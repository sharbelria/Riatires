import { BadgeCheck } from "lucide-react";
import { getSizeOptions } from "@/lib/tires";
import { TireSearch } from "./tire-search";
import { TireGraphic } from "./tire-graphic";

export function Hero() {
  const sizes = getSizeOptions();
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      {/* decorative background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-brand/25 blur-3xl" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0_38px,rgba(255,255,255,0.035)_38px_40px)]" />
        <TireGraphic className="animate-spin-slow absolute -bottom-48 -left-40 hidden h-[34rem] w-[34rem] opacity-25 lg:block" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 py-8 sm:gap-10 md:py-20 lg:grid-cols-[1fr_26rem]">
        <div className="space-y-4 sm:space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm font-semibold">
            <BadgeCheck className="h-4 w-4 text-brand" aria-hidden="true" />
            מחיר סופי · כולל התקנה, איזון ומע״מ
          </p>
          <h1 className="text-3xl leading-[1.15] font-black sm:text-5xl lg:text-6xl">
            הצמיגים הנכונים לרכב שלכם,
            <br />
            <span className="text-brand">במחיר שלא מסתיר כלום.</span>
          </h1>
          <p className="hidden max-w-xl text-lg text-white/75 sm:block">
            בחרו את מידת הצמיג, השוו בין כל המותגים הזמינים, הזמינו אונליין – ואנחנו נדאג להתקנה מהירה
            ומקצועית.
          </p>
          <ul className="hidden flex-wrap gap-x-6 sm:flex gap-y-2 text-sm text-white/70">
            <li>✓ כל המותגים המובילים</li>
            <li>✓ תשלום באשראי או במזומן</li>
            <li>✓ התקנה ביום ההגעה</li>
          </ul>
        </div>

        <div
          id="search"
          className="scroll-mt-24 rounded-2xl border border-white/10 bg-bg p-5 text-fg shadow-2xl shadow-black/50 sm:p-6"
        >
          <h2 className="mb-1 text-2xl font-black">חיפוש צמיגים לפי מידה</h2>
          <p className="mb-5 text-sm text-muted">שלושה צעדים פשוטים ומקבלים את כל האפשרויות.</p>
          <TireSearch sizes={sizes} />
        </div>
      </div>
    </section>
  );
}
