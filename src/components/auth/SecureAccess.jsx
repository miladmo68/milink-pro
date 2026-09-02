"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";

const ADMIN_EMAILS = new Set(["miladmo68@gmail.com", "info@milink.ca"]);
const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
};

export default function SecureAccess({ area = "client", initialNotice = "" }) {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState(initialNotice);
  const [busy, setBusy] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const isAdmin = area === "admin";

  const portalVerificationRedirect = () => `${getBaseUrl()}/auth/callback?next=/portal`;

  async function submit(event) {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (area === "client" && ADMIN_EMAILS.has(normalized)) { router.replace("/admin"); return; }
    if (isAdmin && !ADMIN_EMAILS.has(normalized)) { setNotice("This email is not authorised for the MIlink admin workspace."); return; }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setNotice("Secure sign-in needs Supabase keys. Add them to .env.local before using accounts in production."); return; }
    setBusy(true); setNotice("");
    const redirectTo = `${getBaseUrl()}/auth/callback?next=${isAdmin ? "/admin" : "/portal"}`;
    const result = mode === "create"
      ? await supabase.auth.signUp({ email: normalized, password, options: { emailRedirectTo: portalVerificationRedirect() } })
      : await supabase.auth.signInWithPassword({ email: normalized, password });
    setBusy(false);
    if (result.error) {
      const message = result.error.message?.toLowerCase() || "";
      setNotice(message.includes("email not confirmed") ? "Please verify your email before logging in. Use the resend link below if you need a new verification email." : result.error.message);
      return;
    }
    if (mode === "create") {
      // With email confirmation enabled, Supabase returns no session. Keep the
      // account out of the workspace until the email link has been opened.
      if (!result.data.session || result.data.user?.identities?.some((identity) => identity.identity_data?.email === normalized)) setVerificationSent(true);
      else setNotice("Account created. Please verify your email before accessing your workspace.");
      return;
    }
    else router.replace(isAdmin ? "/admin" : "/portal");
  }

  async function resendVerification() {
    const normalized = email.trim().toLowerCase();
    if (!normalized) { setNotice("Enter your email address first, then request a verification link."); return; }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setNotice("Supabase needs to be configured before verification emails can be sent."); return; }
    setBusy(true); setNotice("");
    const { error } = await supabase.auth.resend({ type: "signup", email: normalized, options: { emailRedirectTo: portalVerificationRedirect() } });
    setBusy(false); setNotice(error ? error.message : "A fresh verification link has been sent to your email.");
  }

  async function google() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setNotice("Google sign-in will activate after Supabase is connected."); return; }
    const redirectTo = `${getBaseUrl()}/auth/callback?next=${isAdmin ? "/admin" : "/portal"}`;
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
    if (error) setNotice(error.message);
  }

  return <main className="portal-shell portal-frame grid min-h-screen place-items-center p-4 text-slate-100"><div className="grid w-full max-w-5xl overflow-hidden rounded-[30px] border border-white/10 bg-[#0b192c] shadow-2xl shadow-slate-950/40 lg:grid-cols-[.9fr_1.1fr]"><section className="hidden bg-[#202d3e] p-10 lg:block"><Link href="/" className="inline-flex"><img src="/Logo-White.png" alt="MIlink" className="h-9 w-auto" /></Link><div className="mt-28"><span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold tracking-wider text-[#a6e8ed]">{isAdmin ? "PRIVATE ADMIN" : "CLIENT PORTAL"}</span><h1 className="mt-5 text-4xl font-extrabold leading-tight">{isAdmin ? "Control your MIlink workspace." : "A clearer way to build your website."}</h1><p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">Secure, private and purpose-built for the next step in every project.</p></div><div className="mt-16 flex gap-3 text-xs text-[#a6e8ed]"><ShieldCheck size={16}/> Role-based access</div></section><section className="p-6 sm:p-10">{verificationSent ? <div className="py-8 sm:py-14"><span className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 text-[#a6e8ed]"><Mail size={22}/></span><p className="mt-7 text-sm font-semibold text-[#a6e8ed]">Check your inbox</p><h2 className="mt-2 text-3xl font-extrabold">Verify your email to continue.</h2><p className="mt-4 max-w-md text-sm leading-7 text-slate-400">We sent a secure verification link to <b className="text-slate-200">{email}</b>. Please open it before accessing your private MIlink workspace.</p><button type="button" disabled={busy} onClick={resendVerification} className="mt-7 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-[#a6e8ed] hover:bg-white/[.05]">{busy ? "Sending…" : "Resend verification email"}<ArrowRight size={16}/></button><button type="button" onClick={()=>{setVerificationSent(false);setMode("login")}} className="ml-3 mt-7 text-sm font-semibold text-slate-400 hover:text-white">Back to sign in</button>{notice&&<div className="mt-5 flex gap-2 rounded-xl border border-[#a6e8ed]/20 bg-[#a6e8ed]/10 p-3 text-xs leading-5 text-slate-200"><CheckCircle2 size={16} className="shrink-0 text-[#a6e8ed]"/>{notice}</div>}</div> : <><p className="text-sm font-semibold text-[#a6e8ed]">{isAdmin ? "MIlink private workspace" : mode === "login" ? "Welcome back" : "Start your project"}</p><h2 className="mt-2 text-3xl font-extrabold">{isAdmin ? "Admin sign in" : mode === "login" ? "Sign in to your portal" : "Create your account"}</h2><p className="mt-3 text-sm leading-6 text-slate-400">{isAdmin ? "Only authorised MIlink administrators can enter." : "Your project, files and messages will remain private to your account."}</p><button type="button" onClick={google} className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[.05] px-4 py-3.5 text-sm font-bold hover:bg-white/[.1]"><span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[11px] font-black text-slate-700">G</span> Continue with Google</button><div className="my-6 flex items-center gap-3 text-xs text-slate-500"><span className="h-px flex-1 bg-white/10"/>or continue with email<span className="h-px flex-1 bg-white/10"/></div><form onSubmit={submit}><label className="text-xs font-bold text-slate-300">Email address</label><input required value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder={isAdmin ? "miladmo68@gmail.com" : "you@company.com"} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3.5 text-sm outline-none focus:border-[#a6e8ed]"/><div className="mt-4 flex items-center justify-between"><label className="text-xs font-bold text-slate-300">Password</label>{!isAdmin&&mode==="login"&&<Link href="/forgot-password" className="text-xs font-semibold text-[#a6e8ed] hover:text-white">Forgot password?</Link>}</div><input required minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="At least 8 characters" className="mt-2 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3.5 text-sm outline-none focus:border-[#a6e8ed]"/><button disabled={busy} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#a6e8ed] py-3.5 text-sm font-bold text-[#101827] disabled:opacity-50">{busy ? "Please wait…" : mode === "create" ? "Create secure account" : "Sign in"}<ArrowRight size={17}/></button></form>{notice && <div className="mt-4 flex gap-2 rounded-xl border border-[#a6e8ed]/20 bg-[#a6e8ed]/10 p-3 text-xs leading-5 text-slate-200"><CheckCircle2 size={16} className="shrink-0 text-[#a6e8ed]"/>{notice}</div>}{!isAdmin && mode==="login" && notice.toLowerCase().includes("verify your email")&&<button type="button" disabled={busy} onClick={resendVerification} className="mt-3 text-xs font-semibold text-[#a6e8ed] hover:text-white">Resend verification link</button>}{!isAdmin && <p className="mt-6 text-center text-sm text-slate-400">{mode === "login" ? "New to MIlink?" : "Already have an account?"} <button type="button" onClick={() => {setMode(mode === "login" ? "create" : "login");setNotice("")}} className="font-bold text-[#a6e8ed]">{mode === "login" ? "Create an account" : "Sign in"}</button></p>}<div className="mt-5 flex items-center justify-center gap-3 text-xs"><Link href={isAdmin ? "/portal" : "/admin"} className="font-semibold text-[#a6e8ed]">{isAdmin ? "Client sign in" : "Admin sign in"}</Link><span className="h-3 w-px bg-white/15"/><a href="mailto:info@milink.ca?subject=MIlink%20Portal%20Support" className="font-semibold text-[#a6e8ed]">Contact Us</a></div></>}</section></div></main>;
}
