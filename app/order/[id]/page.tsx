import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { decodeSummary, paymentLabels } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { ClearCart } from "@/components/cart/clear-cart";
import { OrderWhatsAppButton } from "@/components/order/order-whatsapp-button";

export const metadata: Metadata = {
  title: "אישור הזמנה",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function OrderPage(props: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-surface" />}>
        <OrderDetails {...props} />
      </Suspense>
    </div>
  );
}

async function OrderDetails({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const token = typeof sp.t === "string" ? sp.t : undefined;
  const summary = decodeSummary(token);
  const order = summary && summary.id === id ? summary : null;
  const paid = sp.paid === "1";
  const safeId = /^[A-Z0-9-]{4,30}$/.test(id) ? id : "";

  const heading =
    order?.method === "card"
      ? paid
        ? "התשלום התקבל, תודה!"
        : "ההזמנה ממתינה לתשלום"
      : "תודה! ההזמנה התקבלה";

  return (
    <div className="rounded-3xl border border-line bg-bg p-6 sm:p-10">
      {(order?.method !== "card" || paid) && <ClearCart />}
      <div className="mb-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" aria-hidden="true" />
        <h1 className="mb-2 text-3xl font-black">{heading}</h1>
        {safeId && (
          <p className="text-muted">
            מספר הזמנה: <span className="font-bold text-fg" dir="ltr">{safeId}</span>
          </p>
        )}
        <p className="mt-3 text-muted">ניצור איתכם קשר בהקדם לתיאום מועד ההתקנה.</p>
      </div>

      {order && (
        <section aria-labelledby="summary-title" className="mb-8 rounded-2xl bg-surface p-5">
          <h2 id="summary-title" className="mb-4 text-lg font-black">
            סיכום ההזמנה
          </h2>
          <ul className="space-y-3 text-sm">
            {order.lines.map((l) => (
              <li key={l.id} className="flex justify-between gap-3">
                <span>
                  <span className="block text-right font-semibold" dir="ltr">
                    {l.brand} {l.model}
                  </span>
                  <span className="text-muted">
                    <span dir="ltr">{l.size}</span> · {l.qty} × {formatPrice(l.unitPrice)}
                  </span>
                </span>
                <span className="font-bold">{formatPrice(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-t border-line pt-4">
            <div className="flex justify-between text-lg">
              <dt className="font-bold">סה״כ</dt>
              <dd className="font-black">{formatPrice(order.total)}</dd>
            </div>
            <div className="flex justify-between text-sm text-muted">
              <dt>אמצעי תשלום</dt>
              <dd>{paymentLabels[order.method]}</dd>
            </div>
          </dl>
        </section>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <OrderWhatsAppButton
          orderId={safeId}
          lines={order?.lines}
          total={order?.total}
          paymentLabel={order ? paymentLabels[order.method] : undefined}
          paid={order?.method === "card" && paid}
        />
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl border-2 border-line px-6 py-3 font-bold hover:border-brand"
        >
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
}
