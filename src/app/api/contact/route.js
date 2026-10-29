import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { randomUUID } from "crypto";
import { getAppUrl } from "../../../lib/transactionalEmail";

const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[character]));
const sentAt = () => new Intl.DateTimeFormat("en-CA", { month:"short", day:"numeric", year:"numeric", hour:"numeric", minute:"2-digit", timeZone:"America/Toronto", timeZoneName:"short" }).format(new Date());
const PACKAGE_OPTIONS = new Set(["Essential", "Professional", "E-commerce & Custom"]);
const PROJECT_TYPES = new Set(["Business website", "Online store", "Redesign", "SEO & speed", "Branding", "Not sure yet"]);

// ── Abuse protection (server-side: the browser can be bypassed) ────────────
// Honeypot + minimum fill time + per-IP rate limit + strict validation, and an
// optional Cloudflare Turnstile check that switches on when
// TURNSTILE_SECRET_KEY is set. The rate limiter is in memory, so on serverless
// it is per instance: a best-effort brake, not a guarantee.
const MAX_BODY_CHARS = 12000;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MIN_FILL_MS = 2500;
const MAX_FILL_MS = 24 * 60 * 60 * 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[0-9+()\-.\s]{7,30}$/;
const rateBuckets = new Map();

const clean = (value, max) =>
  typeof value === "string" ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : "";
const cleanLine = (value, max) => clean(value, max).replace(/[\r\n]+/g, " ");

function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return (forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip")) || "unknown";
}

/** Returns 0 when allowed, otherwise the seconds until the caller may retry. */
function retryAfterSeconds(ip) {
  const now = Date.now();
  if (rateBuckets.size > 2000) {
    for (const [key, bucket] of rateBuckets) if (bucket.resetAt < now) rateBuckets.delete(key);
  }
  const bucket = rateBuckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return 0;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT ? Math.ceil((bucket.resetAt - now) / 1000) : 0;
}

async function turnstilePassed(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token || typeof token !== "string") return false;
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const result = await response.json();
    return Boolean(result.success);
  } catch {
    return false;
  }
}

export async function POST(request) {
  const raw = await request.text().catch(() => "");
  if (!raw || raw.length > MAX_BODY_CHARS) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const ip = clientIp(request);
  const retryAfter = retryAfterSeconds(ip);
  if (retryAfter) {
    return NextResponse.json(
      { error: "Too many messages. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  // Bots fill every field and submit instantly. Answer "ok" so they do not adapt.
  const fillTime = Date.now() - Number(body?.openedAt);
  if (clean(body?.website, 200) || !(fillTime >= MIN_FILL_MS)) {
    return NextResponse.json({ ok: true });
  }
  if (fillTime > MAX_FILL_MS) {
    return NextResponse.json({ error: "This form expired. Please reload the page." }, { status: 400 });
  }

  const name = cleanLine(body?.name, 100);
  const email = cleanLine(body?.email, 254);
  const phone = cleanLine(body?.phone, 30);
  const message = clean(body?.message, 4000);
  const service = body?.service;
  const projectType = typeof body?.projectType === "string" && PROJECT_TYPES.has(body.projectType.trim()) ? body.projectType.trim() : "";
  const selectedPackage = typeof service === "string" && PACKAGE_OPTIONS.has(service.trim())
    ? service.trim()
    : "";

  const fields = {};
  if (name.length < 2) fields.name = "Please enter your name.";
  if (!EMAIL_RE.test(email)) fields.email = "Please enter a valid email address.";
  if (phone && !PHONE_RE.test(phone)) fields.phone = "Please enter a valid phone number.";
  if (message.length < 10) fields.message = "Please tell us a little more (at least 10 characters).";
  if (Object.keys(fields).length) {
    return NextResponse.json({ error: "Please check the highlighted fields.", fields }, { status: 400 });
  }

  if (!(await turnstilePassed(body?.cfToken, ip))) {
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 400 });
  }

  try {
    const timestamp = sentAt();
    const dashboardUrl = `${getAppUrl()}/admin`;
    const metadata = [["Full name",name],["Sender email",email],["Phone",phone],["Project type",projectType],["Selected package",selectedPackage],["Sent",timestamp]].filter(([,value]) => value !== undefined && value !== null && value !== "");
    const metadataRows = metadata.map(([label,value]) => `<tr><td style="padding:10px 13px;border-bottom:1px solid #22314e;color:#7f92ad;font-family:Inter,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:.7px;text-transform:uppercase">${escapeHtml(label)}</td><td style="padding:10px 13px;border-bottom:1px solid #22314e;color:#edf5ff;font-family:Inter,Arial,sans-serif;font-size:13px;line-height:1.45">${escapeHtml(value)}</td></tr>`).join("");
    const logoUrl = `${getAppUrl()}/Logo-Navy1.png`;
    const text = `MiLink website inquiry\n\nFull name: ${name}\nSender email: ${email}${phone ? `\nPhone: ${phone}` : ""}${projectType ? `\nProject type: ${projectType}` : ""}${selectedPackage ? `\nSelected package: ${selectedPackage}` : ""}\nSent: ${timestamp}\n\nMessage:\n${message}\n\nOpen the MiLink dashboard: ${dashboardUrl}\n\n© 2026 MiLink · All rights reserved\n${process.env.BUSINESS_ADDRESS || "Toronto, Ontario, Canada"}\nThis message was submitted through the MiLink website.`;
    const html = `<!doctype html><html><body style="margin:0;background:#0b0f17;color:#edf5ff;font-family:Inter,ui-sans-serif,Arial,sans-serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0f17"><tr><td align="center" style="padding:42px 16px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;overflow:hidden;border:1px solid #22314e;border-radius:18px;background:#131b2e"><tr><td style="padding:24px 32px 16px;border-bottom:1px solid #22314e"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td style="padding:0 11px 0 0;vertical-align:middle"><img src="${escapeHtml(logoUrl)}" alt="MiLink" height="34" style="display:block;width:auto;height:34px;max-height:36px;border:0;outline:none;text-decoration:none"/></td><td style="vertical-align:middle"><div style="color:#f8fbff;font-size:22px;font-weight:800;letter-spacing:-.8px;line-height:1">Mi<span style="color:#4da8ff">Link</span></div><div style="margin-top:5px;color:#8ba0bb;font-size:10px;font-weight:800;letter-spacing:1.35px;line-height:1.2;text-transform:uppercase">Website inquiry</div></td></tr></table></td></tr><tr><td style="padding:30px 32px"><h1 style="margin:0;color:#ffffff;font-size:27px;line-height:1.2;letter-spacing:-.55px">New website inquiry</h1><p style="margin:15px 0 0;color:#c4d0df;font-size:15px;line-height:1.7">A visitor has contacted MiLink through the website. Their details and message are included below.</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0;border:1px solid #22314e;border-radius:12px;background:#0d1525">${metadataRows}</table><div style="margin:22px 0 0;padding:16px;border:1px solid #2d4263;border-radius:12px;background:#0d1525"><div style="margin:0 0 8px;color:#8ba0bb;font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase">Message</div><p style="margin:0;color:#edf5ff;font-size:14px;line-height:1.7;white-space:pre-wrap">${escapeHtml(message)}</p></div><p style="margin:27px 0 0"><a href="${escapeHtml(dashboardUrl)}" style="display:inline-block;padding:13px 18px;border-radius:10px;background:#4da8ff;color:#06152b;text-decoration:none;font-size:14px;font-weight:800">Open MiLink Dashboard →</a></p></td></tr><tr><td style="padding:21px 32px;border-top:1px solid #22314e"><p style="margin:0;color:#71829b;font-size:11px;line-height:1.65">© 2026 MiLink · All rights reserved<br/>${escapeHtml(process.env.BUSINESS_ADDRESS || "Toronto, Ontario, Canada")}<br/>This inquiry was submitted through the MiLink website.</p></td></tr></table></td></tr></table></body></html>`;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"MiLink Inquiry" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: process.env.TO_EMAIL,
      subject: `New message from website — ${name}`,
      text,
      html,
      headers: {
        "X-Entity-Ref-ID": randomUUID(),
        "X-Priority": "3",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json(
      { error: "Send failed" },
      { status: 500 }
    );
  }
}
