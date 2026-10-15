import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-1.5 font-black tracking-tight ${className}`}
      aria-label="Riatires – לדף הבית"
      dir="ltr"
    >
      <svg viewBox="0 0 40 40" className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" aria-hidden="true">
        <circle cx="20" cy="20" r="18" fill="currentColor" />
        <circle cx="20" cy="20" r="11" fill="var(--brand)" />
        <circle cx="20" cy="20" r="4" fill="currentColor" />
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={i}
            x="19"
            y="2.5"
            width="2"
            height="5"
            rx="1"
            fill="var(--bg)"
            transform={`rotate(${i * 45} 20 20)`}
          />
        ))}
      </svg>
      <span className="text-xl leading-none sm:text-2xl">
        Ria<span className="text-brand">tires</span>
      </span>
    </Link>
  );
}
