"use client";

import { useId, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "done" } | { kind: "error"; message: string };

export function ContactForm() {
  const uid = useId();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({ ok: false }))) as { ok: boolean; error?: string };
      if (!json.ok) throw new Error(json.error);
      form.reset();
      setStatus({ kind: "done" });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error && err.message ? err.message : "משהו השתבש, נסו שוב" });
    }
  }

  if (status.kind === "done") {
    return (
      <div role="status" className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-500" aria-hidden="true" />
        <p className="text-xl font-bold">תודה! קיבלנו את הפנייה</p>
        <p className="text-muted">נחזור אליכם בהקדם.</p>
      </div>
    );
  }

  const input =
    "h-12 w-full rounded-xl border-2 border-line bg-bg px-4 text-base text-fg placeholder:text-muted/70 focus:border-brand focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate={false}>
      <div>
        <label htmlFor={`${uid}-name`} className="mb-1.5 block text-sm font-bold">
          שם מלא
        </label>
        <input id={`${uid}-name`} name="name" required minLength={2} autoComplete="name" className={input} />
      </div>
      <div>
        <label htmlFor={`${uid}-phone`} className="mb-1.5 block text-sm font-bold">
          טלפון
        </label>
        <input
          id={`${uid}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          required
          autoComplete="tel"
          placeholder="05X-XXXXXXX"
          className={`${input} text-right`}
        />
      </div>
      <div>
        <label htmlFor={`${uid}-details`} className="mb-1.5 block text-sm font-bold">
          מידת צמיג או דגם רכב
        </label>
        <input
          id={`${uid}-details`}
          name="details"
          placeholder="לדוגמה: 205/55R16 או מאזדה 3 2019"
          className={input}
        />
      </div>
      {/* honeypot for bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {status.kind === "error" && (
        <p role="alert" className="rounded-lg bg-brand/10 px-3 py-2 text-sm font-semibold text-brand">
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-brand font-bold text-white transition hover:bg-brand-strong disabled:opacity-60"
      >
        {status.kind === "sending" && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
        חזרו אליי
      </button>
    </form>
  );
}
