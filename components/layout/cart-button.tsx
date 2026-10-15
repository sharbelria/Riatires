"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-store";

export function CartButton() {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border sm:h-10 sm:w-10 border-line text-fg transition hover:border-brand hover:text-brand"
      aria-label={count ? `סל הקניות, ${count} פריטים` : "סל הקניות, ריק"}
    >
      <ShoppingCart className="h-5 w-5" aria-hidden="true" />
      {count > 0 && (
        <span className="absolute -top-1.5 -left-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
