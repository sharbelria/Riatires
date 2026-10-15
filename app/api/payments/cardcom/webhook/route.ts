import { NextResponse } from "next/server";
import { verifySignature } from "@/lib/orders";
import { verifyCardcomPayment } from "@/lib/payments/cardcom";
import { sendOwnerPaymentEmail } from "@/lib/order-emails";

/**
 * Cardcom calls this URL (server-to-server) after a payment attempt.
 * We never trust the callback body: we re-check the deal with Cardcom's API
 * and compare it with the order id + amount signed when the order was created.
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("order") ?? "";
  const amount = Number(url.searchParams.get("amount"));
  const sig = url.searchParams.get("sig") ?? "";

  if (!orderId || !amount || !verifySignature(`pay:${orderId}:${amount}`, sig)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as { LowProfileId?: string };
  const lowProfileId = body.LowProfileId ?? url.searchParams.get("lowprofilecode") ?? "";
  if (!lowProfileId) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    const payment = await verifyCardcomPayment(lowProfileId);
    if (!payment || payment.orderId !== orderId || Math.round(payment.amount) !== amount) {
      console.warn("[cardcom] webhook did not verify", { orderId, amount, payment });
      return NextResponse.json({ ok: true, verified: false });
    }
    await sendOwnerPaymentEmail(orderId, payment.amount, payment.transactionId);
    return NextResponse.json({ ok: true, verified: true });
  } catch (err) {
    console.error("[cardcom] webhook error", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
