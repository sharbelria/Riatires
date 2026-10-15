import { z } from "zod";
import { MAX_LINES, MAX_QTY } from "@/lib/cart-limits";

// Israeli phone: 05X-XXXXXXX, 0X-XXXXXXX or +972…, separators allowed.
const phone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s\-()]/g, ""))
  .refine((v) => /^(\+972|0)([23489]|5\d|7\d)\d{7}$/.test(v), "מספר טלפון לא תקין");

export const contactSchema = z.object({
  name: z.string().trim().min(2, "נא להזין שם").max(80),
  phone,
  details: z.string().trim().max(300).optional().default(""),
  // honeypot field – must stay empty
  website: z.string().max(0).optional(),
});

export type ContactInput = z.input<typeof contactSchema>;

export const paymentMethods = ["card", "cash", "email"] as const;
export type PaymentMethod = (typeof paymentMethods)[number];

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => v || undefined);

export const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2, "נא להזין שם מלא").max(80),
    phone,
    city: z.string().trim().min(2, "נא להזין עיר").max(60),
    email: z
      .union([z.literal(""), z.string().trim().email("כתובת מייל לא תקינה").max(120)])
      .optional()
      .transform((v) => v || undefined),
    notes: optionalText(500),
  }),
  items: z
    .array(z.object({ id: z.string().min(1).max(100), qty: z.number().int().min(1).max(MAX_QTY) }))
    .min(1, "הסל ריק")
    .max(MAX_LINES),
  paymentMethod: z.enum(paymentMethods, { message: "נא לבחור אמצעי תשלום" }),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;
