import type {
  Coupon,
  CouponListParams,
  CreateCouponInput,
  UpdateCouponInput,
} from "@/entities/coupon";
import type {
  CouponFilterParams,
  CreateCouponPayload,
  DiscountCoupon,
  UpdateCouponPayload,
} from "@/types/crm";

const fromWireType = (type: Coupon["type"]): DiscountCoupon["type"] =>
  type === "fixed" ? "fixed_amount" : "percentage";

const toWireType = (type: DiscountCoupon["type"]): Coupon["type"] =>
  type === "fixed_amount" ? "fixed" : "percentage";

export const toCouponViewModel = (coupon: Coupon): DiscountCoupon => ({
  id: coupon.id,
  code: coupon.code,
  type: fromWireType(coupon.type),
  value: Number(coupon.value),
  minOrderValue: coupon.minOrderValue === null ? undefined : Number(coupon.minOrderValue),
  usageLimit: coupon.usageLimit,
  usedCount: coupon.usedCount,
  startDate: coupon.startDate,
  endDate: coupon.endDate,
  status: coupon.status,
  applicableCategory: coupon.categoryIds[0],
  createdAt: coupon.createdAt,
});

export const toCouponListParams = (filters: CouponFilterParams): CouponListParams => ({
  search: filters.search?.trim() || undefined,
  status: filters.status === "all" ? undefined : filters.status,
  type: filters.type === "all" || !filters.type ? undefined : toWireType(filters.type),
  page: filters.page,
  limit: filters.limit,
  sortBy: filters.sortBy === "usedCount" || filters.sortBy === "value" ? "createdAt" : filters.sortBy,
  sortOrder: filters.sortOrder,
});

export const toCreateCouponInput = (payload: CreateCouponPayload): CreateCouponInput => ({
  code: payload.code,
  type: toWireType(payload.type),
  value: String(payload.value),
  minOrderValue: payload.minOrderValue ? String(payload.minOrderValue) : null,
  usageLimit: payload.usageLimit || null,
  startDate: payload.startDate,
  endDate: payload.endDate,
  categoryIds: payload.applicableCategory ? [payload.applicableCategory] : [],
});

export const toUpdateCouponInput = (payload: UpdateCouponPayload): UpdateCouponInput => {
  const input: UpdateCouponInput = {};
  if (payload.code !== undefined) input.code = payload.code;
  if (payload.type !== undefined) input.type = toWireType(payload.type);
  if (payload.value !== undefined) input.value = String(payload.value);
  if (payload.minOrderValue !== undefined) input.minOrderValue = payload.minOrderValue ? String(payload.minOrderValue) : null;
  if (payload.usageLimit !== undefined) input.usageLimit = payload.usageLimit || null;
  if (payload.startDate !== undefined) input.startDate = payload.startDate;
  if (payload.endDate !== undefined) input.endDate = payload.endDate;
  if (payload.applicableCategory !== undefined) input.categoryIds = payload.applicableCategory ? [payload.applicableCategory] : [];
  return input;
};
