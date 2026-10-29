"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SecureAccess from "../../components/auth/SecureAccess";
import { AdminExperience } from "../../components/portal/PortalExperience";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";
import { isAdminEmail, isAdminRole } from "../../config/admins.js";

// /admin: the sign-in form until the visitor is an administrator, then the workspace.
export default function AdminPortal() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return undefined;
    // Access comes from the profile role (the same rule the API routes and the
    // database policies use); the owner emails stay as the bootstrap admins.
    // It is re-checked on every sign-in, so the workspace opens right after the
    // login form without a manual refresh.
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) { if (mounted) setAuthenticated(false); return; }
      let allowed = isAdminEmail(user.email);
      if (!allowed) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
        allowed = isAdminRole(profile?.role);
      }
      if (mounted && allowed) setAuthenticated(true);
    };
    check();
    const { data: listener } = supabase.auth.onAuthStateChange((event) => { if (event === "SIGNED_IN") check(); });
    return () => { mounted = false; listener?.subscription?.unsubscribe(); };
  }, []);

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase?.auth.signOut();
    setAuthenticated(false);
    router.replace("/");
  }

  if (!authenticated) return <SecureAccess area="admin" />;
  return <AdminExperience onSignOut={handleSignOut} />;
}
