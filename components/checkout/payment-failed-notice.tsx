"use client";

import { useSearchParams } from "next/navigation";

export function PaymentFailedNotice() {
  const params = useSearchParams();
  if (params.get("payment") !== "failed") return null;
  return (
    <div role="alert" className="mb-6 rounded-xl border border-brand bg-brand/10 p-4 font-semibold text-brand">
      התשלום לא הושלם{params.get("order") ? ` (הזמנה ${params.get("order")})` : ""}. לא בוצע חיוב. אפשר לנסות
      שוב או לבחור אמצעי תשלום אחר.
    </div>
  );
}
