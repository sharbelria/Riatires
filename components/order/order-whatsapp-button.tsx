"use client";

import { useSyncExternalStore } from "react";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import { formatPrice } from "@/lib/format";
import { parseOrderContact, readOrderContactRaw } from "@/lib/order-contact";
import { WhatsAppIcon } from "@/components/icons";

type Line = { brand: string; model: string; size: string; qty: number; lineTotal: number };

type Props = {
  orderId: string;
  lines?: Line[];
  total?: number;
  paymentLabel?: string;
  paid?: boolean;
};

const noopSubscribe = () => () => {};

export function OrderWhatsAppButton({ orderId, lines, total, paymentLabel, paid }: Props) {
  // Customer details live only in this browser tab (see lib/order-contact.ts).
  const raw = useSyncExternalStore(noopSubscribe, readOrderContactRaw, () => null);
  const contact = parseOrderContact(raw, orderId);

  const message = [
    `שלום ${siteConfig.name}, ביצעתי הזמנה באתר ואשמח לתאם התקנה.`,
    "",
    orderId && `מספר הזמנה: ${orderId}`,
    contact?.name && `שם: ${contact.name}`,
    contact?.phone && `טלפון: ${contact.phone}`,
    contact?.city && `עיר: ${contact.city}`,
    ...(lines?.length
      ? ["", "פריטים:", ...lines.map((l) => `• ${l.brand} ${l.model} | ${l.size} | ${l.qty} יח׳ | ${formatPrice(l.lineTotal)}`)]
      : []),
    total != null && "",
    total != null && `סה״כ: ${formatPrice(total)} (כולל התקנה, איזון ומע״מ)`,
    paymentLabel && `אמצעי תשלום: ${paymentLabel}${paid ? " (שולם)" : ""}`,
    contact?.notes && `הערות: ${contact.notes}`,
  ]
    .filter((l): l is string => typeof l === "string")
    .join("\n");

  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-bold text-white"
    >
      <WhatsAppIcon /> שליחת ההזמנה בוואטסאפ
    </a>
  );
}
