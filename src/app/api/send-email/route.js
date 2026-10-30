import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAppUrl, renderEmailTemplate, renderPlainText, sendWithSmtp } from "../../../lib/transactionalEmail";
import { normalizeNotificationEmailMode } from "../../../lib/notificationDigest";
import { paymentSchedule, priceForMethod } from "../../../lib/paymentPlan.js";
import { sendPush } from "../../../lib/push.js";
import { ADMIN_EMAILS, isAdminAccount } from "../../../config/admins.js";

export const runtime = "nodejs";

const ADMIN_ALERT_EMAILS = [...ADMIN_EMAILS, "milinkagency@gmail.com"];
const adminRecipients = () => (process.env.TO_EMAIL || ADMIN_ALERT_EMAILS.join(",")).split(",").map((email) => email.trim()).filter(Boolean);
const money = (cents) => new Intl.NumberFormat("en-CA", { style:"currency", currency:"CAD" }).format((Number(cents) || 0) / 100);
const statusTitle = (value = "") => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

async function pushToRecipients(admin, emails) {
  if (!emails.length) return;
  const adminSet = new Set(adminRecipients().map((email) => email.toLowerCase()));
  const toAdmins = emails.filter((email) => adminSet.has(email.to.trim().toLowerCase()));
  const toOthers = emails.filter((email) => !adminSet.has(email.to.trim().toLowerCase()));
  if (toAdmins.length) {
    const { data: admins } = await admin.from("profiles").select("id").in("role", ["admin", "super_admin"]);
    const first = toAdmins[0].push;
    await sendPush(admin, (admins || []).map((row) => row.id), { ...first, url: first.url?.replace(/\/admin(\?|$)/, "/admin$1") || "/admin", tag: first.title });
  }
  for (const email of toOthers) {
    const { data: profile } = await admin.from("profiles").select("id").ilike("email", email.to.trim()).maybeSingle();
    if (profile) await sendPush(admin, [profile.id], { ...email.push, tag: email.push.title });
  }
}

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
  const isAdmin = trusted || await isAdminAccount(admin, actor);
  const portal = `${getAppUrl()}/portal`, portalMessages = `${portal}?tab=messages`, adminUrl = `${getAppUrl()}/admin`;
  const emails = [];
  const add = (to, subject, details) => { if (to) emails.push({ to, subject, html:renderEmailTemplate(details), text:renderPlainText(details), push:{ title:subject.replace(/^[^\w]+\s*/, ""), body:details.copy, url:details.href } }); };

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
  } else if (event === "proposal_sent") {
    if (!isAdmin) return NextResponse.json({ error:"Only administrators can send proposals." }, { status:403 });
    const { data:brief } = await admin.from("project_briefs").select("id,business_name,proposal_amount_cents,proposal_delivery_days,proposal_summary,profiles!project_briefs_client_id_fkey(email)").eq("id",resourceId).maybeSingle();
    if (!brief) return NextResponse.json({ error:"Project not found." }, { status:404 });
    const projectName = brief.business_name || "your website";
    add(brief.profiles?.email, `Your proposal for ${projectName} is ready`, { heading:"Your proposal is ready.", copy:`We have prepared the scope, price and timeline for ${projectName}. Open your workspace to read it.`, buttonLabel:"Read the proposal", href:`${portal}?tab=contracts`, metadata:[["Price", money(brief.proposal_amount_cents)],["Delivery", brief.proposal_delivery_days ? `${brief.proposal_delivery_days} days` : "To be confirmed"],["Scope", brief.proposal_summary || "See your workspace"]], senderName:"MiLink Team" });
  } else if (event === "approval_requested") {
    if (!isAdmin) return NextResponse.json({ error:"Only administrators can request approvals." }, { status:403 });
    const { data:item } = await admin.from("approvals").select("id,title,description,project_briefs(business_name),profiles!approvals_client_id_fkey(email)").eq("id",resourceId).maybeSingle();
    if (!item) return NextResponse.json({ error:"Approval not found." }, { status:404 });
    add(item.profiles?.email, `Ready for your approval: ${item.title}`, { heading:"Something is ready for you to approve.", copy:`“${item.title}” for ${item.project_briefs?.business_name || "your website"} is ready. Take a look, then approve it or tell us what to change.`, buttonLabel:"Review it", href:`${portal}?tab=approvals`, metadata:item.description ? [["Note", item.description]] : [], senderName:"MiLink Team" });
  } else if (event === "approval_decided") {
    const { data:item } = await admin.from("approvals").select("id,client_id,title,status,client_feedback,project_briefs(business_name),profiles!approvals_client_id_fkey(email,full_name)").eq("id",resourceId).maybeSingle();
    if (!item || (!trusted && item.client_id !== actor.id && !isAdmin)) return NextResponse.json({ error:"Not allowed." }, { status:403 });
    const approved = item.status === "approved";
    adminRecipients().forEach(email => add(email, `${approved ? "Approved" : "Changes requested"}: ${item.title}`, { heading: approved ? "A client approved a deliverable." : "A client asked for changes.", copy:`${item.profiles?.full_name || item.profiles?.email || "The client"} ${approved ? "approved" : "asked for changes to"} “${item.title}” (${item.project_briefs?.business_name || "project"}).`, buttonLabel:"Open admin", href:adminUrl, eyebrow:"MiLink Operations", metadata: approved ? [] : [["Feedback", item.client_feedback || "No note"]] }));
  } else if (event === "contract_sent") {
    if (!isAdmin) return NextResponse.json({ error:"Only administrators can send agreements." }, { status:403 });
    const { data:item } = await admin.from("contracts").select("id,title,project_briefs(business_name,profiles!project_briefs_client_id_fkey(email))").eq("id",resourceId).maybeSingle();
    if (!item) return NextResponse.json({ error:"Agreement not found." }, { status:404 });
    add(item.project_briefs?.profiles?.email, `Please sign: ${item.title}`, { heading:"Your agreement is ready to sign.", copy:`Read the agreement for ${item.project_briefs?.business_name || "your website"} and sign it with your typed name. We start as soon as it is signed.`, buttonLabel:"Read and sign", href:`${portal}?tab=contracts`, metadata:[], senderName:"MiLink Team" });
  } else if (event === "contract_decided") {
    const { data:item } = await admin.from("contracts").select("id,title,status,signer_name,decline_reason,project_briefs(client_id,business_name)").eq("id",resourceId).maybeSingle();
    if (!item || (!trusted && item.project_briefs?.client_id !== actor.id && !isAdmin)) return NextResponse.json({ error:"Not allowed." }, { status:403 });
    const signed = item.status === "signed";
    adminRecipients().forEach(email => add(email, `${signed ? "Agreement signed" : "Agreement changes requested"}: ${item.project_briefs?.business_name || item.title}`, { heading: signed ? "An agreement was signed." : "A client asked to change an agreement.", copy: signed ? `${item.signer_name} signed “${item.title}”.` : `The client asked for changes to “${item.title}”.`, buttonLabel:"Open admin", href:adminUrl, eyebrow:"MiLink Operations", metadata: signed ? [] : [["Note", item.decline_reason || "No note"]] }));
  } else if (event === "etransfer_sent") {
    const { data:brief } = await admin.from("project_briefs").select("*,profiles!project_briefs_client_id_fkey(email,full_name)").eq("id",resourceId).maybeSingle();
    if (!brief || (!trusted && brief.client_id !== actor.id)) return NextResponse.json({ error:"Not allowed." }, { status:403 });
    if (brief.payment_status !== "e_transfer_submitted") return NextResponse.json({ error:"No e-Transfer is waiting." }, { status:409 });
    const { data:proof } = await admin.from("project_files").select("file_name,description").eq("brief_id",brief.id).eq("file_kind","receipt").order("created_at",{ ascending:false }).limit(1);
    const due = priceForMethod(paymentSchedule(brief).dueNow, "e_transfer").total;
    const reference = String(body.reference || "").slice(0,120);
    adminRecipients().forEach(email => add(email, `e-Transfer sent: ${brief.business_name || "client project"} (${money(due)})`, { heading:"A client says they sent an e-Transfer.", copy:`${brief.profiles?.full_name || brief.profiles?.email || "The client"} marked ${money(due)} as sent for ${brief.business_name || "their project"}. Check your bank, then confirm it in Payments.`, buttonLabel:"Open Payments", href:`${adminUrl}?tab=payments`, eyebrow:"MiLink Operations", metadata:[["Amount", money(due)],["Reference", reference || "Not given"],["Proof", proof?.[0]?.file_name || "No file attached"]] }));
  } else if (event === "payment_confirmed") {
    if (!isAdmin) return NextResponse.json({ error:"Only administrators can confirm payments." }, { status:403 });
    const { data:brief } = await admin.from("project_briefs").select("id,business_name,amount_paid_cents,proposal_amount_cents,payment_status,profiles!project_briefs_client_id_fkey(email)").eq("id",resourceId).maybeSingle();
    if (!brief || !["paid","approved","partially_paid"].includes(brief.payment_status)) return NextResponse.json({ error:"Payment is not confirmed." }, { status:409 });
    if (brief.payment_status === "partially_paid") { add(brief.profiles?.email, `Deposit received for ${brief.business_name || "your website"}`, { heading:"Thank you, your deposit arrived.", copy:`We received ${money(brief.amount_paid_cents)} of ${money(brief.proposal_amount_cents)} for ${brief.business_name || "your website"}. The balance is due when your site is ready for review.`, buttonLabel:"View payment", href:`${portal}?tab=payments`, metadata:[], senderName:"MiLink Team" }); }
    else
    add(brief.profiles?.email, `Payment received for ${brief.business_name || "your website"}`, { heading:"Thank you, your payment arrived.", copy:`We received ${money(brief.amount_paid_cents || brief.proposal_amount_cents)} for ${brief.business_name || "your website"}. Your receipt is in your workspace.`, buttonLabel:"View receipt", href:`${portal}?tab=payments`, metadata:[], senderName:"MiLink Team" });
  } else return NextResponse.json({ error:"Unsupported email event." }, { status:400 });
  // Phone/desktop notifications go to the same people, regardless of their email setting (they chose to turn them on).
  try { await pushToRecipients(admin, emails); } catch (pushError) { console.warn("Push dispatch failed", pushError); }
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
