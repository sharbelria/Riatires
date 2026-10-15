// One row of data/tires.json
export type TireRecord = {
  id: string;
  brand: string;
  model: string;
  width: number;
  profile: number;
  rim: number;
  supplierPrice: number;
  inStock: boolean;
  image?: string;
};

// Public shape – safe to send to the browser (no supplier price).
export type Tire = Omit<TireRecord, "supplierPrice"> & { price: number; size: string };

export type SizeOption = { width: number; profile: number; rim: number };
