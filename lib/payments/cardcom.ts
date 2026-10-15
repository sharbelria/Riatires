import "server-only";
import type { CreatePaymentInput, PaymentProvider, VerifiedPayment } from "./types";

/**
 * Cardcom "Low Profile" hosted payment page (API v11).
 * Docs: https://secure.cardcom.solutions/swagger/index.html?url=/swagger/v11/swagger.json
 *
 * Env:
 *   CARDCOM_TERMINAL_NUMBER  – your terminal number
 *   CARDCOM_API_NAME         – API username from the Cardcom dashboard
 *   CARDCOM_API_BASE         – optional, defaults to https://secure.cardcom.solutions/api/v11
 */
function config() {
  const terminal = Number(process.env.CARDCOM_TERMINAL_NUMBER);
  const apiName = process.env.CARDCOM_API_NAME;
  const base = process.env.CARDCOM_API_BASE ?? "https://secure.cardcom.solutions/api/v11";
  if (!terminal || !apiName) return null;
  return { terminal, apiName, base };
}

export function cardcomConfigured() {
  return config() !== null;
}

async function call<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const cfg = config();
  if (!cfg) throw new Error("Cardcom is not configured");
  const res = await fetch(`${cfg.base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ TerminalNumber: cfg.terminal, ApiName: cfg.apiName, ...body }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Cardcom HTTP ${res.status}`);
  return (await res.json()) as T;
}

type CreateResponse = { ResponseCode: number; Description?: string; LowProfileId?: string; Url?: string };

type LpResultResponse = {
  ResponseCode: number;
  Description?: string;
  ReturnValue?: string;
  TranzactionId?: number;
  TranzactionInfo?: { ResponseCode?: number; Amount?: number; TranzactionId?: number };
};

export const cardcomProvider: PaymentProvider = {
  name: "cardcom",
  async createPayment(input: CreatePaymentInput) {
    const data = await call<CreateResponse>("/LowProfile/Create", {
      Operation: "ChargeOnly",
      ReturnValue: input.orderId,
      Amount: input.amount,
      ISOCoinId: 1, // ILS
      Language: "he",
      ProductName: input.description,
      SuccessRedirectUrl: input.successUrl,
      FailedRedirectUrl: input.failureUrl,
      WebHookUrl: input.webhookUrl,
      UIDefinition: {
        CardOwnerNameValue: input.customer.name,
        CardOwnerPhoneValue: input.customer.phone,
        CardOwnerEmailValue: input.customer.email ?? "",
      },
    });
    if (data.ResponseCode !== 0 || !data.Url) {
      throw new Error(`Cardcom create failed: ${data.ResponseCode} ${data.Description ?? ""}`);
    }
    return { redirectUrl: data.Url };
  },
};

/** Asks Cardcom (server-to-server) whether a Low Profile deal was really paid. */
export async function verifyCardcomPayment(lowProfileId: string): Promise<VerifiedPayment | null> {
  const data = await call<LpResultResponse>("/LowProfile/GetLpResult", { LowProfileId: lowProfileId });
  const tx = data.TranzactionInfo;
  if (data.ResponseCode !== 0 || !data.ReturnValue || (tx?.ResponseCode ?? 0) !== 0 || tx?.Amount == null) {
    return null;
  }
  return {
    orderId: data.ReturnValue,
    amount: tx.Amount,
    transactionId: String(tx.TranzactionId ?? data.TranzactionId ?? ""),
  };
}
