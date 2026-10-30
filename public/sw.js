// MIlink workspace service worker: shows phone/desktop notifications sent by the server
// and opens the right page when one is tapped. It does not cache pages.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data && event.data.text() }; }
  const title = data.title || "MIlink";
  event.waitUntil(self.registration.showNotification(title, {
    body: data.body || "",
    icon: "/icon.png",
    badge: "/icon.png",
    tag: data.tag || undefined,
    data: { url: data.url || "/portal" },
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "/portal", self.location.origin).href;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of windows) {
      if (client.url.startsWith(self.location.origin) && "focus" in client) { await client.navigate(url).catch(() => {}); return client.focus(); }
    }
    return self.clients.openWindow(url);
  })());
});
