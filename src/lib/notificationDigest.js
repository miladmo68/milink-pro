import { getAppUrl, renderEmailTemplate, renderPlainText } from "./transactionalEmail";

export const notificationEmailModes = ["instant", "daily_digest", "weekly_digest", "off"];

export function normalizeNotificationEmailMode(value) {
  return notificationEmailModes.includes(value) ? value : "instant";
}

export function digestIntervalMs(mode) {
  return mode === "weekly_digest" ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
}

export function isDigestDue(profile, now = new Date()) {
  const mode = normalizeNotificationEmailMode(profile?.notification_email_mode);
  if (mode !== "daily_digest" && mode !== "weekly_digest") return false;
  const lastSent = profile?.last_digest_sent_at ? new Date(profile.last_digest_sent_at).getTime() : 0;
  return !Number.isFinite(lastSent) || now.getTime() - lastSent >= digestIntervalMs(mode);
}

const toAbsoluteHref = (href, fallback) => {
  if (!href) return fallback;
  if (!/^https?:\/\//i.test(href)) return `${getAppUrl()}${href.startsWith("/") ? href : `/${href}`}`;

  // Notifications created before a deployment can contain an absolute local
  // development URL. Rebase those internal links onto the canonical email URL
  // so digest recipients never receive a localhost link from production.
  try {
    const parsed = new URL(href);
    if (["localhost", "127.0.0.1"].includes(parsed.hostname)) {
      return `${getAppUrl()}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
    return parsed.toString();
  } catch {
    return fallback;
  }
};

export async function compileNotificationDigest({ supabase, profile, now = new Date() }) {
  const mode = normalizeNotificationEmailMode(profile?.notification_email_mode);
  const fallbackHref = `${getAppUrl()}${["admin", "super_admin"].includes(profile?.role) ? "/admin" : "/portal"}`;
  const windowStart = profile?.last_digest_sent_at
    ? new Date(profile.last_digest_sent_at)
    : new Date(now.getTime() - digestIntervalMs(mode));
  const { data, error } = await supabase
    .from("notifications")
    .select("id,title,message,link,href,type,created_at,is_read")
    .eq("recipient_id", profile.id)
    .gt("created_at", windowStart.toISOString())
    .lte("created_at", now.toISOString())
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) throw error;
  const items = (data || []).map((notification) => ({
    title: notification.title || "MiLink update",
    message: notification.message || "Open your workspace to review this update.",
    href: toAbsoluteHref(notification.href || notification.link, fallbackHref),
  }));
  return { mode, windowStart, notifications: data || [], items, fallbackHref };
}

export function composeNotificationDigest({ profile, digest }) {
  const cadence = digest.mode === "weekly_digest" ? "weekly" : "daily";
  const count = digest.items.length;
  const heading = `${count} new ${count === 1 ? "update" : "updates"} in your MiLink workspace`;
  const copy = `Here is your ${cadence} MiLink summary. Review the updates below whenever you are ready.`;
  const details = { heading, copy, buttonLabel: "Open your workspace", href: digest.fallbackHref, eyebrow: `MiLink ${cadence} digest`, metadata: [["Updates", count], ["Delivery", `${cadence[0].toUpperCase()}${cadence.slice(1)} digest`]], items: digest.items };
  return { subject: `${count} MiLink ${count === 1 ? "update" : "updates"} · ${cadence === "weekly" ? "Weekly" : "Daily"} digest`, html: renderEmailTemplate(details), text: renderPlainText(details) };
}
