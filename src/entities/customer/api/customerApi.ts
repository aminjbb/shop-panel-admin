import { apiRequest } from "@/config/api";
import type {
  Customer,
  CustomerDetail,
  CustomerDetailParams,
  CustomerListParams,
  CustomerListResponse,
  SetCustomerTierInput,
} from "../types";

export const customerApi = {
  list(
    params: CustomerListParams = {},
    signal?: AbortSignal,
  ): Promise<CustomerListResponse> {
    return apiRequest({ path: "/customers", query: { ...params }, signal });
  },

  get(
    customerId: string,
    params: CustomerDetailParams = {},
    signal?: AbortSignal,
  ): Promise<CustomerDetail> {
    return apiRequest({
      path: `/customers/${encodeURIComponent(customerId)}`,
      query: { ...params },
      signal,
    });
  },

  toggleStatus(customerId: string, signal?: AbortSignal): Promise<Customer> {
    return apiRequest({
      path: `/customers/${encodeURIComponent(customerId)}/toggle-status`,
      method: "PATCH",
      signal,
    });
  },

  setTier(
    customerId: string,
    body: SetCustomerTierInput,
    signal?: AbortSignal,
  ): Promise<Customer> {
    return apiRequest({
      path: `/customers/${encodeURIComponent(customerId)}/tier`,
      method: "PATCH",
      body,
      signal,
    });
  },
};
