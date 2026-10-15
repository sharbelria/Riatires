import Link from "next/link";

/** Shared layout for text pages (about, terms, privacy, accessibility). */
export function ContentPage({
  title,
  intro,
  placeholder = true,
  children,
}: {
  title: string;
  intro?: string;
  placeholder?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
      <nav aria-label="פירורי לחם" className="mb-3 text-sm text-muted">
        <Link href="/" className="hover:text-brand">
          ראשי
        </Link>{" "}
        / <span>{title}</span>
      </nav>
      <h1 className="mb-3 text-4xl font-black">{title}</h1>
      {intro && <p className="mb-6 text-lg text-muted">{intro}</p>}
      {placeholder && (
        <p className="mb-8 rounded-xl border border-dashed border-brand px-4 py-3 text-sm font-semibold text-brand">
          טקסט לדוגמה – יש לעדכן את התוכן לפני העלאת האתר לאוויר.
        </p>
      )}
      <div className="space-y-4 leading-relaxed [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-black [&_li]:ms-5 [&_ul]:list-disc [&_ul]:space-y-1">
        {children}
      </div>
    </div>
  );
}
