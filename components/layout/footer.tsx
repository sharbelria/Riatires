import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import { WhatsAppIcon } from "@/components/icons";
import { Logo } from "./logo";

const infoLinks = [
  { href: "/about", label: "אודות" },
  { href: "/contact", label: "צור קשר" },
  { href: "/cart", label: "סל הקניות" },
];

const legalLinks = [
  { href: "/terms", label: "תקנון ותנאי שימוש" },
  { href: "/privacy", label: "מדיניות פרטיות" },
  { href: "/accessibility", label: "הצהרת נגישות" },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo className="text-white [--bg:#0b0b0b]" />
          <p className="text-sm leading-relaxed">
            צמיגים לכל רכב במחיר סופי – כולל התקנה, איזון ומע״מ. בלי הפתעות בקופה.
          </p>
        </div>

        <div>
          <h2 className="mb-3 font-bold text-white">יצירת קשר</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand" aria-hidden="true" />
              <a href={`tel:${siteConfig.phoneE164}`} dir="ltr" className="hover:text-white">
                {siteConfig.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <WhatsAppIcon className="h-4 w-4 text-brand" />
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                וואטסאפ
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand" aria-hidden="true" />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
              <span>{siteConfig.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand" aria-hidden="true" />
              <span>{siteConfig.hours}</span>
            </li>
          </ul>
        </div>

        <nav aria-label="קישורים">
          <h2 className="mb-3 font-bold text-white">קישורים</h2>
          <ul className="space-y-2 text-sm">
            {infoLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="מידע משפטי">
          <h2 className="mb-3 font-bold text-white">מידע</h2>
          <ul className="space-y-2 text-sm">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {siteConfig.name} · כל הזכויות שמורות
      </div>
    </footer>
  );
}
