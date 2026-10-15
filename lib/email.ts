import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { siteConfig } from "@/lib/site-config";

type Mail = { to: string | string[]; subject: string; html: string; replyTo?: string };

export type SendResult = { ok: true; id?: string; skipped?: boolean } | { ok: false; error: string };

/**
 * Sends email with the first service that is configured in .env.local:
 *   1. Gmail / any SMTP server – SMTP_USER + SMTP_PASS (Gmail: an App Password)
 *   2. Resend (https://resend.com) – RESEND_API_KEY
 * With neither (local development) the email is printed to the console instead.
 */
export async function sendEmail(mail: Mail): Promise<SendResult> {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) return sendViaSmtp(mail);
  if (process.env.RESEND_API_KEY) return sendViaResend(mail, process.env.RESEND_API_KEY);

  console.warn(`[email] no email service configured – email not sent. Subject: "${mail.subject}" → ${mail.to}`);
  return { ok: true, skipped: true };
}

let transporter: Transporter | null = null;

function smtp() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "smtp.gmail.com",
      port,
      secure: port === 465, // 465 = TLS from the start; 587 upgrades with STARTTLS
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

async function sendViaSmtp(mail: Mail): Promise<SendResult> {
  // Gmail only sends "from" the signed-in account (or its verified aliases).
  const from = process.env.EMAIL_FROM ?? `${siteConfig.name} <${process.env.SMTP_USER}>`;
  try {
    const info = await smtp().sendMail({
      from,
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
      replyTo: mail.replyTo,
    });
    return { ok: true, id: info.messageId };
  } catch (err) {
    console.error("[email] SMTP send failed", err);
    return { ok: false, error: "smtp" };
  }
}

async function sendViaResend(mail: Mail, apiKey: string): Promise<SendResult> {
  const from = process.env.EMAIL_FROM ?? `${siteConfig.name} <onboarding@resend.dev>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: Array.isArray(mail.to) ? mail.to : [mail.to],
        subject: mail.subject,
        html: mail.html,
        reply_to: mail.replyTo,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("[email] Resend error", res.status, text);
      return { ok: false, error: `Resend ${res.status}` };
    }
    const data = (await res.json()) as { id?: string };
    return { ok: true, id: data.id };
  } catch (err) {
    console.error("[email] send failed", err);
    return { ok: false, error: "network" };
  }
}

/** Address that receives new orders / leads. */
export function ownerEmail() {
  return process.env.ORDER_EMAIL_TO ?? siteConfig.email;
}

export function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Simple RTL email wrapper. */
export function emailLayout(title: string, body: string) {
  return `<!doctype html><html lang="he" dir="rtl"><body style="margin:0;background:#f5f5f6;font-family:Arial,sans-serif;color:#0b0b0b">
<div style="max-width:600px;margin:0 auto;background:#fff">
<div style="background:#0b0b0b;padding:16px 20px;color:#fff;font-size:22px;font-weight:bold" dir="ltr">Ria<span style="color:#d7141a">tires</span></div>
<div style="padding:20px;direction:rtl;text-align:right">
<h1 style="font-size:20px;margin:0 0 12px">${escapeHtml(title)}</h1>
${body}
</div>
<div style="padding:12px 20px;background:#f5f5f6;font-size:12px;color:#55565b;direction:rtl;text-align:right">${escapeHtml(siteConfig.name)} · ${escapeHtml(siteConfig.phoneDisplay)} · ${escapeHtml(siteConfig.email)}</div>
</div></body></html>`;
}
