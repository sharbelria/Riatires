"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, siteConfig } from "@/lib/site-config";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="-ms-2 inline-flex h-10 w-9 items-center justify-center rounded-md text-fg"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
      >
        {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
      </button>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="ניווט ראשי"
          className="absolute inset-x-0 top-16 border-b border-line bg-bg shadow-lg"
        >
          <ul className="mx-auto max-w-6xl px-4 py-3">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-3 text-lg font-semibold text-fg hover:text-brand"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="block rounded-md px-2 py-3 text-lg font-semibold text-fg hover:text-brand"
              >
                סל הקניות
              </Link>
            </li>
            <li className="mt-2 border-t border-line px-2 pt-3 text-sm text-muted">
              טלפון:{" "}
              <a href={`tel:${siteConfig.phoneE164}`} className="font-semibold text-fg" dir="ltr">
                {siteConfig.phoneDisplay}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
