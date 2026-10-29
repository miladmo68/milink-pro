import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { compileNotificationDigest, composeNotificationDigest, isDigestDue } from "../../../../lib/notificationDigest";
import { sendWithSmtp } from "../../../../lib/transactionalEmail";
import { sendReminders } from "../../../../lib/reminders";
import { ADMIN_EMAILS } from "../../../../config/admins.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const authorized = (request) => {
  const secret = process.env.NOTIFICATION_DIGEST_SECRET || process.env.CRON_SECRET;
  if (!secret) return false;
  const bearer = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  return bearer === secret || request.headers.get("x-notification-digest-secret") === secret;
};

async function processDigests(request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) return NextResponse.json({ error: "Digest service is not configured." }, { status: 503 });
  const supabase = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
  const now = new Date();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id,email,full_name,role,notification_email_mode,last_digest_sent_at")
    .in("notification_email_mode", ["daily_digest", "weekly_digest"]);
  if (error) {
    console.error("Notification digest profile lookup failed", error);
    return NextResponse.json({ error: "Unable to prepare notification digests." }, { status: 500 });
  }
  const result = { processed: 0, sent: 0, skipped: 0, failed: 0 };
  for (const profile of profiles || []) {
    if (!profile.email || !isDigestDue(profile, now)) { result.skipped += 1; continue; }
    try {
      const digest = await compileNotificationDigest({ supabase, profile, now });
      if (!digest.notifications.length) { result.skipped += 1; continue; }
      const previous = profile.last_digest_sent_at;
      let claim = supabase.from("profiles").update({ last_digest_sent_at: now.toISOString() }).eq("id", profile.id);
      claim = previous ? claim.eq("last_digest_sent_at", previous) : claim.is("last_digest_sent_at", null);
      const { data: claimed, error: claimError } = await claim.select("id");
      if (claimError || !claimed?.length) { result.skipped += 1; continue; }
      result.processed += 1;
      const email = composeNotificationDigest({ profile, digest });
      await sendWithSmtp({ to: profile.email, ...email });
      result.sent += 1;
    } catch (digestError) {
      result.failed += 1;
      console.error(`Notification digest failed for profile ${profile.id}`, digestError);
    }
  }
  let reminders = { sent: 0, skipped: 0, failed: 0 };
  try { reminders = await sendReminders({ supabase, adminEmails: (process.env.TO_EMAIL || ADMIN_EMAILS.join(",")).split(",").map((email) => email.trim()).filter(Boolean), now }); }
  catch (reminderError) { console.error("Reminders failed", reminderError); }
  return NextResponse.json({ ok: true, ...result, reminders });
}

// Vercel Cron invokes GET; POST is available for a trusted scheduler or manual job.
export async function GET(request) { return processDigests(request); }
export async function POST(request) { return processDigests(request); }
