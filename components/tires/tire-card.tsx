"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import type { Tire } from "@/lib/tires-types";
import { formatPrice } from "@/lib/format";
import { cart, MAX_QTY } from "@/lib/cart-store";
import { TireGraphic } from "@/components/home/tire-graphic";

export function TireCard({ tire }: { tire: Tire }) {
  const uid = useId();
  const [qty, setQty] = useState(4);
  const [added, setAdded] = useState(false);

  function add() {
    cart.add(tire.id, qty);
    setAdded(true);
  }

  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-bg p-5 transition hover:border-brand hover:shadow-lg">
      <div className="mb-4 flex items-start gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface">
          {tire.image ? (
            <Image src={tire.image} alt={`צמיג ${tire.brand} ${tire.model}`} fill sizes="80px" className="object-contain p-1" />
          ) : (
            <TireGraphic className="h-full w-full p-1.5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black tracking-wide text-brand uppercase text-right" dir="ltr">
            {tire.brand}
          </p>
          <h3 className="truncate text-right text-lg font-bold" dir="ltr">
            {tire.model}
          </h3>
          <p className="text-sm text-muted">
            מידה: <span dir="ltr" className="font-semibold text-fg">{tire.size}</span>
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-3xl font-black">{formatPrice(tire.price)}</p>
          <p className="text-xs text-muted">לצמיג · כולל התקנה, איזון ומע״מ</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
            tire.inStock
              ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
              : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
          }`}
        >
          {tire.inStock ? "במלאי" : "בהזמנה מיוחדת"}
        </span>
      </div>

      <div className="mt-auto flex items-end gap-2">
        <div>
          <label htmlFor={`${uid}-qty`} className="mb-1 block text-xs font-bold text-muted">
            כמות
          </label>
          <select
            id={`${uid}-qty`}
            value={qty}
            onChange={(e) => {
              setQty(Number(e.target.value));
              setAdded(false);
            }}
            className="h-12 rounded-xl border-2 border-line bg-bg px-3 font-bold text-fg focus:border-brand focus:outline-none"
          >
            {Array.from({ length: MAX_QTY }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        {added ? (
          <Link
            href="/cart"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-ink font-bold text-white dark:bg-white dark:text-ink"
          >
            <Check className="h-5 w-5" aria-hidden="true" /> נוסף · לסל
          </Link>
        ) : (
          <button
            type="button"
            onClick={add}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand font-bold text-white transition hover:bg-brand-strong"
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" /> הוסיפו לסל
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-muted">
        סה״כ ל-{qty} צמיגים: <span className="font-bold text-fg">{formatPrice(tire.price * qty)}</span>
      </p>
      <p className="sr-only" role="status">
        {added ? `${qty} צמיגים נוספו לסל` : ""}
      </p>
    </article>
  );
}
