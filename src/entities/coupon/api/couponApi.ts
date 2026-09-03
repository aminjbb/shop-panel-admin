import { apiRequest } from "@/config/api";
import type {
  Coupon,
  CouponListParams,
  CouponListResponse,
  CreateCouponInput,
  UpdateCouponInput,
  ValidateCouponInput,
  ValidateCouponResult,
} from "../types";

export const couponApi = {
  list(
    params: CouponListParams = {},
    signal?: AbortSignal,
  ): Promise<CouponListResponse> {
    return apiRequest({ path: "/coupons", query: { ...params }, signal });
  },

  get(couponId: string, signal?: AbortSignal): Promise<Coupon> {
    return apiRequest({
      path: `/coupons/${encodeURIComponent(couponId)}`,
      signal,
    });
  },

  create(body: CreateCouponInput, signal?: AbortSignal): Promise<Coupon> {
    return apiRequest({ path: "/coupons", method: "POST", body, signal });
  },

  update(
    couponId: string,
    body: UpdateCouponInput,
    signal?: AbortSignal,
  ): Promise<Coupon> {
    return apiRequest({
      path: `/coupons/${encodeURIComponent(couponId)}`,
      method: "PATCH",
      body,
      signal,
    });
  },

  toggleStatus(couponId: string, signal?: AbortSignal): Promise<Coupon> {
    return apiRequest({
      path: `/coupons/${encodeURIComponent(couponId)}/toggle-status`,
      method: "PATCH",
      signal,
    });
  },

  archive(couponId: string, signal?: AbortSignal): Promise<void> {
    return apiRequest({
      path: `/coupons/${encodeURIComponent(couponId)}`,
      method: "DELETE",
      signal,
    });
  },

  validate(
    body: ValidateCouponInput,
    signal?: AbortSignal,
  ): Promise<ValidateCouponResult> {
    return apiRequest({
      path: "/coupons/validate",
      method: "POST",
      body,
      auth: false,
      signal,
    });
  },
};
