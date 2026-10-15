import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "מדיניות פרטיות",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <ContentPage title="מדיניות פרטיות">
      <h2>איזה מידע אנחנו אוספים</h2>
      <p>
        בעת ביצוע הזמנה או השארת פרטים נאסף המידע שמסרתם: שם, טלפון, עיר, מייל (אם נמסר) ופרטי ההזמנה. המידע משמש
        לטיפול בהזמנה וליצירת קשר איתכם בלבד.
      </p>
      <h2>פרטי אשראי</h2>
      <p>
        תשלום באשראי מתבצע בדף מאובטח של חברת סליקה העומדת בתקן PCI-DSS. פרטי כרטיס האשראי אינם עוברים דרך האתר
        ואינם נשמרים אצלנו.
      </p>
      <h2>שמירה במכשיר שלכם</h2>
      <p>האתר שומר בדפדפן שלכם את תוכן סל הקניות ואת בחירת מצב יום/לילה, כדי לשפר את חוויית השימוש.</p>
      <h2>מסירת מידע לצד שלישי</h2>
      <p>איננו מוכרים מידע אישי. מידע יועבר לספקי שירות (כגון שליחת מיילים וסליקה) רק לצורך ביצוע ההזמנה.</p>
      <h2>פנייה בנושא פרטיות</h2>
      <p>לעיון, תיקון או מחיקת מידע: {siteConfig.email}</p>
    </ContentPage>
  );
}
