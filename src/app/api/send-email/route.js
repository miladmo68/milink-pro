import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAppUrl, renderEmailTemplate, renderPlainText, sendWithSmtp } from "../../../lib/transactionalEmail";
import { normalizeNotificationEmailMode } from "../../../lib/notificationDigest";

export const runtime = "nodejs";

const ADMIN_EMAILS = ["miladmo68@gmail.com", "info@milink.ca"];
const ADMIN_ALERT_EMAILS = ["miladmo68@gmail.com", "info@milink.ca", "milinkagency@gmail.com"];
const adminRecipients = () => (process.env.TO_EMAIL || ADMIN_ALERT_EMAILS.join(",")).split(",").map((email) => email.trim()).filter(Boolean);
const statusTitle = (value = "") => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export async function POST(request) {
  const body = await request.json().catch(() => ({})); const event = body.event; const resourceId = body.resourceId;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anon || !service) return NextResponse.json({ error:"Email service is not configured." }, { status:503 });
  const bearer = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const trusted = request.headers.get("x-email-dispatch-secret") && request.headers.get("x-email-dispatch-secret") === process.env.EMAIL_DISPATCH_SECRET;
  const viewer = createClient(url, anon, { auth:{ persistSession:false, autoRefreshToken:false } });
  const { data:authData } = trusted ? { data:{ user:null } } : await viewer.auth.getUser(bearer);
  const actor = authData?.user;
  if (!trusted && !actor) return NextResponse.json({ error:"Authentication is required." }, { status:401 });
  const admin = createClient(url, service, { auth:{ persistSession:false, autoRefreshToken:false } });
  const isAdmin = trusted || ADMIN_EMAILS.includes(actor?.email?.toLowerCase());
  const portal = `${getAppUrl()}/portal`, portalMessages = `${portal}?tab=messages`, adminUrl = `${getAppUrl()}/admin`;
  const emails = [];
  const add = (to, subject, details) => { if (to) emails.push({ to, subject, html:renderEmailTemplate(details), text:renderPlainText(details) }); };

  if (event === "welcome") {
    const targetId = resourceId || actor?.id; if (!targetId || (!trusted && targetId !== actor.id)) return NextResponse.json({ error:"Invalid welcome recipient." }, { status:403 });
    const { data:profile } = await admin.from("profiles").select("id,email").eq("id",targetId).maybeSingle(); if (!profile?.email) return NextResponse.json({ error:"Recipient not found." }, { status:404 });
    const { data:alreadySent } = await admin.from("email_outbox").select("id").eq("recipient_id",targetId).eq("template","welcome").limit(1);
    if (alreadySent?.length) return NextResponse.json({ ok:true, skipped:true });
    add(profile.email, "Welcome to MIlink Client Portal — Let's build your next website", { heading:"Welcome to MIlink.", copy:"Your private client workspace is ready. Share your project ideas, files, and feedback whenever you are ready.", buttonLabel:"Open your portal", href:portal });
    await admin.from("email_outbox").insert({ recipient_id:targetId, template:"welcome", payload:{ source:"api" }, status:"pending" });
  } else if (event === "brief_submitted" || event === "status_updated") {
    const { data:brief } = await admin.from("project_briefs").select("id,client_id,business_name,industry,status,main_goals,page_structure,custom_pages,budget_range,target_launch_date,profiles!project_briefs_client_id_fkey(email,full_name)").eq("id",resourceId).maybeSingle();
    if (!brief || (!trusted && event === "brief_submitted" && brief.client_id !== actor.id) || (!trusted && event === "status_updated" && !isAdmin)) return NextResponse.json({ error:"Not allowed to dispatch this project email." }, { status:403 });
    const recipient = brief.profiles?.email;
    const projectMetadata=[["Client",brief.profiles?.full_name || "Not provided"],["Client email",recipient],["Business",brief.business_name || "Website project"],["Project",brief.business_name || "Website project"],["Current stage",statusTitle(brief.status)]];
    if (event === "brief_submitted") { add(recipient,"We received your MiLink project brief",{heading:"Your brief is with us.",copy:`We received the requirements for ${brief.business_name || "your website"}. Our team will review them and prepare the next step.`,buttonLabel:"View project",href:portal,metadata:projectMetadata}); adminRecipients().forEach(email=>add(email,`New MiLink brief: ${brief.business_name || "New client project"}`,{heading:"A new brief is ready to review.",copy:`${brief.profiles?.full_name || recipient || "A client"} submitted ${brief.business_name || "a website project"}.`,buttonLabel:"Review client",href:adminUrl,eyebrow:"MiLink Operations",metadata:[...projectMetadata,["Industry",brief.industry || "Not provided"],["Goals",brief.main_goals || []],["Selected scope",[...(brief.page_structure || []),...(brief.custom_pages || [])]],["Budget",brief.budget_range || "Not provided"],["Target launch",brief.target_launch_date || "Not provided"]]})); }
    else { const projectName=brief.business_name || "your website project"; const stageName=statusTitle(brief.status); add(recipient,`🚀 Project Roadmap Update: ${projectName} is now ${stageName}`,{heading:"Your project moved to the next milestone!",copy:`Great news! Your project ${projectName} has progressed to ${stageName}. Open your private workspace to review the next milestone and any actions needed from you.`,buttonLabel:"View Project Roadmap →",href:`${portal}?tab=overview`,metadata:[]}); }
  } else if (event === "file_requested") {
    if (!isAdmin) return NextResponse.json({ error:"Only administrators can request files." }, { status:403 }); const { data:item } = await admin.from("file_requests").select("title,description,profiles!file_requests_client_id_fkey(email),project_briefs(business_name)").eq("id",resourceId).maybeSingle(); if (!item) return NextResponse.json({ error:"File request not found." }, { status:404 }); const projectName=item.project_briefs?.business_name || "your website project"; add(item.profiles?.email,`📁 Action Required: Missing assets needed for ${projectName}`,{heading:"Action Needed: Please provide requested files",copy:`To keep ${projectName} moving forward without delays, we need: ${item.title}${item.description ? ` — ${item.description}` : ""}.`,buttonLabel:"Upload Requested Files →",href:`${portal}?tab=assets`,metadata:[],senderName:"MiLink Team"});
  } else if (event === "file_response") {
    const { data:item } = await admin.from("file_requests").select("id,client_id,title,file_name,file_size,client_note,profiles!file_requests_client_id_fkey(email,full_name),project_briefs(business_name,status)").eq("id",resourceId).maybeSingle(); if (!item || (!trusted && item.client_id !== actor.id && !isAdmin)) return NextResponse.json({ error:"File response event is not allowed." }, { status:403 }); const fileSize=item.file_size?`${(item.file_size/1024/1024).toFixed(item.file_size>1024*1024?1:2)} ${item.file_size>1024*1024?"MB":"KB"}`:"No file attached"; adminRecipients().forEach(email=>add(email,`Client response received: ${item.title}`,{heading:"A client responded to an asset request.",copy:item.file_name ? `The client uploaded ${item.file_name} for “${item.title}”.` : item.client_note || `The client responded to “${item.title}”.`,buttonLabel:"Review client",href:adminUrl,eyebrow:"MiLink Operations",metadata:[["Client",item.profiles?.full_name || "Not provided"],["Client email",item.profiles?.email],["Business",item.project_briefs?.business_name || "Website project"],["Project stage",statusTitle(item.project_briefs?.status || "submitted")],["Requested asset",item.title],["File",item.file_name || "No file attached"],["File size",fileSize],["Client note",item.client_note || "No note provided"]]}));
  } else if (event === "new_message") {
    const { data:message } = await admin.from("messages").select("id,sender_id,recipient_id,content,project_id,profiles!messages_recipient_id_fkey(email,role),sender:profiles!messages_sender_id_fkey(email,full_name),project_briefs(business_name,status)").eq("id",resourceId).maybeSingle(); if (!message || (!trusted && message.sender_id !== actor.id && !isAdmin)) return NextResponse.json({ error:"Message event is not allowed." }, { status:403 }); const recipientIsAdmin=["admin","super_admin"].includes(message.profiles?.role) || ADMIN_EMAILS.includes(message.profiles?.email?.toLowerCase()); if(recipientIsAdmin){adminRecipients().forEach(email=>add(email,"New message from MiLink Client Portal",{heading:"You have a new project message.",copy:message.content.slice(0,220),buttonLabel:"Open client inbox",href:adminUrl,eyebrow:"MiLink Operations",metadata:[["From",message.sender?.full_name || message.sender?.email || "MiLink client"],["Sender email",message.sender?.email],["Project",message.project_briefs?.business_name || "General conversation"],["Current stage",statusTitle(message.project_briefs?.status || "Not set")],["Message preview",message.content.slice(0,220)]]}));}else { const projectName=message.project_briefs?.business_name || "your website project"; add(message.profiles?.email,`💬 New Message regarding ${projectName} · MiLink`,{heading:"You received a new message from MiLink Team",copy:`Our team just posted a new update in your project workspace regarding ${projectName}. Please open your secure portal to read and reply.`,buttonLabel:"Open & Reply to Message →",href:portalMessages,eyebrow:"MiLink Client Portal",metadata:[],senderName:"MiLink Team"}); }
  } else return NextResponse.json({ error:"Unsupported email event." }, { status:400 });
  try {
    const uniqueRecipients = [...new Set(emails.map((email) => email.to.trim().toLowerCase()))];
    const { data:profiles, error:preferenceError } = uniqueRecipients.length ? await admin.from("profiles").select("email,notification_email_mode").in("email", uniqueRecipients) : { data:[] };
    if (preferenceError) console.warn("Email preference lookup failed; defaulting to immediate delivery", preferenceError.message);
    const modes = new Map((profiles || []).map((profile) => [profile.email?.trim().toLowerCase(), normalizeNotificationEmailMode(profile.notification_email_mode)]));
    const immediate = emails.filter((email) => {
      const mode = modes.get(email.to.trim().toLowerCase()) || "instant";
      return mode === "instant";
    });
    const result = await Promise.all(immediate.map(sendWithSmtp));
    return NextResponse.json({ ok:true, deliveries:result.length, deferred:emails.length-result.length, mocked:result.every(item=>item.mocked) });
  } catch (error) { console.error("Email delivery failed",error); return NextResponse.json({ error:error.message || "Email delivery failed." }, { status:502 }); }
}
