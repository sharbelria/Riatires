import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="mb-2 text-7xl font-black text-brand">404</p>
      <h1 className="mb-4 text-3xl font-black">הדף לא נמצא</h1>
      <p className="mb-8 text-muted">ייתכן שהקישור שגוי או שהדף הוסר.</p>
      <Link href="/" className="inline-flex rounded-xl bg-brand px-6 py-3 font-bold text-white hover:bg-brand-strong">
        חזרה לדף הבית
      </Link>
    </div>
  );
}
