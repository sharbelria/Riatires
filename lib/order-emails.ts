import "server-only";
import { emailLayout, escapeHtml, ownerEmail, sendEmail } from "@/lib/email";
import { formatPrice } from "@/lib/format";
import { paymentLabels, type OrderSummary } from "@/lib/orders";
import { siteConfig } from "@/lib/site-config";

export type Customer = { name: string; phone: string; city: string; email?: string; notes?: string };

function itemsTable(order: OrderSummary) {
  const rows = order.lines
    .map(
      (l) => `<tr>
<td style="padding:8px;border-bottom:1px solid #eee" dir="ltr">${escapeHtml(l.brand)} ${escapeHtml(l.model)}</td>
<td style="padding:8px;border-bottom:1px solid #eee" dir="ltr">${escapeHtml(l.size)}</td>
<td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${l.qty}</td>
<td style="padding:8px;border-bottom:1px solid #eee">${formatPrice(l.unitPrice)}</td>
<td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">${formatPrice(l.lineTotal)}</td>
</tr>`,
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;font-size:14px;margin:12px 0" dir="rtl">
<thead><tr style="background:#f5f5f6;text-align:right">
<th style="padding:8px">צמיג</th><th style="padding:8px">מידה</th><th style="padding:8px">כמות</th><th style="padding:8px">מחיר ליח׳</th><th style="padding:8px">סה״כ</th>
</tr></thead><tbody>${rows}</tbody></table>
<p style="font-size:18px;margin:8px 0"><b>סה״כ לתשלום: ${formatPrice(order.total)}</b> <span style="color:#55565b;font-size:13px">(כולל התקנה, איזון ומע״מ)</span></p>`;
}

export async function sendOwnerOrderEmail(order: OrderSummary, customer: Customer, note?: string) {
  const c = customer;
  const html = emailLayout(
    `הזמנה חדשה ${order.id}`,
    `${note ? `<p style="background:#fff4d6;padding:10px;border-radius:6px">${escapeHtml(note)}</p>` : ""}
<p><b>שם:</b> ${escapeHtml(c.name)}</p>
<p><b>טלפון:</b> <a href="tel:${escapeHtml(c.phone)}">${escapeHtml(c.phone)}</a></p>
<p><b>עיר:</b> ${escapeHtml(c.city)}</p>
<p><b>מייל:</b> ${c.email ? escapeHtml(c.email) : "—"}</p>
<p><b>אמצעי תשלום:</b> ${paymentLabels[order.method]}</p>
${c.notes ? `<p><b>הערות:</b> ${escapeHtml(c.notes)}</p>` : ""}
${itemsTable(order)}
<p style="color:#55565b;font-size:12px">התקבלה: ${new Date(order.createdAt).toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })}</p>`,
  );
  return sendEmail({
    to: ownerEmail(),
    subject: `הזמנה חדשה ${order.id} – ${c.name} – ${formatPrice(order.total)} (${paymentLabels[order.method]})`,
    html,
    replyTo: c.email,
  });
}

export async function sendCustomerOrderEmail(order: OrderSummary, customer: Customer) {
  if (!customer.email) return { ok: true as const, skipped: true };
  const html = emailLayout(
    `תודה ${customer.name}, ההזמנה התקבלה!`,
    `<p>מספר הזמנה: <b>${escapeHtml(order.id)}</b></p>
<p>אמצעי תשלום: ${paymentLabels[order.method]}</p>
${itemsTable(order)}
<p>ניצור איתכם קשר בהקדם לתיאום מועד ההתקנה.</p>
<p>לשאלות: <a href="tel:${siteConfig.phoneE164}">${siteConfig.phoneDisplay}</a> · <a href="https://wa.me/${siteConfig.whatsappNumber}">וואטסאפ</a></p>`,
  );
  return sendEmail({ to: customer.email, subject: `אישור הזמנה ${order.id} – ${siteConfig.name}`, html });
}

export async function sendOwnerPaymentEmail(orderId: string, amount: number, transactionId?: string) {
  const html = emailLayout(
    `התשלום התקבל – הזמנה ${orderId}`,
    `<p>התקבל תשלום באשראי עבור הזמנה <b>${escapeHtml(orderId)}</b>.</p>
<p><b>סכום:</b> ${formatPrice(amount)}</p>
${transactionId ? `<p><b>מספר עסקה:</b> ${escapeHtml(transactionId)}</p>` : ""}
<p>פרטי הלקוח והפריטים נמצאים במייל ״הזמנה חדשה ${escapeHtml(orderId)}״.</p>`,
  );
  return sendEmail({ to: ownerEmail(), subject: `✅ התשלום התקבל – הזמנה ${orderId} – ${formatPrice(amount)}`, html });
}
