import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "אודות",
  description: `הכירו את ${siteConfig.name} – צמיגים במחיר סופי כולל התקנה, איזון ומע״מ.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <ContentPage title={`אודות ${siteConfig.name}`} intro="צמיגים במחיר הוגן, שירות אישי ושקיפות מלאה.">
      <p>
        {siteConfig.name} נולדה מתוך רצון לעשות סדר בקניית צמיגים: מחיר אחד וברור שכולל את כל מה שצריך – הצמיג,
        ההתקנה, האיזון והמע״מ – בלי תוספות מפתיעות כשמגיעים לשלם.
      </p>
      <h2>מה מייחד אותנו</h2>
      <ul>
        <li>מגוון רחב של מותגים מובילים בכל המידות הנפוצות.</li>
        <li>מחיר סופי שמוצג מראש באתר.</li>
        <li>התקנה מקצועית ומהירה בתיאום מראש.</li>
        <li>זמינות בטלפון ובוואטסאפ לכל שאלה.</li>
      </ul>
      <h2>הסיפור שלנו</h2>
      <p>כאן אפשר לספר על העסק: מתי הוקם, מי עומד מאחוריו, הניסיון בתחום ומה חשוב לכם בשירות ללקוחות.</p>
    </ContentPage>
  );
}
