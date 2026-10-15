import type { Metadata } from "next";
import { ContactSection } from "@/components/home/contact-section";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "צור קשר",
  description: `צרו קשר עם ${siteConfig.name}: טלפון ${siteConfig.phoneDisplay}, וואטסאפ ומייל.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-10 md:pt-16">
        <h1 className="mb-2 text-4xl font-black">צור קשר</h1>
        <p className="text-lg text-muted">
          זמינים בטלפון, בוואטסאפ ובמייל. שעות פעילות: {siteConfig.hours}
        </p>
      </div>
      <ContactSection />
    </>
  );
}
