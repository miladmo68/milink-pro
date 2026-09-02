import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const ADMIN_EMAILS = new Set(["miladmo68@gmail.com", "info@milink.ca"]);
const safeDestination = (next) => next?.startsWith("/") && !next.startsWith("//") ? next : "/portal";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || requestUrl.host;
  const isLocal = host?.includes("localhost") || host?.includes("127.0.0.1");
  const origin = isLocal ? "http://localhost:3000" : "https://milink.ca";
  const code = searchParams.get("code");
  const requestedDestination = searchParams.get("next");
  if (!code) return NextResponse.redirect(`${origin}/portal?error=auth_failed`);

  const cookieStore = cookies();
  const response = NextResponse.redirect(`${origin}/portal?error=auth_failed`);
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (entries) => entries.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
    },
  });

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) return response;

  let role = "client";
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();
  if (profile?.role) role = profile.role;

  const isAdmin = ["admin", "super_admin"].includes(role)
    || ADMIN_EMAILS.has(data.user.email?.toLowerCase());
  // `next` is optional because Supabase redirect URLs are registered without
  // query strings. If no safe destination was supplied, route by account role.
  const destination = requestedDestination
    ? safeDestination(requestedDestination)
    : (isAdmin ? "/admin" : "/portal");

  response.headers.set("location", `${origin}${destination}`);
  response.headers.set("x-milink-role", isAdmin ? "admin" : "client");
  return response;
}
