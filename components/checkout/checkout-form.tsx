"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Banknote, CreditCard, Loader2, Lock, Mail } from "lucide-react";
import type { Tire } from "@/lib/tires-types";
import type { PaymentMethod } from "@/lib/validation";
import { formatPrice } from "@/lib/format";
import { cart } from "@/lib/cart-store";
import { useCartLines } from "@/components/cart/use-cart-lines";
import { saveOrderContact } from "@/lib/order-contact";

const methods: { value: PaymentMethod; label: string; hint: string; icon: typeof CreditCard }[] = [
  { value: "card", label: "תשלום באשראי", hint: "מעבר לדף תשלום מאובטח של חברת הסליקה", icon: CreditCard },
  { value: "cash", label: "תשלום במזומן בהתקנה", hint: "משלמים כשמגיעים להתקנה", icon: Banknote },
  { value: "email", label: "שליחת הזמנה במייל", hint: "נחזור אליכם לאישור ותיאום תשלום", icon: Mail },
];

export function CheckoutForm({ catalog }: { catalog: Tire[] }) {
  const uid = useId();
  const router = useRouter();
  const { lines, total } = useCartLines(catalog);
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (lines.length === 0 && !sending) {
    return (
      <div className="rounded-2xl border border-dashed border-line p-12 text-center">
        <p className="mb-6 text-lg">אין פריטים בסל.</p>
        <Link href="/#search" className="inline-flex rounded-xl bg-brand px-6 py-3 font-bold text-white">
          לחיפוש צמיגים
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const customer = {
      name: String(f.get("name") ?? ""),
      phone: String(f.get("phone") ?? ""),
      city: String(f.get("city") ?? ""),
      email: String(f.get("email") ?? ""),
      notes: String(f.get("notes") ?? ""),
    };
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          // only ids + quantities – the server calculates all prices
          items: lines.map((l) => ({ id: l.tire.id, qty: l.qty })),
          paymentMethod: method,
        }),
      });
      const json = (await res.json().catch(() => ({ ok: false }))) as {
        ok: boolean;
        error?: string;
        orderId?: string;
        redirectUrl?: string;
      };
      if (!json.ok || !json.redirectUrl) throw new Error(json.error);
      // kept in this browser tab only, so the WhatsApp message can include the customer's details
      if (json.orderId) saveOrderContact({ orderId: json.orderId, ...customer });

      if (method === "card") {
        // keep the cart until payment succeeds (cleared on the confirmation page)
        window.location.assign(json.redirectUrl);
      } else {
        cart.clear();
        router.push(json.redirectUrl);
      }
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "משהו השתבש, נסו שוב");
      setSending(false);
    }
  }

  const input =
    "h-12 w-full rounded-xl border-2 border-line bg-bg px-4 text-base text-fg focus:border-brand focus:outline-none";
  const label = "mb-1.5 block text-sm font-bold";

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-6">
        <fieldset className="rounded-2xl border border-line p-5">
          <legend className="px-2 text-lg font-black">פרטי לקוח</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${uid}-name`} className={label}>
                שם מלא <span className="text-brand">*</span>
              </label>
              <input id={`${uid}-name`} name="name" required minLength={2} autoComplete="name" className={input} />
            </div>
            <div>
              <label htmlFor={`${uid}-phone`} className={label}>
                טלפון <span className="text-brand">*</span>
              </label>
              <input
                id={`${uid}-phone`}
                name="phone"
                type="tel"
                inputMode="tel"
                required
                autoComplete="tel"
                placeholder="05X-XXXXXXX"
                className={`${input} text-right`}
              />
            </div>
            <div>
              <label htmlFor={`${uid}-city`} className={label}>
                מאיפה אתם <span className="text-brand">*</span>
              </label>
              <input
                id={`${uid}-city`}
                name="city"
                required
                minLength={2}
                autoComplete="address-level2"
                placeholder="עיר / יישוב"
                className={input}
              />
            </div>
            <div>
              <label htmlFor={`${uid}-email`} className={label}>
                מייל <span className="font-normal text-muted">(לא חובה)</span>
              </label>
              <input
                id={`${uid}-email`}
                name="email"
                type="email"
                autoComplete="email"
                dir="ltr"
                className={`${input} text-right`}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={`${uid}-notes`} className={label}>
                הערות <span className="font-normal text-muted">(לא חובה)</span>
              </label>
              <textarea
                id={`${uid}-notes`}
                name="notes"
                rows={3}
                maxLength={500}
                placeholder="דגם הרכב, מועד מועדף להתקנה וכו׳"
                className={`${input} h-auto py-3`}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-line p-5">
          <legend className="px-2 text-lg font-black">אמצעי תשלום</legend>
          <div className="space-y-3">
            {methods.map(({ value, label: l, hint, icon: Icon }) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition ${
                  method === value ? "border-brand bg-brand/5" : "border-line hover:border-muted"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={value}
                  checked={method === value}
                  onChange={() => setMethod(value)}
                  className="h-5 w-5 accent-[var(--brand)]"
                />
                <Icon className="h-6 w-6 shrink-0 text-brand" aria-hidden="true" />
                <span>
                  <span className="block font-bold">{l}</span>
                  <span className="block text-sm text-muted">{hint}</span>
                </span>
              </label>
            ))}
          </div>
          {method === "card" && (
            <p className="mt-3 flex items-center gap-2 text-xs text-muted">
              <Lock className="h-4 w-4" aria-hidden="true" />
              פרטי האשראי מוזנים בדף מאובטח של חברת הסליקה ואינם נשמרים אצלנו.
            </p>
          )}
        </fieldset>
      </div>

      <aside className="h-fit rounded-2xl border border-line bg-surface p-5 lg:sticky lg:top-24">
        <h2 className="mb-4 text-lg font-black">ההזמנה שלכם</h2>
        <ul className="mb-4 space-y-3 text-sm">
          {lines.map(({ tire, qty, lineTotal }) => (
            <li key={tire.id} className="flex justify-between gap-3">
              <span>
                <span className="block text-right font-semibold" dir="ltr">
                  {tire.brand} {tire.model}
                </span>
                <span className="text-muted">
                  <span dir="ltr">{tire.size}</span> × {qty}
                </span>
              </span>
              <span className="font-bold">{formatPrice(lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-line pt-3 text-lg">
          <span className="font-bold">סה״כ</span>
          <span className="font-black">{formatPrice(total)}</span>
        </div>
        <p className="mt-1 text-xs text-muted">כולל התקנה, איזון ומע״מ</p>

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-brand/10 px-3 py-2 text-sm font-semibold text-brand">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-brand font-bold text-white hover:bg-brand-strong disabled:opacity-60"
        >
          {sending && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
          {method === "card" ? "מעבר לתשלום מאובטח" : "שליחת ההזמנה"}
        </button>
        <p className="mt-3 text-center text-xs text-muted">
          בלחיצה אתם מאשרים את{" "}
          <Link href="/terms" className="underline hover:text-brand">
            התקנון
          </Link>{" "}
          ו
          <Link href="/privacy" className="underline hover:text-brand">
            מדיניות הפרטיות
          </Link>
          .
        </p>
      </aside>
    </form>
  );
}
