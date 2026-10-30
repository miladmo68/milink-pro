import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// Anonymous, cookieless visit counter for the public site (see supabase/site_analytics_v1.sql).
// Stores the page, the referring site, a per-tab visit id, the device type and the country only.
const KINDS = new Set(["pageview", "contact_submit", "whatsapp_click", "portal_signup"]);
const BOTS = /bot|crawl|spider|slurp|lighthouse|headless|preview|facebookexternalhit|embedly|monitor/i;
const recent = new Map();

export async function POST(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return new NextResponse(null, { status: 204 });
  const ua = request.headers.get("user-agent") || "";
  if (BOTS.test(ua)) return new NextResponse(null, { status: 204 });
  const body = await request.json().catch(() => null);
  if (!body || !KINDS.has(body.k)) return new NextResponse(null, { status: 204 });

  // Light rate limit per visit id so a stuck tab cannot flood the table.
  const visit = String(body.v || "").slice(0, 40);
  const now = Date.now(), last = recent.get(visit) || [];
  const window = last.filter((t) => now - t < 60000);
  if (window.length > 30) return new NextResponse(null, { status: 204 });
  recent.set(visit, [...window, now]);
  if (recent.size > 5000) recent.clear();

  const path = String(body.p || "/").split("?")[0].slice(0, 120);
  if (body.k === "pageview" && /^\/(portal|admin|api|auth)/.test(path)) return new NextResponse(null, { status: 204 });
  let referrer = null;
  try { const host = new URL(String(body.r || "")).hostname.replace(/^www\./, ""); if (host && !host.endsWith("milink.ca") && host !== "localhost") referrer = host.slice(0, 80); } catch { /* no referrer */ }
  const device = /iPad|Tablet/i.test(ua) ? "tablet" : /Mobi|Android|iPhone/i.test(ua) ? "mobile" : "desktop";
  const country = (request.headers.get("x-vercel-ip-country") || "").slice(0, 2) || null;

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await supabase.from("site_events").insert({ kind: body.k, path, referrer_host: referrer, visit_id: visit || null, device, country });
  if (error && !/site_events/.test(error.message)) console.warn("track insert failed", error.message);
  return new NextResponse(null, { status: 204 });
}
