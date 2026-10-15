import { BadgeDollarSign, CreditCard, Headset, Ruler, ShieldCheck, Tag, UserRound, Wrench, Zap } from "lucide-react";
import { getBrands } from "@/lib/tires";

function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p className="mb-2 text-sm font-bold tracking-wide text-brand">{eyebrow}</p>
      <h2 id={id} className="text-3xl font-black sm:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-3 text-muted">{intro}</p>}
    </div>
  );
}

const trust = [
  {
    icon: BadgeDollarSign,
    title: "מחיר סופי, באמת",
    text: "המחיר באתר כולל התקנה, איזון ומע״מ. מה שרואים – זה מה שמשלמים.",
  },
  {
    icon: ShieldCheck,
    title: "אחריות מלאה",
    text: "צמיגים חדשים מהיבואנים הרשמיים, עם אחריות יצרן על כל צמיג.",
  },
  {
    icon: Zap,
    title: "שירות מהיר",
    text: "מתאמים מראש ומתקינים במהירות, כדי שתחזרו לכביש בלי לבזבז יום.",
  },
  {
    icon: Headset,
    title: "שירות לקוחות אישי",
    text: "זמינים בטלפון ובוואטסאפ לכל שאלה – לפני, במהלך ואחרי ההזמנה.",
  },
];

export function TrustBlocks() {
  return (
    <section aria-labelledby="trust-title" className="mx-auto max-w-6xl px-4 py-16">
      <h2 id="trust-title" className="sr-only">
        למה לבחור ב-Riatires
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trust.map(({ icon: Icon, title, text }) => (
          <li
            key={title}
            className="group rounded-2xl border border-line bg-surface p-6 transition hover:-translate-y-0.5 hover:border-brand"
          >
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mb-1 text-lg font-bold">{title}</h3>
            <p className="text-sm leading-relaxed text-muted">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

const steps = [
  { icon: Ruler, title: "בוחרים מידה", text: "רוחב, חתך וקוטר – לפי מה שכתוב על דופן הצמיג." },
  { icon: Tag, title: "בוחרים מותג", text: "משווים מחירים בין כל המותגים הזמינים במידה שלכם." },
  { icon: UserRound, title: "ממלאים פרטים", text: "שם, טלפון ועיר – ואנחנו חוזרים אליכם לתיאום." },
  { icon: CreditCard, title: "משלמים", text: "באשראי בדף תשלום מאובטח, או במזומן ביום ההתקנה." },
  { icon: Wrench, title: "מתקינים", text: "מגיעים, מרכיבים ומאזנים – ויוצאים לדרך." },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="bg-surface py-16">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading id="how-title" eyebrow="איך זה עובד" title="חמישה צעדים ואתם על הכביש" />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative rounded-2xl border border-line bg-bg p-6">
              <span className="absolute top-4 left-4 text-5xl leading-none font-black text-brand/15">
                {i + 1}
              </span>
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white dark:bg-white dark:text-ink">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mb-1 font-bold">
                <span className="text-brand">{i + 1}.</span> {title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// Shown in addition to the brands found in data/tires.json
const featuredBrands = [
  "Michelin",
  "Bridgestone",
  "Continental",
  "Pirelli",
  "Goodyear",
  "Hankook",
  "Kumho",
  "Yokohama",
  "Nexen",
  "Dunlop",
  "Toyo",
  "Falken",
];

export function BrandsGrid() {
  const brands = [...new Set([...featuredBrands, ...getBrands()])];
  return (
    <section aria-labelledby="brands-title" className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeading
        id="brands-title"
        eyebrow="המותגים שלנו"
        title="כל המותגים המובילים במקום אחד"
        intro="עובדים עם מגוון יבואנים כדי שתמיד תהיה לכם אפשרות שמתאימה לתקציב."
      />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {brands.map((b) => (
          <li
            key={b}
            className="flex h-20 items-center justify-center rounded-xl border border-line bg-surface text-lg font-black tracking-tight uppercase transition hover:border-brand hover:text-brand"
            dir="ltr"
          >
            {b}
          </li>
        ))}
      </ul>
    </section>
  );
}

// SAMPLE CONTENT – replace with real customer reviews.
const testimonials = [
  { name: "לקוח לדוגמה 1", city: "עיר", text: "דוגמה לטקסט המלצה. כאן תופיע חוות דעת אמיתית של לקוח." },
  { name: "לקוח לדוגמה 2", city: "עיר", text: "דוגמה לטקסט המלצה. החליפו את הטקסט בהמלצה שקיבלתם." },
  { name: "לקוח לדוגמה 3", city: "עיר", text: "דוגמה לטקסט המלצה. אפשר להוסיף כמה המלצות שרוצים." },
];

export function Testimonials() {
  return (
    <section aria-labelledby="reviews-title" className="bg-surface py-16">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading id="reviews-title" eyebrow="לקוחות ממליצים" title="מה אומרים עלינו" />
        <p className="mx-auto -mt-6 mb-8 w-fit rounded-full border border-dashed border-brand px-3 py-1 text-xs font-semibold text-brand">
          תוכן לדוגמה – יוחלף בהמלצות אמיתיות
        </p>
        <ul className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <li key={t.name} className="rounded-2xl border border-line bg-bg p-6">
              <p className="mb-3 text-brand" aria-label="5 מתוך 5 כוכבים">
                ★★★★★
              </p>
              <blockquote className="mb-4 leading-relaxed">״{t.text}״</blockquote>
              <p className="text-sm font-bold">
                {t.name} <span className="font-normal text-muted">· {t.city}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export { SectionHeading };
