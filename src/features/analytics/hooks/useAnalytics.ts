import { useState, useEffect, useCallback } from "react";
import type { DashboardMetrics, TimeRangeFilter } from "@/types/analytics";
import { mockAnalyticsService } from "../api/mockAnalyticsService";
import useToastStore from "@/shared-app/designSystem/toast/store";

export function useAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>("30d");
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async (range: TimeRangeFilter) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await mockAnalyticsService.getDashboardSummary(range);
      setMetrics(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطا در دریافت شاخص‌های تحلیلی";
      setError(msg);
      useToastStore.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics(timeRange);
  }, [fetchMetrics, timeRange]);

  const handleTimeRangeChange = (range: TimeRangeFilter) => {
    setTimeRange(range);
  };

  const handleRefresh = () => {
    fetchMetrics(timeRange);
    useToastStore.info("شاخص‌های داشبورد به‌روزرسانی شدند.");
  };

  return {
    timeRange,
    metrics,
    isLoading,
    error,
    handleTimeRangeChange,
    handleRefresh,
  };
}

export default useAnalytics;
