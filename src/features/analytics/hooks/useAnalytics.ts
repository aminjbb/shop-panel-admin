import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/entities/analytics";
import type { TimeRangeFilter } from "@/types/analytics";
import useToastStore from "@/shared-app/designSystem/toast/store";
import { toAnalyticsViewModel } from "../models/analyticsMapper";

export function useAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>("30d");
  const query = useQuery({
    queryKey: ["analytics", "dashboard", timeRange],
    queryFn: ({ signal }) => analyticsApi.getDashboard({ timeRange }, signal),
    select: (dashboard) => toAnalyticsViewModel(dashboard, timeRange),
  });

  useEffect(() => {
    if (query.error) useToastStore.error("خطا در دریافت شاخص‌های تحلیلی");
  }, [query.error]);

  return {
    timeRange,
    metrics: query.data ?? null,
    isLoading: query.isLoading || query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    handleTimeRangeChange: setTimeRange,
    handleRefresh: async () => {
      const result = await query.refetch();
      if (!result.error) useToastStore.info("شاخص‌های داشبورد به‌روزرسانی شدند.");
    },
  };
}

export default useAnalytics;
