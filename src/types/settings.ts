export type CurrencyType = "IRT" | "IRR";

export interface StoreSettings {
  storeName: string;
  legalName: string;
  supportPhone: string;
  supportEmail: string;
  address: string;
  currency: CurrencyType;
  taxRate: number; // percentage (e.g. 10)
  freeShippingThreshold: number; // in Tomans/Rials
  orderPrefix: string; // e.g. "DYN-"
  enableOrderTracking: boolean;
  invoiceFooterNote: string;
  logoUrl?: string;
  updatedAt?: string;
}

export interface ShippingMethod {
  id: string;
  title: string;
  description: string;
  cost: number;
  estimatedDays: string; // e.g. "۱ الی ۲ روز کاری"
  iconName: "truck" | "zap" | "motorcycle" | "plane" | "box";
  isActive: boolean;
  coveredCities: string[]; // e.g. ["تهران", "کرج"] or ["all"]
  isFreeOverThreshold: boolean;
}

export type CreateShippingMethodPayload = Omit<ShippingMethod, "id">;

export type AdminRole = "super_admin" | "inventory_manager" | "support_agent";
export type AdminStaffStatus = "active" | "inactive";

export interface AdminStaff {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: AdminRole;
  status: AdminStaffStatus;
  avatarUrl?: string;
  avatar?: string;
  lastLogin?: string;
  lastActive?: string;
  createdAt: string;
}

export interface StaffFilterParams {
  search?: string;
  role?: AdminRole | "all";
  status?: AdminStaffStatus | "all";
  page?: number;
  pageSize?: number;
  limit?: number;
}

export interface CreateStaffPayload {
  fullName: string;
  email: string;
  phone?: string;
  role: AdminRole;
  status: AdminStaffStatus;
  avatarUrl?: string;
}
