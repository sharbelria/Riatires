import { Mail, Phone } from "lucide-react";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import { WhatsAppIcon } from "@/components/icons";
import { ContactForm } from "./contact-form";

export function ContactSection() {
  return (
    <section aria-labelledby="contact-title" className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid overflow-hidden rounded-3xl border border-line md:grid-cols-2">
        <div className="relative bg-ink p-8 text-white sm:p-10">
          <div aria-hidden="true" className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-brand/30 blur-3xl" />
          <div className="relative space-y-5">
            <p className="text-sm font-bold text-brand">לא בטוחים איזה צמיג מתאים?</p>
            <h2 id="contact-title" className="text-3xl font-black sm:text-4xl">
              השאירו פרטים ונחזור אליכם
            </h2>
            <p className="text-white/75">
              כתבו את מידת הצמיג או את דגם הרכב, ונמליץ על האפשרויות הטובות ביותר עבורכם.
            </p>
            <ul className="space-y-3 pt-2">
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 font-semibold hover:text-brand">
                  <WhatsAppIcon className="h-5 w-5" /> וואטסאפ
                </a>
              </li>
              <li>
                <a href={`tel:${siteConfig.phoneE164}`} className="inline-flex items-center gap-3 font-semibold hover:text-brand">
                  <Phone className="h-5 w-5" aria-hidden="true" /> <span dir="ltr">{siteConfig.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-3 font-semibold hover:text-brand">
                  <Mail className="h-5 w-5" aria-hidden="true" /> {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-bg p-8 sm:p-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
