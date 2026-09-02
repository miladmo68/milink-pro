import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAILS = new Set(["miladmo68@gmail.com", "info@milink.ca"]);

/** Deletes one project brief and its project-scoped records only. Never deletes the client account. */
export async function POST(request) {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.replace(/^Bearer\s+/i, "");
  const briefId = (await request.json().catch(() => ({}))).briefId;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceKey) return NextResponse.json({ error: "Server deletion is not configured." }, { status: 503 });
  if (!token || !briefId) return NextResponse.json({ error: "Missing authorisation or project." }, { status: 400 });

  const callerClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: callerData, error: callerError } = await callerClient.auth.getUser(token);
  const callerEmail = callerData.user?.email?.toLowerCase();
  if (callerError || !callerEmail || !ADMIN_EMAILS.has(callerEmail)) return NextResponse.json({ error: "Only MIlink administrators can delete projects." }, { status: 403 });

  const adminClient = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: brief, error: briefError } = await adminClient
    .from("project_briefs")
    .select("id, client_id")
    .eq("id", briefId)
    .maybeSingle();
  if (briefError) return NextResponse.json({ error: "Could not locate this project." }, { status: 500 });
  if (!brief) return NextResponse.json({ error: "This project no longer exists." }, { status: 404 });

  // Database foreign keys cascade the project-scoped database records. Storage
  // objects do not cascade, so remove only paths owned by this exact brief first.
  const { data: projectFiles, error: filesError } = await adminClient
    .from("project_files")
    .select("storage_bucket, storage_path, file_url")
    .eq("brief_id", brief.id);
  if (filesError) return NextResponse.json({ error: "Could not prepare project files for deletion." }, { status: 500 });

  const filesByBucket = new Map();
  for (const file of projectFiles || []) {
    const bucket = file.storage_bucket || "portal-files";
    const path = file.storage_path || file.file_url;
    if (!path || /^https?:\/\//i.test(path)) continue;
    filesByBucket.set(bucket, [...(filesByBucket.get(bucket) || []), path]);
  }
  for (const [bucket, paths] of filesByBucket) {
    const { error: storageError } = await adminClient.storage.from(bucket).remove(paths);
    if (storageError) return NextResponse.json({ error: "Could not remove project files from storage." }, { status: 500 });
  }

  const { error: deleteError } = await adminClient.from("project_briefs").delete().eq("id", brief.id);
  if (deleteError) return NextResponse.json({ error: "Could not delete this project." }, { status: 500 });

  return NextResponse.json({ ok: true, clientId: brief.client_id });
}
