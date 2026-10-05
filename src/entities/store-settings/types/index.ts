export type StoreCurrency = "IRT" | "IRR";

export interface StoreSettingsInput {
  storeName: string;
  legalName: string | null;
  supportPhone: string | null;
  supportEmail: string | null;
  address: string | null;
  currency: StoreCurrency;
  taxRate: string | number;
  freeShippingThreshold: string | number | null;
  orderPrefix: string;
  enableOrderTracking: boolean;
  invoiceFooterNote: string | null;
  logoUrl: string | null;
}

export interface StoreSettings extends Omit<StoreSettingsInput, "taxRate" | "freeShippingThreshold"> {
  taxRate: string;
  freeShippingThreshold: string | null;
  updatedAt: string;
}
