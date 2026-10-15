import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "תקנון ותנאי שימוש",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <ContentPage title="תקנון ותנאי שימוש">
      <h2>כללי</h2>
      <p>
        האתר מופעל על ידי {siteConfig.legalName}. השימוש באתר וביצוע הזמנות בו כפופים לתנאים המפורטים בתקנון זה.
      </p>
      <h2>מחירים</h2>
      <p>
        המחירים באתר הם לצמיג אחד, בשקלים חדשים, וכוללים התקנה, איזון ומע״מ, אלא אם צוין אחרת. ט.ל.ח.
      </p>
      <h2>הזמנות ותשלום</h2>
      <p>
        ניתן לשלם בכרטיס אשראי דרך דף תשלום מאובטח של חברת סליקה, במזומן במועד ההתקנה, או לשלוח הזמנה במייל ולתאם
        תשלום. ההזמנה תאושר לאחר בדיקת זמינות מול הספק.
      </p>
      <h2>ביטול עסקה</h2>
      <p>ביטול עסקה יתבצע בהתאם לחוק הגנת הצרכן, התשמ״א-1981 ותקנותיו. יש לפרט כאן את מדיניות הביטול וההחזרות.</p>
      <h2>אחריות</h2>
      <p>הצמיגים נמכרים עם אחריות יצרן/יבואן. יש לפרט כאן את תנאי האחריות.</p>
      <h2>יצירת קשר</h2>
      <p>
        לכל שאלה: {siteConfig.phoneDisplay} · {siteConfig.email}
      </p>
    </ContentPage>
  );
}
