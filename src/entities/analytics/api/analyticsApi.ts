import { apiRequest } from "@/config/api";
import type {
  AnalyticsDashboard,
  AnalyticsDashboardParams,
} from "../types";

export const analyticsApi = {
  getDashboard(
    params: AnalyticsDashboardParams = {},
    signal?: AbortSignal,
  ): Promise<AnalyticsDashboard> {
    return apiRequest({
      path: "/analytics/dashboard",
      query: { ...params },
      signal,
    });
  },
};
