import { apiRequest } from "@/config/api";
import type {
  Order,
  OrderInvoice,
  OrderListParams,
  OrderListResponse,
  UpdateFulfillmentInput,
  UpdatePaymentInput,
} from "../types";

export const orderApi = {
  list(params: OrderListParams = {}, signal?: AbortSignal): Promise<OrderListResponse> {
    return apiRequest({ path: "/orders", query: { ...params }, signal });
  },
  get(idOrNumber: string, signal?: AbortSignal): Promise<Order> {
    return apiRequest({ path: `/orders/${encodeURIComponent(idOrNumber)}`, signal });
  },
  updateFulfillment(id: string, body: UpdateFulfillmentInput): Promise<Order> {
    return apiRequest({ path: `/orders/${encodeURIComponent(id)}/fulfillment`, method: "PATCH", body });
  },
  updatePayment(id: string, body: UpdatePaymentInput): Promise<Order> {
    return apiRequest({ path: `/orders/${encodeURIComponent(id)}/payment`, method: "PATCH", body });
  },
  invoice<TStoreSettings = unknown>(id: string, signal?: AbortSignal): Promise<OrderInvoice<TStoreSettings>> {
    return apiRequest({ path: `/orders/${encodeURIComponent(id)}/invoice`, signal });
  },
};
