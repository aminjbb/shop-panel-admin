import { apiRequest } from "@/config/api";
import type { ShippingMethod, ShippingMethodInput } from "../types";

export const shippingMethodApi = {
  list(signal?: AbortSignal): Promise<ShippingMethod[]> {
    return apiRequest({ path: "/shipping-methods", signal });
  },
  create(body: ShippingMethodInput): Promise<ShippingMethod> {
    return apiRequest({ path: "/shipping-methods", method: "POST", body });
  },
  update(id: string, body: ShippingMethodInput): Promise<ShippingMethod> {
    return apiRequest({ path: `/shipping-methods/${encodeURIComponent(id)}`, method: "PATCH", body });
  },
  toggleStatus(id: string): Promise<ShippingMethod> {
    return apiRequest({ path: `/shipping-methods/${encodeURIComponent(id)}/toggle-status`, method: "PATCH" });
  },
  remove(id: string): Promise<void> {
    return apiRequest({ path: `/shipping-methods/${encodeURIComponent(id)}`, method: "DELETE" });
  },
};
