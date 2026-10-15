import { NextResponse } from "next/server";
import {
  createOrderId,
  orderPath,
  paymentLabels,
  priceItems,
  type OrderSummary,
} from "@/lib/orders";
import { checkoutSchema } from "@/lib/validation";
import { sendCustomerOrderEmail, sendOwnerOrderEmail } from "@/lib/order-emails";
import { getPaymentProvider, paymentSignature } from "@/lib/payments";
import { saveOrder } from "@/lib/submissions";

const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "נתונים לא תקינים");

  const { customer, items, paymentMethod } = parsed.data;

  // Prices come from data/tires.json only – never from the browser.
  const { lines, total, missing } = priceItems(items);
  if (missing.length || lines.length === 0) {
    return fail("חלק מהפריטים בסל כבר לא זמינים. רעננו את הסל ונסו שוב.", 409);
  }

  const order: OrderSummary = {
    id: createOrderId(),
    createdAt: new Date().toISOString(),
    method: paymentMethod,
    lines,
    total,
  };

  if (paymentMethod === "card") {
    const provider = getPaymentProvider();
    if (!provider) return fail("תשלום באשראי אינו זמין כרגע. בחרו אמצעי תשלום אחר או פנו אלינו.", 503);

    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    const sig = paymentSignature(order.id, order.total);
    const successPath = orderPath(order, { paid: "1" });
    const failurePath = `/checkout?payment=failed&order=${order.id}`;
    const absolute = provider.name !== "mock";

    let redirectUrl: string;
    try {
      ({ redirectUrl } = await provider.createPayment({
        orderId: order.id,
        amount: order.total,
        description: `הזמנת צמיגים ${order.id}`,
        lines,
        customer,
        successUrl: absolute ? origin + successPath : successPath,
        failureUrl: absolute ? origin + failurePath : failurePath,
        webhookUrl: `${origin}/api/payments/${provider.name}/webhook?order=${order.id}&amount=${order.total}&sig=${sig}`,
      }));
    } catch (err) {
      console.error("[orders] payment init failed", err);
      return fail("לא הצלחנו לפתוח את דף התשלום. נסו שוב או בחרו אמצעי תשלום אחר.", 502);
    }

    // Owner gets the full order now; a second "payment received" email follows from the webhook.
    await Promise.all([
      saveOrder(order, customer),
      sendOwnerOrderEmail(order, customer, "ממתין לתשלום באשראי – אישור תשלום יישלח במייל נפרד."),
    ]);
    return NextResponse.json({ ok: true, orderId: order.id, redirectUrl });
  }

  const [saved, sent] = await Promise.all([saveOrder(order, customer), sendOwnerOrderEmail(order, customer)]);
  // The order counts as received if it reached the owner by at least one channel.
  if (saved !== "saved" && !sent.ok) {
    return fail("שליחת ההזמנה נכשלה. נסו שוב או שלחו לנו הודעה בוואטסאפ.", 502);
  }
  await sendCustomerOrderEmail(order, customer);

  console.info(`[orders] ${order.id} ${paymentLabels[paymentMethod]} ${order.total}`);
  return NextResponse.json({ ok: true, orderId: order.id, redirectUrl: orderPath(order) });
}
