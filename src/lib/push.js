// Server-side web push (phone and desktop notifications). Needs NEXT_PUBLIC_VAPID_PUBLIC_KEY,
// VAPID_PRIVATE_KEY and VAPID_SUBJECT; without them it does nothing.
import webpush from "web-push";

let configured = null;
function ready() {
  if (configured !== null) return configured;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY, privateKey = process.env.VAPID_PRIVATE_KEY;
  configured = Boolean(publicKey && privateKey);
  if (configured) webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:info@milink.ca", publicKey, privateKey);
  return configured;
}

/** Sends one notification to every device the given profiles turned notifications on for. */
export async function sendPush(supabase, userIds, { title, body, url, tag }) {
  const ids = [...new Set(userIds.filter(Boolean))];
  if (!ready() || !ids.length) return { sent: 0 };
  const { data: subscriptions, error } = await supabase.from("push_subscriptions").select("id,endpoint,p256dh,auth").in("user_id", ids);
  if (error || !subscriptions?.length) return { sent: 0 };
  const payload = JSON.stringify({ title, body: String(body || "").slice(0, 180), url, tag });
  let sent = 0;
  await Promise.all(subscriptions.map(async (row) => {
    try {
      await webpush.sendNotification({ endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } }, payload, { TTL: 86400 });
      sent += 1;
    } catch (pushError) {
      // The browser removed this subscription (uninstalled, permission revoked): forget it.
      if (pushError.statusCode === 404 || pushError.statusCode === 410) await supabase.from("push_subscriptions").delete().eq("id", row.id);
      else console.warn("Push failed", pushError.statusCode, pushError.body);
    }
  }));
  return { sent };
}
