import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const ADMIN_EMAILS = new Set(["miladmo68@gmail.com", "info@milink.ca"]);

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/portal";
  if (!code) return NextResponse.redirect(`${origin}/portal?error=missing_auth_code`);

  const cookieStore = cookies();
  const response = NextResponse.redirect(`${origin}${next}`);
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (entries) => entries.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
    },
  });
  const { data: { user } } = await supabase.auth.exchangeCodeForSession(code);
  if (ADMIN_EMAILS.has(user?.email?.toLowerCase())) response.headers.set("x-milink-role", "admin");
  return response;
}
