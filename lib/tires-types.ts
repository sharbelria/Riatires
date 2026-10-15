// One row of data/tires.json
export type TireRecord = {
  id: string;
  brand: string;
  model: string;
  width: number;
  profile: number;
  rim: number;
  supplierPrice: number;
  supplierCode?: string; // supplier's catalog number (קוד פריט) – shown only in order emails
  inStock: boolean;
  image?: string;
};

// Public shape – safe to send to the browser (no supplier price or code).
export type Tire = Omit<TireRecord, "supplierPrice" | "supplierCode"> & { price: number; size: string };

export type SizeOption = { width: number; profile: number; rim: number };
