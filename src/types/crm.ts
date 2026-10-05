export type CouponType = "percentage" | "fixed_amount";
export type CouponStatus = "active" | "expired" | "disabled";

export interface DiscountCoupon {
  id: string;
  code: string; // e.g., "SUMMER2026"
  type: CouponType;
  value: number; // e.g., 20 (%) or 50000 (Toman)
  minOrderValue?: number;
  usageLimit: number | null;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: CouponStatus;
  description?: string;
  applicableCategory?: string;
  createdAt?: string;
}

export interface CouponFilterParams {
  search?: string;
  status?: CouponStatus | "all";
  type?: CouponType | "all";
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "endDate" | "usedCount" | "value";
  sortOrder?: "asc" | "desc";
}

export interface CouponListResponse {
  coupons: DiscountCoupon[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  counts: {
    all: number;
    active: number;
    expired: number;
    disabled: number;
  };
}

export interface CreateCouponPayload {
  code: string;
  type: CouponType;
  value: number;
  minOrderValue?: number;
  usageLimit: number;
  startDate: string;
  endDate: string;
  status?: CouponStatus;
  description?: string;
  applicableCategory?: string;
}

export interface UpdateCouponPayload extends Partial<CreateCouponPayload> {}
