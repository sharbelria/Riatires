import type { Metadata } from "next";
import { getAllTires } from "@/lib/tires";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "סל הקניות",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      <h1 className="mb-6 text-3xl font-black">סל הקניות</h1>
      <CartView catalog={getAllTires()} />
    </div>
  );
}
