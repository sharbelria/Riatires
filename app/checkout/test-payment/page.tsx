import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { mockPaymentsEnabled } from "@/lib/payments";
import { formatPrice } from "@/lib/format";
import { TestPaymentActions } from "@/components/checkout/test-payment-actions";

export const metadata: Metadata = {
  title: "דף תשלום לבדיקה",
  robots: { index: false, follow: false },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

// Only same-site relative paths are allowed as return addresses.
const safePath = (v: unknown) => (typeof v === "string" && v.startsWith("/") && !v.startsWith("//") ? v : "/");

export default function TestPaymentPage({ searchParams }: { searchParams: SP }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <Suspense fallback={null}>
        <TestPayment searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function TestPayment({ searchParams }: { searchParams: SP }) {
  // read request data first so the env check happens at request time, not build time
  const sp = await searchParams;
  if (!mockPaymentsEnabled()) notFound();
  const order = typeof sp.order === "string" ? sp.order : "";
  const amount = Number(sp.amount);
  const sig = typeof sp.sig === "string" ? sp.sig : "";

  return (
    <div className="rounded-3xl border-2 border-dashed border-amber-500 p-8 text-center">
      <p className="mb-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
        סביבת בדיקה – לא מתבצע חיוב
      </p>
      <h1 className="mb-2 text-2xl font-black">דף תשלום מדומה</h1>
      <p className="mb-6 text-muted">
        כאן יופיע דף התשלום המאובטח של Cardcom כשתגדירו את מפתחות הסליקה.
      </p>
      <p className="mb-1 text-sm text-muted">הזמנה {order}</p>
      <p className="mb-8 text-3xl font-black">{Number.isFinite(amount) ? formatPrice(amount) : "—"}</p>
      <TestPaymentActions
        order={order}
        amount={amount}
        sig={sig}
        successPath={safePath(sp.success)}
        failurePath={safePath(sp.failure)}
      />
    </div>
  );
}
