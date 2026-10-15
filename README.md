# Riatires – Tire Shop Website

Next.js (App Router) + TypeScript + Tailwind CSS. Hebrew, right-to-left, light/dark mode.

[English](#english) · [עברית](#עברית)

---

## English

### 1. Install & run locally

Requirements: [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Other commands:

| Command         | What it does                         |
| --------------- | ------------------------------------ |
| `npm run dev`   | Development server with live reload  |
| `npm run build` | Production build (must pass)         |
| `npm start`     | Runs the production build            |
| `npm run lint`  | Code checks                          |

### 2. Edit tires and prices – `data/tires.json`

Every tire is one object in the list:

```json
{
  "id": "205-55-16-michelin-primacy4",
  "brand": "Michelin",
  "model": "Primacy 4+",
  "width": 205,
  "profile": 55,
  "rim": 16,
  "supplierPrice": 420,
  "inStock": true,
  "image": "/tires/michelin-primacy4.png"
}
```

| Field           | Meaning                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------- |
| `id`            | Unique id, letters/numbers/dashes only. Suggested: `width-profile-rim-brand-model`.        |
| `brand`/`model` | Shown on the card.                                                                        |
| `width`         | Tire width, e.g. `205` (number, no quotes).                                               |
| `profile`       | Profile / aspect ratio, e.g. `55`.                                                        |
| `rim`           | Rim diameter in inches, e.g. `16`.                                                        |
| `supplierPrice` | **Your cost per tire in ₪, before VAT.** The site price is calculated from it.            |
| `supplierCode`  | Optional. The supplier's item code (קוד פריט). Shown only in your order emails, never on the site. |
| `inStock`       | `true` = "במלאי", `false` = "בהזמנה מיוחדת" (still orderable).                              |
| `image`         | Optional. Put the picture in `public/tires/` and write `/tires/file.png`.                  |

**Selling price is calculated automatically, never typed by hand:**

```
sellingPrice = round((supplierPrice + 100) * 1.18)
```

So a supplier price of ₪420 sells for round(520 × 1.18) = **₪614**. To change the ₪100 markup or the VAT rate, edit `pricing` in `lib/site-config.ts`.

Tips:

- The search dropdowns are built from this file. A size appears in the dropdowns only if at least one tire in the file has it.
- For ~17 sizes × 2 brands, add ~34 objects. Separate them with commas; the last one has no comma after it.
- Validate the file at https://jsonlint.com if the site fails to start after an edit.
- Don't change the `id` of a tire that customers may have in their cart (they'll be asked to refresh their cart).
- Supplier prices are never sent to the browser.

### 3. Contact details

All contact info (phone, WhatsApp number and greeting, email, address, hours) lives in **`lib/site-config.ts`**. Change it once and it updates everywhere.

### 4. Environment variables – `.env.local`

Copy `.env.example` to `.env.local` and fill it in:

```bash
cp .env.example .env.local
```

| Variable                   | Required    | Purpose                                                                 |
| -------------------------- | ----------- | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | production  | Your public address, e.g. `https://www.riatires.co.il`                  |
| `ORDER_SECRET`             | production  | Long random string that signs order links and payment callbacks          |
| `RESEND_API_KEY`           | yes         | Sends order emails                                                      |
| `EMAIL_FROM`               | yes         | Sender, on a domain verified in Resend                                  |
| `ORDER_EMAIL_TO`           | no          | Who receives orders (defaults to the email in `site-config.ts`)         |
| `PAYMENT_PROVIDER`         | for credit  | `cardcom` (real) or `mock` (local test gateway)                          |
| `CARDCOM_TERMINAL_NUMBER`  | for credit  | From your Cardcom account                                               |
| `CARDCOM_API_NAME`         | for credit  | From your Cardcom account                                               |

**Email (Resend):**

1. Sign up at https://resend.com and create an API key → `RESEND_API_KEY`.
2. Add and verify your domain (Domains → Add) so you can send from e.g. `orders@your-domain.co.il` → `EMAIL_FROM`.
3. Until the domain is verified, `onboarding@resend.dev` works but only delivers to the email you signed up with.

Without `RESEND_API_KEY` (local development), emails are printed to the terminal instead of being sent.

**What gets emailed:**

- Every order (any payment method) → you: customer name, phone, city, email, notes, items, sizes, quantities, total, payment method.
- Cash / email orders → the customer too, if they entered an email.
- Credit-card orders → you get "new order (awaiting payment)" right away, then "✅ payment received" once Cardcom confirms the payment server-to-server. Turn on Cardcom's own receipt/invoice emails for the customer in your Cardcom dashboard.

**Credit card (Cardcom):**

The customer is redirected to **Cardcom's hosted, PCI-compliant payment page**. Card numbers never reach this website or its server.

1. Open a Cardcom account and get your terminal number and API name (ask Cardcom for "API v11 / Low Profile").
2. Set `PAYMENT_PROVIDER=cardcom`, `CARDCOM_TERMINAL_NUMBER`, `CARDCOM_API_NAME`.
3. Cardcom calls `https://your-domain/api/payments/cardcom/webhook` after each payment. The site re-checks the payment with Cardcom's API and compares the amount before emailing you, so the callback can't be faked. The site must be on a public HTTPS address for this to work (not localhost).
4. Do a real ₪1 test with Cardcom's test terminal before going live.

The adapter is in `lib/payments/cardcom.ts`. Field names follow Cardcom's API v11. Check them against Cardcom's current docs when you get your account. To use Tranzila or Grow (Meshulam) instead, add a file next to it that implements the `PaymentProvider` interface in `lib/payments/types.ts` and register it in `lib/payments/index.ts`.

**Local testing without Cardcom:** with `PAYMENT_PROVIDER=mock` (the default in `npm run dev`), "תשלום באשראי" opens a fake test page with "success" / "failure" buttons. It is automatically disabled in production unless you set `PAYMENT_PROVIDER=mock`, which you should never do on the live site.

### 5. Deploy to Vercel

1. Push the project to a GitHub repository.
2. Go to https://vercel.com → **Add New → Project** → import the repository. Framework: Next.js (auto-detected).
3. Under **Environment Variables** add everything from your `.env.local` (`NEXT_PUBLIC_SITE_URL`, `ORDER_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `PAYMENT_PROVIDER`, `CARDCOM_*`).
4. Click **Deploy**.
5. Add your domain under **Settings → Domains**, then set `NEXT_PUBLIC_SITE_URL` to it and redeploy.

To update prices later: edit `data/tires.json`, commit and push. Vercel redeploys automatically.

### 6. Before going live – checklist

- [ ] Check `data/tires.json` against your current supplier price list (it was loaded from the holiday-promo list valid until 30.9.2026).
- [ ] Edit the texts in `app/about`, `app/terms`, `app/privacy`, `app/accessibility` (marked "טקסט לדוגמה").
- [ ] Replace the sample testimonials in `components/home/sections.tsx`.
- [ ] Set address and hours in `lib/site-config.ts`.
- [ ] Brand logos: the brands grid is in `components/home/sections.tsx` (`featuredBrands`).
- [ ] All environment variables set on Vercel, one full test order with each payment method.

### Project structure

```
app/                    pages and API routes
  page.tsx              home
  tires/                search results (/tires?width=205&profile=55&rim=16)
  cart/  checkout/      cart and checkout
  order/[id]/           order confirmation
  api/orders            creates orders: validates, recalculates prices, emails
  api/contact           callback form
  api/payments/…        payment callbacks (Cardcom webhook, test gateway)
components/             UI (layout, home, tires, cart, checkout)
data/tires.json         price list
lib/site-config.ts      contact details and pricing rules
lib/tires.ts            catalog + price calculation (server only)
lib/orders.ts           order pricing and signed order links
lib/payments/           payment gateway adapters
lib/email.ts            Resend email sending
```

Orders are not stored in a database: each order is emailed to you, and the confirmation link carries a signed, tamper-proof summary. If you want an order history dashboard later, a database (e.g. Vercel Postgres or Supabase) can be added.

---

<div dir="rtl">

## עברית

### 1. התקנה והרצה מקומית

צריך [Node.js](https://nodejs.org) בגרסה 20 ומעלה. בתיקיית הפרויקט מריצים:

```bash
npm install
npm run dev
```

ופותחים בדפדפן: http://localhost:3000

- `npm run build`: בנייה לפרודקשן (חייבת לעבור בלי שגיאות)
- `npm start`: הרצת הגרסה הבנויה

### 2. עריכת צמיגים ומחירים: `data/tires.json`

כל צמיג הוא אובייקט אחד ברשימה:

```json
{
  "id": "205-55-16-michelin-primacy4",
  "brand": "Michelin",
  "model": "Primacy 4+",
  "width": 205,
  "profile": 55,
  "rim": 16,
  "supplierPrice": 420,
  "inStock": true
}
```

- **id**: מזהה ייחודי, באותיות לועזיות, מספרים ומקפים בלבד. מומלץ: רוחב-חתך-קוטר-מותג-דגם.
- **brand / model**: שם המותג והדגם.
- **width / profile / rim**: רוחב, חתך וקוטר, כמספרים בלי מרכאות.
- **supplierPrice**: **מחיר הספק לצמיג בש״ח, לפני מע״מ.**
- **supplierCode** (לא חובה): קוד הפריט אצל הספק. מופיע רק במייל ההזמנה שלכם, לא באתר.
- **inStock**: ‏`true` מציג ״במלאי״, ‏`false` מציג ״בהזמנה מיוחדת״.
- **image** (לא חובה): שמים את התמונה בתיקייה `public/tires/` וכותבים `/tires/שם-הקובץ.png`.

**מחיר המכירה מחושב אוטומטית ולא מוקלד ידנית:**

```
מחיר מכירה = עיגול((מחיר ספק + 100) × 1.18)
```

לדוגמה: מחיר ספק 420 ₪ ← (420+100)×1.18 = **614 ₪** (כולל התקנה, איזון ומע״מ).
כדי לשנות את התוספת (100 ₪) או את אחוז המע״מ, עורכים את `pricing` בקובץ `lib/site-config.ts`.

טיפים:

- הרשימות הנפתחות בחיפוש נבנות מהקובץ הזה. מידה מופיעה רק אם יש לפחות צמיג אחד בקובץ באותה מידה.
- בין אובייקט לאובייקט שמים פסיק, ואחרי האחרון אין פסיק.
- אם האתר לא עולה אחרי עריכה, בדקו את הקובץ ב-https://jsonlint.com.
- מחירי הספק לעולם לא נשלחים לדפדפן של הלקוח.

### 3. פרטי התקשרות

כל פרטי הקשר (טלפון, וואטסאפ והודעת הפתיחה, מייל, כתובת, שעות פעילות) נמצאים בקובץ אחד: **`lib/site-config.ts`**.

### 4. הגדרת `.env.local` (מייל וסליקה)

מעתיקים את `.env.example` לקובץ חדש בשם `.env.local` וממלאים:

- **ORDER_SECRET**: מחרוזת אקראית ארוכה (32 תווים ומעלה). חובה בפרודקשן.
- **RESEND_API_KEY / EMAIL_FROM**: נרשמים ב-https://resend.com, יוצרים מפתח API ומאמתים את הדומיין שלכם.
- **PAYMENT_PROVIDER=cardcom** + **CARDCOM_TERMINAL_NUMBER** + **CARDCOM_API_NAME**: מקבלים מ-Cardcom.

**מה נשלח במייל:** כל הזמנה (בכל אמצעי תשלום) נשלחת אליכם עם שם, טלפון, עיר, פריטים, מידות, כמויות, סה״כ ואמצעי תשלום. אם הלקוח השאיר מייל, הוא מקבל אישור (בהזמנות מזומן/מייל). בהזמנת אשראי תקבלו מייל ״הזמנה חדשה״ מיד, ומייל ״✅ התשלום התקבל״ אחרי ש-Cardcom מאשרת את התשלום.

**אשראי:** הלקוח מועבר לדף תשלום מאובטח של Cardcom (תקן PCI). מספרי כרטיסי אשראי לא עוברים דרך האתר ולא נשמרים בו.

**בדיקה מקומית בלי Cardcom:** בהרצה מקומית, ״תשלום באשראי״ פותח דף בדיקה מדומה עם כפתורי ״הצליח״ ו״נכשל״. בפרודקשן הדף הזה כבוי.

בלי `RESEND_API_KEY` (בפיתוח), המיילים מודפסים בטרמינל במקום להישלח.

### 5. העלאה ל-Vercel

1. מעלים את הפרויקט ל-GitHub.
2. ב-https://vercel.com לוחצים **Add New → Project** ובוחרים את הריפו.
3. ב-**Environment Variables** מוסיפים את כל המשתנים מ-`.env.local`.
4. לוחצים **Deploy**.
5. מחברים דומיין ב-**Settings → Domains**, מעדכנים את `NEXT_PUBLIC_SITE_URL` ומבצעים Deploy מחדש.

לעדכון מחירים בהמשך: עורכים את `data/tires.json`, מבצעים commit ו-push, ו-Vercel מעדכן את האתר אוטומטית.

### 6. לפני העלייה לאוויר

- [ ] לוודא שהמחירים ב-`data/tires.json` תואמים למחירון העדכני של הספק (נטען ממבצע החגים שתוקפו עד 30.9.2026).
- [ ] לערוך את הטקסטים בדפי אודות, תקנון, פרטיות ונגישות (מסומנים ״טקסט לדוגמה״).
- [ ] להחליף את ההמלצות לדוגמה ב-`components/home/sections.tsx`.
- [ ] לעדכן כתובת ושעות פעילות ב-`lib/site-config.ts`.
- [ ] להגדיר את כל משתני הסביבה ב-Vercel ולבצע הזמנת בדיקה בכל אמצעי תשלום.

</div>
