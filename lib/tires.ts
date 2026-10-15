import "server-only";
import rawTires from "@/data/tires.json";
import { siteConfig } from "@/lib/site-config";
import type { SizeOption, Tire, TireRecord } from "@/lib/tires-types";

export type { SizeOption, Tire, TireRecord };

/**
 * Selling price per tire, calculated – never typed by hand:
 * round((supplierPrice + markup) * (1 + VAT))
 */
export function sellingPrice(supplierPrice: number): number {
  const { markupIls, vatRate } = siteConfig.pricing;
  return Math.round((supplierPrice + markupIls) * (1 + vatRate));
}

export function formatSize(t: SizeOption): string {
  return `${t.width}/${t.profile}R${t.rim}`;
}

const catalog: Tire[] = (rawTires as TireRecord[]).map(({ supplierPrice, ...t }) => ({
  ...t,
  price: sellingPrice(supplierPrice),
  size: formatSize(t),
}));

export function getAllTires(): Tire[] {
  return catalog;
}

export function getTireById(id: string): Tire | undefined {
  return catalog.find((t) => t.id === id);
}

export function findTires(width: number, profile: number, rim: number): Tire[] {
  return catalog
    .filter((t) => t.width === width && t.profile === profile && t.rim === rim)
    .sort((a, b) => a.price - b.price);
}

/** Unique sizes that actually exist in the catalog – feeds the search dropdowns. */
export function getSizeOptions(): SizeOption[] {
  const seen = new Map<string, SizeOption>();
  for (const t of catalog) {
    const key = formatSize(t);
    if (!seen.has(key)) seen.set(key, { width: t.width, profile: t.profile, rim: t.rim });
  }
  return [...seen.values()];
}

export function getBrands(): string[] {
  return [...new Set(catalog.map((t) => t.brand))].sort();
}
