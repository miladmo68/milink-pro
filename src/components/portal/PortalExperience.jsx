"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Building2, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleDollarSign, Download, Eye, FileArchive, FileImage, FileSignature, FileText, FolderKanban, HeartPulse, HelpCircle, LayoutDashboard, LockKeyhole, LogOut, Menu, MessageCircle, Moon, Palette, Plus, RefreshCw, Save, Search, Send, ShieldCheck, Sparkles, Sun, Target, Trash2, Upload, UserRound, Users, X } from "lucide-react";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";
import { computeProjectHealth } from "../../lib/projectHealth";
import { notificationKind, resolveNotificationNavigation } from "../../lib/notificationNavigation";
import { isAdminEmail } from "../../config/admins.js";
import { BUSINESS } from "../../config/business.js";


const clientNav=[["Overview",LayoutDashboard],["Project brief",FileText],["Assets",FolderKanban],["Messages",MessageCircle],["Approvals",ShieldCheck],["Contracts",FileSignature],["Handoff & Docs",FileArchive],["Payments",CircleDollarSign]];
const adminNav=[["Action Center",LayoutDashboard],["Clients",Users],["Projects",FolderKanban],["Messages",MessageCircle],["Payments",CircleDollarSign]];
const steps=[["About you",Building2],["Your website",Target],["Look & files",Palette],["Timing & send",CalendarDays]];
const goals=["Generate leads","Sell online","Accept bookings","Build trust","Show my work","Grow an audience"], features=["Contact form","Online store","Booking system","Multilingual","SEO foundation","Google Maps","Blog","Analytics"], pages=["Home","About","Services","Portfolio","Testimonials","Contact","FAQ","Blog"];
const initial={business_name:"",industry:"",current_website:"",business_description:"",main_goals:[],site_type:"multi_page",page_structure:["Home","Contact"],custom_pages:[],required_features:[],design_style:"Minimal",brand_colors:[],reference_sites:[],domain_status:"not_sure",hosting_status:"not_sure",budget_range:"Not sure yet",target_launch_date:"",additional_notes:"",status:"draft"};
const onboardingChecklistDefault=[
  {id:"brand_assets",label:"Vector Logo & Brand Assets",status:"pending"},
  {id:"copywriting",label:"Page Content & Copywriting",status:"pending"},
  {id:"domain_dns",label:"Domain & DNS Access Details",status:"pending"},
  {id:"color_palette",label:"Color Preferences & Typography Approved",status:"pending"}
];
const normaliseOnboardingChecklist=value=>{const saved=Array.isArray(value)?value:[];const base=onboardingChecklistDefault.map(item=>{const match=saved.find(entry=>entry?.id===item.id);return {...item,status:match?.status==="ready"?"ready":"pending"};});const custom=saved.filter(entry=>entry&&typeof entry.id==="string"&&entry.id.startsWith("custom_")&&typeof entry.label==="string"&&entry.label.trim()).slice(0,8).map(entry=>({id:entry.id,label:entry.label.trim().slice(0,80),status:entry.status==="ready"?"ready":"pending",custom:true}));return [...base,...custom];};
const timelineCategories=["Development","Design","Milestone","Note"];
const normaliseTimelineUpdates=value=>Array.isArray(value)?value.filter(update=>update&&typeof update.message==="string").map(update=>({id:String(update.id||update.created_at||Math.random()),message:update.message.trim(),category:timelineCategories.includes(update.category)?update.category:"Note",created_at:update.created_at||new Date().toISOString()})).filter(update=>update.message):[];
const timelineTimestamp=value=>{const date=new Date(value);if(Number.isNaN(date.getTime()))return "Recently";const today=new Date();const sameDay=date.toDateString()===today.toDateString();return sameDay?`Today, ${date.toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})}`:date.toLocaleDateString(undefined,{month:"short",day:"numeric"});};
const handoffDefaults={admin_login_url:"",dns_provider:"",training_video_url:"",documentation_notes:""};
const normaliseHandoffSpecs=value=>{let specs=value;if(typeof specs==="string"){try{specs=JSON.parse(specs)}catch{specs={};}}return {...handoffDefaults,...(specs&&typeof specs==="object"?specs:{})};};
const handoffUrl=value=>{const trimmed=String(value||"").trim();return trimmed?/^https?:\/\//i.test(trimmed)?trimmed:`https://${trimmed}`:"";};
const stageLabels={draft:"Draft",submitted:"Brief received",reviewing:"In review",proposal_sent:"Proposal ready",in_progress:"In development",client_review:"Ready for your review",completed:"Live"};
const stageLabel=value=>stageLabels[value||"draft"]||title(value||"draft");
const stageTone=value=>({draft:"is-plain",submitted:"is-brand",reviewing:"is-brand",proposal_sent:"is-wait",in_progress:"is-brand",client_review:"is-wait",completed:"is-go"}[value||"draft"]||"is-plain");
const projectStages=["draft","submitted","reviewing","proposal_sent","in_progress","client_review","completed"];
const contactLabels={email:"Email",portal:"Messages here",whatsapp:"WhatsApp"};
const paymentDue=brief=>{const order=["draft","submitted","reviewing","proposal_sent","in_progress","client_review","completed"];return Number(brief?.proposal_amount_cents)>0&&order.indexOf(brief?.status)>=3&&!["paid","approved","e_transfer_submitted","pending_review"].includes(brief?.payment_status);};
// Opens a clean, printable page (receipt or signed agreement) so the client can save it as PDF.
const escapeHtml=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
function printDocument(heading,rows,body=""){const win=window.open("","_blank","noopener=no,width=820,height=960");if(!win)return false;win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(heading)}</title><style>body{font:15px/1.55 -apple-system,Segoe UI,Arial,sans-serif;color:#0d1728;max-width:720px;margin:48px auto;padding:0 24px}header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #0a5cff;padding-bottom:16px;margin-bottom:24px}h1{font-size:24px;margin:0}small{color:#5a6a80}table{width:100%;border-collapse:collapse;margin:16px 0}td{padding:10px 0;border-bottom:1px solid #e3e8f0;vertical-align:top}td:first-child{color:#5a6a80;width:38%}pre{white-space:pre-wrap;font:inherit;background:#f4f6fa;padding:16px;border-radius:8px}footer{margin-top:32px;color:#5a6a80;font-size:13px}@media print{body{margin:0}button{display:none}}</style></head><body><header><div><h1>${escapeHtml(heading)}</h1><small>${escapeHtml(BUSINESS.name)} · ${escapeHtml(BUSINESS.email)} · ${escapeHtml(BUSINESS.address.short)}</small></div><button onclick="window.print()">Save as PDF</button></header><table>${rows.map(([label,value])=>`<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`).join("")}</table>${body?`<pre>${escapeHtml(body)}</pre>`:""}<footer>Issued ${escapeHtml(new Date().toLocaleDateString("en-CA",{year:"numeric",month:"long",day:"numeric"}))}</footer></body></html>`);win.document.close();return true;}
const noteStyle={message:[MessageCircle,"is-brand"],contract:[FileSignature,"is-wait"],approval:[ShieldCheck,"is-wait"],file_request:[Upload,"is-wait"],payment:[CircleDollarSign,"is-go"],brief:[FileText,"is-brand"],handoff:[FileArchive,"is-go"],status_update:[RefreshCw,""]};
const actionKinds=["contract","approval","file_request"];
const cx=(...v)=>v.filter(Boolean).join(" "); const title=(v="draft")=>v.replaceAll("_"," ").replace(/\b\w/g,x=>x.toUpperCase()); const initials=(v="MI")=>String(v||"MI").split(/\s+/).map(x=>x.replace(/[^\p{L}\p{N}]/gu,"")[0]).filter(Boolean).join("").slice(0,2).toUpperCase()||"MI";
const clientProjects=client=>client?.project_briefs||[];
const awaitingProposal=projects=>(projects||[]).find(project=>["draft","submitted","reviewing"].includes(project.status||"draft"));
const latestClientProject=client=>clientProjects(client)[0]||null;
// A directory row can represent several projects. Surface the most urgent
// health signal rather than silently hiding risk behind the newest project.
const clientHealth=client=>clientProjects(client).reduce((mostUrgent,project)=>{
  const candidate=project?.health;
  if(!candidate)return mostUrgent;
  return !mostUrgent||(candidate.priority||0)>(mostUrgent.priority||0)?candidate:mostUrgent;
},null);
const clientHasProjectStatus=(client,statuses)=>clientProjects(client).some(project=>statuses.includes(project.status));
const formatCad=(cents)=>new Intl.NumberFormat("en-CA",{style:"currency",currency:"CAD"}).format((Number(cents)||0)/100);
// Messages are intentionally one conversation per client account. A project id is
// optional context only, so a stale/deleted brief must never prevent a reply.
async function resolveMessageProjectContext(supabase,projectId){
  if(!projectId)return null;
  const {data,error}=await supabase.from("project_briefs").select("id").eq("id",projectId).maybeSingle();
  if(data?.id)return data.id;
  console.warn("Sending message without project context because the selected brief is unavailable.",{projectId,error:error?.message||null});
  return null;
}
async function dispatchEmailEvent(event,resourceId){try{const s=getSupabaseBrowserClient();const {data:{session}}=await s.auth.getSession();if(!session?.access_token)return;const response=await fetch("/api/send-email",{method:"POST",headers:{"content-type":"application/json",authorization:`Bearer ${session.access_token}`},body:JSON.stringify({event,resourceId})});if(!response.ok)console.warn("Email event was not delivered",event,await response.text());}catch(error){console.warn("Email dispatch is unavailable",error);}}
async function updateETransfer(briefId,action){const supabase=getSupabaseBrowserClient();const {data:{session}}=await supabase.auth.getSession();if(!session?.access_token)throw new Error("Please sign in again before updating this payment.");const response=await fetch("/api/payments/e-transfer",{method:"POST",headers:{"content-type":"application/json",authorization:`Bearer ${session.access_token}`},body:JSON.stringify({briefId,action})});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||"We could not update this e-Transfer payment.");return data;}

function AdminModal({children,onClose,danger=false,label="Dialog",heading,wide=false}){const [mounted,setMounted]=useState(false),dialogRef=useRef(null);useEffect(()=>{setMounted(true);const previous=document.body.style.overflow;const keepFocusInside=event=>{if(event.key==="Escape"){onClose?.();return;}if(event.key!=="Tab"||!dialogRef.current)return;const focusable=[...dialogRef.current.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(element=>!element.hasAttribute("hidden"));if(!focusable.length){event.preventDefault();dialogRef.current.focus();return;}const first=focusable[0],last=focusable[focusable.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}};document.body.style.overflow="hidden";document.addEventListener("keydown",keepFocusInside);const frame=window.requestAnimationFrame(()=>dialogRef.current?.focus());return()=>{window.cancelAnimationFrame(frame);document.body.style.overflow=previous;document.removeEventListener("keydown",keepFocusInside);};},[onClose]);if(!mounted||typeof document==="undefined")return null;
  // Rendered inside .d-app so the dialog gets the workspace theme tokens.
  return createPortal(<div role="presentation" className="d-modal-scrim" onMouseDown={event=>{if(event.target===event.currentTarget)onClose?.();}}><section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={label} className={cx("d-modal",danger&&"is-danger",wide&&"is-wide")} onMouseDown={event=>event.stopPropagation()}>{heading!==undefined&&<header className="d-modal-head"><h3>{heading}</h3><button type="button" className="d-icon-button" aria-label="Close" onClick={onClose}><X size={18}/></button></header>}{children}</section></div>,document.querySelector(".d-app")||document.body);}

export function ClientExperience({onSignOut}){
  const [section,setSection]=useState("Overview"),[projects,setProjects]=useState([]),[projectId,setProjectId]=useState(""),[projectsLoading,setProjectsLoading]=useState(true);
  const updateUrl=useCallback((nextSection,nextProjectId,{replace=true}={})=>{if(typeof window==="undefined")return;const tabs={Overview:"overview","Project brief":"brief",Assets:"assets",Messages:"messages",Approvals:"approvals",Contracts:"contracts","Handoff & Docs":"handoff",Payments:"payments",Profile:"profile"};const url=new URL(window.location.href);url.searchParams.set("tab",tabs[nextSection]||"overview");if(nextProjectId)url.searchParams.set("project",nextProjectId);else url.searchParams.delete("project");window.history[replace?"replaceState":"pushState"]({},"",url);},[]);
  const navigate=useCallback((next,nextProjectId=projectId)=>{setSection(next);if(nextProjectId!==projectId)setProjectId(nextProjectId);updateUrl(next,nextProjectId);},[projectId,updateUrl]);
  const refreshProjects=useClientProjectsRealtime(setProjects,setProjectsLoading);
  useEffect(()=>{const params=new URLSearchParams(window.location.search);const tab=params.get("tab")?.toLowerCase();const requestedProject=params.get("project")||"";const destinations={messages:"Messages",assets:"Assets",overview:"Overview",brief:"Project brief",approvals:"Approvals",contracts:"Contracts",handoff:"Handoff & Docs",profile:"Profile",payments:"Payments"};if(destinations[tab])setSection(destinations[tab]);setProjectId(requestedProject);},[]);
  useEffect(()=>{if(projectsLoading)return;if(projectId==="new")return;const exists=projects.some(project=>project.id===projectId);const resolved=exists?projectId:(projects[0]?.id||"");if(resolved!==projectId){setProjectId(resolved);updateUrl(section,resolved);}},[projects,projectsLoading,projectId,section,updateUrl]);
  const brief=projects.find(project=>project.id===projectId)||null;
  const chooseProject=useCallback(id=>{setProjectId(id);updateUrl(section,id);},[section,updateUrl]);
  const startNewProject=useCallback(()=>{if(awaitingProposal(projects)){chooseProject(awaitingProposal(projects).id);return;}setProjectId("new");setSection("Project brief");updateUrl("Project brief","new");},[updateUrl,projects,chooseProject]);
  const handleBriefChange=useCallback(updated=>{if(!updated?.id)return;setProjects(current=>[updated,...current.filter(project=>project.id!==updated.id)].sort((a,b)=>new Date(b.updated_at||b.created_at||0)-new Date(a.updated_at||a.created_at||0)));setProjectId(updated.id);updateUrl(section,updated.id);},[section,updateUrl]);
  const handleNotificationNavigate=useCallback(target=>{const nextProjectId=target.projectId||projectId;navigate(target.section,nextProjectId);},[navigate,projectId]);
  // A new client sees only what they can act on; the rest appears as the project moves on.
  // The section being viewed (for example opened from a notification) always stays listed.
  const visibleNav=useMemo(()=>{const status=brief?.status;const stages=["draft","submitted","reviewing","proposal_sent","in_progress","client_review","completed"];const at=stages.indexOf(status);const show={Overview:true,"Project brief":true,Messages:true,Assets:Boolean(brief),Contracts:at>=3,Payments:at>=3,Approvals:at>=4,"Handoff & Docs":at>=5};return clientNav.filter(([label])=>show[label]||label===section);},[brief,section]);
  return <Shell mode="client" section={section} setSection={navigate} navItems={visibleNav} context={brief?.business_name||(projectsLoading?"":"New project")} onNotificationNavigate={handleNotificationNavigate} onSignOut={onSignOut} projectSwitcher={<ProjectSwitcher projects={projects} activeProject={brief} loading={projectsLoading} onSelect={chooseProject} onStartNew={startNewProject}/>}>{section==="Overview"&&<><ClientHome brief={brief} onBriefChange={handleBriefChange} open={()=>navigate("Project brief")} message={()=>navigate("Messages")} go={navigate}/></>} {section==="Project brief"&&<Brief brief={brief} newProject={projectId==="new"} onChange={handleBriefChange}/>} {section==="Assets"&&<Assets brief={brief}/>} {section==="Messages"&&<ClientMessages brief={brief}/>} {section==="Profile"&&<ProfileSettings/>} {section==="Approvals"&&<ClientApprovals brief={brief}/>} {section==="Contracts"&&<ClientContracts brief={brief}/>} {section==="Handoff & Docs"&&<ProjectHandoffHub brief={brief} onMessage={()=>navigate("Messages")}/>} {section==="Payments"&&<ClientPayments brief={brief} onRefresh={refreshProjects}/>}</Shell>;
}

const profileDefaults={full_name:"",company_name:"",job_title:"",phone:"",company_website:"",timezone:"America/Toronto",preferred_contact:"email",notification_email_mode:"instant"};
function ProfileSettings(){
  const [user,setUser]=useState(null),[profile,setProfile]=useState(profileDefaults),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[preferenceSaving,setPreferenceSaving]=useState(false),[notice,setNotice]=useState(null),[passwordOpen,setPasswordOpen]=useState(false),[passwords,setPasswords]=useState({password:"",confirm:""}),[passwordSaving,setPasswordSaving]=useState(false),[passwordConfigured,setPasswordConfigured]=useState(false),[dirty,setDirty]=useState(false);
  useEffect(()=>{let mounted=true;const load=async()=>{const supabase=getSupabaseBrowserClient();if(!supabase){if(mounted){setNotice({tone:"stop",text:"Account settings are not available right now."});setLoading(false);}return;}const {data:{user:currentUser}}=await supabase.auth.getUser();if(!currentUser){if(mounted)setLoading(false);return;}const {data,error}=await supabase.from("profiles").select("id,email,full_name,company_name,job_title,phone,company_website,timezone,preferred_contact,notification_email_mode").eq("id",currentUser.id).maybeSingle();if(!mounted)return;setUser(currentUser);setPasswordConfigured(Boolean(currentUser.identities?.some(identity=>identity.provider==="email")));if(error)setNotice({tone:"stop",text:`Could not load your profile: ${error.message}`});if(data)setProfile({...profileDefaults,...data});setLoading(false);};load();return()=>{mounted=false};},[]);
  const update=(key,value)=>{setDirty(true);setProfile(current=>({...current,[key]:value}));};
  const save=async()=>{if(!user)return;if(!profile.full_name.trim()){setNotice({tone:"wait",text:"Add your name before saving."});return;}setSaving(true);setNotice(null);const payload={full_name:profile.full_name.trim(),company_name:profile.company_name.trim()||null,phone:profile.phone.trim()||null,company_website:profile.company_website.trim()||null,preferred_contact:profile.preferred_contact||"email"};const {data,error}=await getSupabaseBrowserClient().from("profiles").update(payload).eq("id",user.id).select().single();setSaving(false);if(error){setNotice({tone:"stop",text:`Could not save: ${error.message}`});return;}setProfile(current=>({...current,...data}));setDirty(false);setNotice({tone:"go",text:"Your details are saved."});};
  const saveNotificationPreference=async mode=>{if(!user||preferenceSaving)return;const previous=profile.notification_email_mode||"instant";setProfile(current=>({...current,notification_email_mode:mode}));setPreferenceSaving(true);setNotice(null);const {data,error}=await getSupabaseBrowserClient().from("profiles").update({notification_email_mode:mode}).eq("id",user.id).select("notification_email_mode").single();setPreferenceSaving(false);if(error){setProfile(current=>({...current,notification_email_mode:previous}));setNotice({tone:"stop",text:`Could not update email settings: ${error.message}`});return;}setProfile(current=>({...current,notification_email_mode:data?.notification_email_mode||mode}));setNotice({tone:"go",text:"Email settings saved."});};
  const changePassword=async()=>{if(passwords.password.length<8){setNotice({tone:"wait",text:"Use at least 8 characters."});return;}if(passwords.password!==passwords.confirm){setNotice({tone:"wait",text:"The two passwords do not match."});return;}setPasswordSaving(true);setNotice(null);const {error}=await getSupabaseBrowserClient().auth.updateUser({password:passwords.password});setPasswordSaving(false);if(error){setNotice({tone:"stop",text:`Could not ${passwordConfigured?"change":"set"} your password: ${error.message}`});return;}setPasswordConfigured(true);setPasswords({password:"",confirm:""});setPasswordOpen(false);setNotice({tone:"go",text:passwordConfigured?"Password changed.":"Password set. You can now also sign in with your email and password."});};
  if(loading)return <Loading label="Loading your settings…"/>;
  const displayName=profile.full_name||user?.email||"You";
  return <div className="d-page d-narrow">
    <div className="d-page-head"><h2>Profile and settings</h2><p>Your details, how we reach you, and your password.</p></div>
    {notice&&<div className={cx("d-notice",`is-${notice.tone}`)} role="status">{notice.text}</div>}
    <section className="d-panel">
      <div className="d-panel-head"><div className="d-identity"><span className="d-avatar is-lg">{initials(displayName)}</span><span><b>{displayName}</b><small>{user?.email}</small></span></div></div>
      <div className="d-panel-body d-fields">
        <div className="d-fields d-fields-2">
          <ProfileInput label="Full name" value={profile.full_name} onChange={value=>update("full_name",value)} required placeholder="Your name" autoComplete="name"/>
          <ProfileInput label="Business name" value={profile.company_name} onChange={value=>update("company_name",value)} placeholder="Optional" autoComplete="organization"/>
          <ProfileInput label="Phone" value={profile.phone} onChange={value=>update("phone",value)} type="tel" placeholder="Optional" autoComplete="tel"/>
          <ProfileInput label="Business website" value={profile.company_website} onChange={value=>update("company_website",value)} type="url" placeholder="https://" autoComplete="url"/>
        </div>
        <fieldset className="d-choice"><legend>Best way to reach you quickly</legend><div className="d-chips">{[["email","Email"],["portal","Messages here"],["whatsapp","WhatsApp"]].map(([value,label])=><button type="button" key={value} onClick={()=>update("preferred_contact",value)} className={cx("d-chip",profile.preferred_contact===value&&"is-on")} aria-pressed={profile.preferred_contact===value}>{profile.preferred_contact===value&&<Check size={14}/>}{label}</button>)}</div></fieldset>
        <label className="d-field"><span>Sign-in email</span><input value={user?.email||""} readOnly/><small>To change it, message the MIlink team.</small></label>
      </div>
      <div className="d-panel-foot d-foot-actions"><span className="d-save-state">{dirty?"Unsaved changes":""}</span><button type="button" className="d-btn is-primary" disabled={saving||!dirty} onClick={save}>{saving?"Saving…":"Save details"}</button></div>
    </section>
    <section className="d-panel">
      <div className="d-panel-head"><div><h3>Email updates</h3><p>You always see updates here. Choose how often we email you.</p></div></div>
      <div className="d-options" role="radiogroup" aria-label="Email updates">{[["instant","Every update","An email for each new message or step"],["daily_digest","Daily summary","One email a day"],["weekly_digest","Weekly summary","One email a week"],["off","No emails","Only see updates here"]].map(([value,label,description])=><button type="button" role="radio" aria-checked={profile.notification_email_mode===value} key={value} disabled={preferenceSaving} onClick={()=>saveNotificationPreference(value)} className="d-option"><span className="d-radio" aria-hidden="true"/><span><b>{label}</b><small>{description}</small></span></button>)}</div>
    </section>
    <section className="d-panel">
      <div className="d-panel-head"><div><h3>Password</h3><p>{passwordConfigured?"Change the password you sign in with.":"You sign in with Google. Add a password to also sign in with your email."}</p></div>{!passwordOpen&&<button type="button" className="d-btn is-sm" onClick={()=>setPasswordOpen(true)}>{passwordConfigured?"Change":"Add password"}</button>}</div>
      {passwordOpen&&<div className="d-panel-body d-fields"><div className="d-fields d-fields-2"><ProfileInput label={passwordConfigured?"New password":"Password"} type="password" value={passwords.password} onChange={value=>setPasswords(current=>({...current,password:value}))} placeholder="At least 8 characters" autoComplete="new-password"/><ProfileInput label="Repeat password" type="password" value={passwords.confirm} onChange={value=>setPasswords(current=>({...current,confirm:value}))} placeholder="Type it again" autoComplete="new-password"/></div><div className="d-btn-row"><button type="button" className="d-btn is-primary" disabled={passwordSaving} onClick={changePassword}>{passwordSaving?"Saving…":passwordConfigured?"Change password":"Add password"}</button><button type="button" className="d-btn" onClick={()=>{setPasswordOpen(false);setPasswords({password:"",confirm:""});}}>Cancel</button></div></div>}
    </section>
  </div>;
}
function ProfileInput({label,value,onChange,type="text",placeholder,required,autoComplete}){return <label className="d-field"><span>{label}{required&&<em aria-hidden="true">*</em>}</span><input type={type} value={value||""} onChange={event=>onChange(event.target.value)} placeholder={placeholder} required={required} autoComplete={autoComplete}/></label>}
function useClientProjectsRealtime(setProjects,setLoading) {
  const loadProjects=useCallback(async()=>{
    const supabase=getSupabaseBrowserClient();
    if(!supabase){setLoading(false);return [];}
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){setProjects([]);setLoading(false);return [];}
    const {data,error}=await supabase.from("project_briefs").select("*").eq("client_id",user.id).order("updated_at",{ascending:false});
    if(error){console.error("Could not refresh client projects",error);setLoading(false);return [];}
    setProjects(data||[]);setLoading(false);return data||[];
  },[setLoading,setProjects]);
  useEffect(() => { const supabase=getSupabaseBrowserClient(); if(!supabase) return undefined; let channel; let active=true; loadProjects(); supabase.auth.getUser().then(({data}) => { if(!active || !data.user) return; channel=supabase.channel(`client-projects-${data.user.id}`).on("postgres_changes",{event:"*",schema:"public",table:"project_briefs",filter:`client_id=eq.${data.user.id}`},()=>{if(active)loadProjects();}).subscribe((status)=>{if(status==="CHANNEL_ERROR")console.error("Client projects realtime channel error");}); }); return ()=>{active=false;if(channel)supabase.removeChannel(channel);}; },[loadProjects]); return loadProjects;
}

function ClientPayments({brief,onRefresh}) {
  const [loading,setLoading]=useState(false),[eTransferLoading,setETransferLoading]=useState(false),[notice,setNotice]=useState(null),[returnState,setReturnState]=useState(""),[copied,setCopied]=useState(false);
  useEffect(()=>{const payment=new URLSearchParams(window.location.search).get("payment");if(payment)setReturnState(payment);},[]);
  const amount=Number(brief?.proposal_amount_cents);
  const hasAmount=Number.isInteger(amount)&&amount>0;
  const paid=brief?.payment_status==="paid"||brief?.payment_status==="approved";
  const stripePaid=brief?.payment_method==="stripe"&&brief?.payment_status==="paid";
  const eTransferSubmitted=brief?.payment_status==="e_transfer_submitted";
  const eTransferRejected=brief?.payment_status==="rejected"&&brief?.payment_method==="e_transfer";
  useEffect(()=>{if(returnState!=="success"||paid||!onRefresh)return undefined;let active=true;let attempts=0;let timer;const refresh=async()=>{await onRefresh();attempts+=1;if(active&&attempts<5)timer=window.setTimeout(refresh,attempts===1?1000:2500);};refresh();return()=>{active=false;window.clearTimeout(timer);};},[returnState,paid,onRefresh]);
  if(!brief) return <Empty icon={CircleDollarSign} title="Nothing to pay yet" copy="Once your proposal is ready, you can pay here by card or Interac e-Transfer."/>;
  const payNow=async()=>{
    if(!hasAmount){setNotice({tone:"wait",text:"The project price is not set yet."});return;}
    setLoading(true);setNotice(null);
    try{
      const supabase=getSupabaseBrowserClient();
      const {data:{session}}=await supabase.auth.getSession();
      if(!session?.access_token)throw new Error("Your session ended. Sign in again, then pay.");
      const response=await fetch("/api/payments/create-checkout-session",{method:"POST",headers:{"content-type":"application/json",authorization:`Bearer ${session.access_token}`},body:JSON.stringify({briefId:brief.id})});
      const data=await response.json();
      if(!response.ok||!data.url)throw new Error(data.error||"Could not open the secure checkout.");
      window.location.assign(data.url);
    }catch(error){setNotice({tone:"stop",text:error.message||"Could not open the secure checkout. Try again or use e-Transfer."});setLoading(false);}
  };
  const markETransferSent=async()=>{if(!hasAmount){setNotice({tone:"wait",text:"The project price is not set yet."});return;}setETransferLoading(true);setNotice(null);try{await updateETransfer(brief.id,"submit");setNotice({tone:"go",text:"Thanks. MIlink will confirm once the transfer arrives."});await onRefresh?.();}catch(error){setNotice({tone:"stop",text:error.message||"Could not record your e-Transfer. Try again."});}finally{setETransferLoading(false);}};
  const copyEmail=async()=>{try{await navigator.clipboard?.writeText(BUSINESS.eTransferEmail);setCopied(true);window.setTimeout(()=>setCopied(false),1600);}catch{}};
  const paidOn=new Date((stripePaid?brief.stripe_paid_at:brief.e_transfer_confirmed_at)||brief.updated_at||Date.now()).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"});
  return <div className="d-page">
    <div className="d-page-head"><h2>Payment</h2><p>Pay by card through Stripe, or send an Interac e-Transfer.</p></div>
    {returnState==="success"&&!paid&&<div className="d-notice is-go" role="status"><CheckCircle2 size={18}/><span>Payment received by Stripe. This page updates as soon as it is confirmed.</span></div>}
    {returnState==="cancelled"&&<div className="d-notice" role="status"><span>Checkout was cancelled. No payment was made.</span></div>}
    <section className={cx("d-panel","d-amount",paid&&"is-paid")}>
      <div><small>{paid?"Paid":"Amount due"}</small><b className="d-num">{hasAmount?formatCad(paid?(brief.amount_paid_cents||amount):amount):"Not set yet"}</b><p>{paid?`${stripePaid?"Card payment":"e-Transfer"} confirmed on ${paidOn}.`:hasAmount?`For ${brief.business_name||"your website project"}, in Canadian dollars.`:"MIlink sets the amount when your proposal is ready."}</p></div>
      <span className="d-amount-side"><span className={cx("d-pill",paid?"is-go":eTransferSubmitted?"is-wait":"is-plain")}>{paid?"Paid":eTransferSubmitted?"Checking transfer":brief.payment_status==="checkout_pending"?"Checkout started":"Not paid"}</span>{paid&&<button type="button" className="d-btn is-sm" onClick={()=>printDocument("Payment receipt",[["Project",brief.business_name||"Website project"],["Amount paid",formatCad(brief.amount_paid_cents||amount)],["Method",stripePaid?"Card (Stripe)":"Interac e-Transfer"],["Date",paidOn],["Reference",brief.id.slice(0,8).toUpperCase()]])}><Download size={15}/>Receipt</button>}</span>
    </section>
    {!paid&&hasAmount&&<div className="d-pay-options">
      <section className="d-panel d-pay-option">
        <div className="d-panel-head"><div><h3>Pay by card</h3><p>Secure Stripe checkout. MIlink never sees your card details.</p></div></div>
        <div className="d-panel-body"><button type="button" className="d-btn is-primary is-block" disabled={loading||eTransferSubmitted} onClick={payNow}><CircleDollarSign size={17}/>{loading?"Opening checkout…":eTransferSubmitted?"Transfer being checked":`Pay ${formatCad(amount)}`}</button></div>
      </section>
      <section className="d-panel d-pay-option">
        <div className="d-panel-head"><div><h3>Interac e-Transfer</h3><p>Send to this email and put “{brief.business_name||"your business name"}” in the message.</p></div></div>
        <div className="d-panel-body d-stack-sm">
          <div className="d-copy-field"><span>{BUSINESS.eTransferEmail}</span><button type="button" className="d-btn is-sm" onClick={copyEmail}>{copied?"Copied":"Copy"}</button></div>
          {eTransferSubmitted?<p className="d-outcome is-wait"><RefreshCw size={16}/>You marked it as sent{brief.e_transfer_submitted_at?` on ${new Date(brief.e_transfer_submitted_at).toLocaleDateString(undefined,{month:"short",day:"numeric"})}`:""}. We will confirm when it arrives.</p>
          :<>{eTransferRejected&&<div className="d-notice is-stop">We could not find your last transfer. Please send it again or message us.</div>}<button type="button" className="d-btn is-block" disabled={eTransferLoading} onClick={markETransferSent}><CheckCircle2 size={17}/>{eTransferLoading?"Saving…":"I have sent it"}</button></>}
        </div>
      </section>
    </div>}
    {notice&&<div className={cx("d-notice",`is-${notice.tone}`)} role="status">{notice.text}</div>}
  </div>;
}

export function AdminExperience({onSignOut}){const [section,setSection]=useState("Action Center"),[toast,setToast]=useState("");const syncAdminLocation=useCallback((next,projectId)=>{if(typeof window==="undefined")return;const tabs={"Action Center":"action-center",Clients:"clients",Projects:"projects",Messages:"messages",Payments:"payments"};const url=new URL(window.location.href);url.pathname="/admin";url.searchParams.set("tab",tabs[next]||"action-center");if(projectId)url.searchParams.set("project",projectId);else url.searchParams.delete("project");window.history.pushState({},"",`${url.pathname}${url.search}`);},[]);const navigateAdmin=useCallback((next,projectId)=>{setSection(next);syncAdminLocation(next,projectId);},[syncAdminLocation]);useEffect(()=>{if(typeof window==="undefined")return;const target=new URLSearchParams(window.location.search).get("tab")?.toLowerCase();const tabs={"action-center":"Action Center",action_center:"Action Center",clients:"Clients",projects:"Projects",messages:"Messages",payments:"Payments"};if(tabs[target])setSection(tabs[target]);},[]);useEffect(()=>{let timer;const openClients=event=>{setSection("Clients");setToast(event.detail||"Client deleted successfully.");if(typeof window!=="undefined")window.history.replaceState({},"","/admin?tab=clients");window.clearTimeout(timer);timer=window.setTimeout(()=>setToast(""),4200);};window.addEventListener("milink:client-deleted",openClients);window.addEventListener("milink:admin-toast",openClients);return()=>{window.removeEventListener("milink:client-deleted",openClients);window.removeEventListener("milink:admin-toast",openClients);window.clearTimeout(timer);};},[]);const handleNotificationNavigate=useCallback(target=>{navigateAdmin(target.section,target.projectId);if(target.projectId&&typeof window!=="undefined")window.setTimeout(()=>window.dispatchEvent(new CustomEvent("milink:open-project",{detail:{projectId:target.projectId,clientId:target.clientId}})),0);},[navigateAdmin]);return <Shell mode="admin" section={section} setSection={navigateAdmin} onNotificationNavigate={handleNotificationNavigate} onSignOut={onSignOut}><AdminWorkspace currentTab={section} onNavigate={navigateAdmin}/>{toast&&<div className="d-toast" role="status"><CheckCircle2 size={17}/>{toast}</div>}</Shell>}

function AdminWorkspace({ currentTab, onNavigate }) {
  const [clients, setClients] = useState([]); const [selected, setSelected] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [query, setQuery] = useState(""); const failedRef = useRef(false); const loadedRef = useRef(false); const openedUrlProjectRef = useRef("");
  const fetchClients = useCallback(async () => {
    const supabase = getSupabaseBrowserClient(); if (!supabase) { setError("Supabase is not configured."); setLoading(false); return; }
    if (!loadedRef.current) setLoading(true); setError("");
    const [{ data: profiles, error: clientsError }, { data: briefRows, error: briefsError }, { data: messageRows, error: messagesError }, { data: approvalRows, error: approvalsError }, { data: fileRequestRows, error: fileRequestsError }] = await Promise.all([
      supabase.from("profiles").select("id, email, full_name, role, created_at, phone, company_name, preferred_contact").order("created_at", { ascending:false }),
      supabase.from("project_briefs").select("*").order("updated_at", { ascending:false }),
      supabase.from("messages").select("sender_id, recipient_id, created_at"),
      supabase.from("approvals").select("project_id, status, created_at"),
      supabase.from("file_requests").select("project_id, status, admin_decision, created_at"),
    ]);
    if (clientsError || briefsError) { const fetchError=clientsError||briefsError; console.error("Admin CRM fetch failed:", fetchError); failedRef.current = true; setError(`Could not load clients: ${fetchError.message}`); setClients([]); }
    else {
      if (messagesError || approvalsError || fileRequestsError) console.warn("Admin project health is using the available data only.", messagesError || approvalsError || fileRequestsError);
      const adminIds = (profiles || []).filter(profile => ["admin", "super_admin"].includes(profile.role) || isAdminEmail(profile.email)).map(profile => profile.id);
      const messagesByClient = new Map();
      (messageRows || []).forEach(message => {
        [message.sender_id, message.recipient_id].forEach(userId => {
          if (!userId) return;
          const values = messagesByClient.get(userId) || [];
          values.push(message); messagesByClient.set(userId, values);
        });
      });
      const approvalsByProject = new Map();
      (approvalRows || []).forEach(approval => { const values = approvalsByProject.get(approval.project_id) || []; values.push(approval); approvalsByProject.set(approval.project_id, values); });
      const requestsByProject = new Map();
      (fileRequestRows || []).forEach(request => { const values = requestsByProject.get(request.project_id) || []; values.push(request); requestsByProject.set(request.project_id, values); });
      const briefsByClient=new Map();
      (briefRows||[]).forEach(rawBrief=>{
        const brief = { ...rawBrief, health: computeProjectHealth({ brief:rawBrief, messages:messagesByClient.get(rawBrief.client_id)||[], approvals:approvalsByProject.get(rawBrief.id)||[], fileRequests:requestsByProject.get(rawBrief.id)||[], adminIds }) };
        const current=briefsByClient.get(brief.client_id)||[]; current.push(brief); briefsByClient.set(brief.client_id,current);
      });
      const clientRows=(profiles||[]).filter((profile)=>!["admin","super_admin"].includes(profile.role)&&!isAdminEmail(profile.email)).map(profile=>({...profile,project_briefs:briefsByClient.get(profile.id)||[]}));
      failedRef.current = false; loadedRef.current = true; setClients(clientRows);
      setSelected((current) => { const next = current ? clientRows.find((client) => client.id === current.id) : null; return next ? { ...next, _openProjectId: current?._openProjectId } : null; });
    }
    setLoading(false);
  }, []);
  useEffect(() => { fetchClients(); const supabase = getSupabaseBrowserClient(); if (!supabase) return undefined; let timer; const refresh = () => { if (failedRef.current) return; window.clearTimeout(timer); timer = window.setTimeout(() => fetchClients(), 200); }; const channel = supabase.channel("admin-project-health").on("postgres_changes", { event:"*", schema:"public", table:"profiles" }, refresh).on("postgres_changes", { event:"*", schema:"public", table:"project_briefs" }, refresh).on("postgres_changes", { event:"*", schema:"public", table:"messages" }, refresh).on("postgres_changes", { event:"*", schema:"public", table:"approvals" }, refresh).on("postgres_changes", { event:"*", schema:"public", table:"file_requests" }, refresh).subscribe((status) => { if (status === "CHANNEL_ERROR") console.error("Admin CRM realtime channel error"); }); return () => { window.clearTimeout(timer); supabase.removeChannel(channel); }; }, [fetchClients]);
  useEffect(() => {
    const openClient = (event) => {
      const client = clients.find((item) => item.id === event.detail?.clientId);
      if (!client) return;
      setSelected(client);
      onNavigate("Projects");
    };
    const openProject = (event) => {
      const projectId = event.detail?.projectId;
      const client = clients.find((item) => item.id === event.detail?.clientId || item.project_briefs?.some((brief) => brief.id === projectId));
      if (!client) return;
      setSelected({ ...client, _openProjectId: projectId });
      onNavigate("Projects", projectId);
    };
    window.addEventListener("milink:open-client", openClient);
    window.addEventListener("milink:open-project", openProject);
    return () => { window.removeEventListener("milink:open-client", openClient); window.removeEventListener("milink:open-project", openProject); };
  }, [clients, onNavigate]);
  useEffect(() => {
    if (typeof window === "undefined" || !clients.length) return;
    const projectId = new URLSearchParams(window.location.search).get("project");
    if (!projectId || openedUrlProjectRef.current === projectId) return;
    const client = clients.find((item) => item.project_briefs?.some((brief) => brief.id === projectId));
    if (!client) return;
    openedUrlProjectRef.current = projectId;
    setSelected({ ...client, _openProjectId: projectId });
    onNavigate("Projects", projectId);
  }, [clients, onNavigate]);
  const briefs = clients.flatMap((client) => (client.project_briefs || []).map((brief) => ({ ...brief, client })));
  const submitted = briefs.filter((brief) => ["submitted","reviewing","proposal_sent"].includes(brief.status)); const active = briefs.filter((brief) => ["in_progress","client_review"].includes(brief.status)); const noBrief = clients.filter((client) => !(client.project_briefs || []).length);
  const visibleClients = clients.filter((client) => `${client.full_name || ""} ${client.email || ""}`.toLowerCase().includes(query.toLowerCase()));
  if (loading) return <Loading label="Loading your workspace…"/>;
  if (error) return <Empty icon={ShieldCheck} title="Could not load the workspace" copy={error} action={<button type="button" className="d-btn is-primary" onClick={() => { failedRef.current = false; fetchClients(); }}>Try again</button>}/>;
  if (currentTab === "Messages") return <AdminMessages onOpenClient={(clientId)=>{onNavigate("Projects");window.setTimeout(()=>window.dispatchEvent(new CustomEvent("milink:open-client",{detail:{clientId}})),0);}}/>;
  if (currentTab === "Payments") return <AdminPayments briefs={briefs} refresh={fetchClients}/>;
  if (currentTab === "Projects") return selected ? <ClientFullView record={selected} initialProjectId={selected._openProjectId} refresh={fetchClients} onBack={()=>setSelected(null)} onNavigate={onNavigate}/> : <ProjectsBoard briefs={briefs} onOpen={(client,brief) => { setSelected({...client,_openProjectId:brief.id}); }} />;
  if (currentTab === "Action Center") return <ActionCenter clients={clients} briefs={briefs} submitted={submitted} noBrief={noBrief} refresh={fetchClients} onNavigate={onNavigate} onOpenProject={(brief)=>{setSelected({...brief.client,_openProjectId:brief.id});onNavigate("Projects",brief.id);}}/>;
  if (currentTab === "Clients") return <ClientDirectory clients={clients} refresh={fetchClients} onNavigate={onNavigate} />;
  return <ClientDirectory clients={clients} refresh={fetchClients} onNavigate={onNavigate} />;
}

function ProjectsBoard({ briefs, onOpen }) {
  const groups=[["Drafts",["draft"],"Clients still writing their brief"],["New",["submitted","reviewing"],"Read the brief and send a proposal"],["Proposal sent",["proposal_sent"],"Waiting for the client to sign or pay"],["Building",["in_progress","client_review"],"In progress or with the client for review"],["Live",["completed"],"Launched"]];
  const [tab,setTab]=useState("New");
  const desktop=useIsDesktop();
  const shown=desktop?groups:groups.filter(([label])=>label===tab);
  return <div className="d-page">
    <div className="d-page-head"><h2>Projects</h2><p>{briefs.length} project{briefs.length===1?"":"s"} by stage. Open one to work on it.</p></div>
    {!desktop&&<div className="d-segment" role="tablist" aria-label="Project stage">{groups.map(([label,states])=><button type="button" role="tab" key={label} aria-selected={tab===label} onClick={()=>setTab(label)}>{label}<span className="d-num">{briefs.filter(brief=>states.includes(brief.status||"draft")).length}</span></button>)}</div>}
    <div className="d-board">{shown.map(([label,states,hint])=>{const items=briefs.filter(brief=>states.includes(brief.status||"draft")).sort((a,b)=>new Date(b.updated_at||0)-new Date(a.updated_at||0));return <section className="d-panel d-board-col" key={label} aria-label={label}>
      <div className="d-panel-head"><div><h3>{label} <span className="d-num d-muted-count">{items.length}</span></h3><p>{hint}</p></div></div>
      {items.length?<ul className="d-list">{items.map(brief=><li key={brief.id}><button type="button" className="d-row" onClick={()=>onOpen(brief.client,brief)}><span className="d-avatar is-square">{initials(brief.business_name||brief.client?.full_name||brief.client?.email)}</span><span className="d-row-main"><b>{brief.business_name||"Untitled project"}</b><small>{brief.client?.full_name||brief.client?.email} · {relativeTime(brief.updated_at||brief.created_at)}</small>{brief.health&&brief.health.level!=="neutral"&&brief.health.level!=="on_track"&&<small className="d-board-health"><ProjectHealthBadge health={brief.health}/></small>}</span><ChevronRight size={16}/></button></li>)}</ul>:<p className="d-board-empty">Nothing here.</p>}
    </section>;})}</div>
  </div>;
}

function AdminPayments({ briefs, refresh }) {
  const [notice,setNotice]=useState(null),[busy,setBusy]=useState("");
  const waiting=briefs.filter(brief=>["e_transfer_submitted","pending_review"].includes(brief.payment_status));
  const history=briefs.filter(brief=>["paid","approved","rejected","checkout_pending"].includes(brief.payment_status)||brief.stripe_checkout_session_id).sort((a,b)=>new Date(b.stripe_paid_at||b.e_transfer_confirmed_at||b.updated_at||0)-new Date(a.stripe_paid_at||a.e_transfer_confirmed_at||a.updated_at||0));
  const unpaid=briefs.filter(brief=>Number(brief.proposal_amount_cents)>0&&!["paid","approved","e_transfer_submitted","pending_review"].includes(brief.payment_status));
  const received=history.filter(brief=>["paid","approved"].includes(brief.payment_status)).reduce((sum,brief)=>sum+Number(brief.amount_paid_cents||brief.proposal_amount_cents||0),0);
  const outstanding=unpaid.reduce((sum,brief)=>sum+Number(brief.proposal_amount_cents||0),0);
  const updateManual=async(brief,action)=>{setBusy(`${brief.id}-${action}`);setNotice(null);try{await updateETransfer(brief.id,action);if(action==="confirm")dispatchEmailEvent("payment_confirmed",brief.id);setNotice({tone:"go",text:action==="confirm"?"Marked as received. The client was notified.":"Marked as not received. The client was notified."});await refresh();}catch(error){setNotice({tone:"stop",text:error.message||"Could not update this payment."});}finally{setBusy("");}};
  const name=brief=>brief.business_name||brief.client?.full_name||brief.client?.email;
  const statusOf=brief=>brief.payment_status==="paid"||brief.payment_status==="approved"?["Paid","is-go"]:brief.payment_status==="rejected"?["Not received","is-stop"]:brief.payment_status==="checkout_pending"?["Checkout started","is-wait"]:["Open","is-plain"];
  return <div className="d-page">
    <div className="d-page-head"><h2>Payments</h2><p>Card payments confirm themselves. Confirm e-Transfers only after you see the money in your bank.</p></div>
    <div className="d-stats">
      <div className="d-panel d-stat"><small>Received</small><b className="d-num">{formatCad(received)}</b></div>
      <div className="d-panel d-stat"><small>Waiting to be paid</small><b className="d-num">{formatCad(outstanding)}</b><span>{unpaid.length} project{unpaid.length===1?"":"s"}</span></div>
      <div className={cx("d-panel","d-stat",waiting.length&&"is-attention")}><small>e-Transfers to check</small><b className="d-num">{waiting.length}</b></div>
    </div>
    {notice&&<div className={cx("d-notice",`is-${notice.tone}`)} role="status">{notice.text}</div>}
    <section className="d-panel" aria-label="e-Transfers to check">
      <div className="d-panel-head"><div><h3>e-Transfers to check</h3><p>The client says they sent it.</p></div></div>
      {waiting.length?<ul className="d-list">{waiting.map(brief=><li key={brief.id} className="d-queue-row"><span className="d-row-icon is-wait"><CircleDollarSign size={18}/></span><span className="d-row-main"><b>{name(brief)}</b><small>{formatCad(brief.proposal_amount_cents)} · marked sent {new Date(brief.e_transfer_submitted_at||brief.updated_at).toLocaleDateString(undefined,{month:"short",day:"numeric"})}</small></span><span className="d-queue-actions"><button type="button" className="d-btn is-sm is-primary" disabled={Boolean(busy)} onClick={()=>updateManual(brief,"confirm")}>{busy===`${brief.id}-confirm`?"Saving…":"Received"}</button><button type="button" className="d-btn is-sm" disabled={Boolean(busy)} onClick={()=>updateManual(brief,"reject")}>{busy===`${brief.id}-reject`?"Saving…":"Not received"}</button></span></li>)}</ul>:<div className="d-empty"><CheckCircle2 size={22}/><b>Nothing to check</b><p>When a client marks an e-Transfer as sent, it shows up here.</p></div>}
    </section>
    <section className="d-panel" aria-label="Payment history">
      <div className="d-panel-head"><div><h3>History</h3><p>Card and e-Transfer payments.</p></div></div>
      {history.length?<ul className="d-list">{history.map(brief=>{const [label,tone]=statusOf(brief);const stripe=brief.payment_method==="stripe"||brief.stripe_checkout_session_id;return <li key={brief.id} className="d-row"><span className={cx("d-row-icon",tone==="is-go"&&"is-go")}><CircleDollarSign size={18}/></span><span className="d-row-main"><b>{name(brief)}</b><small>{formatCad(brief.amount_paid_cents||brief.proposal_amount_cents)} · {stripe?"Card (Stripe)":"e-Transfer"} · {new Date(brief.stripe_paid_at||brief.e_transfer_confirmed_at||brief.updated_at||Date.now()).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}</small></span><span className={cx("d-pill",tone)}>{label}</span></li>;})}</ul>:<div className="d-empty"><CircleDollarSign size={22}/><b>No payments yet</b><p>Payments appear here once clients pay.</p></div>}
    </section>
  </div>;
}

function AdminMessages({onOpenClient}) {
  const [user,setUser]=useState(null),[clients,setClients]=useState([]),[items,setItems]=useState([]),[selectedId,setSelectedId]=useState(""),[query,setQuery]=useState(""),[showNew,setShowNew]=useState(false),[notice,setNotice]=useState(""),[mobileConversationOpen,setMobileConversationOpen]=useState(false);
  const desktop=useIsDesktop();
  const load=useCallback(async()=>{const s=getSupabaseBrowserClient();const [{data:auth},{data:profiles,error:profilesError},{data:messages,error:messagesError}]=await Promise.all([s.auth.getUser(),s.from("profiles").select("id,email,full_name,role,project_briefs(id,status,business_name)").order("created_at",{ascending:false}),s.from("messages").select("*").order("created_at",{ascending:true}).limit(500)]);if(auth?.user)setUser(auth.user);if(profilesError||messagesError){setNotice(profilesError?.message||messagesError?.message||"Could not load conversations.");return;}const clientRows=(profiles||[]).filter(profile=>!["admin","super_admin"].includes(profile.role)&&!isAdminEmail(profile.email));setClients(clientRows);setItems(messages||[]);setSelectedId(current=>current||clientRows.find(client=>(messages||[]).some(message=>message.sender_id===client.id||message.recipient_id===client.id))?.id||"");},[]);
  useEffect(()=>{load();const s=getSupabaseBrowserClient();if(!s)return;const channel=s.channel("admin-inbox-v3").on("postgres_changes",{event:"*",schema:"public",table:"messages"},load).subscribe();return()=>s.removeChannel(channel)},[load]);
  useEffect(()=>{if(typeof window==="undefined")return;const clientId=window.sessionStorage.getItem("milink-message-client");if(clientId){setSelectedId(clientId);setMobileConversationOpen(true);window.sessionStorage.removeItem("milink-message-client");}},[]);
  useEffect(()=>{if(typeof window==="undefined")return undefined;const openClient=event=>{const clientId=event.detail?.clientId;if(clientId){setSelectedId(clientId);setMobileConversationOpen(true);}};window.addEventListener("milink:open-message-client",openClient);return()=>window.removeEventListener("milink:open-message-client",openClient);},[]);
  const conversations=useMemo(()=>clients.map(client=>{const messages=items.filter(message=>message.sender_id===client.id||message.recipient_id===client.id);const latest=messages[messages.length-1];const unread=messages.filter(message=>message.sender_id===client.id&&message.recipient_id===user?.id&&!message.is_read).length;return {client,messages,latest,unread};}).filter(thread=>thread.messages.length||thread.client.id===selectedId).sort((a,b)=>new Date(b.latest?.created_at||0)-new Date(a.latest?.created_at||0)),[clients,items,user?.id,selectedId]);
  const selected=conversations.find(thread=>thread.client.id===selectedId)||null;
  const markRead=useCallback(async(clientId)=>{if(!user?.id||!clientId)return;const {error}=await getSupabaseBrowserClient().from("messages").update({is_read:true}).eq("sender_id",clientId).eq("recipient_id",user.id).eq("is_read",false);if(error)console.error("Could not mark messages read",error);},[user?.id]);
  useEffect(()=>{if(selectedId&&(desktop||mobileConversationOpen))markRead(selectedId)},[selectedId,markRead,items.length,desktop,mobileConversationOpen]);
  const match=client=>`${client.full_name||""} ${client.email||""}`.toLowerCase().includes(query.trim().toLowerCase());
  const shown=conversations.filter(thread=>match(thread.client));
  const others=clients.filter(client=>!conversations.some(thread=>thread.client.id===client.id)&&match(client));
  const start=clientId=>{setSelectedId(clientId);setShowNew(false);setQuery("");setMobileConversationOpen(true);};
  const showList=desktop||!mobileConversationOpen, showThread=desktop||mobileConversationOpen;
  return <div className={cx("d-inbox",!desktop&&mobileConversationOpen&&"is-thread")}>
    {showList&&<aside className="d-panel d-inbox-list" aria-label="Conversations">
      <div className="d-inbox-tools">
        <label className="d-search"><Search size={16}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={showNew?"Find a client":"Search conversations"} aria-label="Search"/></label>
        <button type="button" className={cx("d-btn","is-sm",showNew&&"is-primary")} onClick={()=>setShowNew(value=>!value)} aria-pressed={showNew}>{showNew?"Done":<><Plus size={15}/>New</>}</button>
      </div>
      <div className="d-inbox-scroll">
        {showNew?<ul className="d-list">{[...conversations.map(thread=>thread.client),...others].filter(match).map(client=><li key={client.id}><button type="button" className="d-row" onClick={()=>start(client.id)}><span className="d-avatar">{initials(client.full_name||client.email)}</span><span className="d-row-main"><b>{client.full_name||"No name yet"}</b><small>{client.email}</small></span><ChevronRight size={16}/></button></li>)}</ul>
        :shown.length?<ul className="d-list">{shown.map(thread=><li key={thread.client.id}><button type="button" className={cx("d-thread",selectedId===thread.client.id&&desktop&&"is-active",thread.unread>0&&"is-unread")} onClick={()=>start(thread.client.id)}>
          <span className="d-avatar">{initials(thread.client.full_name||thread.client.email)}</span>
          <span className="d-thread-main"><span className="d-thread-top"><b>{thread.client.full_name||thread.client.email}</b><time>{relativeTime(thread.latest?.created_at)}</time></span><span className="d-thread-bottom"><small>{thread.latest?(thread.latest.sender_id===user?.id?"You: ":"")+(thread.latest.content||"Attachment"):thread.client.email}</small>{thread.unread>0&&<em className="d-nav-badge">{thread.unread}</em>}</span></span>
        </button></li>)}</ul>
        :<div className="d-empty"><MessageCircle size={22}/><b>{query?"No match":"No conversations yet"}</b><p>{query?"Try another name or email.":"Start one with New."}</p></div>}
      </div>
    </aside>}
    {showThread&&<section className="d-panel d-chat" aria-label="Conversation">{selected?<AdminConversation thread={selected} user={user} onSent={load} onBack={()=>setMobileConversationOpen(false)} desktop={desktop} onOpenClient={onOpenClient}/>:<div className="d-empty d-chat-empty"><MessageCircle size={26}/><b>Choose a conversation</b><p>Pick a client on the left, or start a new message.</p></div>}</section>}
    {notice&&<div className="d-notice is-stop" role="alert">{notice}</div>}
  </div>;
}

function ActionCenter({clients,briefs,submitted,noBrief,refresh,onNavigate,onOpenProject}) {
  const [notice,setNotice]=useState(""),[busy,setBusy]=useState(""),[inbox,setInbox]=useState([]),[sent,setSent]=useState({}),[replies,setReplies]=useState({files:[],changes:[],declined:[]});
  const loadInbox=useCallback(async()=>{const s=getSupabaseBrowserClient();if(!s)return;const {data:{user}}=await s.auth.getUser();if(!user)return;const [{data},files,changes,declined]=await Promise.all([s.from("messages").select("id,content,sender_id,created_at").eq("recipient_id",user.id).eq("is_read",false).order("created_at",{ascending:false}).limit(50),s.from("file_requests").select("id,title,project_id,completed_at").eq("status","completed").eq("admin_decision","pending").limit(30),s.from("approvals").select("id,title,project_id,decided_at").eq("status","changes_requested").limit(30),s.from("contracts").select("id,title,project_id,created_at").eq("status","declined").limit(30)]);setInbox(data||[]);setReplies({files:files.data||[],changes:changes.data||[],declined:declined.data||[]});},[]);
  useEffect(()=>{loadInbox();},[loadInbox,briefs]);
  const clientById=useMemo(()=>new Map(clients.map(client=>[client.id,client])),[clients]);
  const pendingPayments=briefs.filter(brief=>["e_transfer_submitted","pending_review"].includes(brief.payment_status));
  const toReview=submitted.filter(brief=>["submitted","reviewing"].includes(brief.status));
  const atRisk=briefs.filter(brief=>brief.health?.level==="at_risk").sort((a,b)=>(b.health?.priority||0)-(a.health?.priority||0));
  const followUps=noBrief.filter(client=>Date.now()-new Date(client.created_at).getTime()>86400000);
  const threads=[...inbox.reduce((map,message)=>{const entry=map.get(message.sender_id)||{sender:message.sender_id,count:0,latest:message};entry.count+=1;map.set(message.sender_id,entry);return map;},new Map()).values()];
  const reminder=async client=>{setBusy(`r-${client.id}`);const s=getSupabaseBrowserClient();const {data:{user}}=await s.auth.getUser();const {error}=await s.from("notifications").insert({user_id:client.id,recipient_id:client.id,sender_id:user?.id||null,title:"A quick reminder from MIlink",message:"Your project workspace is ready whenever you are. Complete your project brief to get started.",link:"/portal",type:"brief"});setBusy("");if(error){setNotice(`Could not send the reminder: ${error.message}`);return;}setSent(current=>({...current,[client.id]:true}));setNotice(`Reminder sent to ${client.full_name||client.email}.`);};
  const settle=async(brief,action)=>{setBusy(`p-${brief.id}`);try{await updateETransfer(brief.id,action);if(action==="confirm")dispatchEmailEvent("payment_confirmed",brief.id);setNotice(action==="confirm"?"Payment marked as received. The client was notified.":"Payment marked as not received. The client was notified.");refresh();}catch(error){setNotice(error.message||"Could not update this payment.");}setBusy("");};
  const openThread=clientId=>{if(typeof window!=="undefined")window.sessionStorage.setItem("milink-message-client",clientId);onNavigate("Messages");};
  const name=brief=>brief.business_name||brief.client?.full_name||brief.client?.email||"Untitled project";
  const briefById=new Map(briefs.map(brief=>[brief.id,brief]));
  const openFocused=(brief,focus)=>{if(typeof window!=="undefined")window.sessionStorage.setItem("milink-admin-project-focus",JSON.stringify({projectId:brief.id,focus}));onOpenProject?.(brief);};
  const queue=[
    ...toReview.map(brief=>({key:`b-${brief.id}`,tone:"brand",icon:FileText,title:name(brief),detail:`New brief from ${brief.client?.full_name||brief.client?.email}`,actions:[{label:"Open brief",primary:true,run:()=>onOpenProject?.(brief)}]})),
    ...threads.map(thread=>{const client=clientById.get(thread.sender);return {key:`m-${thread.sender}`,tone:"brand",icon:MessageCircle,title:client?.full_name||client?.email||"Client",detail:`${thread.count>1?`${thread.count} new messages`:"New message"}: “${(thread.latest.content||"Attachment").slice(0,90)}”`,meta:relativeTime(thread.latest.created_at),actions:[{label:"Reply",primary:true,run:()=>openThread(thread.sender)}]};}),
    ...replies.files.map(item=>{const brief=briefById.get(item.project_id);return brief&&{key:`fr-${item.id}`,tone:"brand",icon:Upload,title:name(brief),detail:`Replied to your request for “${item.title}”`,actions:[{label:"Review reply",primary:true,run:()=>openFocused(brief,"request-file")}]};}),
    ...replies.changes.map(item=>{const brief=briefById.get(item.project_id);return brief&&{key:`ch-${item.id}`,tone:"wait",icon:ShieldCheck,title:name(brief),detail:`Asked for changes to “${item.title}”`,actions:[{label:"See feedback",primary:true,run:()=>openFocused(brief,"approvals")}]};}),
    ...replies.declined.map(item=>{const brief=briefById.get(item.project_id);return brief&&{key:`dc-${item.id}`,tone:"stop",icon:FileSignature,title:name(brief),detail:`Asked to change the agreement “${item.title}”`,actions:[{label:"See note",primary:true,run:()=>openFocused(brief,"contracts")}]};}),
    ...pendingPayments.map(brief=>({key:`p-${brief.id}`,tone:"wait",icon:CircleDollarSign,title:name(brief),detail:"Client says the e-Transfer was sent. Check your bank, then confirm.",actions:[{label:"Received",primary:true,run:()=>settle(brief,"confirm"),busy:busy===`p-${brief.id}`},{label:"Not received",run:()=>settle(brief,"reject"),busy:busy===`p-${brief.id}`}]})),
    ...atRisk.map(brief=>({key:`h-${brief.id}`,tone:"stop",icon:HeartPulse,title:name(brief),detail:brief.health?.reason||"Needs attention",actions:[{label:"Open project",run:()=>onOpenProject?.(brief)}]})),
    ...followUps.map(client=>({key:`f-${client.id}`,tone:"plain",icon:UserRound,title:client.full_name||client.email,detail:"Signed up more than a day ago and has not started a brief.",actions:[{label:sent[client.id]?"Reminder sent":"Send reminder",run:()=>reminder(client),busy:busy===`r-${client.id}`,disabled:sent[client.id]}]}))
  ];
  const queueItems=queue.filter(Boolean);
  const replyCount=replies.files.length+replies.changes.length+replies.declined.length;
  const parts=[toReview.length&&`${toReview.length} new brief${toReview.length===1?"":"s"}`,threads.length&&`${threads.length} conversation${threads.length===1?"":"s"} waiting`,pendingPayments.length&&`${pendingPayments.length} payment${pendingPayments.length===1?"":"s"} to confirm`,replyCount&&`${replyCount} client repl${replyCount===1?"y":"ies"} to check`,atRisk.length&&`${atRisk.length} project${atRisk.length===1?"":"s"} at risk`].filter(Boolean);
  const stages=[["New brief","submitted"],["Reviewing","reviewing"],["Proposal sent","proposal_sent"],["Building","in_progress"],["Client review","client_review"],["Live","completed"]];
  const today=new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});
  return <div className="d-page">
    <div className="d-page-head-row">
      <div className="d-page-head"><p className="d-muted-text" style={{margin:0}}>{today}</p><h2>{queueItems.length?`${queueItems.length} thing${queueItems.length===1?"":"s"} need${queueItems.length===1?"s":""} you`:"You are all caught up"}</h2><p>{parts.length?parts.join(", ")+".":"No briefs, messages or payments are waiting."}</p></div>
      <button type="button" className="d-btn is-sm" onClick={()=>{refresh();loadInbox();}}><RefreshCw size={15}/>Refresh</button>
    </div>
    {notice&&<div className="d-notice is-go" role="status"><CheckCircle2 size={18}/><span>{notice}</span></div>}
    <section className="d-panel" aria-label="Needs you">
      {queueItems.length?<ul className="d-list">{queueItems.map(item=>{const Icon=item.icon;return <li key={item.key} className="d-queue-row">
        <span className={cx("d-row-icon",item.tone!=="plain"&&`is-${item.tone}`)}><Icon size={18}/></span>
        <span className="d-row-main"><b>{item.title}</b><small>{item.detail}</small>{item.meta&&<small className="d-queue-meta">{item.meta}</small>}</span>
        <span className="d-queue-actions">{item.actions.map(action=><button type="button" key={action.label} className={cx("d-btn","is-sm",action.primary&&"is-primary")} onClick={action.run} disabled={action.busy||action.disabled}>{action.busy?"Saving…":action.label}</button>)}</span>
      </li>;})}</ul>:<div className="d-empty"><CheckCircle2 size={24}/><b>Nothing is waiting</b><p>New briefs, client messages and payments show up here as they arrive.</p></div>}
    </section>
    <section className="d-panel" aria-label="Projects by stage">
      <div className="d-panel-head"><div><h3>Projects by stage</h3><p>{briefs.length} project{briefs.length===1?"":"s"} in total.</p></div><button type="button" className="d-btn is-quiet is-sm" onClick={()=>onNavigate("Projects")}>All projects</button></div>
      <div className="d-panel-body">
        <div className="d-stagebar" aria-hidden="true">{stages.map(([label,key])=>{const count=briefs.filter(brief=>brief.status===key).length;return count?<i key={key} className={`is-${key}`} style={{flexGrow:count}} title={`${label}: ${count}`}/>:null;})}</div>
        <ul className="d-stage-legend">{stages.map(([label,key])=>{const count=briefs.filter(brief=>brief.status===key).length;return <li key={key} className={count?"":"is-empty"}><i className={`is-${key}`}/><span>{label}</span><b className="d-num">{count}</b></li>;})}</ul>
      </div>
    </section>
  </div>;
}
function ProjectHealthBadge({health,detail=false}) {
  if (!health || health.level === "neutral") return null;
  const labels={on_track:"On track",needs_attention:"Needs attention",at_risk:"At risk"};
  const tone=health.level==="on_track"?"is-go":health.level==="needs_attention"?"is-wait":"is-stop";
  return <span className={cx("d-pill",tone)} title={health.reason}>{labels[health.level]}{detail&&<span className="d-visually-hidden">: {health.reason}</span>}</span>;
}

function ClientDirectory({ clients, refresh, onNavigate }) {
  const [selected,setSelected]=useState(null),[query,setQuery]=useState(""),[filter,setFilter]=useState("all"),[sort,setSort]=useState({key:"activity",dir:-1});
  const desktop=useIsDesktop();
  const lastActivity=client=>Math.max(new Date(client.created_at).getTime(),...clientProjects(client).map(project=>new Date(project.updated_at||project.created_at||0).getTime()));
  const stageIndex=client=>{const brief=latestClientProject(client);return brief?projectStages.indexOf(brief.status||"draft"):-1;};
  const sortBy=key=>setSort(current=>({key,dir:current.key===key?-current.dir:(key==="name"?1:-1)}));
  const filters=[["all","All"],["registered","No brief"],["submitted","New and proposal"],["development","Building"],["completed","Live"]];
  const matchesFilter=(client,value)=>{const projects=clientProjects(client);return value==="all"||value==="registered"&&!projects.length||value==="submitted"&&clientHasProjectStatus(client,["draft","submitted","reviewing","proposal_sent"])||value==="development"&&clientHasProjectStatus(client,["in_progress","client_review"])||value==="completed"&&clientHasProjectStatus(client,["completed"]);};
  const rows=clients.filter(client=>`${client.full_name||""} ${client.email||""}`.toLowerCase().includes(query.trim().toLowerCase())&&matchesFilter(client,filter)).sort((a,b)=>{const value=client=>sort.key==="name"?(client.full_name||client.email||"").toLowerCase():sort.key==="stage"?stageIndex(client):sort.key==="joined"?new Date(client.created_at).getTime():lastActivity(client);const x=value(a),y=value(b);return (x<y?-1:x>y?1:0)*sort.dir;});
  if(selected)return <ClientFullView record={selected} refresh={refresh} onBack={()=>setSelected(null)} onNavigate={onNavigate}/>;
  const openMessages=client=>{if(typeof window!=="undefined")window.sessionStorage.setItem("milink-message-client",client.id);onNavigate("Messages");};
  return <div className="d-page">
    <div className="d-page-head-row"><div className="d-page-head"><h2>Clients</h2><p>{clients.length} account{clients.length===1?"":"s"}. Open one to see their projects, files and agreements.</p></div><button type="button" className="d-btn is-sm" onClick={refresh}><RefreshCw size={15}/>Refresh</button></div>
    <section className="d-panel">
      <div className="d-files-tools">
        <div className="d-segment" role="tablist" aria-label="Filter clients">{filters.map(([value,label])=><button type="button" role="tab" key={value} aria-selected={filter===value} onClick={()=>setFilter(value)}>{label}<span className="d-num">{clients.filter(client=>matchesFilter(client,value)).length}</span></button>)}</div>
        <label className="d-search"><Search size={16}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search name or email" aria-label="Search clients"/></label>
      </div>
      {rows.length&&desktop?<div className="d-table-wrap"><table className="d-table"><thead><tr>{[["name","Client"],["stage","Stage"],[null,"Health"],["activity","Last activity"],["joined","Joined"]].map(([key,label])=><th key={label} scope="col" aria-sort={key&&sort.key===key?(sort.dir===1?"ascending":"descending"):undefined}>{key?<button type="button" onClick={()=>sortBy(key)}>{label}{sort.key===key&&<ChevronDown size={14} className={sort.dir===1?"is-up":""}/>}</button>:label}</th>)}<th scope="col"><span className="d-visually-hidden">Actions</span></th></tr></thead><tbody>{rows.map(client=>{const brief=latestClientProject(client),projectCount=clientProjects(client).length,health=clientHealth(client),name=client.full_name||client.email;return <tr key={client.id} onClick={()=>setSelected(client)}>
          <td><span className="d-cell-person"><span className="d-avatar">{initials(client.full_name||client.email)}</span><span><b>{name}</b><small>{client.full_name?client.email:""}{projectCount>1?`${client.full_name?" · ":""}${projectCount} projects`:""}</small></span></span></td>
          <td><span className={cx("d-pill",brief?stageTone(brief.status):"is-plain")}>{brief?stageLabel(brief.status):"No brief yet"}</span></td>
          <td>{health&&health.level!=="neutral"?<ProjectHealthBadge health={health}/>:<span className="d-muted-cell">—</span>}</td>
          <td className="d-num">{relativeTime(new Date(lastActivity(client)).toISOString())}</td>
          <td className="d-num">{new Date(client.created_at).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}</td>
          <td className="d-cell-actions"><button type="button" className="d-icon-button" aria-label={`Message ${name}`} title="Message" onClick={event=>{event.stopPropagation();openMessages(client);}}><MessageCircle size={18}/></button></td>
        </tr>;})}</tbody></table></div>
      :rows.length?<ul className="d-list">{rows.map(client=>{const brief=latestClientProject(client),projectCount=clientProjects(client).length,health=clientHealth(client),name=client.full_name||client.email;return <li key={client.id} className="d-client-row">
        <button type="button" className="d-client-open" onClick={()=>setSelected(client)}>
          <span className="d-avatar">{initials(client.full_name||client.email)}</span>
          <span className="d-row-main"><b>{name}</b><small>{client.full_name?client.email:`Joined ${new Date(client.created_at).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}`}</small></span>
          <span className="d-client-meta"><span className={cx("d-pill",brief?stageTone(brief.status):"is-plain")}>{brief?stageLabel(brief.status):"No brief yet"}</span>{projectCount>1&&<span className="d-pill is-plain">{projectCount} projects</span>}<ProjectHealthBadge health={health}/></span>
        </button>
        <button type="button" className="d-icon-button" aria-label={`Message ${name}`} title="Message" onClick={()=>openMessages(client)}><MessageCircle size={18}/></button>
      </li>;})}</ul>:<div className="d-empty"><Users size={24}/><b>No clients here</b><p>Try another filter or search.</p></div>}
    </section>
  </div>;
}

function ProjectTabs({projects,activeId,onSelect}){if(projects.length<2)return null;return <div className="d-segment" role="tablist" aria-label="Client projects">{projects.map(project=><button type="button" role="tab" aria-selected={project.id===activeId} key={project.id} onClick={()=>onSelect(project.id)}>{project.business_name||project.industry||"Untitled project"}<span>{stageLabel(project.status)}</span></button>)}</div>}

function ClientFullView({record,initialProjectId,refresh,onBack,onNavigate}) {
  const [activeProjectId,setActiveProjectId]=useState(initialProjectId||latestClientProject(record)?.id||"");
  useEffect(()=>{setActiveProjectId(current=>{const projects=clientProjects(record);const desired=initialProjectId&&projects.some(project=>project.id===initialProjectId)?initialProjectId:current;return projects.some(project=>project.id===desired)?desired:(latestClientProject(record)?.id||"");});},[record.id,record.project_briefs,initialProjectId]);
  useEffect(()=>{window.dispatchEvent(new CustomEvent("milink:notifications-seen",{detail:{kinds:["brief","file_request"]}}));},[record.id,activeProjectId]);
  const brief=record.project_briefs?.find(project=>project.id===activeProjectId)||null;
  return <ClientFullViewInner record={record} brief={brief} projects={record.project_briefs||[]} activeProjectId={activeProjectId} onSelectProject={setActiveProjectId} refresh={refresh} onBack={onBack} onNavigate={onNavigate} onProjectDeleted={()=>{refresh();onBack();}}/>;
}

function ClientFullViewInner({record,brief,projects,activeProjectId,onSelectProject,refresh,onBack,onNavigate,onProjectDeleted}) {
  const [status,setStatus]=useState(brief?.status||"draft");
  const [quote,setQuote]=useState({amount:"",days:"",summary:""});
  const [showQuote,setShowQuote]=useState(false);
  const [notice,setNotice]=useState(null);
  const [savingStage,setSavingStage]=useState(false);
  const [tab,setTab]=useState("brief");
  const tabs=[["brief","Brief"],["work","Work"],["files","Files"],["contract","Contract"],["handoff","Handoff"],["activity","Activity"]];
  const tabOf={assets:"files","request-file":"files",approvals:"work",contracts:"contract",activity:"activity"};
  const reveal=(id,block="start",delay=100)=>{setTab(tabOf[id]||"brief");window.setTimeout(()=>document.getElementById(id==="request-file"?"mi-request-file":`mi-project-${id}`)?.scrollIntoView({behavior:"smooth",block}),delay);};
  useEffect(()=>{setTab("brief");setNotice(null);},[brief?.id]);
  useEffect(()=>{if(!brief?.id||typeof window==="undefined")return;let pending=null;try{pending=JSON.parse(window.sessionStorage.getItem("milink-admin-project-action")||"null")}catch{}if(!pending||pending.projectId!==brief.id)return;window.sessionStorage.removeItem("milink-admin-project-action");if(pending.action==="proposal"){openQuote();return;}if(pending.action==="files")reveal("request-file","center",120);},[brief?.id]);
  useEffect(()=>{if(!brief?.id||typeof window==="undefined")return;let pending=null;try{pending=JSON.parse(window.sessionStorage.getItem("milink-admin-project-focus")||"null")}catch{}if(!pending||pending.projectId!==brief.id)return;window.sessionStorage.removeItem("milink-admin-project-focus");reveal(pending.focus);},[brief?.id]);
  useEffect(()=>{setStatus(brief?.status||"draft");},[brief?.id,brief?.status]);
  const saveStatus=async()=>{if(!brief||status===brief.status)return;setSavingStage(true);const {error}=await getSupabaseBrowserClient().from("project_briefs").update({status}).eq("id",brief.id);setSavingStage(false);if(error){setNotice({tone:"stop",text:error.message});return;}setNotice({tone:"go",text:`Stage changed to “${stageLabel(status)}”. The client was notified.`});dispatchEmailEvent("status_updated",brief.id);refresh();};
  const openQuote=()=>{setQuote({amount:brief?.proposal_amount_cents?String(brief.proposal_amount_cents/100):"",days:brief?.proposal_delivery_days?String(brief.proposal_delivery_days):"",summary:brief?.proposal_summary||""});setShowQuote(true);};
  const proposal=async()=>{if(!brief)return;const {error}=await getSupabaseBrowserClient().from("project_briefs").update({status:"proposal_sent",proposal_amount_cents:Math.round(Number(quote.amount||0)*100),proposal_delivery_days:Number(quote.days)||null,proposal_summary:quote.summary}).eq("id",brief.id);if(error){setNotice({tone:"stop",text:error.message});return;}setNotice({tone:"go",text:"Proposal sent. Next: add the agreement in the Contract tab."});dispatchEmailEvent("proposal_sent",brief.id);setShowQuote(false);refresh();};
  const openChat=()=>{if(typeof window!=="undefined")window.sessionStorage.setItem("milink-message-client",record.id);onNavigate("Messages");};
  const phoneDigits=String(record.phone||"").replace(/\D/g,"");
  const whatsapp=phoneDigits.length>=10?`https://wa.me/${phoneDigits.length===10?`1${phoneDigits}`:phoneDigits}?text=${encodeURIComponent(`Hi ${record.full_name?.split(" ")[0]||""}, this is MIlink about your website.`)}`:"";
  const nextAction=!brief?null:["submitted","reviewing"].includes(brief.status)?{label:"Send proposal",run:openQuote}:brief.status==="proposal_sent"?{label:"Add agreement",run:()=>setTab("contract")}:["in_progress","client_review"].includes(brief.status)?{label:"Post an update",run:()=>setTab("work")}:null;
  return <div className="d-page">
    <button type="button" className="d-back" onClick={onBack}><ChevronLeft size={18}/>All clients</button>
    <section className="d-panel d-client-head">
      <div className="d-identity"><span className="d-avatar is-lg">{initials(record.full_name||record.email)}</span><span><b>{record.full_name||"No name yet"}</b><small>{record.email}</small></span></div>
      <dl className="d-facts">
        {record.company_name&&<div><dt>Business</dt><dd>{record.company_name}</dd></div>}
        {record.phone&&<div><dt>Phone</dt><dd><a href={`tel:${record.phone}`}>{record.phone}</a></dd></div>}
        <div><dt>Prefers</dt><dd>{contactLabels[record.preferred_contact]||"Email"}</dd></div>
        <div><dt>Joined</dt><dd>{new Date(record.created_at).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}</dd></div>
      </dl>
      <div className="d-btn-row"><button type="button" className="d-btn" onClick={openChat}><MessageCircle size={17}/>Message</button>{whatsapp&&<a className="d-btn" href={whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>}{nextAction&&<button type="button" className="d-btn is-primary" onClick={nextAction.run}>{nextAction.label}</button>}</div>
    </section>
    {projects.length>1&&<ProjectTabs projects={projects} activeId={activeProjectId} onSelect={onSelectProject}/>}
    {notice&&<div className={cx("d-notice",`is-${notice.tone}`)} role="status">{notice.text}</div>}
    {!brief?<Empty icon={Users} title="No project yet" copy="This client has an account but has not started a brief. Send them a message to get started." action={<button type="button" className="d-btn" onClick={openChat}><MessageCircle size={17}/>Message</button>}/>:<>
      <section className="d-panel d-stage-bar" aria-label="Project stage">
        <div className="d-stage-name"><small>Project</small><b>{brief.business_name||"Untitled project"}</b>{brief.health&&<ProjectHealthBadge health={brief.health} detail/>}</div>
        <label className="d-field d-stage-select"><span>Stage</span><select value={status} onChange={event=>setStatus(event.target.value)}>{projectStages.map(value=><option key={value} value={value}>{stageLabel(value)}</option>)}</select></label>
        <button type="button" className="d-btn is-primary" disabled={savingStage||status===brief.status} onClick={saveStatus}>{savingStage?"Saving…":"Update stage"}</button>
      </section>
      <div className="d-segment d-tabs" role="tablist" aria-label="Project sections">{tabs.map(([key,label])=><button key={key} type="button" role="tab" aria-selected={tab===key} onClick={()=>setTab(key)}>{label}</button>)}</div>
      {tab==="brief"&&<BriefFacts brief={brief}/>}
      {tab==="work"&&<div className="d-stack"><OnboardingReadiness brief={brief} admin onChange={()=>refresh()}/><LiveProgressTimeline brief={brief} admin onChange={()=>refresh()}/><div id="mi-project-approvals"><AdminApprovals brief={brief} client={record}/></div></div>}
      {tab==="files"&&<div className="d-stack"><div id="mi-request-file"><AdminFileRequest client={record} brief={brief}/></div><div id="mi-project-assets"><AdminAssetHub client={record} brief={brief}/></div></div>}
      {tab==="contract"&&<div id="mi-project-contracts"><AdminContracts brief={brief}/></div>}
      {tab==="handoff"&&<AdminHandoffSpecs brief={brief} onChange={()=>refresh()}/>}
      {tab==="activity"&&<div id="mi-project-activity"><AdminActivityLog brief={brief}/></div>}
    </>}
    <section className="d-panel d-danger" aria-label="Delete">
      <div className="d-panel-head"><div><h3>Delete</h3><p>Permanent. Files, messages and records cannot be recovered.</p></div></div>
      <div className="d-panel-body d-btn-row">{brief&&<ProjectDeleteAction brief={brief} clientName={record.full_name||record.email} onDeleted={onProjectDeleted}/>}<ClientDeleteAction record={record} onDeleted={()=>{refresh();onBack();}}/></div>
    </section>
    {showQuote&&<ProposalModal brief={brief} quote={quote} setQuote={setQuote} onClose={()=>setShowQuote(false)} onSubmit={proposal}/>}
  </div>;
}

function ProposalModal({quote,setQuote,onClose,onSubmit,brief}) {
  const [sending,setSending]=useState(false);
  const asked=brief?[brief.budget_range&&brief.budget_range!=="Not sure yet"?`budget ${brief.budget_range}`:"",brief.page_structure?.length?`${brief.page_structure.length} pages`:"",brief.target_launch_date?`launch by ${brief.target_launch_date}`:""].filter(Boolean).join(", "):"";
  const valid=Number(quote.amount)>0;
  return <AdminModal label="Send a proposal" heading="Send a proposal" onClose={onClose}>
    <div className="d-modal-body">
      <p className="d-muted-text" style={{margin:0}}>The client sees this on their overview and in Contracts, and gets an email.{asked&&<> They asked for {asked}.</>}</p>
      <div className="d-fields d-fields-2">
        <label className="d-field"><span>Price in CAD <em aria-hidden="true">*</em></span><input type="number" min="0" inputMode="decimal" value={quote.amount} onChange={event=>setQuote(current=>({...current,amount:event.target.value}))} placeholder="e.g. 1899"/></label>
        <label className="d-field"><span>Delivery in days</span><input type="number" min="0" inputMode="numeric" value={quote.days} onChange={event=>setQuote(current=>({...current,days:event.target.value}))} placeholder="e.g. 21"/></label>
      </div>
      <label className="d-field"><span>What is included</span><textarea rows={4} value={quote.summary} onChange={event=>setQuote(current=>({...current,summary:event.target.value}))} placeholder="Pages, features and anything not included."/></label>
    </div>
    <footer className="d-modal-foot"><button type="button" className="d-btn" onClick={onClose}>Cancel</button><button type="button" className="d-btn is-primary" disabled={!valid||sending} onClick={async()=>{setSending(true);await onSubmit();setSending(false);}}>{sending?"Sending…":"Send proposal"}</button></footer>
  </AdminModal>;
}

function ClientDeleteAction({record,onDeleted}) {
  const [open,setOpen]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(""),[confirmation,setConfirmation]=useState("");
  const name=record.full_name||record.email;
  const canDelete=confirmation.trim().toLowerCase()===name.trim().toLowerCase();
  const remove=async()=>{if(!canDelete)return;setBusy(true);setError("");const s=getSupabaseBrowserClient();const {data:{session}}=await s.auth.getSession();const response=await fetch("/api/admin/delete-client",{method:"POST",headers:{"content-type":"application/json",authorization:`Bearer ${session?.access_token||""}`},body:JSON.stringify({clientId:record.id})});const body=await response.json().catch(()=>({}));setBusy(false);if(!response.ok){setError(body.error||"Could not delete this client.");return;}window.dispatchEvent(new CustomEvent("milink:admin-toast",{detail:"Client deleted."}));onDeleted();};
  return <>
    <button type="button" className="d-btn is-danger is-sm" onClick={()=>setOpen(true)}><X size={16}/>Delete client</button>
    {open&&<AdminModal danger label="Delete client" heading={`Delete ${name}?`} onClose={()=>!busy&&setOpen(false)}>
      <div className="d-modal-body"><p className="d-card-text">This deletes the account, every project, message and file. It cannot be undone.</p><label className="d-field"><span>Type “{name}” to confirm</span><input value={confirmation} onChange={event=>setConfirmation(event.target.value)} autoComplete="off"/></label>{error&&<div className="d-notice is-stop" role="alert">{error}</div>}</div>
      <footer className="d-modal-foot"><button type="button" className="d-btn" disabled={busy} onClick={()=>setOpen(false)}>Cancel</button><button type="button" className="d-btn is-danger" disabled={busy||!canDelete} onClick={remove}>{busy?"Deleting…":"Delete permanently"}</button></footer>
    </AdminModal>}
  </>;
}

function ProjectDeleteAction({brief,clientName,onDeleted}) {
  const [open,setOpen]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(""),[confirmation,setConfirmation]=useState("");
  const projectName=brief.business_name||brief.industry||"Untitled project";
  const canDelete=confirmation.trim().toLowerCase()===projectName.trim().toLowerCase();
  const remove=async()=>{if(!canDelete)return;setBusy(true);setError("");try{const s=getSupabaseBrowserClient();const {data:{session}}=await s.auth.getSession();const response=await fetch("/api/admin/delete-project",{method:"POST",headers:{"content-type":"application/json",authorization:`Bearer ${session?.access_token||""}`},body:JSON.stringify({briefId:brief.id})});const body=await response.json().catch(()=>({}));if(!response.ok)throw new Error(body.error||"Could not delete this project.");window.dispatchEvent(new CustomEvent("milink:admin-toast",{detail:"Project deleted. The client account is still active."}));onDeleted?.();}catch(removeError){setError(removeError.message||"Could not delete this project.");}finally{setBusy(false);}};
  return <>
    <button type="button" className="d-btn is-danger is-sm" onClick={()=>setOpen(true)}><Trash2 size={16}/>Delete this project</button>
    {open&&<AdminModal danger label="Delete project" heading={`Delete ${projectName}?`} onClose={()=>!busy&&setOpen(false)}>
      <div className="d-modal-body"><p className="d-card-text">This deletes the brief, files, approvals, agreements, payment records and project messages. {clientName}’s account and other projects stay.</p><label className="d-field"><span>Type “{projectName}” to confirm</span><input value={confirmation} onChange={event=>setConfirmation(event.target.value)} autoComplete="off"/></label>{error&&<div className="d-notice is-stop" role="alert">{error}</div>}</div>
      <footer className="d-modal-foot"><button type="button" className="d-btn" disabled={busy} onClick={()=>setOpen(false)}>Cancel</button><button type="button" className="d-btn is-danger" disabled={busy||!canDelete} onClick={remove}>{busy?"Deleting…":"Delete permanently"}</button></footer>
    </AdminModal>}
  </>;
}
function AdminAssetHub({client,brief}) {
  const [files,setFiles]=useState([]),[filter,setFilter]=useState("all"),[notice,setNotice]=useState(null),[zipping,setZipping]=useState(false),[progress,setProgress]=useState(0),[preview,setPreview]=useState(null);
  const load=useCallback(async()=>{if(!brief?.id)return;const {data,error}=await getSupabaseBrowserClient().from("project_files").select("*").eq("brief_id",brief.id).order("created_at",{ascending:false});if(error){console.error("Could not load files",error);setNotice({tone:"stop",text:error.message});return;}setFiles(data||[]);},[brief?.id]);
  useEffect(()=>{load();if(!brief?.id)return undefined;const s=getSupabaseBrowserClient();const channel=s.channel(`admin-assets-${brief.id}`).on("postgres_changes",{event:"*",schema:"public",table:"project_files",filter:`brief_id=eq.${brief.id}`},load).subscribe();return()=>s.removeChannel(channel);},[brief?.id,load]);
  const downloadAll=async selectedFiles=>{if(!selectedFiles.length)return;setZipping(true);setProgress(0);setNotice(null);try{const [{default:JSZip},fileSaver]=await Promise.all([import("jszip"),import("file-saver")]);const zip=new JSZip();for(let index=0;index<selectedFiles.length;index++){const file=selectedFiles[index];const path=assetPath(file);if(!path)continue;const {data,error}=await getSupabaseBrowserClient().storage.from(assetBucket(file)).createSignedUrl(path,600);if(error)throw error;const response=await fetch(data.signedUrl);if(!response.ok)throw new Error(`Could not download ${file.file_name||file.name}.`);zip.file(`${assetGroupLabel(file)||"File"}s/${file.file_name||file.name||`file-${index+1}`}`,await response.blob());setProgress(Math.round(((index+1)/selectedFiles.length)*85));}const archive=await zip.generateAsync({type:"blob"},metadata=>setProgress(85+Math.round(metadata.percent*.15)));const exportName=(brief?.business_name||client.full_name||client.email||"client").replace(/[^a-z0-9]+/gi,"-").replace(/(^-|-$)/g,"")||"client";fileSaver.saveAs(archive,`${exportName}-files.zip`);}catch(error){console.error("ZIP failed",error);setNotice({tone:"stop",text:error.message||"Could not package these files."});}finally{setZipping(false);setProgress(0);}};
  const remove=async file=>{if(!window.confirm(`Delete ${file.file_name||file.name} from this project?`))return;setFiles(current=>current.filter(item=>item.id!==file.id));const s=getSupabaseBrowserClient();const {error}=await s.from("project_files").delete().eq("id",file.id);if(error){setNotice({tone:"stop",text:error.message});load();return;}if(assetBucket(file)==="portal-files"&&assetPath(file))await s.storage.from("portal-files").remove([assetPath(file)]);setNotice({tone:"go",text:"File deleted."});};
  const shown=files.filter(file=>filter==="all"||assetKind(file)===filter);
  const previewAsset=file=>{if(assetPreviewKind(file))setPreview(file);else openAsset(file).catch(error=>setNotice({tone:"stop",text:error.message}));};
  return <section className="d-panel" aria-label="Project files">
    <div className="d-panel-head"><div><h3>Files from the client</h3><p>{files.length} file{files.length===1?"":"s"}.</p></div>{files.length>0&&<button type="button" className="d-btn is-sm" disabled={zipping} onClick={()=>downloadAll(shown)}><Download size={15}/>{zipping?`Preparing ${progress}%`:"Download all"}</button>}</div>
    {normaliseBrandColors(brief?.brand_colors).length>0&&<div className="d-panel-body"><BrandColorTokens colors={brief?.brand_colors}/></div>}
    {files.length>0&&<div className="d-files-tools"><div className="d-segment" role="tablist" aria-label="File type">{assetTypeFilters.map(([value,label])=><button type="button" role="tab" key={value} aria-selected={filter===value} onClick={()=>setFilter(value)}>{label}<span className="d-num">{files.filter(file=>value==="all"||assetKind(file)===value).length}</span></button>)}</div></div>}
    {notice&&<div className="d-panel-body"><div className={cx("d-notice",`is-${notice.tone}`)} role="status">{notice.text}</div></div>}
    {shown.length?<ul className="d-list">{shown.map(file=><li key={file.id} className="d-file-row"><button type="button" className="d-file-open" onClick={()=>previewAsset(file)}><span className={cx("d-row-icon",assetKind(file)==="image"&&"is-brand")}>{assetIcon(file,18)}</span><span className="d-row-main"><b>{file.file_name||file.name}</b><small>{assetGroupLabel(file)} · {formatBytes(file.file_size??file.size_bytes)} · {new Date(file.created_at).toLocaleDateString(undefined,{month:"short",day:"numeric"})}</small>{file.description&&<small>{file.description}</small>}</span></button><span className="d-file-actions"><button type="button" className="d-icon-button" aria-label={`Download ${file.file_name||file.name}`} onClick={async()=>{try{await openAsset(file,{download:true})}catch(error){setNotice({tone:"stop",text:error.message})}}}><Download size={17}/></button><button type="button" className="d-icon-button is-danger" aria-label={`Delete ${file.file_name||file.name}`} onClick={()=>remove(file)}><Trash2 size={17}/></button></span></li>)}</ul>:<div className="d-empty"><FolderKanban size={22}/><b>No files yet</b><p>Client uploads appear here right away.</p></div>}
    {preview&&<AssetLightbox file={preview} onClose={()=>setPreview(null)}/>}
  </section>;
}

const fileRequestPresets=[["Logo","Your logo","Send your logo as an SVG, or a PNG at least 1000px wide."],["Photos","Photos for the website","Send 10 to 15 of your best photos (JPG, at least 2000px wide)."],["Website text","Text for each page","Send the text you want on each page, or a Google Docs link."],["Brand guide","Brand colours and fonts","Send your colours and fonts, or a brand guide PDF if you have one."],["Domain access","Domain details","Tell us where your domain is registered (for example GoDaddy or Namecheap). We will explain how to share access safely."]];
function AdminFileRequest({client,brief}) {
  const [title,setTitle]=useState(""),[description,setDescription]=useState(""),[notice,setNotice]=useState(null),[busy,setBusy]=useState(""),[requests,setRequests]=useState([]),[composing,setComposing]=useState(false);
  const load=useCallback(async()=>{let query=getSupabaseBrowserClient().from("file_requests").select("*").eq("client_id",client.id);if(brief?.id)query=query.eq("project_id",brief.id);const {data,error}=await query.order("created_at",{ascending:false});if(error)console.error("Could not load file requests",error);else setRequests(data||[]);},[client.id,brief?.id]);
  useEffect(()=>{load();const s=getSupabaseBrowserClient();if(!s)return undefined;const projectFilter=brief?.id?`project_id=eq.${brief.id}`:`client_id=eq.${client.id}`;const channel=s.channel(`admin-file-review-${client.id}-${brief?.id||"all"}`).on("postgres_changes",{event:"*",schema:"public",table:"file_requests",filter:projectFilter},load).subscribe();return()=>s.removeChannel(channel)},[client.id,brief?.id,load]);
  const send=async()=>{if(!title.trim()){setNotice({tone:"wait",text:"Say what you need, for example “Your logo”."});return;}setBusy("new");const s=getSupabaseBrowserClient();const {data:{user}}=await s.auth.getUser();const {data:request,error}=await s.from("file_requests").insert({project_id:brief?.id||null,client_id:client.id,created_by:user?.id||null,title:title.trim(),description:description.trim()||null}).select("id").single();setBusy("");if(error){setNotice({tone:"stop",text:error.message});return;}setNotice({tone:"go",text:"Request sent. The client sees it on their overview and gets an email."});dispatchEmailEvent("file_requested",request.id);setTitle("");setDescription("");setComposing(false);load();};
  const notify=async(heading,message,type="file_request")=>{const s=getSupabaseBrowserClient();const {data:{user}}=await s.auth.getUser();const tab=type==="file_request"?"assets":"overview";const projectSuffix=brief?.id?`&project=${brief.id}`:"";await s.from("notifications").insert({user_id:client.id,recipient_id:client.id,sender_id:user?.id||null,title:heading,message,link:`/portal?tab=${tab}${projectSuffix}`,type});};
  const decide=async(request,decision)=>{setBusy(request.id);const s=getSupabaseBrowserClient();let error=null;if(decision==="accepted"&&request.file_url){const {data:{user}}=await s.auth.getUser();const {error:assetError}=await s.from("project_files").insert({brief_id:request.project_id||brief?.id,client_id:client.id,name:request.file_name||request.title,file_name:request.file_name||request.title,storage_path:request.file_url,file_url:request.file_url,storage_bucket:"portal-files",mime_type:null,file_type:null,size_bytes:request.file_size||null,file_size:request.file_size||null,file_kind:"asset",category:assetKind({name:request.file_name||""})==="image"?"media":"document",description:`From request: ${request.title}`,uploaded_by:user?.id||null,status:"approved"});error=assetError;}if(!error){const result=await s.from("file_requests").update({admin_decision:decision,status:decision==="dismissed"?"cancelled":"completed"}).eq("id",request.id);error=result.error;}setBusy("");if(error){setNotice({tone:"stop",text:error.message});return;}await notify(decision==="accepted"?"File received":"Request closed",decision==="accepted"?`Thanks, we saved “${request.file_name||request.title}” to your files.`:`We closed the request for “${request.title}”.`);setNotice({tone:"go",text:decision==="accepted"?"Saved to the project files.":"Request closed."});load();};
  const download=async request=>{const path=request.file_url||request.uploaded_file_url;if(!path)return;const {data,error}=await getSupabaseBrowserClient().storage.from("portal-files").createSignedUrl(path,3600);if(error){setNotice({tone:"stop",text:error.message});return;}window.open(data.signedUrl,"_blank","noopener,noreferrer");};
  const open=requests.filter(request=>!["accepted","dismissed"].includes(request.admin_decision));
  const stateOf=request=>request.status==="completed"&&request.admin_decision==="pending"?["Reply received","is-brand"]:request.admin_decision==="accepted"?["Saved","is-go"]:request.admin_decision==="dismissed"?["Closed","is-plain"]:["Waiting for client","is-wait"];
  return <section className="d-panel" aria-label="File requests">
    <div className="d-panel-head"><div><h3>File requests</h3><p>{open.length?`${open.length} open.`:"Ask the client for anything you are missing."}</p></div>{!composing&&<button type="button" className="d-btn is-sm is-primary" onClick={()=>setComposing(true)}><Plus size={15}/>Ask for a file</button>}</div>
    {composing&&<div className="d-panel-body d-fields">
      <div className="d-chips" aria-label="Common requests">{fileRequestPresets.map(([label,presetTitle,presetText])=><button type="button" key={label} className={cx("d-chip",title===presetTitle&&"is-on")} onClick={()=>{setTitle(presetTitle);setDescription(presetText);}}>{label}</button>)}</div>
      <label className="d-field"><span>What do you need?</span><input value={title} onChange={event=>setTitle(event.target.value)} placeholder="e.g. Your logo"/></label>
      <label className="d-field"><span>Instructions <i>optional</i></span><textarea rows={3} value={description} onChange={event=>setDescription(event.target.value)} placeholder="Format, size, or why you need it."/></label>
      <div className="d-btn-row"><button type="button" className="d-btn is-primary" disabled={busy==="new"} onClick={send}>{busy==="new"?"Sending…":"Send request"}</button><button type="button" className="d-btn" onClick={()=>setComposing(false)}>Cancel</button></div>
    </div>}
    {notice&&<div className="d-panel-body"><div className={cx("d-notice",`is-${notice.tone}`)} role="status">{notice.text}</div></div>}
    {requests.length>0&&<ul className="d-list">{requests.map(request=>{const [label,tone]=stateOf(request);const received=request.status==="completed"&&request.admin_decision==="pending";return <li key={request.id} className="d-request-row">
      <div className="d-request-top"><span className="d-row-main"><b>{request.title}</b>{request.description&&<small>{request.description}</small>}</span><span className={cx("d-pill",tone)}>{label}</span></div>
      {(request.file_url||request.uploaded_file_url)&&<button type="button" className="d-attachment-row" onClick={()=>download(request)}><FileText size={17}/><span><b>{request.file_name||"Attached file"}</b><small>{formatBytes(request.file_size||0)} · open</small></span></button>}
      {request.client_note&&<div className="d-quote"><b>Client note</b><p>{request.client_note}</p></div>}
      {received&&<div className="d-btn-row">{(request.file_url||request.uploaded_file_url)&&<button type="button" className="d-btn is-sm is-primary" disabled={busy===request.id} onClick={()=>decide(request,"accepted")}><Check size={15}/>Save to files</button>}<button type="button" className="d-btn is-sm" disabled={busy===request.id} onClick={()=>decide(request,"dismissed")}>Close request</button></div>}
    </li>;})}</ul>}
  </section>;
}

function AdminCommandPalette({open,onClose,onNavigate,onOpenClient,onOpenProject,onOpenMessages,light,onToggleTheme}) {
  const [query,setQuery]=useState(""),[clients,setClients]=useState([]),[projects,setProjects]=useState([]),[results,setResults]=useState({messages:[],files:[],contracts:[],approvals:[]}),[activeIndex,setActiveIndex]=useState(0),[loading,setLoading]=useState(false),[searching,setSearching]=useState(false); const inputRef=useRef(null);
  useEffect(()=>{if(!open)return undefined;let active=true;setQuery("");setResults({messages:[],files:[],contracts:[],approvals:[]});setActiveIndex(0);setLoading(true);const load=async()=>{const supabase=getSupabaseBrowserClient();if(!supabase){if(active)setLoading(false);return;}const [{data:profileRows,error:profileError},{data:projectRows,error:projectError}]=await Promise.all([supabase.from("profiles").select("id,email,full_name,role").order("created_at",{ascending:false}),supabase.from("project_briefs").select("id,client_id,business_name,status,updated_at")]);if(active){if(profileError||projectError)console.error("Could not load command palette context",profileError||projectError);setClients((profileRows||[]).filter(client=>!["admin","super_admin"].includes(client.role)&&!isAdminEmail(client.email)));setProjects(projectRows||[]);setLoading(false);}};load();return()=>{active=false};},[open]);
  useEffect(()=>{
    const term=query.trim();
    if(!open||term.length<2){setResults({messages:[],files:[],contracts:[],approvals:[]});setSearching(false);return undefined;}
    let active=true;
    const timer=window.setTimeout(async()=>{
      setSearching(true);
      const supabase=getSupabaseBrowserClient();
      if(!supabase){if(active)setSearching(false);return;}
      // Keep this lightweight: one debounced, limited ILIKE query per result type.
      const like=`%${term.replace(/[,%()]/g," ").replace(/[%_]/g,"\\$&")}%`;
      const [messages,files,contracts,approvals]=await Promise.all([
        supabase.from("messages").select("id,content,project_id,sender_id,recipient_id,created_at").ilike("content",like).order("created_at",{ascending:false}).limit(5),
        supabase.from("project_files").select("id,brief_id,client_id,file_name,name,description,created_at").or(`file_name.ilike.${like},name.ilike.${like},description.ilike.${like}`).order("created_at",{ascending:false}).limit(5),
        supabase.from("contracts").select("id,title,project_id,status,created_at").ilike("title",like).order("created_at",{ascending:false}).limit(5),
        supabase.from("approvals").select("id,title,project_id,status,created_at").ilike("title",like).order("created_at",{ascending:false}).limit(5),
      ]);
      if(!active)return;
      [messages,files,contracts,approvals].forEach(result=>{if(result.error)console.warn("Command palette search category unavailable",result.error.message);});
      setResults({messages:messages.data||[],files:files.data||[],contracts:contracts.data||[],approvals:approvals.data||[]});
      setSearching(false);
    },280);
    return()=>{active=false;window.clearTimeout(timer);};
  },[open,query]);
  const actions=useMemo(()=>{
    const navigate=(label,tab)=>({kind:"action",label,detail:"Navigation",icon:LayoutDashboard,run:()=>{onNavigate(tab);onClose();}});
    const navigation=[navigate("Today","Action Center"),navigate("Clients","Clients"),navigate("Projects","Projects"),navigate("Messages","Messages"),navigate("Payments","Payments")];
    const theme={kind:"action",label:`Use ${light?"dark":"light"} theme`,detail:"Appearance",icon:light?Moon:Sun,run:()=>{onToggleTheme();onClose();}};
    const term=query.trim().toLowerCase();
    const clientMatches=term?clients.filter(client=>`${client.full_name||""} ${client.email||""}`.toLowerCase().includes(term)).slice(0,5).map(client=>({kind:"client",label:client.full_name||client.email,detail:client.email,icon:Users,run:()=>{onOpenClient(client);onClose();}})):[];
    const clientById=new Map(clients.map(client=>[client.id,client]));
    const projectById=new Map(projects.map(project=>[project.id,project]));
    const contextFor=row=>{const projectId=row.project_id||row.brief_id||"";const project=projectById.get(projectId);const clientId=row.client_id||project?.client_id||[row.sender_id,row.recipient_id].find(id=>clientById.has(id));const client=clientById.get(clientId);return {projectId,clientId:clientId||"",projectName:project?.business_name||"Project",clientName:client?.full_name||client?.email||"Client"};};
    const openProject=(context,focus)=>()=>{if(!context.projectId)return;onOpenProject(context.projectId,context.clientId,focus);onClose();};
    const messageMatches=results.messages.map(message=>{const context=contextFor(message);const snippet=(message.content||"Message").replace(/\s+/g," ").trim().slice(0,92);return {kind:"message",label:snippet||"Message",detail:`${context.clientName} · ${context.projectName}`,icon:MessageCircle,run:()=>{if(context.clientId)onOpenMessages(context.clientId);else onNavigate("Messages");onClose();}};});
    const fileMatches=results.files.map(file=>{const context=contextFor(file);return {kind:"file",label:file.file_name||file.name||"Untitled file",detail:`${context.projectName} · ${context.clientName}`,icon:FileArchive,run:openProject(context,"assets")};});
    const contractMatches=results.contracts.map(contract=>{const context=contextFor(contract);return {kind:"contract",label:contract.title||"Untitled contract",detail:`${context.projectName} · ${title(contract.status||"pending")}`,icon:FileSignature,run:openProject(context,"contracts")};});
    const approvalMatches=results.approvals.map(approval=>{const context=contextFor(approval);return {kind:"approval",label:approval.title||"Untitled deliverable",detail:`${context.projectName} · ${title(approval.status||"pending")}`,icon:ShieldCheck,run:openProject(context,"approvals")};});
    const groups=[
      ["Clients",clientMatches],
      ["Messages",messageMatches],
      ["Files",fileMatches],
      ["Contracts",contractMatches],
      ["Approvals",approvalMatches],
    ].filter(([,items])=>items.length);
    return {navigation,theme,groups,flat:[...navigation,theme,...groups.flatMap(([,items])=>items)]};
  },[clients,light,onClose,onNavigate,onOpenClient,onOpenMessages,onOpenProject,onToggleTheme,projects,query,results]);
  useEffect(()=>{if(!open)return undefined;const onKeyDown=event=>{const items=actions.flat;if(event.key==="Escape"){event.preventDefault();onClose();return;}if(event.key==="ArrowDown"&&items.length){event.preventDefault();setActiveIndex(index=>(index+1)%items.length);}if(event.key==="ArrowUp"&&items.length){event.preventDefault();setActiveIndex(index=>(index-1+items.length)%items.length);}if(event.key==="Enter"&&items[activeIndex]){event.preventDefault();items[activeIndex].run();}};window.addEventListener("keydown",onKeyDown);return()=>window.removeEventListener("keydown",onKeyDown);},[actions,activeIndex,onClose,open]);
  useEffect(()=>{if(activeIndex>=actions.flat.length)setActiveIndex(0);},[activeIndex,actions.flat.length]);
  if(!open)return null;
  let index=-1;const item=(entry)=>{index+=1;const current=index;const Icon=entry.icon||Search;return <button type="button" key={`${entry.kind}-${entry.label}-${current}`} className={cx("d-cmd-item",activeIndex===current&&"is-active")} onMouseEnter={()=>setActiveIndex(current)} onClick={entry.run}><span className={entry.kind==="client"?"d-avatar is-square":"d-row-icon"}>{entry.kind==="client"?initials(entry.label):<Icon size={16}/>}</span><span className="d-row-main"><b>{entry.label}</b><small>{entry.detail}</small></span></button>;};
  const hasQuery=query.trim().length>0;
  return createPortal(<div className="d-modal-scrim d-cmd-scrim" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}><section className="d-modal d-cmd" role="dialog" aria-modal="true" aria-label="Search the workspace"><label className="d-cmd-search"><Search size={19}/><input ref={inputRef} autoFocus value={query} onChange={event=>{setQuery(event.target.value);setActiveIndex(0);}} placeholder="Search clients, messages, files…" aria-label="Search"/><button type="button" className="d-btn is-quiet is-sm" onClick={onClose}>Close</button></label><div className="d-cmd-list">{!hasQuery&&<><p className="d-cmd-label">Go to</p>{actions.navigation.map(item)}{item(actions.theme)}</>}{hasQuery&&query.trim().length<2?<p className="d-cmd-note">Type at least 2 characters.</p>:null}{searching?<p className="d-cmd-note">Searching…</p>:actions.groups.map(([label,items])=><div key={label}><p className="d-cmd-label">{label}</p>{items.map(item)}</div>)}{hasQuery&&!searching&&query.trim().length>=2&&!actions.groups.length?<p className="d-cmd-note">Nothing found for “{query.trim()}”.</p>:null}{loading?<p className="d-cmd-note">Loading clients…</p>:null}</div><footer className="d-cmd-foot"><span>↑ ↓ to move</span><span>Enter to open</span><span>Esc to close</span></footer></section></div>,document.querySelector(".d-app")||document.body);
}

function ProjectSwitcher({projects,activeProject,loading,onSelect,onStartNew}) {
  const [open,setOpen]=useState(false),desktop=useIsDesktop(),ref=useRef(null);
  useDismiss(open&&desktop,setOpen,ref);
  const blocker=awaitingProposal(projects);
  const display=activeProject?.business_name||activeProject?.industry||(loading?"Loading…":"No project yet");
  const pick=id=>{onSelect(id);setOpen(false);};
  const body=<div className="d-menu">
    <div className="d-menu-head"><span><b>Your projects</b><small>{projects.length?`${projects.length} project${projects.length===1?"":"s"}`:"Start with a short brief"}</small></span></div>
    {loading?<p className="d-switcher-note">Loading your projects…</p>:projects.map(project=><button type="button" key={project.id} className="d-menu-item" aria-current={project.id===activeProject?.id?"page":undefined} onClick={()=>pick(project.id)}>
      <span className="d-avatar is-square">{initials(project.business_name||project.industry||"Project")}</span>
      <span className="d-switcher-option"><span>{project.business_name||project.industry||"Untitled project"}</span><small>{stageLabel(project.status)}</small></span>
      {project.id===activeProject?.id&&<Check size={16}/>}
    </button>)}
    <div className="d-menu-sep"/>
    {blocker?<p className="d-switcher-note">You can start another project once we send the proposal for “{blocker.business_name||"your current project"}”.</p>:<button type="button" className="d-menu-item" onClick={()=>{onStartNew();setOpen(false);}}><Plus size={18}/>Start a new project</button>}
  </div>;
  return <div className="d-switcher" ref={ref}>
    <button type="button" className="d-switcher-button" aria-haspopup="menu" aria-expanded={open} onClick={()=>setOpen(value=>!value)} title={display}>
      <span className="d-switcher-icon"><FolderKanban size={17}/></span>
      <span className="d-switcher-text"><small>Project</small><b>{display}</b></span>
      <ChevronDown className="d-switcher-chevron" size={16}/>
    </button>
    {open&&desktop&&<div className="d-popover d-switcher-pop">{body}</div>}
    {!desktop&&<Sheet open={open} onClose={()=>setOpen(false)} label="Your projects">{body}</Sheet>}
  </div>;
}

const accountLabel=user=>{const meta=user?.user_metadata||{};const name=(meta.full_name||meta.name||"").trim()||String(user?.email||"").split("@")[0];return name||"Your account";};
const navLabels={"Action Center":"Today","Handoff & Docs":"Handoff","Project brief":"Brief",Assets:"Files"};
const navLabel=key=>navLabels[key]||key;
const readPreference=(key,fallback)=>{if(typeof window==="undefined")return fallback;try{const value=window.localStorage.getItem(key);return value===null?fallback:value==="1";}catch{return fallback;}};
const writePreference=(key,value)=>{try{window.localStorage.setItem(key,value?"1":"0");}catch{}};
function useIsDesktop(){
  const [desktop,setDesktop]=useState(false);
  useEffect(()=>{const query=window.matchMedia("(min-width: 900px)");const sync=()=>setDesktop(query.matches);sync();query.addEventListener("change",sync);return()=>query.removeEventListener("change",sync);},[]);
  return desktop;
}
function useDismiss(open,setOpen,ref){
  useEffect(()=>{
    if(!open)return undefined;
    const outside=event=>{if(ref.current&&!ref.current.contains(event.target))setOpen(false);};
    const escape=event=>{if(event.key==="Escape")setOpen(false);};
    document.addEventListener("pointerdown",outside);document.addEventListener("keydown",escape);
    return()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",escape);};
  },[open,setOpen,ref]);
}
function Sheet({open,onClose,label,children}){
  useEffect(()=>{if(!open)return undefined;const escape=event=>{if(event.key==="Escape")onClose();};document.addEventListener("keydown",escape);const previous=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.removeEventListener("keydown",escape);document.body.style.overflow=previous;};},[open,onClose]);
  return <AnimatePresence>{open&&<>
    <motion.div className="d-scrim" onClick={onClose} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.18}}/>
    <motion.div className="d-sheet" role="dialog" aria-modal="true" aria-label={label} initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}} transition={{type:"tween",duration:.24,ease:[.2,.8,.2,1]}}>
      <div className="d-sheet-grip" aria-hidden="true"/>{children}
    </motion.div>
  </>}</AnimatePresence>;
}

function Shell({mode,section,setSection,onNotificationNavigate,onSignOut,projectSwitcher,navItems,context,children}) {
  const admin=mode==="admin",nav=admin?adminNav:(navItems||clientNav),desktop=useIsDesktop();
  const [collapsed,setCollapsed]=useState(false),[light,setLight]=useState(false),[account,setAccount]=useState(false),[bell,setBell]=useState(false),[more,setMore]=useState(false),[notes,setNotes]=useState([]),[notificationUser,setNotificationUser]=useState(null),[notificationClock,setNotificationClock]=useState(Date.now()),[unreadMessages,setUnreadMessages]=useState(0),[commandOpen,setCommandOpen]=useState(false);
  const accountRef=useRef(null),bellRef=useRef(null),[scrolled,setScrolled]=useState(false),[help,setHelp]=useState(false);
  useEffect(()=>{const onScroll=()=>setScrolled(window.scrollY>4);onScroll();window.addEventListener("scroll",onScroll,{passive:true});return()=>window.removeEventListener("scroll",onScroll);},[]);
  useDismiss(account&&desktop,setAccount,accountRef);useDismiss(bell&&desktop,setBell,bellRef);
  useEffect(()=>{setCollapsed(readPreference("milink-dash-collapsed",false));setLight(readPreference("milink-dash-light",false));},[]);
  const toggleCollapsed=useCallback(()=>setCollapsed(value=>{writePreference("milink-dash-collapsed",!value);return !value;}),[]);
  const toggleTheme=useCallback(()=>setLight(value=>{writePreference("milink-dash-light",!value);return !value;}),[]);
  useEffect(()=>{document.documentElement.classList.toggle("mi-portal-light",light);return()=>document.documentElement.classList.remove("mi-portal-light");},[light]);
  useEffect(()=>{const onKey=event=>{const target=event.target;if(target instanceof HTMLInputElement||target instanceof HTMLTextAreaElement||target instanceof HTMLSelectElement||target?.isContentEditable)return;if(admin&&(event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==="k"){event.preventDefault();setCommandOpen(value=>!value);}if(event.key==="["&&!event.metaKey&&!event.ctrlKey&&!event.altKey)toggleCollapsed();};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey);},[admin,toggleCollapsed]);
  useEffect(()=>{if(!bell)return undefined;setNotificationClock(Date.now());const timer=window.setInterval(()=>setNotificationClock(Date.now()),30000);return()=>window.clearInterval(timer);},[bell]);
  useEffect(()=>{const s=getSupabaseBrowserClient();if(!s)return;let active=true;let channel;const boot=async()=>{const {data:{user}}=await s.auth.getUser();if(!active||!user)return;setNotificationUser(user);const load=async()=>{const {data,error}=await s.from("notifications").select("*").eq("recipient_id",user.id).order("created_at",{ascending:false}).limit(60);if(!error&&active)setNotes(data||[]);else if(error)console.error("Could not load notifications",error);};const loadUnread=async()=>{const {count,error}=await s.from("messages").select("id",{count:"exact",head:true}).eq("recipient_id",user.id).eq("is_read",false);if(!error&&active)setUnreadMessages(count||0);};await Promise.all([load(),loadUnread()]);channel=s.channel(`notification-inbox-${user.id}`).on("postgres_changes",{event:"*",schema:"public",table:"notifications",filter:`recipient_id=eq.${user.id}`},load).on("postgres_changes",{event:"*",schema:"public",table:"messages",filter:`recipient_id=eq.${user.id}`},loadUnread).subscribe();};boot();return()=>{active=false;if(channel)s.removeChannel(channel)}},[]);
  const unread=notes.filter(note=>!note.is_read).length;
  const accountName=notificationUser?accountLabel(notificationUser):(admin?"Administrator":"Your account"),accountInitials=initials(accountName)||(admin?"AD":"YO"),accountRole=admin?"Administrator":"MIlink client";
  const markNotificationKindsSeen=useCallback(async kinds=>{const targets=notes.filter(note=>!note.is_read&&kinds.includes(notificationKind(note)));if(!targets.length)return;const ids=targets.map(note=>note.id),previous=notes;setNotes(current=>current.map(note=>ids.includes(note.id)?{...note,is_read:true}:note));const {error}=await getSupabaseBrowserClient().from("notifications").update({is_read:true}).in("id",ids);if(error){console.error("Could not mark contextual notifications read",error);setNotes(previous);}},[notes]);
  const markIncomingMessagesSeen=useCallback(async()=>{if(!notificationUser?.id)return;setUnreadMessages(0);const {error}=await getSupabaseBrowserClient().from("messages").update({is_read:true}).eq("recipient_id",notificationUser.id).eq("is_read",false);if(error)console.error("Could not mark incoming messages read",error);},[notificationUser?.id]);
  useEffect(()=>{const seenBySection={Messages:["message"],Assets:["file_request"],"Project brief":["brief"],Projects:admin?["brief","file_request"]:[],Clients:admin?["brief","file_request"]:[]};const kinds=seenBySection[section]||[];if(kinds.length)markNotificationKindsSeen(kinds);if(section==="Messages")markIncomingMessagesSeen();},[section,admin,markNotificationKindsSeen,markIncomingMessagesSeen]);
  useEffect(()=>{const handleContextSeen=event=>{const kinds=event.detail?.kinds;if(Array.isArray(kinds)&&kinds.length)markNotificationKindsSeen(kinds);};window.addEventListener("milink:notifications-seen",handleContextSeen);return()=>window.removeEventListener("milink:notifications-seen",handleContextSeen);},[markNotificationKindsSeen]);
  const markRead=async note=>{if(note.is_read)return;setNotes(current=>current.map(item=>item.id===note.id?{...item,is_read:true}:item));const {error}=await getSupabaseBrowserClient().from("notifications").update({is_read:true}).eq("id",note.id);if(error)console.error("Could not mark notification read",error);};
  const dismiss=async id=>{const previous=notes;setNotes(current=>current.filter(note=>note.id!==id));const {error}=await getSupabaseBrowserClient().from("notifications").delete().eq("id",id);if(error){console.error("Could not dismiss notification",error);setNotes(previous);}};
  const markAll=async()=>{if(!notificationUser)return;setNotes(current=>current.map(note=>({...note,is_read:true})));const {error}=await getSupabaseBrowserClient().from("notifications").update({is_read:true}).eq("recipient_id",notificationUser.id).eq("is_read",false);if(error)console.error("Could not mark notifications read",error);};
  const clearAll=async()=>{if(!notificationUser)return;const previous=notes;setNotes([]);const {error}=await getSupabaseBrowserClient().from("notifications").delete().eq("recipient_id",notificationUser.id);if(error){console.error("Could not clear notifications",error);setNotes(previous);}};
  const go=next=>{setSection(next);setMore(false);setAccount(false);if(typeof window!=="undefined")window.scrollTo({top:0});};
  const navigateNotification=async note=>{await markRead(note);const target=resolveNotificationNavigation(note,{admin});if(admin&&target.kind==="message"&&target.clientId&&typeof window!=="undefined")window.sessionStorage.setItem("milink-message-client",target.clientId);if(onNotificationNavigate)onNotificationNavigate(target);else setSection(target.section);setBell(false);setMore(false);};
  const badgeFor=key=>key==="Messages"&&unreadMessages>0?Math.min(unreadMessages,99):0;
  const tabItems=nav.length<=5?nav:nav.slice(0,4);
  const notifications=<NotificationPopover notes={notes} unread={unread} now={notificationClock} onNavigate={navigateNotification} onDismiss={dismiss} onMarkAll={markAll} onClearAll={clearAll}/>;
  const accountMenu=<div className="d-menu" role="menu">
    <div className="d-menu-head"><span className="d-avatar">{accountInitials}</span><span><b>{accountName}</b><small>{notificationUser?.email||accountRole}</small></span></div>
    {!admin&&<button type="button" role="menuitem" className="d-menu-item" onClick={()=>go("Profile")}><UserRound size={18}/>Profile and settings</button>}
    <button type="button" role="menuitem" className="d-menu-item" onClick={toggleTheme}>{light?<Moon size={18}/>:<Sun size={18}/>}{light?"Dark theme":"Light theme"}</button>
    {!admin&&<button type="button" role="menuitem" className="d-menu-item" onClick={()=>{setAccount(false);setHelp(true);}}><HelpCircle size={18}/>How this works</button>}
    <a role="menuitem" className="d-menu-item" href="mailto:info@milink.ca?subject=MIlink%20workspace%20support"><MessageCircle size={18}/>Email support</a>
    <div className="d-menu-sep"/>
    <button type="button" role="menuitem" className="d-menu-item is-danger" onClick={onSignOut}><LogOut size={18}/>Sign out</button>
  </div>;
  return <main className="d-app" data-theme={light?"light":"dark"}>
    <div className={cx("d-shell",collapsed&&"is-collapsed")}>
      <aside className="d-sidebar" aria-label="Main navigation">
        <div className="d-sidebar-head">
          <a href="/" className="d-logo" aria-label="MIlink home">M</a>
          <strong>{admin?"MIlink Studio":"MIlink"}</strong>
          <button type="button" className="d-collapse" onClick={toggleCollapsed} aria-label={collapsed?"Expand sidebar":"Collapse sidebar"} title={`${collapsed?"Expand":"Collapse"} sidebar ( [ )`}><ChevronLeft size={15}/></button>
        </div>
        {!admin&&projectSwitcher}
        <nav className="d-nav">
          {!collapsed&&<p className="d-nav-label">{admin?"Workspace":"Your project"}</p>}
          {nav.map(([key,Icon])=><button type="button" key={key} className="d-nav-item" aria-current={section===key?"page":undefined} title={collapsed?navLabel(key):undefined} onClick={()=>go(key)}><Icon size={19}/><span>{navLabel(key)}</span>{badgeFor(key)>0&&<em className="d-nav-badge" aria-label={`${badgeFor(key)} unread`}>{badgeFor(key)}</em>}</button>)}
        </nav>
        {!admin&&navItems&&navItems.length<clientNav.length&&<p className="d-nav-hint">More sections appear as your project moves forward.</p>}
        <div className="d-sidebar-foot">
          <div className="d-account" ref={accountRef}>
            <button type="button" className="d-account-button" aria-haspopup="menu" aria-expanded={account} onClick={()=>setAccount(value=>!value)} title={collapsed?accountName:undefined}><span className="d-avatar">{accountInitials}</span><span><b>{accountName}</b><small>{accountRole}</small></span></button>
            {account&&desktop&&<div className="d-popover">{accountMenu}</div>}
          </div>
        </div>
      </aside>
      <div className="d-main">
        <header className={cx("d-topbar",scrolled&&"is-scrolled")}>
          <div className="d-topbar-brand">
            {!desktop&&(!admin&&projectSwitcher?<div className="d-topbar-project">{projectSwitcher}</div>:<span className="d-wordmark"><span className="d-logo is-xs" aria-hidden="true">M</span>MIlink Studio</span>)}
            <div className="d-crumbs">{desktop&&<><span className="d-crumb-root">{admin?"MIlink Studio":context||"Your project"}</span><ChevronRight size={15} aria-hidden="true"/></>}<h1 className={desktop?undefined:"d-visually-hidden"}>{navLabel(section)}</h1></div>
          </div>
          <div className="d-topbar-actions">
            {admin&&<button type="button" className="d-icon-button" aria-label="Search clients and projects" title="Search (⌘K)" onClick={()=>setCommandOpen(true)}><Search size={19}/></button>}
            {desktop&&<button type="button" className="d-icon-button" aria-label={light?"Use dark theme":"Use light theme"} onClick={toggleTheme}>{light?<Moon size={19}/>:<Sun size={19}/>}</button>}
            <div ref={bellRef} style={{position:"relative"}}>
              <button type="button" className="d-icon-button" aria-label={unread?`Notifications, ${unread} unread`:"Notifications"} aria-expanded={bell} onClick={()=>setBell(value=>!value)}><Bell size={19}/>{unread>0&&<i className="d-count">{unread>99?"99+":unread}</i>}</button>
              {bell&&desktop&&<div className="d-popover">{notifications}</div>}
            </div>
            {!desktop&&<button type="button" className="d-icon-button" aria-label="Account" onClick={()=>setAccount(true)}><span className="d-avatar is-sm">{accountInitials}</span></button>}
          </div>
        </header>
        <div className="d-content">{children}</div>
      </div>
      <nav className="d-tabbar" aria-label="Sections">
        {tabItems.map(([key,Icon])=><button type="button" key={key} className="d-tab" aria-current={section===key?"page":undefined} onClick={()=>go(key)}><Icon size={21}/><span>{navLabel(key)}</span>{badgeFor(key)>0&&<i className="d-dot" aria-label="Unread"/>}</button>)}
        {nav.length>5&&<button type="button" className="d-tab" aria-current={nav.slice(4).some(([key])=>key===section)?"page":undefined} onClick={()=>setMore(true)}><Menu size={21}/><span>More</span></button>}
      </nav>
    </div>
    {!desktop&&<Sheet open={more} onClose={()=>setMore(false)} label="More sections">
      <div className="d-menu">{nav.slice(4).map(([key,Icon])=><button type="button" key={key} className="d-menu-item" aria-current={section===key?"page":undefined} onClick={()=>go(key)}><Icon size={19}/>{navLabel(key)}</button>)}</div>
    </Sheet>}
    {!desktop&&<Sheet open={account} onClose={()=>setAccount(false)} label="Account">{accountMenu}</Sheet>}
    {!desktop&&<Sheet open={bell} onClose={()=>setBell(false)} label="Notifications">{notifications}</Sheet>}
    {help&&<HelpDialog onClose={()=>setHelp(false)} go={next=>{setHelp(false);go(next);}}/>}
    {admin&&<AdminCommandPalette open={commandOpen} onClose={()=>setCommandOpen(false)} onNavigate={next=>go(next)} onOpenClient={client=>{go("Projects");window.setTimeout(()=>window.dispatchEvent(new CustomEvent("milink:open-client",{detail:{clientId:client.id}})),0);}} onOpenProject={(projectId,clientId,focus)=>{if(typeof window!=="undefined")window.sessionStorage.setItem("milink-admin-project-focus",JSON.stringify({projectId,focus}));go("Projects");window.setTimeout(()=>window.dispatchEvent(new CustomEvent("milink:open-project",{detail:{projectId,clientId,focus}})),0);}} onOpenMessages={clientId=>{if(typeof window!=="undefined")window.sessionStorage.setItem("milink-message-client",clientId);go("Messages");window.setTimeout(()=>window.dispatchEvent(new CustomEvent("milink:open-message-client",{detail:{clientId}})),0);}} light={light} onToggleTheme={toggleTheme}/>}
  </main>;
}

const helpTopics=[
  ["How do I send files?","Open Files and choose them, or drop them in. If we asked for something specific, it is at the top of Files with its own button.","Assets"],
  ["How do I approve a design?","When we share something, it appears under “Waiting for you”. Open it, then press Approve or Ask for changes and write what you would like different.","Approvals"],
  ["How do I pay?","Open Payment. Pay by card through Stripe, or send an Interac e-Transfer to the address shown and press “I have sent it”. You can download a receipt once it is confirmed.","Payments"],
  ["Can I change my brief?","Yes. Open Brief, change anything and it saves as you type. We see the changes.","Project brief"],
  ["How do I reach the team?","Send a message in Messages. Files can be attached there too. We also email you when we reply.","Messages"],
  ["Where are my logins after launch?","In Handoff, together with a training video and notes on looking after your site.","Handoff & Docs"],
];
function HelpDialog({onClose,go}){
  const [open,setOpen]=useState(0);
  return <AdminModal label="How this works" heading="How this works" onClose={onClose}>
    <div className="d-modal-body d-help">{helpTopics.map(([question,answer,to],index)=><div key={question} className={cx("d-help-item",open===index&&"is-open")}><button type="button" aria-expanded={open===index} onClick={()=>setOpen(open===index?-1:index)}><span>{question}</span><ChevronDown size={17}/></button>{open===index&&<div className="d-help-answer"><p>{answer}</p><button type="button" className="d-btn is-sm" onClick={()=>go(to)}>Open {navLabel(to)}</button></div>}</div>)}</div>
    <footer className="d-modal-foot"><a className="d-btn" href="mailto:info@milink.ca?subject=MIlink%20workspace%20support">Email support</a><button type="button" className="d-btn is-primary" onClick={onClose}>Done</button></footer>
  </AdminModal>;
}
function NotificationPopover({notes,unread,now,onNavigate,onDismiss,onMarkAll,onClearAll}) {
  const [filter,setFilter]=useState("all");
  const shown=filter==="action"?notes.filter(note=>actionKinds.includes(notificationKind(note))):filter==="unread"?notes.filter(note=>!note.is_read):notes;
  const groups=["Today","Yesterday","Earlier"].map(label=>[label,shown.filter(note=>noteDay(note.created_at,now)===label)]).filter(([,items])=>items.length);
  return <div className="d-notes" role="region" aria-label="Notifications">
    <div className="d-notes-head"><div><b>Notifications</b>{unread>0&&<small>{unread} unread</small>}</div><button type="button" className="d-btn is-quiet is-sm" onClick={onMarkAll} disabled={!unread}>Mark all read</button></div>
    <div className="d-notes-filter"><div className="d-segment" role="tablist" aria-label="Show">{[["all","All"],["unread","Unread"],["action","Needs you"]].map(([value,label])=><button type="button" role="tab" key={value} aria-selected={filter===value} onClick={()=>setFilter(value)}>{label}</button>)}</div></div>
    <div className="d-notes-list">{groups.length?groups.map(([label,items])=><div key={label}><p className="d-notes-day">{label}</p>{items.map(note=>{const [Icon,tone]=noteStyle[notificationKind(note)]||noteStyle.status_update;return <div className={cx("d-note",!note.is_read&&"is-unread")} key={note.id} role="button" tabIndex={0} onClick={()=>onNavigate(note)} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();onNavigate(note);}}}>
      <span className={cx("d-row-icon",tone)} aria-hidden="true"><Icon size={16}/></span><div><b>{notificationLabel(note.title)}</b><p>{note.message||"Open for details."}</p><time>{relativeTime(note.created_at,now)}</time></div>
      <button type="button" className="d-icon-button" aria-label={`Dismiss ${notificationLabel(note.title)}`} onClick={event=>{event.stopPropagation();onDismiss(note.id);}}><X size={15}/></button>
    </div>;})}</div>):<div className="d-empty"><Bell size={22}/><b>{filter==="all"?"You are all caught up":"Nothing here"}</b><p>{filter==="all"?"New updates about your project appear here.":"Try another filter."}</p></div>}</div>
    {notes.length>0&&<div className="d-notes-foot"><button type="button" className="d-btn is-quiet is-sm" onClick={onClearAll}>Clear all</button></div>}
  </div>;
}
function notificationLabel(value="") { return value.trim().toLowerCase()==="new project message" ? "New message" : value; }

function WaitingStrip({brief,go,todos}){
  const rows=[...todos.contracts.map(item=>({key:`c-${item.id}`,icon:FileSignature,title:item.title,detail:"Ready for your signature",action:"Sign",to:"Contracts"})),...(paymentDue(brief)?[{key:"pay",icon:CircleDollarSign,title:`Payment of ${formatCad(brief.proposal_amount_cents)}`,detail:"Pay by card or Interac e-Transfer",action:"Pay",to:"Payments"}]:[]),...todos.approvals.map(item=>({key:`a-${item.id}`,icon:ShieldCheck,title:item.title,detail:"Waiting for your approval",action:"Review",to:"Approvals"})),...todos.files.map(item=>({key:`f-${item.id}`,icon:Upload,title:item.title,detail:"MIlink asked for this file",action:"Upload",to:"Assets"}))];
  if(!rows.length)return null;
  return <section className="d-panel d-waiting" aria-label="Waiting for you">
    <div className="d-panel-head"><div><h3>Waiting for you</h3><p>{rows.length===1?"One thing needs your input to keep the project moving.":`${rows.length} things need your input to keep the project moving.`}</p></div></div>
    <ul className="d-list">{rows.map(({key,icon:Icon,title:itemTitle,detail,action,to})=><li key={key}><button type="button" className="d-row" onClick={()=>go?.(to)}><span className="d-row-icon is-wait"><Icon size={18}/></span><span className="d-row-main"><b>{itemTitle}</b><small>{detail}</small></span><span className="d-btn is-sm">{action}</span></button></li>)}</ul>
  </section>;
}

const nextSteps={draft:["Finish your project brief","Four short steps. We start as soon as you send it.","Continue the brief","Project brief"],submitted:["We are reviewing your brief","Nothing is needed from you right now. You can add your logo and photos while you wait.","Add files","Assets"],reviewing:["We are reviewing your brief","Nothing is needed from you right now. You can add your logo and photos while you wait.","Add files","Assets"],proposal_sent:["Your proposal is ready","Read the scope and price, then sign the agreement to start.","Review the proposal","Contracts"],in_progress:["We are building your website","Updates appear below as we go. Questions are always welcome.","Message the team","Messages"],client_review:["Your website is ready for review","Check it, then approve it or tell us what to change.","Review now","Approvals"],completed:["Your website is live","Your logins and training notes are in Handoff.","Open handoff","Handoff & Docs"]};
function ClientHome({brief,onBriefChange,open,message,go}){
  const status=brief?.status||"draft";
  const todos=useProjectTodos(brief&&status!=="draft"?brief:null);
  if(!brief||status==="draft") return <div className="d-page">
    <section className="d-hero">
      <p className="d-hero-kicker">{brief?.business_name||"Welcome to MIlink"}</p>
      <h2 className="d-hero-title">{brief?"Finish your project brief":"Tell us about your website"}</h2>
      <p className="d-hero-copy">Four short steps, about three minutes. Your answers save as you go.</p>
      <div className="d-btn-row"><button type="button" className="d-btn is-primary" onClick={open}>{brief?"Continue the brief":"Start the brief"}</button><button type="button" className="d-btn" onClick={message}><MessageCircle size={17}/>Ask a question first</button></div>
    </section>
    <section className="d-panel">
      <div className="d-panel-head"><div><h3>How it works</h3><p>From brief to launch, everything happens in this workspace.</p></div></div>
      <ol className="d-steps">
        <li><b>Send your brief</b><span>Your business, goals, pages and style.</span></li>
        <li><b>Get a proposal</b><span>A clear scope, price and timeline to approve.</span></li>
        <li><b>Review the build</b><span>Approve designs and pages as we go.</span></li>
        <li><b>Launch</b><span>Your site goes live with logins and a short training.</span></li>
      </ol>
    </section>
  </div>;
  const next=todos.loaded?nextStepFor(brief,todos):(nextSteps[status]||nextSteps.in_progress);
  return <div className="d-page">
    <section className="d-hero">
      <div className="d-hero-top"><span className="d-pill is-brand">{stageLabel(status)}</span></div>
      <h2 className="d-hero-title">{next[0]}</h2>
      <p className="d-hero-copy">{next[1]}</p>
      <div className="d-btn-row"><button type="button" className="d-btn is-primary" onClick={()=>go?.(next[3])}>{next[2]}</button>{next[3]!=="Messages"&&<button type="button" className="d-btn" onClick={message}><MessageCircle size={17}/>Message the team</button>}</div>
      <ProjectRoute status={status}/>
    </section>
    <WaitingStrip brief={brief} go={go} todos={todos}/>
    <div className="d-split">
      <LiveProgressTimeline brief={brief} onChange={onBriefChange}/>
      <div className="d-stack">
        <LatestMessage go={go}/>
        <OnboardingReadiness brief={brief} onChange={onBriefChange}/>
      </div>
    </div>
    <p className="d-footnote"><ShieldCheck size={15}/>Only you and the MIlink team can see this project. Need help? <a href="mailto:info@milink.ca?subject=MIlink%20workspace%20support">info@milink.ca</a></p>
  </div>;
}
function OnboardingReadiness({brief,onChange,admin=false}){
  const [items,setItems]=useState(()=>normaliseOnboardingChecklist(brief?.onboarding_checklist));
  const [savingId,setSavingId]=useState("");
  const [notice,setNotice]=useState("");
  const [draft,setDraft]=useState("");
  useEffect(()=>setItems(normaliseOnboardingChecklist(brief?.onboarding_checklist)),[brief?.id,brief?.onboarding_checklist]);
  const readyCount=items.filter(item=>item.status==="ready").length;
  const save=async(next,busyId)=>{
    if(!brief?.id||savingId)return;
    const previous=items;
    setItems(next);setSavingId(busyId);setNotice("");onChange?.({...brief,onboarding_checklist:next});
    const {data,error}=await getSupabaseBrowserClient().from("project_briefs").update({onboarding_checklist:next}).eq("id",brief.id).select().single();
    setSavingId("");
    if(error){setItems(previous);onChange?.({...brief,onboarding_checklist:previous});setNotice(`Could not save the checklist: ${error.message}`);return;}
    onChange?.(data);
  };
  const toggle=id=>save(items.map(item=>item.id===id?{...item,status:item.status==="ready"?"pending":"ready"}:item),id);
  const addItem=()=>{const label=draft.trim();if(!label||items.length>=12)return;const id=`custom_${Date.now().toString(36)}`;setDraft("");save([...items,{id,label:label.slice(0,80),status:"pending",custom:true}],id);};
  const removeItem=id=>save(items.filter(item=>item.id!==id),id);
  return <section className={cx("d-panel","d-checklist",admin&&"is-admin")} aria-label="Getting ready checklist">
    <div className="d-panel-head"><div><h3>{admin?"What the client still owes":"Getting ready"}</h3><p>{readyCount===items.length?"Everything is ready.":`${readyCount} of ${items.length} ready. ${admin?"Tick items as they arrive.":"Tick each one when you have sent it."}`}</p></div></div>
    <div className="d-meter" aria-hidden="true"><i style={{width:`${Math.round((readyCount/items.length)*100)}%`}}/></div>
    <ul className="d-list">{items.map(item=>{const ready=item.status==="ready";return <li key={item.id} className="d-check-row">
      <button type="button" className={cx("d-check",ready&&"is-ready")} onClick={()=>toggle(item.id)} disabled={Boolean(savingId)} aria-pressed={ready}><span className="d-check-box">{ready&&<Check size={14}/>}</span><span className="d-check-label">{item.label}</span>{savingId===item.id&&<small>Saving…</small>}</button>
      {admin&&item.custom&&<button type="button" className="d-icon-button" aria-label={`Remove ${item.label}`} disabled={Boolean(savingId)} onClick={()=>removeItem(item.id)}><X size={15}/></button>}
    </li>;})}</ul>
    {admin&&items.length<12&&<div className="d-inline-form"><input className="d-input" value={draft} maxLength={80} onChange={event=>setDraft(event.target.value)} onKeyDown={event=>event.key==="Enter"&&addItem()} placeholder="Ask for something else, e.g. social media links" aria-label="New checklist item"/><button type="button" className="d-btn" disabled={!draft.trim()||Boolean(savingId)} onClick={addItem}><Plus size={16}/>Add</button></div>}
    {notice&&<p className="d-form-error">{notice}</p>}
  </section>;
}

function LiveProgressTimeline({brief,onChange,admin=false}){
  const [updates,setUpdates]=useState(()=>normaliseTimelineUpdates(brief?.timeline_updates));
  const [message,setMessage]=useState("");
  const [category,setCategory]=useState("Development");
  const [busy,setBusy]=useState("");
  const [notice,setNotice]=useState("");
  useEffect(()=>setUpdates(normaliseTimelineUpdates(brief?.timeline_updates)),[brief?.id,brief?.timeline_updates]);
  const persist=async(next,action)=>{
    const previous=updates;setUpdates(next);setBusy(action);setNotice("");onChange?.({...brief,timeline_updates:next});
    const {data,error}=await getSupabaseBrowserClient().from("project_briefs").update({timeline_updates:next}).eq("id",brief.id).select().single();
    setBusy("");
    if(error){setUpdates(previous);onChange?.({...brief,timeline_updates:previous});setNotice(`Could not save the update: ${error.message}`);return false;}
    onChange?.(data);return true;
  };
  const post=async()=>{const trimmed=message.trim();if(!trimmed||busy||!brief?.id)return;const entry={id:typeof crypto!=="undefined"&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}`,message:trimmed,category,created_at:new Date().toISOString()};const next=[entry,...updates];const saved=await persist(next,"post");if(saved)setMessage("");};
  const remove=id=>{if(busy||!brief?.id)return;persist(updates.filter(update=>update.id!==id),`remove-${id}`);};
  return <section className="d-panel d-updates" aria-label="Project updates">
    <div className="d-panel-head"><div><h3>{admin?"Project updates":"Latest updates"}</h3><p>{admin?"Short notes the client sees on their overview right away.":"What the MIlink team has been working on."}</p></div></div>
    {admin&&<div className="d-panel-body"><div className="d-update-form"><input className="d-input" value={message} onChange={event=>setMessage(event.target.value)} onKeyDown={event=>{if(event.key==="Enter"&&!event.shiftKey){event.preventDefault();post();}}} placeholder="What did the team finish?" aria-label="Update text"/><select className="d-input" value={category} onChange={event=>setCategory(event.target.value)} aria-label="Update type">{timelineCategories.map(value=><option key={value}>{value}</option>)}</select><button type="button" className="d-btn is-primary" onClick={post} disabled={!message.trim()||busy==="post"}>{busy==="post"?"Posting…":"Post update"}</button></div></div>}
    {updates.length?<ol className="d-timeline">{updates.map(update=><li key={update.id}><span className="d-timeline-dot" aria-hidden="true"/><div><p className="d-timeline-meta"><span className={`d-tag is-${update.category.toLowerCase()}`}>{update.category}</span><time>{timelineTimestamp(update.created_at)}</time></p><p className="d-timeline-text">{update.message}</p></div>{admin&&<button type="button" className="d-icon-button" aria-label="Remove update" onClick={()=>remove(update.id)} disabled={Boolean(busy)}><X size={15}/></button>}</li>)}</ol>:<div className="d-empty"><Sparkles size={22}/><b>No updates yet</b><p>{admin?"Post the first update when work starts.":"Updates appear here as soon as work starts."}</p></div>}
    {notice&&<p className="d-form-error">{notice}</p>}
  </section>;
}
function AdminActivityLog({brief}) {
  const [entries,setEntries]=useState([]),[loading,setLoading]=useState(true),[notice,setNotice]=useState("");
  const load=useCallback(async()=>{
    if(!brief?.id){setEntries([]);setLoading(false);return;}
    const supabase=getSupabaseBrowserClient();
    if(!supabase){setLoading(false);return;}
    const {data,error}=await supabase.from("activity_log").select("id,actor_role,action,description,created_at").eq("project_id",brief.id).order("created_at",{ascending:false}).limit(60);
    if(error){console.error("Could not load activity",error);setEntries([]);setNotice(error.code==="42P01"||/activity_log/i.test(error.message||"")?"The activity log is not set up in the database yet.":"Could not load the activity right now.");}
    else {setEntries(data||[]);setNotice("");}
    setLoading(false);
  },[brief?.id]);
  useEffect(()=>{load();if(!brief?.id)return undefined;const supabase=getSupabaseBrowserClient();if(!supabase)return undefined;const channel=supabase.channel(`admin-activity-${brief.id}`).on("postgres_changes",{event:"*",schema:"public",table:"activity_log",filter:`project_id=eq.${brief.id}`},load).subscribe();return()=>supabase.removeChannel(channel);},[brief?.id,load]);
  const iconFor=action=>action?.startsWith("payment")||action==="e_transfer_submitted"?CircleDollarSign:action?.startsWith("approval")?ShieldCheck:action?.startsWith("contract")?FileSignature:action?.startsWith("file_request")?Upload:action?.includes("brief")?FileText:RefreshCw;
  return <section className="d-panel" aria-label="Activity">
    <div className="d-panel-head"><div><h3>Activity</h3><p>Decisions, payments and stage changes, newest first.</p></div></div>
    {loading?<Loading label="Loading…" compact/>:notice?<div className="d-panel-body"><div className="d-notice is-wait">{notice}</div></div>:!entries.length?<div className="d-empty"><Sparkles size={22}/><b>Nothing recorded yet</b><p>Signatures, approvals and payments are recorded here.</p></div>:<ul className="d-list">{entries.map(entry=>{const Icon=iconFor(entry.action);return <li key={entry.id} className="d-row"><span className="d-row-icon"><Icon size={16}/></span><span className="d-row-main"><b>{entry.description}</b><small>{entry.actor_role==="admin"||entry.actor_role==="super_admin"?"MIlink":entry.actor_role==="client"?"Client":"System"} · {timelineTimestamp(entry.created_at)}</small></span></li>;})}</ul>}
  </section>;
}
function ProjectHandoffHub({brief,onMessage}){
  const specs=normaliseHandoffSpecs(brief?.handoff_specs);
  const isReleased=["client_review","completed"].includes(brief?.status);
  const hasSpecs=Object.values(specs).some(Boolean);
  if(!brief)return <Empty icon={FileArchive} title="Nothing here yet" copy="Your logins, training and launch notes appear here near launch."/>;
  if(!isReleased||!hasSpecs)return <Empty icon={FileArchive} title="Your launch details are being prepared" copy="Logins, a short training video and notes on looking after your site appear here before launch." action={<button type="button" className="d-btn" onClick={onMessage}><MessageCircle size={17}/>Ask the team</button>}/>;
  const items=[specs.admin_login_url&&{icon:LockKeyhole,title:"Edit your website",text:"Sign in to change text, photos and pages.",href:handoffUrl(specs.admin_login_url),action:"Open sign-in page"},specs.training_video_url&&{icon:Eye,title:"Training video",text:"A short walkthrough of how to update your site.",href:handoffUrl(specs.training_video_url),action:"Watch"},specs.dns_provider&&{icon:Building2,title:"Domain and hosting",text:`Your domain is managed at ${specs.dns_provider}.`}].filter(Boolean);
  return <div className="d-page">
    <div className="d-page-head"><h2>Your website, handed over</h2><p>Everything you need to look after your site. Keep this page for later.</p></div>
    <section className="d-panel"><ul className="d-list">{items.map(item=>{const Icon=item.icon;return <li key={item.title} className="d-handoff-row"><span className="d-row-icon is-brand"><Icon size={18}/></span><span className="d-row-main"><b>{item.title}</b><small>{item.text}</small></span>{item.href&&<a className="d-btn is-sm" href={item.href} target="_blank" rel="noreferrer">{item.action}</a>}</li>;})}</ul></section>
    {specs.documentation_notes&&<section className="d-panel"><div className="d-panel-head"><div><h3>Notes from MIlink</h3></div></div><div className="d-panel-body"><p className="d-card-text" style={{whiteSpace:"pre-wrap"}}>{specs.documentation_notes}</p></div></section>}
    <section className="d-panel"><div className="d-panel-head"><div><h3>Need a change later?</h3><p>Updates, new pages or maintenance: just send a message.</p></div><button type="button" className="d-btn" onClick={onMessage}><MessageCircle size={17}/>Message us</button></div></section>
  </div>;
}
function AdminHandoffSpecs({brief,onChange}){
  const [specs,setSpecs]=useState(()=>normaliseHandoffSpecs(brief?.handoff_specs));
  const [saving,setSaving]=useState(false),[notice,setNotice]=useState(null),[dirty,setDirty]=useState(false);
  useEffect(()=>{setSpecs(normaliseHandoffSpecs(brief?.handoff_specs));setDirty(false);},[brief?.id,brief?.handoff_specs]);
  const update=(key,value)=>{setDirty(true);setSpecs(current=>({...current,[key]:value}));};
  const save=async()=>{if(!brief?.id||saving)return;setSaving(true);setNotice(null);const {data,error}=await getSupabaseBrowserClient().from("project_briefs").update({handoff_specs:specs}).eq("id",brief.id).select().single();setSaving(false);if(error){setNotice({tone:"stop",text:`Could not save: ${error.message}`});return;}setDirty(false);setNotice({tone:"go",text:"Saved. The client sees this in Handoff."});onChange?.(data);};
  const released=["client_review","completed"].includes(brief?.status);
  return <section className="d-panel" aria-label="Handoff">
    <div className="d-panel-head"><div><h3>Handoff</h3><p>{released?"The client can see these details now.":"The client sees these details from the “Ready for your review” stage."}</p></div></div>
    <div className="d-panel-body d-fields">
      <div className="d-fields d-fields-2"><label className="d-field"><span>Website sign-in page</span><input type="url" value={specs.admin_login_url} onChange={event=>update("admin_login_url",event.target.value)} placeholder="https://site.com/wp-admin"/></label><label className="d-field"><span>Domain and hosting company</span><input value={specs.dns_provider} onChange={event=>update("dns_provider",event.target.value)} placeholder="e.g. Cloudflare"/></label></div>
      <label className="d-field"><span>Training video link</span><input type="url" value={specs.training_video_url} onChange={event=>update("training_video_url",event.target.value)} placeholder="https://www.loom.com/share/…"/></label>
      <label className="d-field"><span>Notes for the client</span><textarea rows={5} value={specs.documentation_notes} onChange={event=>update("documentation_notes",event.target.value)} placeholder="How to edit pages, where photos go, backups, who to call."/></label>
      {notice&&<div className={cx("d-notice",`is-${notice.tone}`)} role="status">{notice.text}</div>}
    </div>
    <div className="d-panel-foot d-foot-actions"><span className="d-save-state">{dirty?"Unsaved changes":""}</span><button type="button" className="d-btn is-primary" disabled={saving||!dirty} onClick={save}>{saving?"Saving…":"Save handoff"}</button></div>
  </section>;
}

function ClientFileRequests({brief}) {
  const [requests,setRequests]=useState([]),[busy,setBusy]=useState(""),[notice,setNotice]=useState(null),[notes,setNotes]=useState({}),[files,setFiles]=useState({});
  const load=useCallback(async()=>{if(!brief?.id)return;const {data,error}=await getSupabaseBrowserClient().from("file_requests").select("*").eq("project_id",brief.id).eq("status","pending").order("created_at",{ascending:false});if(!error)setRequests(data||[]);},[brief?.id]);
  useEffect(()=>{load();const s=getSupabaseBrowserClient();if(!brief?.id||!s)return;const c=s.channel(`client-file-requests-${brief.id}`).on("postgres_changes",{event:"*",schema:"public",table:"file_requests",filter:`project_id=eq.${brief.id}`},load).subscribe();return()=>s.removeChannel(c)},[brief?.id,load]);
  const submit=async request=>{const file=files[request.id];const note=(notes[request.id]||"").trim();if(!file&&!note){setNotice({tone:"wait",text:"Attach the file, or write a short note if you do not have it yet."});return;}setBusy(request.id);setNotice(null);const s=getSupabaseBrowserClient();const {data:{user}}=await s.auth.getUser();if(!user){setBusy("");return;}let path=null;if(file){path=`${user.id}/requests/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"-")}`;const {error:uploadError}=await s.storage.from("portal-files").upload(path,file,{upsert:false});if(uploadError){setNotice({tone:"stop",text:uploadError.message});setBusy("");return;}}const {error}=await s.from("file_requests").update({status:"completed",uploaded_file_url:path,file_url:path,file_name:file?.name||null,file_size:file?.size||null,client_note:note||null,admin_decision:"pending",completed_at:new Date().toISOString()}).eq("id",request.id);setBusy("");if(error){setNotice({tone:"stop",text:error.message});return;}setNotice({tone:"go",text:"Sent. MIlink has been notified."});dispatchEmailEvent("file_response",request.id);load();};
  if(!brief||(!requests.length&&!notice))return null;
  return <section className="d-panel d-waiting" aria-label="Requested by MIlink">
    <div className="d-panel-head"><div><h3>MIlink asked for {requests.length===1?"a file":`${requests.length} files`}</h3><p>Send the file, or a note if you do not have it yet.</p></div></div>
    {requests.map(request=><div key={request.id} className="d-request">
      <div className="d-request-copy"><b>{request.title}</b>{request.description&&<p>{request.description}</p>}</div>
      <label className="d-file-pick"><Upload size={16}/><span>{files[request.id]?.name||"Choose a file"}</span><input type="file" onChange={event=>setFiles(current=>({...current,[request.id]:event.target.files?.[0]||null}))}/></label>
      <label className="d-field"><span className="d-visually-hidden">Note for MIlink</span><textarea rows={2} value={notes[request.id]||""} onChange={event=>setNotes(current=>({...current,[request.id]:event.target.value}))} placeholder="Add a note (optional)"/></label>
      <div className="d-btn-row"><button type="button" className="d-btn is-primary" disabled={busy===request.id||(!files[request.id]&&!(notes[request.id]||"").trim())} onClick={()=>submit(request)}>{busy===request.id?"Sending…":"Send to MIlink"}</button></div>
    </div>)}
    {notice&&<div className="d-panel-body"><div className={cx("d-notice",`is-${notice.tone}`)} role="status">{notice.text}</div></div>}
  </section>;
}

const approvalTypeLabel=value=>({figma:"Figma",staging:"Staging",document:"Document",link:"Link"}[value]||"Link");
const approvalDate=value=>value?new Date(value).toLocaleString(undefined,{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"}):"—";

function ApprovalBadge({status}) {
  const label={pending:"Waiting for you",approved:"Approved",changes_requested:"Changes requested"}[status]||title(status||"pending");
  return <span className={cx("d-pill",status==="approved"?"is-go":status==="changes_requested"?"is-stop":"is-wait")}>{label}</span>;
}

function ClientApprovals({brief}) {
  const [approvals,setApprovals]=useState([]),[loading,setLoading]=useState(true),[notice,setNotice]=useState(null),[userId,setUserId]=useState(""),[feedback,setFeedback]=useState({}),[openFeedback,setOpenFeedback]=useState(""),[busy,setBusy]=useState("");
  const load=useCallback(async()=>{
    if(!brief?.id){setApprovals([]);setLoading(false);return;}
    const supabase=getSupabaseBrowserClient();
    if(!supabase){setLoading(false);return;}
    const {data:{user},error:userError}=await supabase.auth.getUser();
    if(userError||!user){setNotice({tone:"stop",text:"Your session ended. Sign in again to see approvals."});setLoading(false);return;}
    setUserId(user.id);
    const {data,error}=await supabase.from("approvals").select("*").eq("project_id",brief.id).eq("client_id",user.id).order("created_at",{ascending:false});
    if(error){console.error("Could not load approvals",error);setNotice({tone:"stop",text:error.message});}
    else setApprovals([...(data||[])].sort((a,b)=>(a.status==="pending"?0:1)-(b.status==="pending"?0:1)));
    setLoading(false);
  },[brief?.id]);
  useEffect(()=>{load();if(!brief?.id)return undefined;const supabase=getSupabaseBrowserClient();if(!supabase)return undefined;const channel=supabase.channel(`client-approvals-${brief.id}`).on("postgres_changes",{event:"*",schema:"public",table:"approvals",filter:`project_id=eq.${brief.id}`},load).subscribe();return()=>supabase.removeChannel(channel);},[brief?.id,load]);
  const updateApproval=async(approval,updates,success)=>{
    if(!userId)return;
    setNotice(null);setBusy(approval.id);
    const {data,error}=await getSupabaseBrowserClient().from("approvals").update({...updates,decided_at:new Date().toISOString()}).eq("id",approval.id).eq("client_id",userId).select().single();
    setBusy("");
    if(error){setNotice({tone:"stop",text:error.message});return;}
    setApprovals(current=>current.map(item=>item.id===approval.id?data:item));
    dispatchEmailEvent("approval_decided",approval.id);
    setOpenFeedback("");
    setNotice({tone:"go",text:success});
  };
  const approve=approval=>{if(typeof window!=="undefined"&&!window.confirm(`Approve “${approval.title}”? MIlink will move on to the next step.`))return;updateApproval(approval,{status:"approved"},`Approved “${approval.title}”. MIlink has been notified.`);};
  const requestChanges=approval=>{const note=(feedback[approval.id]||"").trim();if(!note){setNotice({tone:"wait",text:"Write what you would like changed, then send."});return;}updateApproval(approval,{status:"changes_requested",client_feedback:note},"Your feedback was sent to MIlink.");};
  const pending=approvals.filter(item=>item.status==="pending").length;
  return <div className="d-page">
    <div className="d-page-head"><h2>Approvals</h2><p>{pending?`${pending} item${pending===1?"":"s"} waiting for your decision. Open each one, then approve it or ask for changes.`:"Designs and pages we share for your sign-off appear here."}</p></div>
    {notice&&<div className={cx("d-notice",`is-${notice.tone}`)} role="status">{notice.text}</div>}
    {loading?<Loading label="Loading approvals…" compact/>:!approvals.length?<Empty icon={ShieldCheck} title="Nothing to approve yet" copy="When MIlink shares a design or page for your sign-off, it appears here and you get an email."/>:<div className="d-cards">{approvals.map(approval=><article className={cx("d-panel","d-card",approval.status==="pending"&&"is-attention")} key={approval.id}>
      <div className="d-card-head"><div><h3>{approval.title}</h3><p>{approvalTypeLabel(approval.deliverable_type)} · shared {approvalDate(approval.created_at)}</p></div><ApprovalBadge status={approval.status}/></div>
      {approval.description&&<p className="d-card-text">{approval.description}</p>}
      {approval.deliverable_url&&<a className="d-btn is-block" href={approval.deliverable_url} target="_blank" rel="noreferrer"><Eye size={17}/>Open the {approvalTypeLabel(approval.deliverable_type).toLowerCase()==="link"?"preview":approvalTypeLabel(approval.deliverable_type)}</a>}
      {approval.status==="pending"&&openFeedback!==approval.id&&<div className="d-btn-row d-card-actions"><button type="button" className="d-btn is-primary" disabled={busy===approval.id} onClick={()=>approve(approval)}><CheckCircle2 size={17}/>Approve</button><button type="button" className="d-btn" onClick={()=>setOpenFeedback(approval.id)}>Ask for changes</button></div>}
      {approval.status==="pending"&&openFeedback===approval.id&&<div className="d-fields"><label className="d-field"><span>What should change?</span><textarea value={feedback[approval.id]||""} onChange={event=>setFeedback(current=>({...current,[approval.id]:event.target.value}))} placeholder="Be as specific as you can, for example the colour of the header or a sentence to reword." autoFocus/></label><div className="d-btn-row"><button type="button" className="d-btn is-primary" disabled={busy===approval.id} onClick={()=>requestChanges(approval)}>{busy===approval.id?"Sending…":"Send feedback"}</button><button type="button" className="d-btn" onClick={()=>setOpenFeedback("")}>Cancel</button></div></div>}
      {approval.status==="approved"&&<p className="d-outcome is-go"><CheckCircle2 size={16}/>Approved {approvalDate(approval.decided_at)}</p>}
      {approval.status==="changes_requested"&&<div className="d-quote"><b>Your feedback</b><p>{approval.client_feedback||"Changes requested."}</p></div>}
    </article>)}</div>}
  </div>;
}

function AdminApprovals({brief,client}) {
  const [approvals,setApprovals]=useState([]),[loading,setLoading]=useState(true),[notice,setNotice]=useState(null),[open,setOpen]=useState(false),[saving,setSaving]=useState(false),[draft,setDraft]=useState({title:"",description:"",deliverable_type:"link",deliverable_url:""});
  const load=useCallback(async()=>{
    if(!brief?.id){setApprovals([]);setLoading(false);return;}
    const {data,error}=await getSupabaseBrowserClient().from("approvals").select("*").eq("project_id",brief.id).eq("client_id",client.id).order("created_at",{ascending:false});
    if(error){console.error("Could not load approvals",error);setNotice({tone:"stop",text:error.message});}
    else setApprovals(data||[]);
    setLoading(false);
  },[brief?.id,client.id]);
  useEffect(()=>{load();if(!brief?.id)return undefined;const supabase=getSupabaseBrowserClient();const channel=supabase.channel(`admin-approvals-${brief.id}`).on("postgres_changes",{event:"*",schema:"public",table:"approvals",filter:`project_id=eq.${brief.id}`},load).subscribe();return()=>supabase.removeChannel(channel);},[brief?.id,load]);
  const create=async()=>{
    if(!draft.title.trim()){setNotice({tone:"wait",text:"Give it a name, for example “Homepage design”."});return;}
    setSaving(true);setNotice(null);
    const {data,error}=await getSupabaseBrowserClient().from("approvals").insert({project_id:brief.id,client_id:client.id,title:draft.title.trim(),description:draft.description.trim()||null,deliverable_type:draft.deliverable_type,deliverable_url:draft.deliverable_url.trim()||null}).select().single();
    setSaving(false);
    if(error){setNotice({tone:"stop",text:error.message});return;}
    setApprovals(current=>[data,...current]);
    dispatchEmailEvent("approval_requested",data.id);
    setDraft({title:"",description:"",deliverable_type:"link",deliverable_url:""});
    setOpen(false);
    setNotice({tone:"go",text:"Sent for approval. The client sees it on their overview."});
  };
  return <section className="d-panel" aria-label="Approvals">
    <div className="d-panel-head"><div><h3>Approvals</h3><p>Send a design, page or document for the client to approve.</p></div><button type="button" className="d-btn is-sm is-primary" onClick={()=>setOpen(true)}><Plus size={15}/>Send for approval</button></div>
    {notice&&<div className="d-panel-body"><div className={cx("d-notice",`is-${notice.tone}`)} role="status">{notice.text}</div></div>}
    {loading?<Loading label="Loading…" compact/>:approvals.length?<ul className="d-list">{approvals.map(approval=><li key={approval.id} className="d-request-row">
      <div className="d-request-top"><span className="d-row-main"><b>{approval.title}</b><small>{approvalTypeLabel(approval.deliverable_type)} · sent {approvalDate(approval.created_at)}</small></span><ApprovalBadge status={approval.status}/></div>
      {approval.deliverable_url&&<a className="d-link-inline" href={approval.deliverable_url} target="_blank" rel="noreferrer">Open what was sent</a>}
      {approval.status==="changes_requested"&&<div className="d-quote"><b>Client feedback</b><p>{approval.client_feedback||"Changes requested."}</p></div>}
    </li>)}</ul>:<div className="d-empty"><ShieldCheck size={22}/><b>Nothing sent yet</b><p>Send a design or page when it is ready for sign-off.</p></div>}
    {open&&<AdminModal label="Send for approval" heading="Send for approval" onClose={()=>!saving&&setOpen(false)}>
      <div className="d-modal-body"><div className="d-fields d-fields-2"><label className="d-field"><span>Name <em aria-hidden="true">*</em></span><input value={draft.title} onChange={event=>setDraft(current=>({...current,title:event.target.value}))} placeholder="e.g. Homepage design"/></label><label className="d-field"><span>Type</span><select value={draft.deliverable_type} onChange={event=>setDraft(current=>({...current,deliverable_type:event.target.value}))}>{["link","figma","staging","document"].map(value=><option key={value} value={value}>{approvalTypeLabel(value)}</option>)}</select></label></div><label className="d-field"><span>Link <i>optional</i></span><input value={draft.deliverable_url} onChange={event=>setDraft(current=>({...current,deliverable_url:event.target.value}))} placeholder="https://"/></label><label className="d-field"><span>Note for the client <i>optional</i></span><textarea rows={3} value={draft.description} onChange={event=>setDraft(current=>({...current,description:event.target.value}))} placeholder="What to look at and what feedback helps most."/></label></div>
      <footer className="d-modal-foot"><button type="button" className="d-btn" disabled={saving} onClick={()=>setOpen(false)}>Cancel</button><button type="button" className="d-btn is-primary" disabled={saving||!draft.title.trim()} onClick={create}>{saving?"Sending…":"Send"}</button></footer>
    </AdminModal>}
  </section>;
}

const contractDate=value=>value?new Date(value).toLocaleString(undefined,{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"}):"—";
const contractStatusLabel=status=>({pending:"Ready to sign",signed:"Signed",declined:"Declined"}[status]||title(status||"pending"));
function ContractBadge({status}){return <span className={cx("d-pill",status==="signed"?"is-go":status==="declined"?"is-stop":"is-wait")}>{contractStatusLabel(status)}</span>}

function ClientContracts({brief}) {
  const [contracts,setContracts]=useState([]),[loading,setLoading]=useState(true),[notice,setNotice]=useState(null),[signers,setSigners]=useState({}),[declines,setDeclines]=useState({}),[openDecline,setOpenDecline]=useState(""),[busy,setBusy]=useState("");
  const load=useCallback(async()=>{if(!brief?.id){setContracts([]);setLoading(false);return;}const supabase=getSupabaseBrowserClient();if(!supabase){setLoading(false);return;}const {data,error}=await supabase.from("contracts").select("*").eq("project_id",brief.id).order("created_at",{ascending:false});if(error){console.error("Could not load contracts",error);setNotice({tone:"stop",text:error.message});}else setContracts(data||[]);setLoading(false);},[brief?.id]);
  useEffect(()=>{load();if(!brief?.id)return undefined;const supabase=getSupabaseBrowserClient();if(!supabase)return undefined;const channel=supabase.channel(`client-contracts-${brief.id}`).on("postgres_changes",{event:"*",schema:"public",table:"contracts",filter:`project_id=eq.${brief.id}`},load).subscribe();return()=>supabase.removeChannel(channel);},[brief?.id,load]);
  const decide=async(contract,status)=>{const signer=(signers[contract.id]||"").trim(),reason=(declines[contract.id]||"").trim();if(status==="signed"&&signer.length<3){setNotice({tone:"wait",text:"Type your full name to sign."});return;}if(status==="declined"&&!reason){setNotice({tone:"wait",text:"Tell us briefly what you would like changed."});return;}setBusy(contract.id);setNotice(null);const payload=status==="signed"?{status,signer_name:signer,signer_signature:signer}:{status,decline_reason:reason};const {data,error}=await getSupabaseBrowserClient().from("contracts").update(payload).eq("id",contract.id).eq("project_id",brief.id).select().single();setBusy("");if(error){setNotice({tone:"stop",text:error.message});return;}setContracts(current=>current.map(item=>item.id===contract.id?data:item));dispatchEmailEvent("contract_decided",contract.id);setOpenDecline("");setNotice({tone:"go",text:status==="signed"?"Signed. MIlink has been notified and will start work.":"Your note was sent to MIlink. We will follow up with an updated agreement."});};
  const proposalAmount=Number(brief?.proposal_amount_cents||0);
  return <div className="d-page">
    <div className="d-page-head"><h2>Proposal and agreement</h2><p>Read the scope and price, then sign with your typed name. Ask in Messages if anything is unclear.</p></div>
    {brief?.proposal_summary||proposalAmount>0?<section className="d-panel d-proposal"><div className="d-proposal-figures">{proposalAmount>0&&<div><small>Price</small><b className="d-num">{formatCad(proposalAmount)}</b></div>}{brief?.proposal_delivery_days?<div><small>Delivery</small><b className="d-num">{brief.proposal_delivery_days} days</b></div>:null}</div>{brief?.proposal_summary&&<p className="d-card-text">{brief.proposal_summary}</p>}</section>:null}
    {notice&&<div className={cx("d-notice",`is-${notice.tone}`)} role="status">{notice.text}</div>}
    {loading?<Loading label="Loading agreements…" compact/>:!contracts.length?<Empty icon={FileSignature} title="No agreement yet" copy="Once your proposal is ready, the agreement appears here to read and sign."/>:<div className="d-cards">{contracts.map(contract=><article className={cx("d-panel","d-card",contract.status==="pending"&&"is-attention")} key={contract.id}>
      <div className="d-card-head"><div><h3>{contract.title}</h3><p>Prepared {contractDate(contract.created_at)}</p></div><ContractBadge status={contract.status}/></div>
      <div className="d-contract-body">{contract.body}</div>
      {contract.status==="pending"&&openDecline!==contract.id&&<div className="d-fields"><label className="d-field"><span>Type your full name to sign</span><input value={signers[contract.id]||""} onChange={event=>setSigners(current=>({...current,[contract.id]:event.target.value}))} placeholder="Your full name" autoComplete="name"/><small>Your typed name is your electronic signature for this agreement.</small></label><div className="d-btn-row"><button type="button" className="d-btn is-primary" disabled={busy===contract.id||(signers[contract.id]||"").trim().length<3} onClick={()=>decide(contract,"signed")}><FileSignature size={17}/>{busy===contract.id?"Signing…":"Sign agreement"}</button><button type="button" className="d-btn" onClick={()=>setOpenDecline(contract.id)}>Request changes</button></div></div>}
      {contract.status==="pending"&&openDecline===contract.id&&<div className="d-fields"><label className="d-field"><span>What would you like changed?</span><textarea rows={3} value={declines[contract.id]||""} onChange={event=>setDeclines(current=>({...current,[contract.id]:event.target.value}))} placeholder="For example the payment schedule or a page you do not need." autoFocus/></label><div className="d-btn-row"><button type="button" className="d-btn is-primary" disabled={busy===contract.id} onClick={()=>decide(contract,"declined")}>{busy===contract.id?"Sending…":"Send to MIlink"}</button><button type="button" className="d-btn" onClick={()=>setOpenDecline("")}>Cancel</button></div></div>}
      {contract.status==="signed"&&<div className="d-btn-row d-signed-row"><p className="d-outcome is-go"><CheckCircle2 size={16}/>Signed by {contract.signer_name} on {contractDate(contract.signed_at)}</p><button type="button" className="d-btn is-sm" onClick={()=>printDocument(contract.title,[["Project",brief?.business_name||"Website project"],["Signed by",contract.signer_name],["Signed on",contractDate(contract.signed_at)],["Agreement reference",contract.id.slice(0,8).toUpperCase()]],contract.body)}><Download size={15}/>Signed copy</button></div>}
      {contract.status==="declined"&&<div className="d-quote"><b>You asked for changes</b><p>{contract.decline_reason||"Changes requested."}</p></div>}
    </article>)}</div>}
  </div>;
}

function AdminContracts({brief}) {
  const [contracts,setContracts]=useState([]),[loading,setLoading]=useState(true),[notice,setNotice]=useState(null),[open,setOpen]=useState(false),[saving,setSaving]=useState(false),[draft,setDraft]=useState({title:"",body:""});
  const load=useCallback(async()=>{if(!brief?.id){setContracts([]);setLoading(false);return;}const {data,error}=await getSupabaseBrowserClient().from("contracts").select("*").eq("project_id",brief.id).order("created_at",{ascending:false});if(error){console.error("Could not load contracts",error);setNotice({tone:"stop",text:error.message});}else setContracts(data||[]);setLoading(false);},[brief?.id]);
  useEffect(()=>{load();if(!brief?.id)return undefined;const supabase=getSupabaseBrowserClient();if(!supabase)return undefined;const channel=supabase.channel(`admin-contracts-${brief.id}`).on("postgres_changes",{event:"*",schema:"public",table:"contracts",filter:`project_id=eq.${brief.id}`},load).subscribe();return()=>supabase.removeChannel(channel);},[brief?.id,load]);
  // Start the agreement from the proposal so the scope, price and timing match what the client saw.
  const startDraft=()=>{const lines=[brief?.proposal_summary&&`Scope: ${brief.proposal_summary}`,brief?.proposal_amount_cents&&`Price: ${formatCad(brief.proposal_amount_cents)}`,brief?.proposal_delivery_days&&`Delivery: ${brief.proposal_delivery_days} days`].filter(Boolean);setDraft({title:`Website agreement for ${brief?.business_name||"your project"}`,body:lines.length?`${lines.join("\n")}\n\n`:""});setOpen(true);};
  const create=async()=>{
    if(!draft.title.trim()||!draft.body.trim()){setNotice({tone:"wait",text:"Add a title and the agreement text."});return;}
    setSaving(true);setNotice(null);
    try{
      const supabase=getSupabaseBrowserClient();
      const {data:{user},error:userError}=await supabase.auth.getUser();
      if(userError)throw userError;
      if(!user)throw new Error("Your session ended. Sign in again.");
      const {data,error}=await supabase.from("contracts").insert({project_id:brief.id,title:draft.title.trim(),body:draft.body.trim(),created_by:user.id}).select().single();
      if(error)throw error;
      setContracts(current=>[data,...current]);dispatchEmailEvent("contract_sent",data.id);setDraft({title:"",body:""});setOpen(false);
      setNotice({tone:"go",text:"Agreement sent. The client can read and sign it now."});
    }catch(error){console.error("Could not create the agreement",error);setNotice({tone:"stop",text:error?.message||"Could not send the agreement."});}
    finally{setSaving(false);}
  };
  return <section className="d-panel" aria-label="Agreement">
    <div className="d-panel-head"><div><h3>Agreement</h3><p>The client signs by typing their name.</p></div><button type="button" className="d-btn is-sm is-primary" onClick={startDraft}><Plus size={15}/>New agreement</button></div>
    {notice&&<div className="d-panel-body"><div className={cx("d-notice",`is-${notice.tone}`)} role="status">{notice.text}</div></div>}
    {loading?<Loading label="Loading…" compact/>:contracts.length?<ul className="d-list">{contracts.map(contract=><li key={contract.id} className="d-request-row">
      <div className="d-request-top"><span className="d-row-main"><b>{contract.title}</b><small>Sent {contractDate(contract.created_at)}</small></span><ContractBadge status={contract.status}/></div>
      {contract.status==="signed"&&<p className="d-outcome is-go"><CheckCircle2 size={16}/>Signed by {contract.signer_name} on {contractDate(contract.signed_at)}</p>}
      {contract.status==="declined"&&<div className="d-quote"><b>Client asked for changes</b><p>{contract.decline_reason||"No reason given."}</p></div>}
      <details className="d-details"><summary>Show agreement text</summary><div className="d-contract-body">{contract.body}</div></details>
    </li>)}</ul>:<div className="d-empty"><FileSignature size={22}/><b>No agreement yet</b><p>{brief?.proposal_amount_cents?"New agreement starts from the proposal you sent.":"Send the proposal first, then the agreement."}</p></div>}
    {open&&<AdminModal label="New agreement" heading="New agreement" onClose={()=>!saving&&setOpen(false)} wide>
      <div className="d-modal-body"><label className="d-field"><span>Title</span><input value={draft.title} onChange={event=>setDraft(current=>({...current,title:event.target.value}))}/></label><label className="d-field"><span>Agreement text</span><textarea rows={12} value={draft.body} onChange={event=>setDraft(current=>({...current,body:event.target.value}))} placeholder="Scope, price, payment terms, timeline and responsibilities."/><small>Started from your proposal. Add payment terms and anything else before sending.</small></label></div>
      <footer className="d-modal-foot"><button type="button" className="d-btn" disabled={saving} onClick={()=>setOpen(false)}>Cancel</button><button type="button" className="d-btn is-primary" disabled={saving||!draft.title.trim()||!draft.body.trim()} onClick={create}>{saving?"Sending…":"Send to client"}</button></footer>
    </AdminModal>}
  </section>;
}

function ClientMessages({brief}) {
  const [user,setUser]=useState(null),[items,setItems]=useState([]),[adminId,setAdminId]=useState(""),[notice,setNotice]=useState(""),[ready,setReady]=useState(false);
  const load=useCallback(async()=>{const s=getSupabaseBrowserClient();const {data:{user:currentUser}}=await s.auth.getUser();if(!currentUser)return;setUser(currentUser);const [{data:messages,error},{data:primaryAdmin}]=await Promise.all([s.from("messages").select("*").or(`sender_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`).order("created_at",{ascending:true}),s.rpc("primary_milink_admin_id")]);if(error)setNotice(error.message);else setItems(messages||[]);if(primaryAdmin)setAdminId(primaryAdmin);setReady(true);const {error:readError}=await s.from("messages").update({is_read:true}).eq("recipient_id",currentUser.id).eq("is_read",false);if(readError)console.error("Could not mark portal messages read",readError);},[]);
  useEffect(()=>{load();const s=getSupabaseBrowserClient();if(!s)return;const channel=s.channel("client-inbox-v3").on("postgres_changes",{event:"*",schema:"public",table:"messages"},load).subscribe();return()=>s.removeChannel(channel)},[load]);
  const send=async({content,attachment})=>{if(!user||(!content.trim()&&!attachment))return {error:"Write a message or choose a file."};const s=getSupabaseBrowserClient();let attachments=[];if(attachment){const fileResult=await uploadChatFile(s,user.id,attachment);if(fileResult.error)return fileResult;attachments=[fileResult.data];}const recipientId=adminId||await getPrimaryAdmin(s);if(!recipientId)return {error:"The MIlink team is not available yet. Email info@milink.ca instead."};const projectId=await resolveMessageProjectContext(s,brief?.id);const {data,error}=await s.from("messages").insert({project_id:projectId,sender_id:user.id,recipient_id:recipientId,content:content.trim()||`Attached: ${attachment?.name||"file"}`,attachments}).select("id").single();if(error)console.error("Could not send client message",{projectId,error:error.message});if(!error){dispatchEmailEvent("new_message",data.id);await load();}return {error:error?.message};};
  return <section className="d-panel d-chat is-client" aria-label="Conversation with MIlink">
    <header className="d-chat-head"><span className="d-logo is-sm" aria-hidden="true">M</span><span className="d-chat-who"><b>MIlink team</b><small>Private conversation about your project</small></span></header>
    {ready?<ChatStream messages={items} currentUserId={user?.id} empty="Ask anything about your project. Files are welcome too."/>:<Loading label="Loading messages…" compact/>}
    {notice&&<p className="d-form-error">{notice}</p>}
    <ChatComposer placeholder="Write to the MIlink team" onSend={send}/>
  </section>;
}

function AdminConversation({thread,user,onSent,onBack,desktop,onOpenClient}) {
  const latestMessageProjectId=thread.messages.at(-1)?.project_id;
  const brief=clientProjects(thread.client).find(project=>project.id===latestMessageProjectId)||latestClientProject(thread.client);
  const send=async({content,attachment})=>{if(!user||(!content.trim()&&!attachment))return {error:"Write a message or choose a file."};const s=getSupabaseBrowserClient();let attachments=[];if(attachment){const fileResult=await uploadChatFile(s,user.id,attachment);if(fileResult.error)return fileResult;attachments=[fileResult.data];}const projectId=await resolveMessageProjectContext(s,brief?.id);const {data,error}=await s.from("messages").insert({project_id:projectId,sender_id:user.id,recipient_id:thread.client.id,content:content.trim()||`Attached: ${attachment?.name||"file"}`,attachments}).select("id").single();if(error)console.error("Could not send admin message",{projectId,error:error.message});if(!error){dispatchEmailEvent("new_message",data.id);await onSent();}return {error:error?.message};};
  return <>
    <header className="d-chat-head">
      {!desktop&&<button type="button" className="d-icon-button" onClick={onBack} aria-label="Back to conversations"><ChevronLeft size={20}/></button>}
      <span className="d-avatar">{initials(thread.client.full_name||thread.client.email)}</span>
      <span className="d-chat-who"><b>{thread.client.full_name||thread.client.email}</b><small>{brief?`${brief.business_name||"Project"} · ${stageLabel(brief.status)}`:thread.client.email}</small></span>
      {onOpenClient&&<button type="button" className="d-btn is-sm" onClick={()=>onOpenClient(thread.client.id)}>{desktop?"Open client":"Client"}</button>}
    </header>
    <ChatStream messages={thread.messages} currentUserId={user?.id} empty="No messages yet. Say hello and explain the next step."/>
    <ChatComposer placeholder={`Message ${thread.client.full_name||"the client"}`} onSend={send} quickReplies={["Thanks, I will look at this today.","Could you send that as a file in Files?","Your update is live, take a look.","Can we have a quick call this week?"]}/>
  </>;
}

function ChatStream({messages,currentUserId,empty}) {
  const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({block:"end"})},[messages.length]);
  const lastMine=[...messages].reverse().find(message=>message.sender_id===currentUserId);
  let previousDay="",previous=null;
  return <div className="d-stream" role="log" aria-live="polite">{messages.length?messages.map(message=>{
    const date=new Date(message.created_at);const day=date.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});const divider=day!==previousDay;previousDay=day;
    const mine=message.sender_id===currentUserId;const grouped=!divider&&previous&&previous.sender_id===message.sender_id&&date-new Date(previous.created_at)<5*60000;previous=message;
    return <Fragment key={message.id}>
      {divider&&<p className="d-stream-day"><span>{day}</span></p>}
      <div className={cx("d-bubble-row",mine?"is-mine":"is-theirs",grouped&&"is-grouped")}>
        <div className="d-bubble">{message.content&&<p>{message.content}</p>}{Array.isArray(message.attachments)&&message.attachments.map(file=><ChatAttachment key={`${message.id}-${file.url}`} file={file}/>)}</div>
        <small className="d-bubble-meta">{date.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}{mine&&message.id===lastMine?.id&&message.is_read&&" · Seen"}</small>
      </div>
    </Fragment>;})
    :<div className="d-empty"><MessageCircle size={24}/><b>No messages yet</b><p>{empty}</p></div>}<div ref={endRef}/></div>;
}

function ChatAttachment({file}) { const [url,setUrl]=useState(""); const isImage=(file.type||"").startsWith("image/"); useEffect(()=>{let active=true;getSupabaseBrowserClient().storage.from("portal-files").createSignedUrl(file.url,3600).then(({data})=>{if(active)setUrl(data?.signedUrl||"")});return()=>{active=false}},[file.url]);return <a className={cx("d-attachment",isImage&&"is-image")} href={url||undefined} target="_blank" rel="noreferrer">{isImage&&url?<img src={url} alt={file.name}/>:<span className="d-row-icon"><FileText size={17}/></span>}<span className="d-attachment-name"><b>{file.name}</b><small>{formatBytes(file.size)}</small></span></a>; }

function ChatComposer({placeholder,onSend,quickReplies=[]}) {
  const [content,setContent]=useState(""),[attachment,setAttachment]=useState(null),[sending,setSending]=useState(false),[error,setError]=useState("");
  const fileRef=useRef(null),textRef=useRef(null),desktop=useIsDesktop();
  useEffect(()=>{const el=textRef.current;if(!el)return;el.style.height="auto";el.style.height=`${Math.min(el.scrollHeight,180)}px`;},[content]);
  const submit=async()=>{if(sending||(!content.trim()&&!attachment))return;setSending(true);setError("");const result=await onSend({content,attachment});if(result?.error)setError(result.error);else{setContent("");setAttachment(null);if(fileRef.current)fileRef.current.value="";}setSending(false);};
  return <div className="d-composer">
    {quickReplies.length>0&&!content&&!attachment&&<div className="d-quick" aria-label="Quick replies">{quickReplies.map(text=><button type="button" key={text} className="d-chip" onClick={()=>{setContent(text);textRef.current?.focus();}}>{text}</button>)}</div>}
    {attachment&&<div className="d-file-chip"><FileText size={15}/><span>{attachment.name}</span><button type="button" className="d-icon-button" onClick={()=>{setAttachment(null);if(fileRef.current)fileRef.current.value="";}} aria-label="Remove attachment"><X size={15}/></button></div>}
    <div className="d-composer-row">
      <label className="d-icon-button" title="Attach a file"><Upload size={19}/><span className="d-visually-hidden">Attach a file</span><input ref={fileRef} hidden type="file" onChange={event=>setAttachment(event.target.files?.[0]||null)}/></label>
      <textarea ref={textRef} value={content} rows={1} onChange={event=>setContent(event.target.value)} onKeyDown={event=>{if(desktop&&event.key==="Enter"&&!event.shiftKey){event.preventDefault();submit();}}} placeholder={placeholder} aria-label="Message"/>
      <button type="button" className="d-btn is-primary d-send" disabled={sending||(!content.trim()&&!attachment)} onClick={submit} aria-label="Send message"><Send size={17}/><span>{sending?"Sending…":"Send"}</span></button>
    </div>
    {desktop&&<small className="d-composer-hint">Enter to send, Shift and Enter for a new line.</small>}
    {error&&<p className="d-form-error" role="alert">{error}</p>}
  </div>;
}
async function uploadChatFile(supabase,userId,file) { const path=`${userId}/messages/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"-")}`;const {error}=await supabase.storage.from("portal-files").upload(path,file,{upsert:false});return error?{error:error.message}:{data:{name:file.name,url:path,size:file.size,type:file.type}}; }
async function getPrimaryAdmin(supabase) { const {data}=await supabase.rpc("primary_milink_admin_id"); return data||""; }
function formatBytes(bytes=0) { return bytes>1024*1024?`${(bytes/(1024*1024)).toFixed(1)} MB`:`${Math.max(1,Math.ceil(bytes/1024))} KB`; }
function relativeTime(value,now=Date.now()) { if(!value)return "";const seconds=Math.max(0,Math.floor((now-new Date(value).getTime())/1000));if(seconds<60)return "Just now";if(seconds<3600)return `${Math.floor(seconds/60)}m ago`;if(seconds<86400)return `${Math.floor(seconds/3600)}h ago`;if(seconds<172800)return "Yesterday";return new Date(value).toLocaleDateString(undefined,{month:"short",day:"numeric"}); }

function Brief({brief:selectedBrief,newProject=false,onChange}){
  const [user,setUser]=useState(null),[brief,setBrief]=useState(selectedBrief||null),[form,setForm]=useState({...initial,...(selectedBrief||{})}),[step,setStep]=useState(0),[ready,setReady]=useState(false),[saving,setSaving]=useState(false),[savedAt,setSavedAt]=useState(null),[notice,setNotice]=useState(""),[errors,setErrors]=useState({}),[submittedThisSession,setSubmittedThisSession]=useState(false);
  const dirty=useRef(false),dirtyDuringSave=useRef(false),topRef=useRef(null);
  // A brief created by the first autosave comes back as the selected project; that is the same form, so keep the step and what was typed.
  const savedId=useRef(selectedBrief?.id||null);
  useEffect(()=>{if(!newProject&&selectedBrief?.id&&selectedBrief.id===savedId.current)return;savedId.current=newProject?null:selectedBrief?.id||null;setBrief(newProject?null:selectedBrief||null);setForm({...initial,...(!newProject&&selectedBrief?selectedBrief:{})});setStep(0);setNotice("");setErrors({});setSubmittedThisSession(false);setSavedAt(null);dirty.current=false;},[selectedBrief?.id,newProject]);
  useEffect(()=>{const s=getSupabaseBrowserClient();if(!s){setReady(true);return}s.auth.getUser().then(({data})=>{setUser(data.user||null);setReady(true)})},[]);
  useEffect(()=>{if(!user?.id||typeof window==="undefined")return;const key=`milink-welcome-${user.id}`;if(!window.sessionStorage.getItem(key)){window.sessionStorage.setItem(key,"1");dispatchEmailEvent("welcome",user.id);}},[user?.id]);
  useEffect(()=>{if(!brief?.id||brief.status!=="submitted"||typeof window==="undefined")return;const key=`milink-brief-email-${brief.id}`;if(!window.sessionStorage.getItem(key)){window.sessionStorage.setItem(key,"1");dispatchEmailEvent("brief_submitted",brief.id);}},[brief?.id,brief?.status]);
  const update=(key,value)=>{dirty.current=true;if(saving)dirtyDuringSave.current=true;setForm(f=>({...f,[key]:value}));setErrors(e=>({...e,[key]:""}))},toggle=(key,value)=>update(key,form[key].includes(value)?form[key].filter(x=>x!==value):[...form[key],value]);
  const save=async(submit=false,silent=false)=>{if(!user)return null;const e={};if(submit){if(!form.business_name.trim())e.business_name="Add your business name.";if(!form.industry.trim())e.industry="Add your industry.";if(!form.main_goals.length)e.main_goals="Choose at least one goal.";if(!form.page_structure.length)e.page_structure="Choose at least one page."}setErrors(e);if(Object.keys(e).length){setNotice("A few required answers are missing. They are marked in red.");setStep(e.business_name||e.industry?0:1);return null}setSaving(true);const currentStatus=brief?.status||form.status||"draft";const payload={...form,site_type:form.page_structure.length<=1?"single_page":"multi_page",client_id:user.id,status:submit?"submitted":currentStatus,target_launch_date:form.target_launch_date||null};const s=getSupabaseBrowserClient(),r=brief?await s.from("project_briefs").update(payload).eq("id",brief.id).select().single():await s.from("project_briefs").insert(payload).select().single();setSaving(false);if(r.error){setNotice(`Could not save: ${r.error.message}`);return null}savedId.current=r.data.id;if(dirtyDuringSave.current){dirtyDuringSave.current=false;}else dirty.current=false;setBrief(r.data);setForm(f=>({...r.data,...f,id:r.data.id,status:r.data.status}));setSavedAt(new Date());onChange(r.data);if(submit)setSubmittedThisSession(true);if(!silent)setNotice(submit?"":"Saved.");return r.data};
  useEffect(()=>{if(!ready||!dirty.current||saving)return;const t=setTimeout(()=>save(false,true),900);return()=>clearTimeout(t)},[form,ready]);
  const goStep=next=>{setStep(next);setNotice("");topRef.current?.scrollIntoView({block:"start",behavior:"smooth"});};
  if(!ready)return <Loading label="Loading your brief…"/>;
  if(submittedThisSession)return <div className="d-page"><section className="d-hero d-done">
    <span className="d-done-icon"><CheckCircle2 size={28}/></span>
    <h2 className="d-hero-title">Your brief is with MIlink</h2>
    <p className="d-hero-copy">Thanks for the details on {brief?.business_name||"your project"}. We review it and post your proposal here in your workspace. You will get an email when it is ready.</p>
    <div className="d-btn-row"><button type="button" className="d-btn" onClick={()=>{setSubmittedThisSession(false);setStep(0)}}>Look over your answers</button></div>
  </section></div>;
  const isSubmitted=Boolean(brief?.status&&brief.status!=="draft");
  const last=step===steps.length-1;
  return <div className="d-page" ref={topRef}>
    <div className="d-page-head"><h2>{isSubmitted?"Your project brief":"Tell us about your project"}</h2><p>{isSubmitted?"We already have your brief. Changes you make here are shared with the MIlink team.":"Four short steps, about three minutes. Your answers save as you type."}</p></div>
    <nav className="d-stepper" aria-label="Brief steps"><ol>{steps.map(([label],index)=><li key={label}><button type="button" className={cx(index===step&&"is-current",index<step&&"is-done")} aria-current={index===step?"step":undefined} onClick={()=>goStep(index)}><span className="d-stepper-num">{index<step?<Check size={13}/>:index+1}</span><span className="d-stepper-label">{label}</span></button></li>)}</ol><p className="d-stepper-phone" style={{"--d-step":`${((step+1)/steps.length)*100}%`}}>Step {step+1} of {steps.length}: {steps[step][0]}</p></nav>
    <section className="d-panel d-form-panel">
      {step===0&&<Business form={form} update={update} errors={errors}/>}
      {step===1&&<Scope form={form} update={update} toggle={toggle} errors={errors}/>}
      {step===2&&<Design form={form} update={update} brief={brief} user={user} save={save}/>}
      {step===3&&<Launch form={form} update={update} go={goStep}/>}
      {notice&&<div className={cx("d-notice",notice==="Saved."?"is-go":"is-wait")} role="status">{notice}</div>}
      <div className="d-form-actions">
        <button type="button" className="d-btn" disabled={!step} onClick={()=>goStep(step-1)}><ChevronLeft size={17}/>Back</button>
        <span className="d-save-state" aria-live="polite">{saving?"Saving…":savedAt?"Saved":""}</span>
        {!last?<button type="button" className="d-btn is-primary" onClick={()=>goStep(step+1)}>Continue<ChevronRight size={17}/></button>
        :isSubmitted?<button type="button" className="d-btn is-primary" disabled={saving} onClick={()=>save(false)}>{saving?"Saving…":"Save changes"}</button>
        :<button type="button" className="d-btn is-primary" disabled={saving} onClick={()=>save(true)}><Send size={16}/>{saving?"Sending…":"Send brief"}</button>}
      </div>
    </section>
  </div>;
}
function Header({n,title:head,copy}){return <div className="d-form-head"><h3>{head}</h3><p>{copy}</p></div>}
function Field({label,value,onChange,required,error,type="text",placeholder,hint}){return <label className={cx("d-field",error&&"is-error")}><span>{label}{required&&<em aria-hidden="true">*</em>}</span><input type={type} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} required={required} aria-invalid={Boolean(error)}/>{error?<small className="d-field-error">{error}</small>:hint&&<small>{hint}</small>}</label>}
function Area({label,value,onChange,placeholder,hint}){return <label className="d-field"><span>{label}</span><textarea value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>{hint&&<small>{hint}</small>}</label>}
function Chips({options,selected,toggle}){return <div className="d-chips">{options.map(x=><button key={x} type="button" onClick={()=>toggle(x)} className={cx("d-chip",selected.includes(x)&&"is-on")} aria-pressed={selected.includes(x)}>{selected.includes(x)&&<Check size={14}/>}{x}</button>)}</div>}
function Business({form,update,errors}){return <><Header title="About your business" copy="Two quick answers and a sentence. That is all we need to start."/><div className="d-fields d-fields-2"><Field label="Business name" required value={form.business_name} error={errors.business_name} onChange={v=>update("business_name",v)} placeholder="Your business or brand name"/><Field label="Industry" required value={form.industry} error={errors.industry} onChange={v=>update("industry",v)} placeholder="e.g. restaurant, clinic, real estate" hint="A few words is enough."/></div><div className="d-fields"><Area label="What do you do, and for whom?" value={form.business_description} onChange={v=>update("business_description",v)} placeholder="e.g. We help local families find a home in Toronto." hint="One or two sentences. Optional."/><Field label="Current website" value={form.current_website} onChange={v=>update("current_website",v)} placeholder="https://" hint="Only if you already have one."/></div></>}
function Scope({form,update,toggle,errors}){const [custom,setCustom]=useState("");const add=()=>{if(custom.trim()){update("custom_pages",[...form.custom_pages,custom.trim()]);update("page_structure",[...new Set([...form.page_structure,custom.trim()])]);setCustom("")}};return <><Header title="What should your website do?" copy="Pick what matters most. You can change this later with us."/>
  <fieldset className={cx("d-choice",errors.main_goals&&"is-error")}><legend>Main goals <em aria-hidden="true">*</em></legend><small>Choose one or more.</small><Chips options={goals} selected={form.main_goals} toggle={v=>toggle("main_goals",v)}/>{errors.main_goals&&<small className="d-field-error">{errors.main_goals}</small>}</fieldset>
  <fieldset className={cx("d-choice",errors.page_structure&&"is-error")}><legend>Pages <em aria-hidden="true">*</em></legend><small>Home and Contact are already picked. Add a page we missed below.</small><Chips options={[...pages,...form.custom_pages]} selected={form.page_structure} toggle={v=>toggle("page_structure",v)}/><div className="d-inline-form is-flush"><input className="d-input" value={custom} onChange={e=>setCustom(e.target.value)} placeholder="Another page, e.g. Pricing" onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();add();}}} aria-label="Another page"/><button type="button" className="d-btn" onClick={add} disabled={!custom.trim()}><Plus size={16}/>Add</button></div>{errors.page_structure&&<small className="d-field-error">{errors.page_structure}</small>}</fieldset>
  <fieldset className="d-choice"><legend>Extras <i>optional</i></legend><small>Anything else the site should have.</small><Chips options={features} selected={form.required_features} toggle={v=>toggle("required_features",v)}/></fieldset></>}
function Design({form,update,brief,user,save}){const [ref,setRef]=useState("");const add=()=>{if(ref.trim()&&form.reference_sites.length<3){update("reference_sites",[...form.reference_sites,ref.trim()]);setRef("")}};return <><Header title="How should it feel?" copy="Pick the closest style, then add your logo and anything you like."/>
  <fieldset className="d-choice"><legend>Style</legend><div className="d-styles">{[["Minimal","Quiet, precise, spacious"],["Luxury","Editorial and elevated"],["Bold","Expressive and memorable"],["Corporate","Structured and trusted"]].map(([n,c])=><button key={n} type="button" onClick={()=>update("design_style",n)} className={cx("d-style",form.design_style===n&&"is-on")} aria-pressed={form.design_style===n}><b>{n}</b><span>{c}</span></button>)}</div></fieldset>
  <div className="d-fields d-fields-2"><Field label="Brand colours" value={(form.brand_colors||[]).join(", ")} onChange={v=>update("brand_colors",v.split(",").map(x=>x.trim()).filter(Boolean))} placeholder="navy and cream, or #0B0F17" hint="Optional. Separate with commas."/>
  <div className="d-field"><span>Websites you like <i>optional, up to 3</i></span><div className="d-inline-form is-flush"><input className="d-input" value={ref} onChange={e=>setRef(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();add();}}} placeholder="https://example.com" disabled={form.reference_sites.length>=3} aria-label="Website you like"/><button type="button" className="d-btn" onClick={add} disabled={!ref.trim()||form.reference_sites.length>=3}>Add</button></div>{form.reference_sites.length>0&&<div className="d-chips">{form.reference_sites.map(x=><span key={x} className="d-chip is-on is-static">{x}<button type="button" aria-label={`Remove ${x}`} onClick={()=>update("reference_sites",form.reference_sites.filter(y=>y!==x))}><X size={13}/></button></span>)}</div>}</div></div>
  <Uploader brief={brief} user={user} save={save}/></>}
const hostingChoices=[["not_sure","Not sure yet","not_sure","not_sure"],["have_both","I have both","have_domain","have_hosting"],["need_hosting","I have a domain, need hosting","have_domain","need_hosting"],["need_both","Please help with both","need_domain","need_hosting"]];
const hostingKey=form=>(hostingChoices.find(c=>c[2]===form.domain_status&&c[3]===form.hosting_status)||hostingChoices[0])[0];
function Launch({form,update,go}){const missing=[["Business name",form.business_name,0],["Industry",form.industry,0],["A main goal",form.main_goals.length,1],["At least one page",form.page_structure.length,1]].filter(x=>!x[1]);const budgets=["Not sure yet","Under $500","$500–$1,000","$1,000–$2,500","$2,500–$5,000","$5,000+"];const options=[...budgets,...(form.budget_range&&!budgets.includes(form.budget_range)?[form.budget_range]:[])].map(v=>[v,v]);return <><Header title="Timing and budget" copy="So we can suggest the right plan. Nothing here is binding."/><div className="d-fields d-fields-2"><Select label="Budget" value={form.budget_range} onChange={v=>update("budget_range",v)} options={options}/><Field label="Ideal launch date" type="date" value={form.target_launch_date} onChange={v=>update("target_launch_date",v)} hint="Optional."/><Select label="Domain and hosting" value={hostingKey(form)} onChange={v=>{const c=hostingChoices.find(x=>x[0]===v);update("domain_status",c[2]);update("hosting_status",c[3])}} options={hostingChoices.map(c=>[c[0],c[1]])}/></div><div className="d-fields"><Area label="Anything else?" value={form.additional_notes} onChange={v=>update("additional_notes",v)} placeholder="Deadlines, competitors, things to avoid…" hint="Optional."/></div>{missing.length>0?<div className="d-notice is-wait"><span>Before you send, please add: {missing.map(([label,,at],i)=><span key={label}>{i>0&&", "}<button type="button" className="d-link" onClick={()=>go(at)}>{label}</button></span>)}.</span></div>:<div className="d-notice is-go"><CheckCircle2 size={18}/><span>Everything we need is here. You can send your brief.</span></div>}</>}
function Select({label,value,onChange,options}){return <label className="d-field"><span>{label}</span><select value={value} onChange={e=>onChange(e.target.value)}>{options.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>}
function Uploader({brief,user,save}){const ref=useRef(null),[message,setMessage]=useState(""),[over,setOver]=useState(false);const go=async files=>{if(!files?.length||!user)return;const b=brief||await save(false,true);if(!b){setMessage("Save the brief first, then add files.");return}setMessage("Uploading…");const s=getSupabaseBrowserClient();let failed=0;for(const file of [...files]){const path=`${user.id}/${b.id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"-")}`;const {error}=await s.storage.from("project-assets").upload(path,file);if(error){failed+=1;continue;}await s.from("project_files").insert({brief_id:b.id,client_id:user.id,name:file.name,storage_path:path,mime_type:file.type,size_bytes:file.size})}setMessage(failed?`${failed} file${failed===1?"":"s"} could not be uploaded. Try again.`:`${files.length} file${files.length===1?"":"s"} uploaded. You can find them in Assets.`)};return <div className={cx("d-drop",over&&"is-over")} onDragOver={e=>{e.preventDefault();setOver(true)}} onDragLeave={()=>setOver(false)} onDrop={e=>{e.preventDefault();setOver(false);go(e.dataTransfer.files)}}><span className="d-row-icon is-brand"><Upload size={18}/></span><span className="d-drop-text"><b>Logo, photos or documents</b><small>Drop files here or choose them. Only you and MIlink can see them.</small></span><button type="button" className="d-btn is-sm" onClick={()=>ref.current?.click()}>Choose files</button><input ref={ref} hidden type="file" multiple onChange={e=>go(e.target.files)}/>{message&&<small className="d-drop-note" role="status">{message}</small>}</div>}
const assetTypeFilters=[["all","All"],["image","Images"],["document","Documents"],["archive","Archives"]];
const assetCategoryKey=value=>({"Brand / Logo":"brand","Images & Photography":"media","Documents / Copywriting":"document","Archive Bundle":"archive","Other":"other"}[value]||value||"other");
const normaliseBrandColors=value=>{let colors=value;if(typeof colors==="string"){try{colors=JSON.parse(colors)}catch{colors=colors.split(/[,\s]+/)}}return(Array.isArray(colors)?colors:[]).map(color=>String(color||"").trim()).filter(color=>/^#[0-9a-f]{3,8}$/i.test(color));};
function assetKind(file={}){const name=(file.file_name||file.name||"").toLowerCase(), type=file.file_type||file.mime_type||"";if(type.startsWith("image/")||/\.(png|jpe?g|webp|gif|svg|avif)$/.test(name))return"image";if(/\.(zip|rar|7z|tar|gz)$/.test(name))return"archive";return"document";}
function assetIcon(file,size=20){const kind=assetKind(file);const Icon=kind==="image"?FileImage:kind==="archive"?FileArchive:FileText;return <Icon size={size}/>;}
function assetPath(file){return file.file_url||file.storage_path;}
function assetBucket(file){return file.storage_bucket||"project-assets";}
async function openAsset(file,{download=false}={}){const path=assetPath(file);if(!path)throw new Error("The storage path is missing for this asset.");const {data,error}=await getSupabaseBrowserClient().storage.from(assetBucket(file)).createSignedUrl(path,3600,{download:download?file.file_name||file.name:undefined});if(error)throw error;window.open(data.signedUrl,"_blank","noopener,noreferrer");}
function assetPreviewKind(file={}){const name=(file.file_name||file.name||"").toLowerCase(),type=(file.file_type||file.mime_type||"").toLowerCase();if(assetKind(file)==="image")return"image";if(type==="application/pdf"||name.endsWith(".pdf"))return"pdf";return null;}
async function assetPreviewUrl(file){const path=assetPath(file);if(!path)throw new Error("The storage path is missing for this asset.");const {data,error}=await getSupabaseBrowserClient().storage.from(assetBucket(file)).createSignedUrl(path,3600);if(error)throw error;return data.signedUrl;}
function AssetLightbox({file,onClose}){const [url,setUrl]=useState(""),[error,setError]=useState("");const mode=assetPreviewKind(file);useEffect(()=>{let active=true;assetPreviewUrl(file).then(value=>{if(active)setUrl(value)}).catch(reason=>{if(active)setError(reason.message||"Could not open this preview.")});return()=>{active=false};},[file]);return <AdminModal label={`Preview ${file.file_name||file.name||"file"}`} heading={file.file_name||file.name} onClose={onClose} wide><div className="d-modal-body d-preview">{error?<div className="d-notice is-stop">{error}</div>:!url?<Loading label="Preparing preview…" compact/>:mode==="pdf"?<iframe title={file.file_name||file.name} src={url}/>:<img src={url} alt={file.file_name||file.name||"Project file"}/>}</div><footer className="d-modal-foot"><button type="button" className="d-btn" onClick={onClose}>Close</button><button type="button" className="d-btn is-primary" disabled={!url} onClick={async()=>{try{await openAsset(file,{download:true})}catch(reason){setError(reason.message||"Could not download this file.")}}}><Download size={16}/>Download</button></footer></AdminModal>}
function BrandColorTokens({colors}){const values=normaliseBrandColors(colors);const [copied,setCopied]=useState("");if(!values.length)return null;const copy=async color=>{try{await navigator.clipboard?.writeText(color);setCopied(color);window.setTimeout(()=>setCopied(current=>current===color?"":current),1400);}catch{setCopied("");}};return <div className="d-swatches" aria-label="Brand colours">{values.map(color=><button type="button" key={color} onClick={()=>copy(color)} title={`Copy ${color}`}><i style={{backgroundColor:color}}/><span>{copied===color?"Copied":color.toUpperCase()}</span></button>)}</div>}
function Assets({brief}){
  const [files,setFiles]=useState([]),[drag,setDrag]=useState(false),[uploading,setUploading]=useState(false),[notice,setNotice]=useState(null),[filter,setFilter]=useState("all"),[query,setQuery]=useState(""),[zipping,setZipping]=useState(false),[progress,setProgress]=useState(0),[preview,setPreview]=useState(null),[loaded,setLoaded]=useState(false); const input=useRef(null);
  const load=useCallback(async()=>{if(!brief?.id){setFiles([]);return;}const {data,error}=await getSupabaseBrowserClient().from("project_files").select("*").eq("brief_id",brief.id).order("created_at",{ascending:false});setLoaded(true);if(error){console.error("Could not load project files",error);setNotice({tone:"stop",text:error.message});return;}setFiles(data||[]);},[brief?.id]);
  useEffect(()=>{load();if(!brief?.id)return undefined;const s=getSupabaseBrowserClient();const channel=s.channel(`client-assets-${brief.id}`).on("postgres_changes",{event:"*",schema:"public",table:"project_files",filter:`brief_id=eq.${brief.id}`},load).subscribe();return()=>s.removeChannel(channel);},[brief?.id,load]);
  // The category comes from the file itself, so uploading is one step.
  const categoryFor=file=>{const kind=assetKind({name:file.name,mime_type:file.type});return kind==="image"?"media":kind==="archive"?"archive":"document";};
  const upload=async incoming=>{const list=[...(incoming||[])];if(!list.length||!brief?.id)return;setUploading(true);setNotice(null);const s=getSupabaseBrowserClient();const {data:{user}}=await s.auth.getUser();if(!user){setNotice({tone:"stop",text:"Your session ended. Sign in again, then upload."});setUploading(false);return;}let failures=0;for(const file of list){const path=`${user.id}/assets/${brief.id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"-")}`;const {error:uploadError}=await s.storage.from("portal-files").upload(path,file,{upsert:false});if(uploadError){failures++;console.error("Upload failed",uploadError);continue;}const {error:recordError}=await s.from("project_files").insert({brief_id:brief.id,client_id:user.id,name:file.name,file_name:file.name,storage_path:path,file_url:path,storage_bucket:"portal-files",mime_type:file.type||null,file_type:file.type||null,size_bytes:file.size,file_size:file.size,file_kind:"asset",category:categoryFor(file),uploaded_by:user.id,status:"uploaded"});if(recordError){failures++;console.error("File record failed",recordError);await s.storage.from("portal-files").remove([path]);}}
    setUploading(false);if(input.current)input.current.value="";setNotice(failures?{tone:"wait",text:`${list.length-failures} uploaded, ${failures} failed. Try the failed ones again.`}:{tone:"go",text:`${list.length} file${list.length===1?"":"s"} uploaded. MIlink can see ${list.length===1?"it":"them"} now.`});load();
  };
  const remove=async file=>{if(!window.confirm(`Delete ${file.file_name||file.name}? This cannot be undone.`))return;setFiles(current=>current.filter(item=>item.id!==file.id));const s=getSupabaseBrowserClient();const {error}=await s.from("project_files").delete().eq("id",file.id);if(error){setNotice({tone:"stop",text:error.message});load();return;}if(assetBucket(file)==="portal-files"&&assetPath(file))await s.storage.from("portal-files").remove([assetPath(file)]);setNotice({tone:"go",text:"File deleted."});};
  const downloadAll=async selectedFiles=>{if(!selectedFiles.length)return;setZipping(true);setProgress(0);setNotice(null);try{const [{default:JSZip},fileSaver]=await Promise.all([import("jszip"),import("file-saver")]);const zip=new JSZip();for(let index=0;index<selectedFiles.length;index++){const file=selectedFiles[index],path=assetPath(file);if(!path)continue;const {data,error}=await getSupabaseBrowserClient().storage.from(assetBucket(file)).createSignedUrl(path,600);if(error)throw error;const response=await fetch(data.signedUrl);if(!response.ok)throw new Error(`Could not download ${file.file_name||file.name}.`);zip.file(`${assetGroupLabel(file)||"File"}s/${file.file_name||file.name||`file-${index+1}`}`,await response.blob());setProgress(Math.round(((index+1)/selectedFiles.length)*85));}const archive=await zip.generateAsync({type:"blob"},metadata=>setProgress(85+Math.round(metadata.percent*.15)));const exportName=(brief.business_name||"milink-project").replace(/[^a-z0-9]+/gi,"-").replace(/(^-|-$)/g,"")||"milink-project";fileSaver.saveAs(archive,`${exportName}-files.zip`);}catch(error){console.error("ZIP failed",error);setNotice({tone:"stop",text:error.message||"Could not package these files."});}finally{setZipping(false);setProgress(0);}};
  const shown=files.filter(file=>(filter==="all"||assetKind(file)===filter)&&(!query||`${file.file_name||file.name||""} ${file.description||""}`.toLowerCase().includes(query.trim().toLowerCase())));
  if(!brief)return <Empty icon={FileText} title="Start your brief first" copy="Files are kept per project. Save your brief, then upload here."/>;
  const previewAsset=file=>{if(assetPreviewKind(file))setPreview(file);else openAsset(file).catch(error=>setNotice({tone:"stop",text:error.message}));};
  return <div className="d-page">
    <div className="d-page-head-row"><div className="d-page-head"><h2>Files</h2><p>Logos, photos, text and anything else for your website. Only you and MIlink can see them.</p></div>{files.length>0&&<button type="button" className="d-btn is-sm" disabled={zipping} onClick={()=>downloadAll(shown)}><Download size={15}/>{zipping?`Preparing ${progress}%`:`Download ${shown.length===files.length?"all":"shown"}`}</button>}</div>
    <ClientFileRequests brief={brief}/>
    <div className={cx("d-drop","is-large",drag&&"is-over")} onDragOver={event=>{event.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={event=>{event.preventDefault();setDrag(false);upload(event.dataTransfer.files)}}>
      <span className="d-row-icon is-brand"><Upload size={20}/></span>
      <span className="d-drop-text"><b>{uploading?"Uploading…":"Add files"}</b><small>Drop them here or choose from your device. Images, PDF, Word and ZIP all work.</small></span>
      <button type="button" className="d-btn is-primary" disabled={uploading} onClick={()=>input.current?.click()}>{uploading?"Uploading…":"Choose files"}</button>
      <input ref={input} hidden type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar,.7z,.svg,.ai,.eps,.psd" onChange={event=>upload(event.target.files)}/>
    </div>
    {notice&&<div className={cx("d-notice",`is-${notice.tone}`)} role="status">{notice.text}</div>}
    <BrandColorTokens colors={brief.brand_colors}/>
    <section className="d-panel">
      <div className="d-files-tools">
        <div className="d-segment" role="tablist" aria-label="File type">{assetTypeFilters.map(([value,label])=>{const count=files.filter(file=>value==="all"||assetKind(file)===value).length;return <button type="button" role="tab" key={value} aria-selected={filter===value} onClick={()=>setFilter(value)}>{label}<span className="d-num">{count}</span></button>;})}</div>
        {files.length>6&&<label className="d-search"><Search size={16}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search files" aria-label="Search files"/></label>}
      </div>
      {!loaded?<Loading label="Loading files…" compact/>:shown.length?<ul className="d-list">{shown.map(file=><li key={file.id} className="d-file-row">
        <button type="button" className="d-file-open" onClick={()=>previewAsset(file)} title={`Open ${file.file_name||file.name}`}><span className={cx("d-row-icon",assetKind(file)==="image"&&"is-brand")}>{assetIcon(file,18)}</span><span className="d-row-main"><b>{file.file_name||file.name}</b><small>{assetGroupLabel(file)} · {formatBytes(file.file_size??file.size_bytes)} · {new Date(file.created_at).toLocaleDateString(undefined,{month:"short",day:"numeric"})}</small>{file.description&&<small>{file.description}</small>}</span></button>
        <span className="d-file-actions"><button type="button" className="d-icon-button" aria-label={`Download ${file.file_name||file.name}`} onClick={async()=>{try{await openAsset(file,{download:true})}catch(error){setNotice({tone:"stop",text:error.message})}}}><Download size={17}/></button><button type="button" className="d-icon-button is-danger" aria-label={`Delete ${file.file_name||file.name}`} onClick={()=>remove(file)}><Trash2 size={17}/></button></span>
      </li>)}</ul>:<div className="d-empty"><FolderKanban size={24}/><b>{files.length?"Nothing matches":"No files yet"}</b><p>{files.length?"Try another type or search.":"Your logo is the most useful file to start with."}</p></div>}
    </section>
    {preview&&<AssetLightbox file={preview} onClose={()=>setPreview(null)}/>}
  </div>;
}
function ProjectRoute({status}){
  const stages=[["Brief","submitted"],["Review","reviewing"],["Proposal","proposal_sent"],["Build","in_progress"],["Your review","client_review"],["Launch","completed"]];
  const order=["draft","submitted","reviewing","proposal_sent","in_progress","client_review","completed"];
  const at=Math.max(0,order.indexOf(status||"draft"));
  const progress=at<=1?0:Math.min(1,(at-1)/(stages.length-1));
  return <div className="d-route" aria-label={`Project stage: ${stageLabel(status)}`}>
    <div className="d-route-track" aria-hidden="true"><i style={{transform:`scaleX(${progress})`}}/></div>
    <ol>{stages.map(([label,key],index)=>{const step=order.indexOf(key);const state=at>step||status==="completed"?"done":at===step?"current":"next";return <li key={key} className={`is-${state}`} aria-current={state==="current"?"step":undefined}><span className="d-route-stop">{state==="done"?<Check size={13}/>:index+1}</span><span className="d-route-label">{label}</span></li>;})}</ol>
  </div>;
}

function LatestMessage({go}){
  const [message,setMessage]=useState(null),[ready,setReady]=useState(false);
  useEffect(()=>{let active=true;const load=async()=>{const supabase=getSupabaseBrowserClient();if(!supabase)return;const {data:{user}}=await supabase.auth.getUser();if(!user)return;const {data}=await supabase.from("messages").select("id,content,sender_id,created_at,attachments").or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`).order("created_at",{ascending:false}).limit(1);if(active){setMessage(data?.[0]?{...data[0],mine:data[0].sender_id===user.id}:null);setReady(true);}};load();return()=>{active=false;};},[]);
  return <section className="d-panel">
    <div className="d-panel-head"><div><h3>Messages</h3><p>{message?`Last message ${relativeTime(message.created_at)}`:"Questions go straight to the MIlink team."}</p></div></div>
    <div className="d-panel-body">
      {ready&&message?<blockquote className="d-quote"><b>{message.mine?"You":"MIlink team"}</b><p>{message.content||"Sent an attachment."}</p></blockquote>:<p className="d-muted-text">{ready?"No messages yet. Ask anything about your project.":"Loading…"}</p>}
      <button type="button" className="d-btn is-block" onClick={()=>go?.("Messages")}><MessageCircle size={17}/>{message?"Open conversation":"Send a message"}</button>
    </div>
  </section>;
}

function assetGroupLabel(file){return {brand:"Brand",media:"Image",document:"Document",archive:"Archive",asset:"File",other:"File"}[assetCategoryKey(file.category||"")]||({image:"Image",document:"Document",archive:"Archive"}[assetKind(file)]);}
function BriefFacts({brief}){
  const list=value=>Array.isArray(value)&&value.length?value.join(", "):"";
  const hosting=hostingChoices.find(c=>c[2]===brief.domain_status&&c[3]===brief.hosting_status)?.[1]||[title(brief.domain_status||"not_sure"),title(brief.hosting_status||"not_sure")].join(" / ");
  const groups=[
    ["Business",[["Name",brief.business_name],["Industry",brief.industry],["What they do",brief.business_description],["Current website",brief.current_website,"link"]]],
    ["Website",[["Goals",list(brief.main_goals)],["Pages",list([...(brief.page_structure||[]),...(brief.custom_pages||[]).filter(page=>!(brief.page_structure||[]).includes(page))])],["Extras",list(brief.required_features)]]],
    ["Look",[["Style",brief.design_style],["Colours",list(brief.brand_colors)],["Sites they like",list(brief.reference_sites),"links"]]],
    ["Timing and budget",[["Budget",brief.budget_range],["Launch date",brief.target_launch_date],["Domain and hosting",hosting],["Notes",brief.additional_notes]]],
    ["Proposal",[["Price",brief.proposal_amount_cents?formatCad(brief.proposal_amount_cents):""],["Delivery",brief.proposal_delivery_days?`${brief.proposal_delivery_days} days`:""],["Scope",brief.proposal_summary]]]
  ];
  const link=value=>{const href=/^https?:\/\//i.test(value)?value:`https://${value}`;return <a href={href} target="_blank" rel="noreferrer">{value}</a>;};
  return <div className="d-stack">{groups.map(([heading,rows])=><section className="d-panel" key={heading}><div className="d-panel-head"><div><h3>{heading}</h3></div></div><dl className="d-deflist">{rows.map(([label,value,kind])=><div key={label}><dt>{label}</dt><dd className={!value?"is-empty":""}>{!value?"Not given":kind==="link"?link(value):kind==="links"?value.split(", ").map((item,index)=><Fragment key={item}>{index>0&&", "}{link(item)}</Fragment>):value}</dd></div>)}</dl></section>)}</div>;
}

function useProjectTodos(brief){
  const [todos,setTodos]=useState({files:[],approvals:[],contracts:[],loaded:false});
  const load=useCallback(async()=>{if(!brief?.id){setTodos({files:[],approvals:[],contracts:[],loaded:true});return;}const supabase=getSupabaseBrowserClient();if(!supabase)return;const [files,approvals,contracts]=await Promise.all([supabase.from("file_requests").select("id,title").eq("project_id",brief.id).eq("status","pending"),supabase.from("approvals").select("id,title").eq("project_id",brief.id).eq("status","pending"),supabase.from("contracts").select("id,title").eq("project_id",brief.id).eq("status","pending")]);setTodos({files:files.data||[],approvals:approvals.data||[],contracts:contracts.data||[],loaded:true});},[brief?.id]);
  useEffect(()=>{load();if(!brief?.id)return undefined;const supabase=getSupabaseBrowserClient();if(!supabase)return undefined;const channel=supabase.channel(`project-todos-${brief.id}`).on("postgres_changes",{event:"*",schema:"public",table:"file_requests",filter:`project_id=eq.${brief.id}`},load).on("postgres_changes",{event:"*",schema:"public",table:"approvals",filter:`project_id=eq.${brief.id}`},load).on("postgres_changes",{event:"*",schema:"public",table:"contracts",filter:`project_id=eq.${brief.id}`},load).subscribe();return()=>supabase.removeChannel(channel);},[brief?.id,load]);
  return todos;
}
function nextStepFor(brief,todos){
  const status=brief?.status||"draft";
  if(todos.contracts.length)return ["Sign your agreement","Read the scope and terms, then sign with your typed name.","Read and sign","Contracts"];
  if(paymentDue(brief))return ["Your payment is due",`${formatCad(brief.proposal_amount_cents)} for ${brief.business_name||"your website"}. Pay by card or Interac e-Transfer.`,"Pay now","Payments"];
  if(todos.approvals.length)return [todos.approvals.length===1?`“${todos.approvals[0].title}” is ready for you`:`${todos.approvals.length} items are ready for you`,"Take a look, then approve or tell us what to change.","Review now","Approvals"];
  if(todos.files.length)return [todos.files.length===1?`We need “${todos.files[0].title}”`:`We need ${todos.files.length} files from you`,"Send them when you can, or leave a note if you do not have them yet.","Send files","Assets"];
  return nextSteps[status]||nextSteps.in_progress;
}

function noteDay(value,now){const date=new Date(value),today=new Date(now);today.setHours(0,0,0,0);const diff=(today-new Date(date).setHours(0,0,0,0))/86400000;return diff<=0?"Today":diff===1?"Yesterday":"Earlier";}
function Empty({icon:Icon,title:heading,copy,action}){return <section className="d-panel d-empty"><Icon size={26}/><b>{heading}</b><p>{copy}</p>{action}</section>}
function Loading({label,compact}){if(compact)return <div className="d-skeleton-list" role="status" aria-label={label}>{[0,1,2].map(i=><div className="d-skeleton-row" key={i}><i className="d-sk is-icon"/><span><i className="d-sk" style={{width:`${62-i*12}%`}}/><i className="d-sk is-thin" style={{width:`${40-i*6}%`}}/></span></div>)}</div>;return <div className="d-page" role="status" aria-label={label}><div className="d-panel d-skeleton-hero"><i className="d-sk is-thin" style={{width:"22%"}}/><i className="d-sk is-title" style={{width:"58%"}}/><i className="d-sk" style={{width:"44%"}}/><i className="d-sk is-btn"/></div><div className="d-panel"><div className="d-skeleton-list">{[0,1].map(i=><div className="d-skeleton-row" key={i}><i className="d-sk is-icon"/><span><i className="d-sk" style={{width:"55%"}}/><i className="d-sk is-thin" style={{width:"35%"}}/></span></div>)}</div></div></div>}
