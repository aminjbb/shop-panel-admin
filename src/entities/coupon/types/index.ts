export type CouponType = "percentage" | "fixed";
export type CouponStatus = "active" | "disabled" | "expired";
export type CouponSort = "createdAt" | "code" | "endDate";
export type SortOrder = "asc" | "desc";

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: string;
  minOrderValue: string | null;
  usageLimit: number | null;
  usedCount: number;
  status: CouponStatus;
  startDate: string;
  endDate: string;
  categoryIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CouponListParams {
  search?: string;
  status?: CouponStatus;
  type?: CouponType;
  page?: number;
  limit?: number;
  sortBy?: CouponSort;
  sortOrder?: SortOrder;
}

export interface CouponListResponse {
  coupons: Coupon[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface CreateCouponInput {
  code: string;
  type: CouponType;
  value: string;
  minOrderValue?: string | null;
  usageLimit?: number | null;
  startDate: string;
  endDate: string;
  categoryIds?: string[];
}

export interface UpdateCouponInput {
  code?: string;
  type?: CouponType;
  value?: string;
  minOrderValue?: string | null;
  usageLimit?: number | null;
  startDate?: string;
  endDate?: string;
  categoryIds?: string[];
}

export interface ValidateCouponInput {
  code: string;
  customerId: string;
  cartTotal: string;
  categoryIds?: string[];
}

export interface ValidateCouponResult {
  couponId: string;
  code: string;
  discountAmount: string;
  finalTotal: string;
}
