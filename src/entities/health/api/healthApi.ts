import { apiRequest } from "@/config/api";
import type { ApiHealth, ServiceHealth } from "../types";

export const healthApi = {
  getServiceHealth(signal?: AbortSignal): Promise<ServiceHealth> {
    return apiRequest({
      path: "/health",
      base: "origin",
      auth: false,
      signal,
    });
  },

  getApiHealth(signal?: AbortSignal): Promise<ApiHealth> {
    return apiRequest({ path: "/health", auth: false, signal });
  },

  getLiveness(signal?: AbortSignal): Promise<ServiceHealth> {
    return apiRequest({ path: "/health/live", auth: false, signal });
  },

  getReadiness(signal?: AbortSignal): Promise<ApiHealth> {
    return apiRequest({ path: "/health/ready", auth: false, signal });
  },
};
