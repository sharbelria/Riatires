import "server-only";
import { siteConfig } from "@/lib/site-config";

type Mail = { to: string | string[]; subject: string; html: string; replyTo?: string };

export type SendResult = { ok: true; id?: string; skipped?: boolean } | { ok: false; error: string };

/**
 * Sends email through Resend (https://resend.com) using its REST API.
 * Needs RESEND_API_KEY and EMAIL_FROM in .env.local.
 * Without a key (local development) the email is printed to the console instead.
 */
export async function sendEmail(mail: Mail): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? `${siteConfig.name} <onboarding@resend.dev>`;

  if (!apiKey) {
    console.warn(`[email] RESEND_API_KEY missing – email not sent. Subject: "${mail.subject}" → ${mail.to}`);
    return { ok: true, skipped: true };
  }

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
