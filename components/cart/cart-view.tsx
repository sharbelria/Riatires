"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import type { Tire } from "@/lib/tires-types";
import { formatPrice } from "@/lib/format";
import { cart, MAX_QTY } from "@/lib/cart-store";
import { TireGraphic } from "@/components/home/tire-graphic";
import { useCartLines } from "./use-cart-lines";

export function CartView({ catalog }: { catalog: Tire[] }) {
  const { lines, total, count } = useCartLines(catalog);

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line p-12 text-center">
        <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-muted" aria-hidden="true" />
        <p className="mb-6 text-lg">הסל שלכם ריק.</p>
        <Link href="/#search" className="inline-flex rounded-xl bg-brand px-6 py-3 font-bold text-white hover:bg-brand-strong">
          לחיפוש צמיגים
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <ul className="space-y-3">
        {lines.map(({ tire, qty, lineTotal }) => (
          <li key={tire.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-bg p-4">
            <div className="h-16 w-16 shrink-0 rounded-xl bg-surface">
              <TireGraphic className="h-full w-full p-1.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-right font-bold" dir="ltr">
                {tire.brand} {tire.model}
              </p>
              <p className="text-sm text-muted">
                <span dir="ltr">{tire.size}</span> · {formatPrice(tire.price)} לצמיג
              </p>
            </div>

            <div className="flex items-center gap-1" role="group" aria-label={`כמות עבור ${tire.brand} ${tire.model}`}>
              <button
                type="button"
                onClick={() => cart.setQty(tire.id, qty - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-line hover:border-brand"
                aria-label="הפחתת כמות"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="w-8 text-center font-bold" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => cart.setQty(tire.id, qty + 1)}
                disabled={qty >= MAX_QTY}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-line hover:border-brand disabled:opacity-40"
                aria-label="הוספת כמות"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <p className="w-24 text-left font-black">{formatPrice(lineTotal)}</p>

            <button
              type="button"
              onClick={() => cart.remove(tire.id)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-brand/10 hover:text-brand"
              aria-label={`הסרת ${tire.brand} ${tire.model} מהסל`}
            >
              <Trash2 className="h-5 w-5" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-2xl border border-line bg-surface p-5 lg:sticky lg:top-24">
        <h2 className="mb-4 text-lg font-black">סיכום הזמנה</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>מספר צמיגים</dt>
            <dd className="font-bold">{count}</dd>
          </div>
          <div className="flex justify-between">
            <dt>התקנה ואיזון</dt>
            <dd className="font-bold text-green-700 dark:text-green-400">כלול</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-lg">
            <dt className="font-bold">סה״כ לתשלום</dt>
            <dd className="font-black">{formatPrice(total)}</dd>
          </div>
        </dl>
        <p className="mt-1 text-xs text-muted">המחיר כולל מע״מ</p>
        <Link
          href="/checkout"
          className="mt-5 flex h-13 items-center justify-center rounded-xl bg-brand font-bold text-white hover:bg-brand-strong"
        >
          המשך לתשלום
        </Link>
        <Link href="/#search" className="mt-3 block text-center text-sm font-semibold text-muted hover:text-brand">
          המשך קניות
        </Link>
      </aside>
    </div>
  );
}
