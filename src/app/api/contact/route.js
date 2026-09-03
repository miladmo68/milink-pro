import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { randomUUID } from "crypto";
import { getAppUrl } from "../../../lib/transactionalEmail";

const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[character]));
const sentAt = () => new Intl.DateTimeFormat("en-CA", { month:"short", day:"numeric", year:"numeric", hour:"numeric", minute:"2-digit", timeZone:"America/Toronto", timeZoneName:"short" }).format(new Date());

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const { name, email, message, phone, company, service, inquiryType } = body || {};

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  try {
    const timestamp = sentAt();
    const dashboardUrl = `${getAppUrl()}/admin`;
    const metadata = [["Full name",name],["Sender email",email],["Phone",phone],["Company",company],["Inquiry type",service || inquiryType],["Sent",timestamp]].filter(([,value]) => value !== undefined && value !== null && value !== "");
    const metadataRows = metadata.map(([label,value]) => `<tr><td style="padding:10px 13px;border-bottom:1px solid #22314e;color:#7f92ad;font-family:Inter,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:.7px;text-transform:uppercase">${escapeHtml(label)}</td><td style="padding:10px 13px;border-bottom:1px solid #22314e;color:#edf5ff;font-family:Inter,Arial,sans-serif;font-size:13px;line-height:1.45">${escapeHtml(value)}</td></tr>`).join("");
    const logoUrl = `${getAppUrl()}/Logo-Navy1.png`;
    const text = `MiLink website inquiry\n\nFull name: ${name}\nSender email: ${email}${phone ? `\nPhone: ${phone}` : ""}${company ? `\nCompany: ${company}` : ""}${service || inquiryType ? `\nInquiry type: ${service || inquiryType}` : ""}\nSent: ${timestamp}\n\nMessage:\n${message}\n\nOpen the MiLink dashboard: ${dashboardUrl}\n\n© 2026 MiLink · All rights reserved\n${process.env.BUSINESS_ADDRESS || "Toronto, Ontario, Canada"}\nThis message was submitted through the MiLink website.`;
    const html = `<!doctype html><html><body style="margin:0;background:#0b0f17;color:#edf5ff;font-family:Inter,ui-sans-serif,Arial,sans-serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0f17"><tr><td align="center" style="padding:42px 16px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;overflow:hidden;border:1px solid #22314e;border-radius:18px;background:#131b2e"><tr><td style="padding:24px 32px 16px;border-bottom:1px solid #22314e"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td style="padding:0 11px 0 0;vertical-align:middle"><img src="${escapeHtml(logoUrl)}" alt="MiLink" height="34" style="display:block;width:auto;height:34px;max-height:36px;border:0;outline:none;text-decoration:none"/></td><td style="vertical-align:middle"><div style="color:#f8fbff;font-size:22px;font-weight:800;letter-spacing:-.8px;line-height:1">Mi<span style="color:#67e8f9">Link</span></div><div style="margin-top:5px;color:#8ba0bb;font-size:10px;font-weight:800;letter-spacing:1.35px;line-height:1.2;text-transform:uppercase">Website inquiry</div></td></tr></table></td></tr><tr><td style="padding:30px 32px"><h1 style="margin:0;color:#ffffff;font-size:27px;line-height:1.2;letter-spacing:-.55px">New website inquiry</h1><p style="margin:15px 0 0;color:#c4d0df;font-size:15px;line-height:1.7">A visitor has contacted MiLink through the website. Their details and message are included below.</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0;border:1px solid #22314e;border-radius:12px;background:#0d1525">${metadataRows}</table><div style="margin:22px 0 0;padding:16px;border:1px solid #2d4263;border-radius:12px;background:#0d1525"><div style="margin:0 0 8px;color:#8ba0bb;font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase">Message</div><p style="margin:0;color:#edf5ff;font-size:14px;line-height:1.7;white-space:pre-wrap">${escapeHtml(message)}</p></div><p style="margin:27px 0 0"><a href="${escapeHtml(dashboardUrl)}" style="display:inline-block;padding:13px 18px;border-radius:10px;background:#67e8f9;color:#08202d;text-decoration:none;font-size:14px;font-weight:800">Open MiLink Dashboard →</a></p></td></tr><tr><td style="padding:21px 32px;border-top:1px solid #22314e"><p style="margin:0;color:#71829b;font-size:11px;line-height:1.65">© 2026 MiLink · All rights reserved<br/>${escapeHtml(process.env.BUSINESS_ADDRESS || "Toronto, Ontario, Canada")}<br/>This inquiry was submitted through the MiLink website.</p></td></tr></table></td></tr></table></body></html>`;
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
        Precedence: "bulk",
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
