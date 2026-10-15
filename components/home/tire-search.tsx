"use client";

import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { SizeOption } from "@/lib/tires-types";

type Props = {
  sizes: SizeOption[];
  initial?: Partial<Record<"width" | "profile" | "rim", number>>;
};

const uniqSorted = (values: number[]) => [...new Set(values)].sort((a, b) => a - b);

export function TireSearch({ sizes, initial }: Props) {
  const router = useRouter();
  const uid = useId();
  const [width, setWidth] = useState(initial?.width?.toString() ?? "");
  const [profile, setProfile] = useState(initial?.profile?.toString() ?? "");
  const [rim, setRim] = useState(initial?.rim?.toString() ?? "");

  // Each dropdown only offers values that exist for the choices made above it.
  const widths = useMemo(() => uniqSorted(sizes.map((s) => s.width)), [sizes]);
  const profiles = useMemo(
    () => uniqSorted(sizes.filter((s) => String(s.width) === width).map((s) => s.profile)),
    [sizes, width],
  );
  const rims = useMemo(
    () =>
      uniqSorted(
        sizes
          .filter((s) => String(s.width) === width && String(s.profile) === profile)
          .map((s) => s.rim),
      ),
    [sizes, width, profile],
  );

  function onWidth(v: string) {
    setWidth(v);
    const nextProfiles = uniqSorted(sizes.filter((s) => String(s.width) === v).map((s) => s.profile));
    const p = nextProfiles.length === 1 ? String(nextProfiles[0]) : "";
    setProfile(p);
    autoRim(v, p);
  }

  function onProfile(v: string) {
    setProfile(v);
    autoRim(width, v);
  }

  function autoRim(w: string, p: string) {
    const nextRims = uniqSorted(
      sizes.filter((s) => String(s.width) === w && String(s.profile) === p).map((s) => s.rim),
    );
    setRim(nextRims.length === 1 ? String(nextRims[0]) : "");
  }

  const ready = width && profile && rim;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    router.push(`/tires?width=${width}&profile=${profile}&rim=${rim}`);
  }

  const selectCls =
    "h-13 w-full appearance-none rounded-xl border-2 border-line bg-bg px-4 pe-10 text-lg font-semibold text-fg transition focus:border-brand focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <form onSubmit={onSubmit} className="space-y-4" aria-label="חיפוש צמיגים לפי מידה">
      <Field id={`${uid}-w`} label="בחרו רוחב" step="1">
        <select
          id={`${uid}-w`}
          className={selectCls}
          value={width}
          onChange={(e) => onWidth(e.target.value)}
          required
        >
          <option value="">רוחב הצמיג</option>
          {widths.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </Field>

      <Field id={`${uid}-p`} label="בחרו חתך" step="2">
        <select
          id={`${uid}-p`}
          className={selectCls}
          value={profile}
          onChange={(e) => onProfile(e.target.value)}
          disabled={!width}
          required
        >
          <option value="">{width ? "חתך (גובה דופן)" : "בחרו קודם רוחב"}</option>
          {profiles.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </Field>

      <Field id={`${uid}-r`} label="בחרו קוטר" step="3">
        <select
          id={`${uid}-r`}
          className={selectCls}
          value={rim}
          onChange={(e) => setRim(e.target.value)}
          disabled={!profile}
          required
        >
          <option value="">{profile ? "קוטר החישוק (אינץ׳)" : "בחרו קודם חתך"}</option>
          {rims.map((v) => (
            <option key={v} value={v}>
              R{v}
            </option>
          ))}
        </select>
      </Field>

      <button
        type="submit"
        disabled={!ready}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand text-lg font-bold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
      >
        <Search className="h-5 w-5" aria-hidden="true" />
        חפשו צמיגים
      </button>
      <p className="text-center text-xs text-muted">
        את המידה תמצאו על דופן הצמיג, לדוגמה: <span dir="ltr">205/55R16</span>
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  step,
  children,
}: {
  id: string;
  label: string;
  step: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-2 text-sm font-bold text-fg">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[11px] text-white dark:bg-white dark:text-ink">
          {step}
        </span>
        {label}
      </label>
      <div className="relative">
        {children}
        <svg
          className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z" />
        </svg>
      </div>
    </div>
  );
}
