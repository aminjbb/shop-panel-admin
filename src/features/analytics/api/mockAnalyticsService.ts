import type {
  DashboardMetrics,
  TimeRangeFilter,
  SalesTrendPoint,
  CategorySalesShare,
  RecentOrderSnippet,
  TopCustomerSnippet,
} from "@/types/analytics";
import type { Order } from "@/types/order";
import type { Customer } from "@/types/crm";
import { INITIAL_MOCK_ORDERS } from "@/features/orders/api/mockOrderService";
import { INITIAL_MOCK_CUSTOMERS } from "@/features/crm/api/mockCrmService";

const NETWORK_LATENCY_MS = 400;

class MockAnalyticsService {
  private delay(ms = NETWORK_LATENCY_MS): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getStoredOrders(): Order[] {
    try {
      const raw = localStorage.getItem("dynova_mock_orders_v1");
      if (!raw) return INITIAL_MOCK_ORDERS;
      return JSON.parse(raw);
    } catch {
      return INITIAL_MOCK_ORDERS;
    }
  }

  private getStoredCustomers(): Customer[] {
    try {
      const raw = localStorage.getItem("dynova_mock_customers_v1");
      if (!raw) return INITIAL_MOCK_CUSTOMERS;
      return JSON.parse(raw);
    } catch {
      return INITIAL_MOCK_CUSTOMERS;
    }
  }

  public async getDashboardSummary(timeRange: TimeRangeFilter = "30d"): Promise<DashboardMetrics> {
    await this.delay();
    const orders = this.getStoredOrders();
    const customers = this.getStoredCustomers();

    // Base totals from orders
    const paidOrders = orders.filter((o) => o.payment?.status === "paid");
    const totalOrderSum = paidOrders.reduce((sum, o) => sum + (o.finalPayable || o.totalAmount || 0), 0);
    const totalOrdersCount = orders.length;

    // Build TimeRange-specific Trend data & Metrics
    let salesTrend: SalesTrendPoint[] = [];
    let revenueMultiplier = 1;
    let periodLabel = "نسبت به ۳۰ روز قبل";

    if (timeRange === "7d") {
      revenueMultiplier = 0.28;
      periodLabel = "نسبت به هفته قبل";
      salesTrend = [
        { date: "۲۲ مرداد", dayName: "دوشنبه", revenue: 8450000, orders: 3 },
        { date: "۲۳ مرداد", dayName: "سه‌شنبه", revenue: 14200000, orders: 5 },
        { date: "۲۴ مرداد", dayName: "چهارشنبه", revenue: 11800000, orders: 4 },
        { date: "۲۵ مرداد", dayName: "پنج‌شنبه", revenue: 22600000, orders: 8 },
        { date: "۲۶ مرداد", dayName: "جمعه", revenue: 19400000, orders: 7 },
        { date: "۲۷ مرداد", dayName: "شنبه", revenue: 26800000, orders: 9 },
        { date: "۲۸ مرداد", dayName: "امروز", revenue: 31200000, orders: 11 },
      ];
    } else if (timeRange === "30d") {
      revenueMultiplier = 1;
      periodLabel = "نسبت به ماه قبل";
      salesTrend = [
        { date: "۱ مرداد", revenue: 18500000, orders: 6 },
        { date: "۵ مرداد", revenue: 24200000, orders: 8 },
        { date: "۱۰ مرداد", revenue: 31000000, orders: 11 },
        { date: "۱۵ مرداد", revenue: 28400000, orders: 9 },
        { date: "۲۰ مرداد", revenue: 42600000, orders: 14 },
        { date: "۲۵ مرداد", revenue: 38900000, orders: 12 },
        { date: "۲۸ مرداد", revenue: 52100000, orders: 17 },
      ];
    } else if (timeRange === "90d") {
      revenueMultiplier = 2.85;
      periodLabel = "نسبت به فصل قبل";
      salesTrend = [
        { date: "خرداد هفته ۱", revenue: 65000000, orders: 22 },
        { date: "خرداد هفته ۳", revenue: 84000000, orders: 28 },
        { date: "تیر هفته ۱", revenue: 98000000, orders: 34 },
        { date: "تیر هفته ۳", revenue: 115000000, orders: 41 },
        { date: "مرداد هفته ۱", revenue: 142000000, orders: 48 },
        { date: "مرداد هفته ۳", revenue: 178000000, orders: 56 },
      ];
    } else {
      // 1y
      revenueMultiplier = 9.4;
      periodLabel = "نسبت به سال قبل";
      salesTrend = [
        { date: "فروردین", revenue: 180000000, orders: 62 },
        { date: "اردیبهشت", revenue: 240000000, orders: 85 },
        { date: "خرداد", revenue: 310000000, orders: 104 },
        { date: "تیر", revenue: 390000000, orders: 135 },
        { date: "مرداد", revenue: 485000000, orders: 168 },
        { date: "شهریور", revenue: 420000000, orders: 142 },
      ];
    }

    // Format revenue in trend
    salesTrend = salesTrend.map((t) => ({
      ...t,
      formattedRevenue: `${(t.revenue / 1000000).toFixed(1)} م تومان`,
    }));

    // Category Sales Share
    const categorySalesShare: CategorySalesShare[] = [
      {
        category: "صوتی و هدفون",
        percentage: 38,
        revenue: Math.round(totalOrderSum * 0.38 * revenueMultiplier),
        ordersCount: 42,
        color: "#6366f1", // Indigo
      },
      {
        category: "ساعت و دستبند هوشمند",
        percentage: 27,
        revenue: Math.round(totalOrderSum * 0.27 * revenueMultiplier),
        ordersCount: 31,
        color: "#38bdf8", // Sky
      },
      {
        category: "پاوربانک و شارژر",
        percentage: 18,
        revenue: Math.round(totalOrderSum * 0.18 * revenueMultiplier),
        ordersCount: 24,
        color: "#10b981", // Emerald
      },
      {
        category: "کابل و مبدل Type-C",
        percentage: 11,
        revenue: Math.round(totalOrderSum * 0.11 * revenueMultiplier),
        ordersCount: 19,
        color: "#f59e0b", // Amber
      },
      {
        category: "پایه‌ها و اکسسوری",
        percentage: 6,
        revenue: Math.round(totalOrderSum * 0.06 * revenueMultiplier),
        ordersCount: 8,
        color: "#ec4899", // Pink
      },
    ];

    // Compute active dynamic KPI numbers
    const activeRevenue = Math.round(totalOrderSum * revenueMultiplier) || 135700000;
    const activeOrdersCount = Math.round(totalOrdersCount * (timeRange === "7d" ? 1 : timeRange === "30d" ? 2.5 : timeRange === "90d" ? 6 : 18));
    const activeAov = activeOrdersCount > 0 ? Math.round(activeRevenue / activeOrdersCount) : 4850000;
    const activeNewCustomers = timeRange === "7d" ? 14 : timeRange === "30d" ? 48 : timeRange === "90d" ? 135 : 420;

    // Recent orders snippet from actual orders
    const recentOrdersSnippet: RecentOrderSnippet[] = orders.slice(0, 5).map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customer: o.customer?.name || "کاربر ناشناس",
      amount: o.finalPayable || o.totalAmount || 0,
      status: o.fulfillment?.status || "processing",
      date: o.createdAt ? new Date(o.createdAt).toLocaleDateString("fa-IR") : "امروز",
      itemsCount: (o.items || []).reduce((s, i) => s + (i.quantity || 1), 0),
    }));

    // Top VIP Customers snippet
    const sortedCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent);
    const topCustomersSnippet: TopCustomerSnippet[] = sortedCustomers.slice(0, 4).map((c) => ({
      id: c.id,
      name: c.name,
      avatar: c.avatar,
      tier: c.tier,
      totalSpent: c.totalSpent,
      totalOrders: c.totalOrders,
      phone: c.phone,
    }));

    return {
      totalRevenue: activeRevenue,
      totalOrdersCount: activeOrdersCount,
      averageOrderValue: activeAov,
      newCustomersCount: activeNewCustomers,
      salesTrend,
      categorySalesShare,
      recentOrdersSnippet,
      topCustomersSnippet,
      timeRange,
      kpis: {
        revenue: {
          value: activeRevenue,
          formattedValue: `${(activeRevenue / 1000000).toLocaleString("fa-IR", { maximumFractionDigits: 1 })} م تومان`,
          changePercentage: 14.8,
          isPositive: true,
          comparisonLabel: periodLabel,
        },
        orders: {
          value: activeOrdersCount,
          formattedValue: `${activeOrdersCount.toLocaleString("fa-IR")} سفارش`,
          changePercentage: 9.2,
          isPositive: true,
          comparisonLabel: periodLabel,
        },
        aov: {
          value: activeAov,
          formattedValue: `${activeAov.toLocaleString("fa-IR")} تومان`,
          changePercentage: 5.4,
          isPositive: true,
          comparisonLabel: periodLabel,
        },
        customers: {
          value: activeNewCustomers,
          formattedValue: `${activeNewCustomers.toLocaleString("fa-IR")} نفر`,
          changePercentage: 18.5,
          isPositive: true,
          comparisonLabel: periodLabel,
        },
      },
    };
  }
}

export const mockAnalyticsService = new MockAnalyticsService();
export default mockAnalyticsService;
