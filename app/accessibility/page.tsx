import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "הצהרת נגישות",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <ContentPage title="הצהרת נגישות">
      <p>
        {siteConfig.name} רואה חשיבות רבה במתן שירות שוויוני לכלל הלקוחות, ופועלת להנגשת האתר בהתאם לתקן הישראלי
        5568 (המבוסס על הנחיות WCAG 2.0 ברמה AA).
      </p>
      <h2>מה נעשה באתר</h2>
      <ul>
        <li>ניווט מלא באמצעות מקלדת, כולל קישור ״דלגו לתוכן הראשי״.</li>
        <li>תוויות לכל שדות הטפסים והודעות שגיאה ברורות.</li>
        <li>ניגודיות צבעים גבוהה ומצב לילה.</li>
        <li>טקסט חלופי לתמונות ומבנה כותרות תקין.</li>
        <li>תמיכה בהגדרת ״הפחתת תנועה״ של מערכת ההפעלה.</li>
      </ul>
      <h2>רכז/ת נגישות</h2>
      <p>
        נתקלתם בבעיה? נשמח לשמוע ולתקן: {siteConfig.phoneDisplay} · {siteConfig.email}
      </p>
      <p className="text-sm text-muted">תאריך עדכון ההצהרה: יש לעדכן.</p>
    </ContentPage>
  );
}
