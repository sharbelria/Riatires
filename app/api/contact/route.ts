import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { emailLayout, escapeHtml, ownerEmail, sendEmail } from "@/lib/email";
import { saveContactRequest } from "@/lib/submissions";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" },
      { status: 400 },
    );
  }
  const { name, phone, details } = parsed.data;

  const html = emailLayout(
    "בקשה לחזרה מהאתר",
    `<p><b>שם:</b> ${escapeHtml(name)}</p>
     <p><b>טלפון:</b> <a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></p>
     <p><b>מידת צמיג / דגם רכב:</b> ${escapeHtml(details || "—")}</p>`,
  );

  const [saved, result] = await Promise.all([
    saveContactRequest({ name, phone, details }),
    sendEmail({ to: ownerEmail(), subject: `בקשה לחזרה – ${name}`, html }),
  ]);
  if (saved !== "saved" && !result.ok) {
    return NextResponse.json({ ok: false, error: "שליחת הפנייה נכשלה, נסו שוב או פנו בוואטסאפ" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
