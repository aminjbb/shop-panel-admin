import type { AnalyticsDashboard } from "@/entities/analytics";
import type { DashboardMetrics, KpiMetric, TimeRangeFilter } from "@/types/analytics";

const toNumber = (value: string | number): number => Number(value) || 0;
const toMetric = (metric: { value: string | number; formattedValue: string; changePercentage: string; isPositive: boolean; comparisonLabel: string }): KpiMetric => ({
  value: toNumber(metric.value),
  formattedValue: metric.formattedValue,
  changePercentage: toNumber(metric.changePercentage),
  isPositive: metric.isPositive,
  comparisonLabel: metric.comparisonLabel,
});

export const toAnalyticsViewModel = (dashboard: AnalyticsDashboard, timeRange: TimeRangeFilter): DashboardMetrics => ({
  totalRevenue: toNumber(dashboard.kpis.totalRevenue.value),
  totalOrdersCount: dashboard.kpis.totalOrdersCount.value,
  averageOrderValue: toNumber(dashboard.kpis.averageOrderValue.value),
  newCustomersCount: dashboard.kpis.newCustomersCount.value,
  salesTrend: dashboard.salesTrend.map((point) => ({ date: point.date, revenue: toNumber(point.revenue), orders: 0 })),
  categorySalesShare: dashboard.categorySalesShare.map((item, index) => ({
    category: item.category,
    percentage: toNumber(item.percentage),
    revenue: toNumber(item.revenue),
    color: ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e"][index % 5],
  })),
  recentOrdersSnippet: dashboard.recentOrdersSnippet.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customer: "—",
    amount: toNumber(order.paidAmount),
    status: "paid",
    date: order.createdAt,
    itemsCount: 0,
  })),
  topCustomersSnippet: dashboard.topCustomersSnippet.map((customer, index) => ({
    id: `${index}-${customer.name}`,
    name: customer.name,
    tier: "vip",
    totalSpent: toNumber(customer.paidAmount),
    totalOrders: 0,
    phone: "—",
  })),
  kpis: {
    revenue: toMetric(dashboard.kpis.totalRevenue),
    orders: toMetric(dashboard.kpis.totalOrdersCount),
    aov: toMetric(dashboard.kpis.averageOrderValue),
    customers: toMetric(dashboard.kpis.newCustomersCount),
  },
  timeRange,
});
