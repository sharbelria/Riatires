"use client";

import { useMemo } from "react";
import type { Tire } from "@/lib/tires-types";
import { useCart } from "@/lib/cart-store";

export type CartLine = { tire: Tire; qty: number; lineTotal: number };

/** Joins the stored cart (ids + qty) with the catalog. Unknown ids are ignored. */
export function useCartLines(catalog: Tire[]) {
  const { items } = useCart();
  return useMemo(() => {
    const byId = new Map(catalog.map((t) => [t.id, t]));
    const lines: CartLine[] = [];
    for (const i of items) {
      const tire = byId.get(i.id);
      if (tire) lines.push({ tire, qty: i.qty, lineTotal: tire.price * i.qty });
    }
    const total = lines.reduce((s, l) => s + l.lineTotal, 0);
    const count = lines.reduce((s, l) => s + l.qty, 0);
    return { lines, total, count };
  }, [items, catalog]);
}
