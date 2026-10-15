"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const dark = !root.classList.contains("dark");
    root.classList.toggle("dark", dark);
    try {
      localStorage.setItem("riatires-theme", dark ? "dark" : "light");
    } catch {}
  }

  // Icons switch purely with CSS so the server and client render the same markup.
  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border sm:h-10 sm:w-10 border-line text-fg transition hover:border-brand hover:text-brand"
      aria-label="החלפה בין מצב יום ללילה"
      title="מצב יום / לילה"
    >
      <Moon className="h-5 w-5 dark:hidden" aria-hidden="true" />
      <Sun className="hidden h-5 w-5 dark:block" aria-hidden="true" />
    </button>
  );
}
