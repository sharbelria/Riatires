import "server-only";
import { sign } from "@/lib/orders";
import { cardcomConfigured, cardcomProvider } from "./cardcom";
import type { PaymentProvider } from "./types";

export type { CreatePaymentInput, PaymentProvider } from "./types";

/**
 * Selects the payment provider from PAYMENT_PROVIDER in the environment:
 *   "cardcom" – real payments through Cardcom's hosted payment page
 *   "mock"    – fake test gateway (local testing only – never takes money)
 * When unset: "mock" in development, disabled in production.
 */
export function getPaymentProvider(): PaymentProvider | null {
  const choice = process.env.PAYMENT_PROVIDER ?? (process.env.NODE_ENV === "production" ? "" : "mock");
  if (choice === "cardcom") return cardcomConfigured() ? cardcomProvider : null;
  if (choice === "mock") return mockProvider;
  return null;
}

export function mockPaymentsEnabled() {
  const choice = process.env.PAYMENT_PROVIDER ?? (process.env.NODE_ENV === "production" ? "" : "mock");
  return choice === "mock";
}

/** Signature that ties a payment callback to the order id + amount we expect. */
export function paymentSignature(orderId: string, amount: number) {
  return sign(`pay:${orderId}:${amount}`);
}

const mockProvider: PaymentProvider = {
  name: "mock",
  async createPayment(input) {
    const qs = new URLSearchParams({
      order: input.orderId,
      amount: String(input.amount),
      sig: paymentSignature(input.orderId, input.amount),
      success: input.successUrl,
      failure: input.failureUrl,
    });
    return { redirectUrl: `/checkout/test-payment?${qs.toString()}` };
  },
};
