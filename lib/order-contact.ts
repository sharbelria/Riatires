"use client";

// Customer details of the order just placed, kept in sessionStorage (this tab only,
// cleared when it closes). Used to pre-fill the WhatsApp message on the confirmation
// page without ever putting personal details in the URL.

export type OrderContact = {
  orderId: string;
  name: string;
  phone: string;
  city: string;
  email?: string;
  notes?: string;
};

const KEY = "riatires-last-order-contact";

export function saveOrderContact(contact: OrderContact) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(contact));
  } catch {
    // storage unavailable – the message just won't include the details
  }
}

/** Raw stored value (a string, so it is stable for useSyncExternalStore). */
export function readOrderContactRaw(): string | null {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function parseOrderContact(raw: string | null, orderId: string): OrderContact | null {
  if (!raw) return null;
  try {
    const c = JSON.parse(raw) as OrderContact;
    return c.orderId === orderId ? c : null;
  } catch {
    return null;
  }
}
