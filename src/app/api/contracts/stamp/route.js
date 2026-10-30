import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/**
 * Records the signer's IP address on a contract the caller just signed.
 * The client signs through the normal database update (guarded by a trigger); this route only adds
 * the IP, once, for evidence of the electronic signature. Clients cannot write ip_address themselves.
 */
export async function POST(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anon || !service) return NextResponse.json({ error: "Not configured." }, { status: 503 });
  const token = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const contractId = (await request.json().catch(() => ({}))).contractId;
  if (!token || !/^[0-9a-f-]{36}$/i.test(String(contractId || ""))) return NextResponse.json({ error: "Missing contract." }, { status: 400 });

  const viewer = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: auth } = await viewer.auth.getUser(token);
  if (!auth?.user) return NextResponse.json({ error: "Sign in again." }, { status: 401 });

  const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: contract } = await admin.from("contracts").select("id,status,ip_address,signed_at,project_briefs(client_id)").eq("id", contractId).maybeSingle();
  if (!contract || contract.project_briefs?.client_id !== auth.user.id) return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  if (contract.status !== "signed" || contract.ip_address) return NextResponse.json({ ok: true, skipped: true });
  // Only stamp a signature made in the last 10 minutes, so an old contract cannot be stamped later from elsewhere.
  if (!contract.signed_at || Date.now() - new Date(contract.signed_at).getTime() > 10 * 60 * 1000) return NextResponse.json({ ok: true, skipped: true });

  const forwarded = request.headers.get("x-forwarded-for") || "";
  const ip = (forwarded.split(",")[0] || request.headers.get("x-real-ip") || "").trim();
  if (!/^[0-9a-f:.]{3,45}$/i.test(ip)) return NextResponse.json({ ok: true, skipped: true });
  const { error } = await admin.from("contracts").update({ ip_address: ip }).eq("id", contractId).is("ip_address", null);
  if (error) return NextResponse.json({ error: "Could not record the signature details." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
