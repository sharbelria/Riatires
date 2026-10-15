"use client";

import { useMemo, useState } from "react";
import type { Tire } from "@/lib/tires-types";
import { TireCard } from "./tire-card";

type Sort = "price-asc" | "price-desc";

export function TireResults({ tires }: { tires: Tire[] }) {
  const brands = useMemo(() => [...new Set(tires.map((t) => t.brand))].sort(), [tires]);
  const [brand, setBrand] = useState("all");
  const [sort, setSort] = useState<Sort>("price-asc");

  const shown = useMemo(() => {
    const list = brand === "all" ? tires : tires.filter((t) => t.brand === brand);
    return [...list].sort((a, b) => (sort === "price-asc" ? a.price - b.price : b.price - a.price));
  }, [tires, brand, sort]);

  const control =
    "h-11 rounded-xl border-2 border-line bg-bg px-3 font-semibold text-fg focus:border-brand focus:outline-none";

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="brand-filter" className="mb-1 block text-xs font-bold text-muted">
            סינון לפי מותג
          </label>
          <select id="brand-filter" value={brand} onChange={(e) => setBrand(e.target.value)} className={control}>
            <option value="all">כל המותגים ({tires.length})</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sort" className="mb-1 block text-xs font-bold text-muted">
            מיון
          </label>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={control}>
            <option value="price-asc">מחיר: מהזול ליקר</option>
            <option value="price-desc">מחיר: מהיקר לזול</option>
          </select>
        </div>
        <p className="ms-auto text-sm text-muted" aria-live="polite">
          {shown.length} תוצאות
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {shown.map((t) => (
          <li key={t.id}>
            <TireCard tire={t} />
          </li>
        ))}
      </ul>
    </div>
  );
}
