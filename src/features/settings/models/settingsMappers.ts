import type { AdminStaff as AdminStaffDto } from "@/entities/admin-staff";
import type { ShippingMethod as ShippingMethodDto, ShippingMethodInput } from "@/entities/shipping-method";
import type { StoreSettings as StoreSettingsDto, StoreSettingsInput } from "@/entities/store-settings";
import type { AdminStaff, ShippingMethod, StoreSettings } from "@/types/settings";

export const mapStoreSettings = (dto: StoreSettingsDto): StoreSettings => ({
  storeName: dto.storeName,
  legalName: dto.legalName ?? "",
  supportPhone: dto.supportPhone ?? "",
  supportEmail: dto.supportEmail ?? "",
  address: dto.address ?? "",
  currency: dto.currency,
  taxRate: Number(dto.taxRate) || 0,
  freeShippingThreshold: Number(dto.freeShippingThreshold) || 0,
  orderPrefix: dto.orderPrefix,
  enableOrderTracking: dto.enableOrderTracking,
  invoiceFooterNote: dto.invoiceFooterNote ?? "",
  logoUrl: dto.logoUrl ?? undefined,
  updatedAt: dto.updatedAt,
});

export const toStoreSettingsInput = (model: StoreSettings): StoreSettingsInput => ({
  storeName: model.storeName.trim(),
  legalName: model.legalName.trim() || null,
  supportPhone: model.supportPhone.trim() || null,
  supportEmail: model.supportEmail.trim() || null,
  address: model.address.trim() || null,
  currency: model.currency,
  taxRate: model.taxRate,
  freeShippingThreshold: model.freeShippingThreshold || null,
  orderPrefix: model.orderPrefix.trim(),
  enableOrderTracking: model.enableOrderTracking,
  invoiceFooterNote: model.invoiceFooterNote.trim() || null,
  logoUrl: model.logoUrl?.trim() || null,
});

export const mapShippingMethod = (dto: ShippingMethodDto): ShippingMethod => ({
  id: dto.id,
  title: dto.name,
  description: "",
  cost: Number(dto.price) || 0,
  estimatedDays: String(dto.estimatedDays),
  iconName: dto.iconName,
  isActive: dto.isActive,
  coveredCities: dto.coveredCities === "all" ? ["all"] : dto.coveredCities,
  isFreeOverThreshold: false,
});

export const toShippingMethodInput = (model: Omit<ShippingMethod, "id">): ShippingMethodInput => ({
  name: model.title.trim(),
  price: model.cost,
  estimatedDays: Number.parseInt(model.estimatedDays, 10) || 0,
  coveredCities: model.coveredCities.includes("all") ? null : model.coveredCities,
  iconName: model.iconName,
  isActive: model.isActive,
});

export const mapAdminStaff = (dto: AdminStaffDto): AdminStaff => ({
  id: dto.id,
  fullName: dto.fullName,
  email: dto.email,
  role: dto.role,
  status: dto.isActive ? "active" : "inactive",
  lastLogin: dto.lastLoginAt ?? undefined,
  createdAt: dto.createdAt,
});
