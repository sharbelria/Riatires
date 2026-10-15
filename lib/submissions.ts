import "server-only";
import type { OrderSummary } from "@/lib/orders";
import type { Customer } from "@/lib/order-emails";
import { createSupabaseServerClient, supabaseConfigured } from "@/lib/supabase/server";

// Saves form submissions to Supabase. Every function returns:
//   "saved"   – stored in the database
//   "skipped" – Supabase is not configured (env vars missing)
//   "failed"  – Supabase returned an error (details are logged)
export type SaveResult = "saved" | "skipped" | "failed";

export async function saveContactRequest(input: { name: string; phone: string; details?: string }): Promise<SaveResult> {
  if (!supabaseConfigured()) return "skipped";
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("contact_requests").insert({
    name: input.name,
    phone: input.phone,
    details: input.details || null,
  });
  if (error) {
    console.error("[supabase] contact_requests insert failed", error);
    return "failed";
  }
  return "saved";
}

/** Order + its items. Prices were already recalculated on the server (see lib/orders.ts). */
export async function saveOrder(order: OrderSummary, customer: Customer): Promise<SaveResult> {
  if (!supabaseConfigured()) return "skipped";
  const supabase = await createSupabaseServerClient();

  const { error: orderError } = await supabase.from("orders").insert({
    order_number: order.id,
    created_at: order.createdAt,
    customer_name: customer.name,
    phone: customer.phone,
    city: customer.city,
    email: customer.email ?? null,
    notes: customer.notes ?? null,
    payment_method: order.method,
    total: order.total,
  });
  if (orderError) {
    console.error("[supabase] orders insert failed", order.id, orderError);
    return "failed";
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    order.lines.map((l) => ({
      order_number: order.id,
      tire_id: l.id,
      brand: l.brand,
      model: l.model,
      size: l.size,
      qty: l.qty,
      unit_price: l.unitPrice,
      line_total: l.lineTotal,
    })),
  );
  if (itemsError) {
    console.error("[supabase] order_items insert failed", order.id, itemsError);
    return "failed";
  }
  return "saved";
}

export async function savePayment(input: {
  orderNumber: string;
  amount: number;
  provider: "cardcom" | "mock";
  transactionId?: string;
}): Promise<SaveResult> {
  if (!supabaseConfigured()) return "skipped";
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("order_payments").insert({
    order_number: input.orderNumber,
    amount: Math.round(input.amount),
    provider: input.provider,
    transaction_id: input.transactionId || null,
  });
  if (error) {
    console.error("[supabase] order_payments insert failed", input.orderNumber, error);
    return "failed";
  }
  return "saved";
}
