"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/dashboard.css";
import SecureAccess from "../../components/auth/SecureAccess";
import { ClientExperience } from "../../components/portal/PortalExperience";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";
import { isAdminEmail, isAdminRole } from "../../config/admins.js";

// /portal: the sign-in form until the visitor is signed in, then the client workspace.
// Administrators who open /portal are sent to /admin.
export default function ClientPortal() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [authNotice, setAuthNotice] = useState("");

  useEffect(() => {
    let mounted = true;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return undefined;
    const applyUser = async (user) => {
      if (!mounted || !user) return;
      let admin = isAdminEmail(user.email);
      if (!admin) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
        admin = isAdminRole(profile?.role);
      }
      if (!mounted) return;
      if (admin) router.replace("/admin");
      else setAuthenticated(true);
    };
    if (new URLSearchParams(window.location.search).get("verified") === "true") setAuthNotice("Email verified successfully. Sign in to access your workspace.");
    supabase.auth.getUser().then(({ data }) => applyUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (["SIGNED_IN", "TOKEN_REFRESHED", "USER_UPDATED"].includes(event)) applyUser(session?.user);
      if (event === "SIGNED_OUT" && mounted) setAuthenticated(false);
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, [router]);

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase?.auth.signOut();
    setAuthenticated(false);
    router.replace("/");
  }

  if (!authenticated) return <SecureAccess area="client" initialNotice={authNotice} />;
  return <ClientExperience onSignOut={handleSignOut} />;
}
