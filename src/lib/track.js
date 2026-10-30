// Sends one anonymous event to /api/track without cookies (see supabase/site_analytics_v1.sql).
// The visit id lives in sessionStorage, so it ends when the tab closes. Respects Do Not Track.
export function track(kind) {
  if (typeof window === "undefined") return;
  try {
    if (navigator.doNotTrack === "1" || window.doNotTrack === "1") return;
    let visit = sessionStorage.getItem("mk-visit");
    if (!visit) { visit = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem("mk-visit", visit); }
    const payload = JSON.stringify({ k: kind, p: location.pathname, r: document.referrer, v: visit });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
    else fetch("/api/track", { method: "POST", body: payload, headers: { "content-type": "application/json" }, keepalive: true });
  } catch { /* analytics must never break the page */ }
}
