import { NextResponse } from "next/server";
import { verifySignature } from "@/lib/orders";
import { mockPaymentsEnabled } from "@/lib/payments";
import { sendOwnerPaymentEmail } from "@/lib/order-emails";
import { savePayment } from "@/lib/submissions";

/** Test gateway "payment succeeded" callback. Disabled unless PAYMENT_PROVIDER=mock (or local dev). */
export async function POST(request: Request) {
  if (!mockPaymentsEnabled()) return NextResponse.json({ ok: false }, { status: 404 });

  const { order, amount, sig } = (await request.json().catch(() => ({}))) as {
    order?: string;
    amount?: number;
    sig?: string;
  };
  if (!order || !amount || !sig || !verifySignature(`pay:${order}:${amount}`, sig)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  await Promise.all([
    savePayment({ orderNumber: order, amount, provider: "mock", transactionId: "TEST" }),
    sendOwnerPaymentEmail(order, amount, "TEST"),
  ]);
  return NextResponse.json({ ok: true });
}
