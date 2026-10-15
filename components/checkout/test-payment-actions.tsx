"use client";

import { useState } from "react";

type Props = { order: string; amount: number; sig: string; successPath: string; failurePath: string };

export function TestPaymentActions({ order, amount, sig, successPath, failurePath }: Props) {
  const [busy, setBusy] = useState(false);

  async function succeed() {
    setBusy(true);
    // simulates the gateway's server-to-server callback
    await fetch("/api/payments/mock/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order, amount, sig }),
    }).catch(() => null);
    window.location.assign(successPath);
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={succeed}
        disabled={busy}
        className="h-12 rounded-xl bg-green-600 font-bold text-white hover:bg-green-700 disabled:opacity-60"
      >
        סימולציה: תשלום הצליח
      </button>
      <button
        type="button"
        onClick={() => window.location.assign(failurePath)}
        disabled={busy}
        className="h-12 rounded-xl border-2 border-line font-bold hover:border-brand"
      >
        סימולציה: תשלום נכשל
      </button>
    </div>
  );
}
