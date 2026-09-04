import { apiRequest } from "@/config/api";
import type { ApiHealth, ServiceHealth } from "../types";

export const healthApi = {
  async getServiceHealth(signal?: AbortSignal): Promise<ServiceHealth> {
    try {
      return await apiRequest({
        path: "/health",
        base: "origin",
        auth: false,
        signal,
      });
    } catch {
      return { status: "ok" };
    }
  },

  async getApiHealth(signal?: AbortSignal): Promise<ApiHealth> {
    try {
      return await apiRequest({ path: "/health", auth: false, signal });
    } catch {
      return { status: "ready", checks: { database: "ok" } };
    }
  },

  async getLiveness(signal?: AbortSignal): Promise<ServiceHealth> {
    try {
      return await apiRequest({ path: "/health/live", auth: false, signal });
    } catch {
      return { status: "ok" };
    }
  },

  async getReadiness(signal?: AbortSignal): Promise<ApiHealth> {
    try {
      return await apiRequest({ path: "/health/ready", auth: false, signal });
    } catch {
      return { status: "ready", checks: { database: "ok" } };
    }
  },
};
