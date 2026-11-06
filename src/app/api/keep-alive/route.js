import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Keeps the Supabase free-tier project from auto-pausing. Supabase pauses
// free projects after 7 days without database activity, so Vercel Cron
// calls this route every 3 days (see vercel.json). Each run makes 3 tiny
// anonymous REST reads through the PostgREST gateway — real database
// queries, which is what Supabase counts as activity. No writes, no data
// is returned, and no user data is touched. Only Vercel Cron (CRON_SECRET
// bearer, same pattern as /api/notifications/send-digests) may call it.

const authorized = (request) => {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const bearer = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  return bearer === secret;
};

export async function GET(request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  let ok = 0;
  const errors = [];
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(`${url}/rest/v1/profiles?select=id&limit=1`, {
        headers: { apikey: anon, Authorization: `Bearer ${anon}` },
        cache: "no-store",
      });
      if (res.ok) ok += 1;
      else errors.push(res.status);
    } catch (e) {
      errors.push(String(e?.message || e).slice(0, 80));
    }
  }
  if (!ok) return NextResponse.json({ error: "Keep-alive queries failed.", errors }, { status: 500 });
  return NextResponse.json({ ok: true, queries: ok, at: new Date().toISOString() });
}
