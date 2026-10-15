import type { OrderLine } from "@/lib/orders";

export type CreatePaymentInput = {
  orderId: string;
  amount: number; // ILS, VAT included
  description: string;
  lines: OrderLine[];
  customer: { name: string; phone: string; email?: string };
  successUrl: string;
  failureUrl: string;
  webhookUrl: string;
};

export type VerifiedPayment = {
  orderId: string;
  amount: number;
  transactionId?: string;
};

/**
 * A payment provider sends the customer to ITS OWN hosted, PCI-compliant
 * payment page. Card numbers never touch this server.
 */
export interface PaymentProvider {
  name: string;
  createPayment(input: CreatePaymentInput): Promise<{ redirectUrl: string }>;
}
