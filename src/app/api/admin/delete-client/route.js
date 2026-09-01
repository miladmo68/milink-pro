import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAILS = new Set(["miladmo68@gmail.com", "info@milink.ca"]);

export async function POST(request) {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.replace(/^Bearer\s+/i, "");
  const clientId = (await request.json().catch(() => ({}))).clientId;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceKey) return NextResponse.json({ error: "Server deletion is not configured." }, { status: 503 });
  if (!token || !clientId) return NextResponse.json({ error: "Missing authorisation or client." }, { status: 400 });

  const callerClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: callerData, error: callerError } = await callerClient.auth.getUser(token);
  const callerEmail = callerData.user?.email?.toLowerCase();
  if (callerError || !callerEmail || !ADMIN_EMAILS.has(callerEmail)) return NextResponse.json({ error: "Only MIlink administrators can delete clients." }, { status: 403 });

  const adminClient = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: targetData, error: targetError } = await adminClient.auth.admin.getUserById(clientId);
  if (targetError || !targetData.user) return NextResponse.json({ error: "Client account was not found." }, { status: 404 });
  if (ADMIN_EMAILS.has(targetData.user.email?.toLowerCase())) return NextResponse.json({ error: "Administrator accounts cannot be deleted here." }, { status: 403 });

  // Auth deletion cascades through the profile foreign keys. Storage objects do
  // not participate in PostgreSQL cascades, so remove them explicitly first.
  const { data: projectFiles, error: filesError } = await adminClient
    .from("project_files")
    .select("storage_bucket, storage_path, file_url")
    .eq("client_id", clientId);
  if (filesError) return NextResponse.json({ error: `Could not prepare client files for deletion: ${filesError.message}` }, { status: 500 });

  const filesByBucket = new Map();
  for (const file of projectFiles || []) {
    const bucket = file.storage_bucket || "portal-files";
    const path = file.storage_path || file.file_url;
    if (!path || /^https?:\/\//i.test(path)) continue;
    filesByBucket.set(bucket, [...(filesByBucket.get(bucket) || []), path]);
  }
  for (const [bucket, paths] of filesByBucket) {
    const { error: storageError } = await adminClient.storage.from(bucket).remove(paths);
    if (storageError) return NextResponse.json({ error: `Could not remove client files: ${storageError.message}` }, { status: 500 });
  }

  // Explicit deletes make cleanup deterministic even where an older migration
  // does not yet have every foreign-key cascade. Missing relationships are not
  // silently ignored; auth deletion only happens after a clean data cleanup.
  const cleanups = [
    adminClient.from("messages").delete().or(`sender_id.eq.${clientId},recipient_id.eq.${clientId}`),
    adminClient.from("notifications").delete().or(`sender_id.eq.${clientId},recipient_id.eq.${clientId}`),
    adminClient.from("file_requests").delete().eq("client_id", clientId),
    adminClient.from("project_files").delete().eq("client_id", clientId),
    adminClient.from("project_briefs").delete().eq("client_id", clientId),
    adminClient.from("projects").delete().eq("client_id", clientId),
  ];
  const cleanupResults = await Promise.all(cleanups);
  const cleanupFailure = cleanupResults.find(({ error }) => error);
  if (cleanupFailure?.error) return NextResponse.json({ error: `Could not remove client data: ${cleanupFailure.error.message}` }, { status: 500 });

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(clientId);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
