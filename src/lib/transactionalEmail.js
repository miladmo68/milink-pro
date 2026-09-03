import nodemailer from "nodemailer";
import { randomUUID } from "crypto";

export const getAppUrl = () => {
  const value = (process.env.NEXT_PUBLIC_SITE_URL || "https://milink.ca").replace(/\/$/, "");
  return /^https:\/\//i.test(value) ? value : `https://${value.replace(/^https?:\/\//i, "")}`;
};

const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character]));
const sentAt = () => new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/Toronto", timeZoneName: "short" }).format(new Date());
const businessAddress = () => process.env.BUSINESS_ADDRESS || "MiLink Studio · Canada";

export function renderEmailTemplate({ heading, copy, buttonLabel, href, eyebrow = "MiLink", metadata = [], items = [] }) {
  const data = [...metadata, ["Sent", sentAt()]].filter(([, value]) => value !== undefined && value !== null && value !== "");
  const rows = data.length ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0;border:1px solid #22314e;border-radius:12px;background:#0d1525">${data.map(([key, value]) => `<tr><td style="padding:10px 13px;border-bottom:1px solid #22314e;color:#7f92ad;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.7px">${escapeHtml(key)}</td><td style="padding:10px 13px;border-bottom:1px solid #22314e;color:#edf5ff;font-size:13px;line-height:1.45">${escapeHtml(Array.isArray(value) ? value.join(", ") : value)}</td></tr>`).join("")}</table>` : "";
  const list = items.length ? `<div style="margin:22px 0 0;border:1px solid #22314e;border-radius:12px;background:#0d1525;overflow:hidden">${items.map((item) => `<div style="padding:13px;border-bottom:1px solid #22314e"><a href="${escapeHtml(item.href)}" style="color:#c8f7ff;font-size:14px;font-weight:750;text-decoration:none">${escapeHtml(item.title)}</a><div style="margin-top:5px;color:#9aacbf;font-size:13px;line-height:1.55">${escapeHtml(item.message || "Open your workspace to review this update.")}</div></div>`).join("")}</div>` : "";
  const logoUrl = `${getAppUrl()}/Logo-Navy1.png`;
  const brandHeader = `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td style="padding:0 11px 0 0;vertical-align:middle"><img src="${escapeHtml(logoUrl)}" alt="MiLink" height="34" style="display:block;width:auto;height:34px;max-height:36px;border:0;outline:none;text-decoration:none"/></td><td style="vertical-align:middle"><div style="color:#f8fbff;font-family:Inter,Arial,sans-serif;font-size:22px;font-weight:800;letter-spacing:-.8px;line-height:1">Mi<span style="color:#67e8f9">Link</span></div><div style="margin-top:5px;color:#8ba0bb;font-family:Inter,Arial,sans-serif;font-size:10px;font-weight:800;letter-spacing:1.35px;line-height:1.2;text-transform:uppercase">${escapeHtml(eyebrow)}</div></td></tr></table>`;
  return `<!doctype html><html><body style="margin:0;background:#0b0f17;color:#edf5ff;font-family:Inter,ui-sans-serif,Arial,sans-serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0f17"><tr><td align="center" style="padding:42px 16px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;overflow:hidden;border:1px solid #22314e;border-radius:18px;background:#131b2e"><tr><td style="padding:24px 32px 16px;border-bottom:1px solid #22314e">${brandHeader}</td></tr><tr><td style="padding:30px 32px"><h1 style="margin:0;color:#ffffff;font-size:27px;line-height:1.2;letter-spacing:-.55px">${escapeHtml(heading)}</h1><p style="margin:15px 0 0;color:#c4d0df;font-size:15px;line-height:1.7">${escapeHtml(copy)}</p>${rows}${list}<p style="margin:27px 0 0"><a href="${escapeHtml(href)}" style="display:inline-block;padding:13px 18px;border-radius:10px;background:#67e8f9;color:#08202d;text-decoration:none;font-size:14px;font-weight:800">${escapeHtml(buttonLabel)}</a></p></td></tr><tr><td style="padding:21px 32px;border-top:1px solid #22314e"><p style="margin:0;color:#71829b;font-size:11px;line-height:1.65">© 2026 MiLink · All rights reserved<br/>${escapeHtml(businessAddress())}<br/>This transactional notification was sent securely for your MiLink workspace.</p></td></tr></table></td></tr></table></body></html>`;
}

export function renderPlainText({ heading, copy, buttonLabel, href, items = [] }) {
  const updates = items.length ? `\n\nUpdates:\n${items.map((item, index) => `${index + 1}. ${item.title}${item.message ? ` — ${item.message}` : ""}\n${item.href}`).join("\n\n")}` : "";
  return `MiLink\n\n${heading}\n\n${copy}${updates}\n\n${buttonLabel}: ${href}\n\n© 2026 MiLink · All rights reserved\n${businessAddress()}\nThis transactional notification was sent securely for your MiLink workspace.`;
}

export async function sendWithSmtp({ to, subject, html, text }) {
  const smtpPassword = process.env.SMTP_PASS;
  if (!process.env.SMTP_USER || !smtpPassword) {
    console.info(`[email:mock] ${subject} → ${to}`);
    return { mocked: true };
  }
  const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST || "smtp.gmail.com", port: Number(process.env.SMTP_PORT) || 465, secure: true, auth: { user: process.env.SMTP_USER, pass: smtpPassword } });
  return transport.sendMail({ from: `"MiLink Team" <${process.env.SMTP_USER}>`, replyTo: process.env.REPLY_TO_EMAIL || "info@milink.ca", to, subject, text, html, headers: { "X-Entity-Ref-ID": randomUUID(), "X-Priority": "3", Precedence: "bulk" } });
}
