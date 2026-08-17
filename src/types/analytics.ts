export type TimeRangeFilter = "7d" | "30d" | "90d" | "1y";

export interface SalesTrendPoint {
  date: string;
  revenue: number;
  orders: number;
  formattedRevenue?: string;
  dayName?: string;
}

export interface CategorySalesShare {
  category: string;
  percentage: number;
  revenue?: number;
  ordersCount?: number;
  color: string;
}

export interface RecentOrderSnippet {
  id: string;
  orderNumber: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
  itemsCount: number;
}

export interface TopCustomerSnippet {
  id: string;
  name: string;
  avatar?: string;
  tier: "vip" | "gold" | "silver" | "bronze";
  totalSpent: number;
  totalOrders: number;
  phone: string;
}

export interface KpiMetric {
  value: number;
  formattedValue: string;
  changePercentage: number;
  isPositive: boolean;
  comparisonLabel: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrdersCount: number;
  averageOrderValue: number;
  newCustomersCount: number;
  salesTrend: SalesTrendPoint[];
  categorySalesShare: CategorySalesShare[];
  recentOrdersSnippet: RecentOrderSnippet[];
  topCustomersSnippet?: TopCustomerSnippet[];
  kpis: {
    revenue: KpiMetric;
    orders: KpiMetric;
    aov: KpiMetric;
    customers: KpiMetric;
  };
  timeRange: TimeRangeFilter;
}
