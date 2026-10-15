import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { findTires, formatSize, getSizeOptions } from "@/lib/tires";
import { whatsappLink } from "@/lib/site-config";
import { TireSearch } from "@/components/home/tire-search";
import { TireResults } from "@/components/tires/tire-results";
import { WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "תוצאות חיפוש צמיגים",
  description: "כל הצמיגים הזמינים במידה שבחרתם – מחיר סופי כולל התקנה, איזון ומע״מ.",
  alternates: { canonical: "/tires" },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

const toInt = (v: string | string[] | undefined) => {
  const n = Number(Array.isArray(v) ? v[0] : v);
  return Number.isInteger(n) && n > 0 ? n : undefined;
};

export default function TiresPage({ searchParams }: { searchParams: SP }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <Suspense fallback={<ResultsSkeleton />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Results({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const width = toInt(sp.width);
  const profile = toInt(sp.profile);
  const rim = toInt(sp.rim);
  const complete = width && profile && rim;
  const tires = complete ? findTires(width, profile, rim) : [];
  const size = complete ? formatSize({ width, profile, rim }) : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
      <aside className="order-last h-fit rounded-2xl border border-line bg-surface p-5 lg:sticky lg:top-24 lg:order-none">
        <h2 className="mb-4 text-lg font-black">שינוי מידה</h2>
        <TireSearch
          key={size ?? "none"}
          sizes={getSizeOptions()}
          initial={{ width, profile, rim }}
        />
      </aside>

      <section aria-labelledby="results-title">
        <nav aria-label="פירורי לחם" className="mb-2 text-sm text-muted">
          <Link href="/" className="hover:text-brand">
            ראשי
          </Link>{" "}
          / <span>חיפוש צמיגים</span>
        </nav>
        <h1 id="results-title" className="mb-1 text-3xl font-black">
          {size ? (
            <>
              צמיגים במידה <span dir="ltr" className="text-brand">{size}</span>
            </>
          ) : (
            "חיפוש צמיגים"
          )}
        </h1>
        <p className="mb-6 text-muted">המחירים לצמיג אחד וכוללים התקנה, איזון ומע״מ.</p>

        {!complete ? (
          <EmptyState text="בחרו רוחב, חתך וקוטר כדי לראות את כל הצמיגים הזמינים." />
        ) : tires.length === 0 ? (
          <EmptyState
            text={`כרגע אין לנו מחיר אונליין למידה ${size}. שלחו לנו הודעה ונבדוק עבורכם מול הספקים.`}
            whatsapp={`שלום, אני מחפש/ת צמיגים במידה ${size}`}
          />
        ) : (
          <TireResults tires={tires} />
        )}
      </section>
    </div>
  );
}

function EmptyState({ text, whatsapp }: { text: string; whatsapp?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line p-10 text-center">
      <p className="mb-4 text-lg">{text}</p>
      {whatsapp && (
        <a
          href={whatsappLink(whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-bold text-white"
        >
          <WhatsAppIcon /> בדיקת זמינות בוואטסאפ
        </a>
      )}
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2" aria-busy="true" aria-label="טוען תוצאות">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-56 animate-pulse rounded-2xl bg-surface" />
      ))}
    </div>
  );
}
