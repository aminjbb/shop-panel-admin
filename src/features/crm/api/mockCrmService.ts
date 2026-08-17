import type {
  Customer,
  CustomerFilterParams,
  CustomerListResponse,
  CustomerTier,
  CustomerStatus,
} from "@/types/crm";

const STORAGE_KEY = "dynova_mock_customers_v1";
const NETWORK_LATENCY_MS = 450;

export const INITIAL_MOCK_CUSTOMERS: Customer[] = [
  {
    id: "cust-001",
    name: "سارا ابراهیمی",
    phone: "09123456789",
    email: "sara.ebrahimi@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    totalOrders: 14,
    totalSpent: 48900000,
    lastOrderDate: "2026-08-17T08:45:00.000Z",
    tier: "vip",
    status: "active",
    createdAt: "2024-03-12T10:00:00.000Z",
    city: "تهران",
    notes: "مشتری وفادار قدیمی • خریدار دائمی هدفون و ساعت هوشمند",
  },
  {
    id: "cust-002",
    name: "محمدرضا کاظمی",
    phone: "09351112233",
    email: "m.kazemi.dev@outlook.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    totalOrders: 9,
    totalSpent: 32400000,
    lastOrderDate: "2026-08-17T07:15:00.000Z",
    tier: "gold",
    status: "active",
    createdAt: "2024-06-20T14:30:00.000Z",
    city: "اصفهان",
    notes: "برنامه‌نویس ارشد • سفارش عمده کابل و هاب Type-C",
  },
  {
    id: "cust-003",
    name: "دکتر نیلوفر باقری",
    phone: "09139876543",
    email: "dr.bagheri@health.ir",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    totalOrders: 18,
    totalSpent: 67800000,
    lastOrderDate: "2026-08-16T19:20:00.000Z",
    tier: "vip",
    status: "active",
    createdAt: "2023-11-05T08:15:00.000Z",
    city: "شیراز",
    notes: "عضو باشگاه VIP طلایی • تخفیف ویژه پزشکان",
  },
  {
    id: "cust-004",
    name: "امیرحسین رضایی",
    phone: "09127778899",
    email: "a.rezaei99@yahoo.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    totalOrders: 4,
    totalSpent: 12500000,
    lastOrderDate: "2026-08-16T14:10:00.000Z",
    tier: "silver",
    status: "active",
    createdAt: "2025-01-15T11:20:00.000Z",
    city: "مشهد",
    notes: "علاقه‌مند به لوازم جانبی گیمینگ",
  },
  {
    id: "cust-005",
    name: "فاطمه حسینی‌راد",
    phone: "09145556677",
    email: "f.hosseini@gmail.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
    totalOrders: 2,
    totalSpent: 4800000,
    lastOrderDate: "2026-08-16T10:05:00.000Z",
    tier: "bronze",
    status: "active",
    createdAt: "2025-05-10T16:45:00.000Z",
    city: "تبریز",
    notes: "کاربر جدید • جذب شده از کمپین اینستاگرام",
  },
  {
    id: "cust-006",
    name: "مهندس پیمان یوسفی",
    phone: "09112223344",
    email: "peyman.yousefi@tech.co",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
    totalOrders: 11,
    totalSpent: 41200000,
    lastOrderDate: "2026-08-15T21:40:00.000Z",
    tier: "gold",
    status: "active",
    createdAt: "2024-04-18T09:10:00.000Z",
    city: "رشت",
    notes: "خرید تجهیزات شبکه و ذخیره‌سازی",
  },
  {
    id: "cust-007",
    name: "زهرا سلیمانی",
    phone: "09183334455",
    email: "z.soleimani@gmail.com",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
    totalOrders: 6,
    totalSpent: 18900000,
    lastOrderDate: "2026-08-15T16:30:00.000Z",
    tier: "silver",
    status: "active",
    createdAt: "2024-09-02T13:00:00.000Z",
    city: "کرمانشاه",
    notes: "متقاضی خرید اقساطی",
  },
  {
    id: "cust-008",
    name: "علیرضا نعمتی",
    phone: "09176665544",
    email: "alireza.nemati@gmail.com",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80",
    totalOrders: 1,
    totalSpent: 1950000,
    lastOrderDate: "2026-08-14T11:20:00.000Z",
    tier: "bronze",
    status: "blocked",
    createdAt: "2025-07-22T15:20:00.000Z",
    city: "شیراز",
    notes: "مسدود شده به علت ثبت آدرس غیرواقعی و عدم تحویل",
  },
  {
    id: "cust-009",
    name: "مینا صادقی",
    phone: "09301239876",
    email: "mina.sadeghi.art@gmail.com",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
    totalOrders: 8,
    totalSpent: 29500000,
    lastOrderDate: "2026-08-13T18:00:00.000Z",
    tier: "gold",
    status: "active",
    createdAt: "2024-07-11T12:40:00.000Z",
    city: "کرج",
    notes: "طراح رابط کاربری • خرید قلم نوری و هولدر تبلت",
  },
  {
    id: "cust-010",
    name: "کوروش آریافر",
    phone: "09121114477",
    email: "kourosh.ariafar@studio.ir",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80",
    totalOrders: 15,
    totalSpent: 59300000,
    lastOrderDate: "2026-08-12T14:50:00.000Z",
    tier: "vip",
    status: "active",
    createdAt: "2023-09-14T17:30:00.000Z",
    city: "تهران",
    notes: "استودیوی فیلم‌سازی و صدابرداری دیجیتال",
  },
  {
    id: "cust-011",
    name: "مریم احمدی",
    phone: "09159998877",
    email: "m.ahmadi.eng@gmail.com",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&auto=format&fit=crop&q=80",
    totalOrders: 5,
    totalSpent: 16400000,
    lastOrderDate: "2026-08-11T09:15:00.000Z",
    tier: "silver",
    status: "active",
    createdAt: "2024-12-01T14:15:00.000Z",
    city: "مشهد",
    notes: "خریدار دوره‌ای کیبورد و موس ارگونومیک",
  },
  {
    id: "cust-012",
    name: "حسین توکلی",
    phone: "09368887766",
    email: "tavakoli.hosein@yahoo.com",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80",
    totalOrders: 3,
    totalSpent: 7200000,
    lastOrderDate: "2026-08-10T16:40:00.000Z",
    tier: "bronze",
    status: "active",
    createdAt: "2025-03-20T10:50:00.000Z",
    city: "قم",
    notes: "عضو عادی باشگاه مشتریان",
  },
];

class MockCrmService {
  private getStoredCustomers(): Customer[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.saveCustomers(INITIAL_MOCK_CUSTOMERS);
        return INITIAL_MOCK_CUSTOMERS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_MOCK_CUSTOMERS;
    }
  }

  private saveCustomers(customers: Customer[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    } catch (e) {
      console.error("Failed to save customers to localStorage", e);
    }
  }

  private delay(ms = NETWORK_LATENCY_MS): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async getCustomers(params: CustomerFilterParams = {}): Promise<CustomerListResponse> {
    await this.delay();
    const allCustomers = this.getStoredCustomers();

    const {
      search = "",
      tier = "all",
      status = "all",
      page = 1,
      limit = 8,
      sortBy = "totalSpent",
      sortOrder = "desc",
    } = params;

    // Filter
    let filtered = allCustomers.filter((cust) => {
      // Tier filter
      if (tier !== "all" && cust.tier !== tier) {
        return false;
      }
      // Status filter
      if (status !== "all" && cust.status !== status) {
        return false;
      }
      // Search
      if (search && search.trim()) {
        const query = search.toLowerCase().trim();
        const matchName = cust.name.toLowerCase().includes(query);
        const matchPhone = cust.phone.includes(query);
        const matchEmail = cust.email.toLowerCase().includes(query);
        const matchCity = cust.city ? cust.city.toLowerCase().includes(query) : false;
        if (!matchName && !matchPhone && !matchEmail && !matchCity) {
          return false;
        }
      }
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      if (sortBy === "totalSpent") {
        valA = a.totalSpent;
        valB = b.totalSpent;
      } else if (sortBy === "totalOrders") {
        valA = a.totalOrders;
        valB = b.totalOrders;
      } else if (sortBy === "createdAt") {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      } else if (sortBy === "name") {
        valA = a.name;
        valB = b.name;
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === "asc" ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

    // Counts across all stored
    const counts = {
      all: allCustomers.length,
      vip: allCustomers.filter((c) => c.tier === "vip").length,
      gold: allCustomers.filter((c) => c.tier === "gold").length,
      silver: allCustomers.filter((c) => c.tier === "silver").length,
      bronze: allCustomers.filter((c) => c.tier === "bronze").length,
      active: allCustomers.filter((c) => c.status === "active").length,
      blocked: allCustomers.filter((c) => c.status === "blocked").length,
    };

    const totalSpentSum = allCustomers.reduce((acc, c) => acc + c.totalSpent, 0);
    const averageCustomerValue = allCustomers.length > 0 ? Math.round(totalSpentSum / allCustomers.length) : 0;

    const stats = {
      totalCustomers: allCustomers.length,
      vipCount: counts.vip,
      totalSpentSum,
      averageCustomerValue,
    };

    // Pagination
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (safePage - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      customers: paginated,
      total,
      page: safePage,
      limit,
      totalPages,
      counts,
      stats,
    };
  }

  public async getCustomerById(id: string): Promise<Customer | null> {
    await this.delay(200);
    const customers = this.getStoredCustomers();
    return customers.find((c) => c.id === id) || null;
  }

  public async toggleCustomerStatus(id: string): Promise<Customer> {
    await this.delay(350);
    const customers = this.getStoredCustomers();
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`مشتری با شناسه ${id} یافت نشد`);
    }

    const current = customers[index];
    const newStatus: CustomerStatus = current.status === "active" ? "blocked" : "active";
    const updated: Customer = {
      ...current,
      status: newStatus,
    };

    customers[index] = updated;
    this.saveCustomers(customers);
    return updated;
  }

  public async updateCustomerTier(id: string, tier: CustomerTier): Promise<Customer> {
    await this.delay(350);
    const customers = this.getStoredCustomers();
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`مشتری با شناسه ${id} یافت نشد`);
    }

    const updated: Customer = {
      ...customers[index],
      tier,
    };

    customers[index] = updated;
    this.saveCustomers(customers);
    return updated;
  }

  public async resetCustomersToMock(): Promise<Customer[]> {
    await this.delay(300);
    this.saveCustomers(INITIAL_MOCK_CUSTOMERS);
    return INITIAL_MOCK_CUSTOMERS;
  }
}

export const mockCrmService = new MockCrmService();
export default mockCrmService;
