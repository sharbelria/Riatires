// Central place for all business / contact details.
// Change a value here and it updates everywhere on the site.

export const siteConfig = {
  name: "Riatires",
  legalName: "Riatires צמיגים",
  description:
    "צמיגים לכל רכב במחיר סופי שכולל התקנה, איזון ומע״מ. חפשו לפי מידה, הזמינו אונליין ותאמו התקנה.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  // Phone shown on the site (display format) and in tel: links (E.164 format)
  phoneDisplay: "053-324-3735",
  phoneE164: "+972533243735",

  // WhatsApp number in international format, digits only (no +, no leading 0)
  whatsappNumber: "972533243735",
  whatsappGreeting: "שלום Riatires, אשמח לקבל הצעת מחיר לצמיגים 🙂",

  email: "Sharbelria4@gmail.com",

  // Address / opening hours – edit freely
  address: "כתובת העסק (לעדכון)",
  hours: "א׳–ה׳ 08:00–18:00 · ו׳ 08:00–13:00",

  // Pricing rules (see lib/pricing.ts)
  pricing: {
    markupIls: 100, // added per tire on top of the supplier price
    vatRate: 0.18, // 18% VAT
  },
} as const;

export function whatsappLink(message: string = siteConfig.whatsappGreeting) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const navLinks = [
  { href: "/", label: "ראשי" },
  { href: "/#search", label: "חיפוש צמיגים" },
  { href: "/about", label: "אודות" },
  { href: "/contact", label: "צור קשר" },
] as const;
