import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllTires } from "@/lib/tires";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { PaymentFailedNotice } from "@/components/checkout/payment-failed-notice";

export const metadata: Metadata = {
  title: "השלמת הזמנה",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      <h1 className="mb-6 text-3xl font-black">השלמת הזמנה</h1>
      <Suspense fallback={null}>
        <PaymentFailedNotice />
      </Suspense>
      <CheckoutForm catalog={getAllTires()} />
    </div>
  );
}
