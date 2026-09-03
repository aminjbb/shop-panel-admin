export type AnalyticsTimeRange = "7d" | "30d" | "90d" | "1y";

export interface KpiMetric<TValue extends string | number> {
  value: TValue;
  formattedValue: string;
  changePercentage: string;
  isPositive: boolean;
  comparisonLabel: "previous period";
}

export interface AnalyticsKpis {
  totalRevenue: KpiMetric<string>;
  totalOrdersCount: KpiMetric<number>;
  averageOrderValue: KpiMetric<string>;
  newCustomersCount: KpiMetric<number>;
}

export interface SalesTrendPoint {
  date: string;
  revenue: string;
}

export interface CategorySalesShare {
  category: string;
  revenue: string;
  percentage: string;
}

export interface RecentOrderSnippet {
  id: string;
  orderNumber: string;
  paidAmount: string;
  createdAt: string;
}

export interface TopCustomerSnippet {
  name: string;
  paidAmount: string;
}

export interface AnalyticsDashboard {
  timeRangeStart: string;
  timeRangeEnd: string;
  timezone: string;
  kpis: AnalyticsKpis;
  salesTrend: SalesTrendPoint[];
  categorySalesShare: CategorySalesShare[];
  recentOrdersSnippet: RecentOrderSnippet[];
  topCustomersSnippet: TopCustomerSnippet[];
  activeCustomerCount: number;
}

export interface AnalyticsDashboardParams {
  timeRange?: AnalyticsTimeRange;
}
