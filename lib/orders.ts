import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { getTireById } from "@/lib/tires";
import { MAX_QTY } from "@/lib/cart-limits";
import type { PaymentMethod } from "@/lib/validation";

export const paymentLabels: Record<PaymentMethod, string> = {
  card: "תשלום באשראי",
  cash: "תשלום במזומן בהתקנה",
  email: "שליחת הזמנה במייל",
};

export type OrderLine = {
  id: string;
  brand: string;
  model: string;
  size: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

/** Order data that is safe to carry in the confirmation link (no personal details). */
export type OrderSummary = {
  id: string;
  createdAt: string;
  method: PaymentMethod;
  lines: OrderLine[];
  total: number;
};

/**
 * Prices are ALWAYS recalculated here from data/tires.json – whatever the
 * browser sent as a price is ignored (it only sends ids + quantities).
 */
export function priceItems(items: { id: string; qty: number }[]) {
  const merged = new Map<string, number>();
  for (const i of items) merged.set(i.id, Math.min(MAX_QTY, (merged.get(i.id) ?? 0) + i.qty));

  const lines: OrderLine[] = [];
  const missing: string[] = [];
  for (const [id, qty] of merged) {
    const tire = getTireById(id);
    if (!tire) {
      missing.push(id);
      continue;
    }
    lines.push({
      id,
      brand: tire.brand,
      model: tire.model,
      size: tire.size,
      qty,
      unitPrice: tire.price,
      lineTotal: tire.price * qty,
    });
  }
  const total = lines.reduce((s, l) => s + l.lineTotal, 0);
  return { lines, total, missing };
}

export function createOrderId(now = new Date()) {
  const ymd = now.toISOString().slice(2, 10).replace(/-/g, "");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = [...randomBytes(4)].map((b) => alphabet[b % alphabet.length]).join("");
  return `RT${ymd}-${rand}`;
}

// ---------- signed tokens (no database needed) ----------

function secret() {
  const s = process.env.ORDER_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ORDER_SECRET is missing or too short (min 16 chars). Set it in your environment variables.");
  }
  return "dev-only-insecure-order-secret";
}

export function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function verifySignature(value: string, signature: string) {
  const expected = Buffer.from(sign(value));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

const summarySchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  method: z.enum(["card", "cash", "email"]),
  lines: z.array(
    z.object({
      id: z.string(),
      brand: z.string(),
      model: z.string(),
      size: z.string(),
      qty: z.number(),
      unitPrice: z.number(),
      lineTotal: z.number(),
    }),
  ),
  total: z.number(),
});

export function encodeSummary(summary: OrderSummary) {
  const payload = Buffer.from(JSON.stringify(summary)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSummary(token: string | undefined): OrderSummary | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !verifySignature(payload, sig)) return null;
  try {
    const parsed = summarySchema.safeParse(JSON.parse(Buffer.from(payload, "base64url").toString("utf8")));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function orderPath(summary: OrderSummary, extra: Record<string, string> = {}) {
  const qs = new URLSearchParams({ t: encodeSummary(summary), ...extra });
  return `/order/${summary.id}?${qs.toString()}`;
}
