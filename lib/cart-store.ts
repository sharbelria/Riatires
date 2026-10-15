"use client";

import { useSyncExternalStore } from "react";
import { MAX_QTY } from "@/lib/cart-limits";

export { MAX_QTY };

// The cart only stores tire ids + quantities. Prices are always looked up
// from the catalog (and recalculated on the server at checkout).
export type CartItem = { id: string; qty: number };

const STORAGE_KEY = "riatires-cart";
const EMPTY: CartItem[] = [];

let cache: CartItem[] | null = null;
const listeners = new Set<() => void>();

function read(): CartItem[] {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    cache = Array.isArray(parsed)
      ? parsed.filter(
          (i): i is CartItem =>
            typeof i?.id === "string" && Number.isInteger(i?.qty) && i.qty > 0,
        )
      : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(items: CartItem[]) {
  cache = items;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage unavailable (private mode) – cart still works for this visit
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, read, () => EMPTY);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  return { items, count };
}

export const cart = {
  add(id: string, qty: number) {
    const items = read();
    const existing = items.find((i) => i.id === id);
    write(
      existing
        ? items.map((i) => (i.id === id ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i))
        : [...items, { id, qty: Math.min(MAX_QTY, qty) }],
    );
  },
  setQty(id: string, qty: number) {
    if (qty <= 0) return cart.remove(id);
    write(read().map((i) => (i.id === id ? { ...i, qty: Math.min(MAX_QTY, qty) } : i)));
  },
  remove(id: string) {
    write(read().filter((i) => i.id !== id));
  },
  clear() {
    write([]);
  },
};
