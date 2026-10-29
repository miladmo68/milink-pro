// Daily reminders, run by the same Vercel cron as the email digests.
// A reminder goes out when something has waited too long, at most once every few days per item:
// each send is recorded in email_outbox (template "action_required", payload.reminder = key).
import { getAppUrl, renderEmailTemplate, renderPlainText, sendWithSmtp } from "./transactionalEmail";

const DAY = 86400000;
const money = (cents) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format((Number(cents) || 0) / 100);
const PAY_DUE_STAGES = ["proposal_sent", "in_progress", "client_review", "completed"];

export async function sendReminders({ supabase, adminEmails, now = new Date() }) {
  const portal = `${getAppUrl()}/portal`, adminUrl = `${getAppUrl()}/admin`;
  const older = (days) => new Date(now.getTime() - days * DAY).toISOString();
  const result = { sent: 0, skipped: 0, failed: 0 };

  const { data: recent } = await supabase.from("email_outbox").select("payload,created_at").eq("template", "action_required").gte("created_at", older(3));
  const sentKeys = new Set((recent || []).map((row) => row.payload?.reminder).filter(Boolean));
  const { data: profiles } = await supabase.from("profiles").select("id,email,full_name,notification_email_mode");
  const byId = new Map((profiles || []).map((profile) => [profile.id, profile]));

  const queue = [];
  const toClient = (clientId, key, subject, details) => {
    const profile = byId.get(clientId);
    if (!profile?.email || profile.notification_email_mode === "off") return;
    queue.push({ key, recipientId: clientId, to: profile.email, subject, details: { senderName: "MiLink Team", metadata: [], ...details } });
  };

  const [contracts, approvals, requests, briefs] = await Promise.all([
    supabase.from("contracts").select("id,title,created_at,project_briefs(client_id,business_name)").eq("status", "pending").lte("created_at", older(3)),
    supabase.from("approvals").select("id,title,client_id,created_at,project_briefs(business_name)").eq("status", "pending").lte("created_at", older(3)),
    supabase.from("file_requests").select("id,title,client_id,created_at,project_briefs(business_name)").eq("status", "pending").lte("created_at", older(4)),
    supabase.from("project_briefs").select("id,client_id,business_name,status,payment_status,proposal_amount_cents,updated_at"),
  ]);

  for (const item of contracts.data || []) toClient(item.project_briefs?.client_id, `contract:${item.id}`, `Reminder: your agreement is waiting`, { heading: "Your agreement is still waiting for you.", copy: `“${item.title}” for ${item.project_briefs?.business_name || "your website"} needs your signature before we can continue.`, buttonLabel: "Read and sign", href: `${portal}?tab=contracts` });
  for (const item of approvals.data || []) toClient(item.client_id, `approval:${item.id}`, `Reminder: “${item.title}” is waiting for your approval`, { heading: "Something is still waiting for your approval.", copy: `Take a look at “${item.title}” for ${item.project_briefs?.business_name || "your website"}, then approve it or tell us what to change.`, buttonLabel: "Review it", href: `${portal}?tab=approvals` });
  for (const item of requests.data || []) toClient(item.client_id, `file:${item.id}`, `Reminder: we still need “${item.title}”`, { heading: "We still need a file from you.", copy: `To keep ${item.project_briefs?.business_name || "your website"} on schedule we need “${item.title}”. If you do not have it, reply with a note.`, buttonLabel: "Send the file", href: `${portal}?tab=assets` });
  for (const brief of briefs.data || []) {
    const waiting = new Date(brief.updated_at || 0).getTime() < now.getTime() - 5 * DAY;
    if (waiting && Number(brief.proposal_amount_cents) > 0 && PAY_DUE_STAGES.includes(brief.status) && !["paid", "approved", "e_transfer_submitted", "pending_review"].includes(brief.payment_status)) {
      toClient(brief.client_id, `payment:${brief.id}`, `Reminder: payment for ${brief.business_name || "your website"}`, { heading: "Your payment is still open.", copy: `${money(brief.proposal_amount_cents)} for ${brief.business_name || "your website"}. You can pay by card or Interac e-Transfer.`, buttonLabel: "Pay now", href: `${portal}?tab=payments` });
    }
  }
  // The admin hears about briefs that have waited two days for a proposal.
  const stale = (briefs.data || []).filter((brief) => ["submitted", "reviewing"].includes(brief.status) && new Date(brief.updated_at || 0).getTime() < now.getTime() - 2 * DAY);
  if (stale.length) {
    const key = `admin-briefs:${now.toISOString().slice(0, 10)}`;
    for (const email of adminEmails) queue.push({ key, to: email, subject: `${stale.length} brief${stale.length === 1 ? "" : "s"} waiting for a proposal`, details: { heading: "Briefs are waiting for a proposal.", copy: stale.map((brief) => brief.business_name || "Untitled project").join(", "), buttonLabel: "Open Today", href: adminUrl, eyebrow: "MiLink Operations", metadata: [] } });
  }

  const done = new Set();
  for (const item of queue) {
    if (sentKeys.has(item.key) && !done.has(item.key)) { result.skipped += 1; continue; }
    try {
      await sendWithSmtp({ to: item.to, subject: item.subject, html: renderEmailTemplate(item.details), text: renderPlainText(item.details) });
      if (!done.has(item.key)) await supabase.from("email_outbox").insert({ recipient_id: item.recipientId || null, template: "action_required", payload: { reminder: item.key }, status: "sent", sent_at: now.toISOString() });
      done.add(item.key);
      result.sent += 1;
    } catch (error) {
      result.failed += 1;
      console.error(`Reminder failed (${item.key})`, error);
    }
  }
  return result;
}
