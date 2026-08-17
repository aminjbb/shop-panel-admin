import type {
  DiscountCoupon,
  CouponFilterParams,
  CouponListResponse,
  CreateCouponPayload,
  UpdateCouponPayload,
  CouponStatus,
} from "@/types/crm";

const STORAGE_KEY = "dynova_mock_coupons_v1";
const NETWORK_LATENCY_MS = 450;

export const INITIAL_MOCK_COUPONS: DiscountCoupon[] = [
  {
    id: "coup-001",
    code: "SUMMER2026",
    type: "percentage",
    value: 20, // 20%
    minOrderValue: 2000000,
    usageLimit: 200,
    usedCount: 142,
    startDate: "2026-06-20T00:00:00.000Z",
    endDate: "2026-09-22T23:59:59.000Z",
    status: "active",
    description: "تخفیف ۲۰ درصدی جشنواره تابستانه برای سفارش‌های بالای ۲ میلیون تومان",
    applicableCategory: "همه کالاها",
    createdAt: "2026-06-18T10:00:00.000Z",
  },
  {
    id: "coup-002",
    code: "WELCOME-DYNOVA",
    type: "fixed_amount",
    value: 250000, // 250,000 Toman
    minOrderValue: 1000000,
    usageLimit: 500,
    usedCount: 318,
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-12-30T23:59:59.000Z",
    status: "active",
    description: "هدیه ۲۵۰ هزار تومانی خوش‌آمدگویی برای اولین خرید کاربران جدید",
    applicableCategory: "همه کالاها",
    createdAt: "2026-01-01T08:00:00.000Z",
  },
  {
    id: "coup-003",
    code: "TECH50",
    type: "percentage",
    value: 15,
    minOrderValue: 3500000,
    usageLimit: 80,
    usedCount: 78,
    startDate: "2026-08-01T00:00:00.000Z",
    endDate: "2026-08-31T23:59:59.000Z",
    status: "active",
    description: "۱۵٪ تخفیف ویژه خرید قطعات هوشمند و هدفون‌های نویزکنسلینگ",
    applicableCategory: "صوتی و تصویری",
    createdAt: "2026-08-01T12:00:00.000Z",
  },
  {
    id: "coup-004",
    code: "VIP-GOLDEN",
    type: "fixed_amount",
    value: 1000000, // 1,000,000 Toman
    minOrderValue: 8000000,
    usageLimit: 50,
    usedCount: 34,
    startDate: "2026-07-15T00:00:00.000Z",
    endDate: "2026-10-15T23:59:59.000Z",
    status: "active",
    description: "کوپن طلایی ۱ میلیون تومانی ویژه مشتریان VIP",
    applicableCategory: "همه کالاها",
    createdAt: "2026-07-14T09:30:00.000Z",
  },
  {
    id: "coup-005",
    code: "SPRING-EXPIRED",
    type: "percentage",
    value: 25,
    minOrderValue: 1500000,
    usageLimit: 100,
    usedCount: 100,
    startDate: "2026-03-20T00:00:00.000Z",
    endDate: "2026-05-20T23:59:59.000Z",
    status: "expired",
    description: "تخفیف ۲۵٪ جشنواره نوروز و بهار (منقضی شده)",
    applicableCategory: "گجت‌ها",
    createdAt: "2026-03-15T15:00:00.000Z",
  },
  {
    id: "coup-006",
    code: "FLASH-SALE",
    type: "fixed_amount",
    value: 500000,
    minOrderValue: 4000000,
    usageLimit: 40,
    usedCount: 12,
    startDate: "2026-08-10T00:00:00.000Z",
    endDate: "2026-08-25T23:59:59.000Z",
    status: "disabled",
    description: "تخفیف ساعتی متوقف شده توسط مدیر فروش",
    applicableCategory: "لوازم جانبی",
    createdAt: "2026-08-09T18:20:00.000Z",
  },
  {
    id: "coup-007",
    code: "BLACKFRIDAY-PRE",
    type: "percentage",
    value: 30,
    minOrderValue: 5000000,
    usageLimit: 150,
    usedCount: 0,
    startDate: "2026-11-20T00:00:00.000Z",
    endDate: "2026-11-30T23:59:59.000Z",
    status: "active",
    description: "پیش‌فروش کوپن‌های جمعه سیاه با ۳۰٪ تخفیف",
    applicableCategory: "تمامی دسته‌ها",
    createdAt: "2026-08-01T11:00:00.000Z",
  },
];

class MockCouponService {
  private getStoredCoupons(): DiscountCoupon[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.saveCoupons(INITIAL_MOCK_COUPONS);
        return INITIAL_MOCK_COUPONS;
      }
      const coupons: DiscountCoupon[] = JSON.parse(raw);
      // Auto-check expired coupons
      const now = new Date().getTime();
      let hasChanges = false;
      const updated = coupons.map((c) => {
        const endTime = new Date(c.endDate).getTime();
        if (endTime < now && c.status === "active") {
          hasChanges = true;
          return { ...c, status: "expired" as CouponStatus };
        }
        return c;
      });

      if (hasChanges) {
        this.saveCoupons(updated);
        return updated;
      }
      return coupons;
    } catch {
      return INITIAL_MOCK_COUPONS;
    }
  }

  private saveCoupons(coupons: DiscountCoupon[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
    } catch (e) {
      console.error("Failed to save coupons to localStorage", e);
    }
  }

  private delay(ms = NETWORK_LATENCY_MS): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async getCoupons(params: CouponFilterParams = {}): Promise<CouponListResponse> {
    await this.delay();
    const allCoupons = this.getStoredCoupons();

    const {
      search = "",
      status = "all",
      type = "all",
      page = 1,
      limit = 8,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    // Filter
    let filtered = allCoupons.filter((c) => {
      // Status filter
      if (status !== "all" && c.status !== status) {
        return false;
      }
      // Type filter
      if (type !== "all" && c.type !== type) {
        return false;
      }
      // Search
      if (search && search.trim()) {
        const query = search.toLowerCase().trim();
        const matchCode = c.code.toLowerCase().includes(query);
        const matchDesc = c.description ? c.description.toLowerCase().includes(query) : false;
        const matchCat = c.applicableCategory ? c.applicableCategory.toLowerCase().includes(query) : false;
        if (!matchCode && !matchDesc && !matchCat) {
          return false;
        }
      }
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      if (sortBy === "createdAt") {
        valA = new Date(a.createdAt || a.startDate).getTime();
        valB = new Date(b.createdAt || b.startDate).getTime();
      } else if (sortBy === "endDate") {
        valA = new Date(a.endDate).getTime();
        valB = new Date(b.endDate).getTime();
      } else if (sortBy === "usedCount") {
        valA = a.usedCount;
        valB = b.usedCount;
      } else if (sortBy === "value") {
        valA = a.value;
        valB = b.value;
      }

      return sortOrder === "asc" ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

    // Counts
    const counts = {
      all: allCoupons.length,
      active: allCoupons.filter((c) => c.status === "active").length,
      expired: allCoupons.filter((c) => c.status === "expired").length,
      disabled: allCoupons.filter((c) => c.status === "disabled").length,
    };

    // Pagination
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (safePage - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      coupons: paginated,
      total,
      page: safePage,
      limit,
      totalPages,
      counts,
    };
  }

  public async getCouponById(id: string): Promise<DiscountCoupon | null> {
    await this.delay(200);
    const coupons = this.getStoredCoupons();
    return coupons.find((c) => c.id === id) || null;
  }

  public async createCoupon(payload: CreateCouponPayload): Promise<DiscountCoupon> {
    await this.delay(500);
    const coupons = this.getStoredCoupons();

    // Check code duplication
    const cleanCode = payload.code.toUpperCase().trim();
    if (coupons.some((c) => c.code.toUpperCase() === cleanCode)) {
      throw new Error(`کد تخفیف «${cleanCode}» قبلاً تعریف شده است.`);
    }

    const now = new Date();
    const isExpired = new Date(payload.endDate).getTime() < now.getTime();

    const newCoupon: DiscountCoupon = {
      id: `coup-${Date.now().toString().slice(-5)}`,
      code: cleanCode,
      type: payload.type,
      value: payload.value,
      minOrderValue: payload.minOrderValue || 0,
      usageLimit: payload.usageLimit || 100,
      usedCount: 0,
      startDate: payload.startDate,
      endDate: payload.endDate,
      status: isExpired ? "expired" : payload.status || "active",
      description: payload.description || "",
      applicableCategory: payload.applicableCategory || "همه کالاها",
      createdAt: now.toISOString(),
    };

    coupons.unshift(newCoupon);
    this.saveCoupons(coupons);
    return newCoupon;
  }

  public async updateCoupon(id: string, payload: UpdateCouponPayload): Promise<DiscountCoupon> {
    await this.delay(450);
    const coupons = this.getStoredCoupons();
    const index = coupons.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`کوپن با شناسه ${id} یافت نشد`);
    }

    if (payload.code) {
      const cleanCode = payload.code.toUpperCase().trim();
      if (coupons.some((c) => c.id !== id && c.code.toUpperCase() === cleanCode)) {
        throw new Error(`کد تخفیف «${cleanCode}» برای کوپن دیگری ثبت شده است.`);
      }
    }

    const current = coupons[index];
    const updated: DiscountCoupon = {
      ...current,
      ...payload,
      code: payload.code ? payload.code.toUpperCase().trim() : current.code,
    };

    coupons[index] = updated;
    this.saveCoupons(coupons);
    return updated;
  }

  public async toggleCouponStatus(id: string): Promise<DiscountCoupon> {
    await this.delay(350);
    const coupons = this.getStoredCoupons();
    const index = coupons.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`کوپن با شناسه ${id} یافت نشد`);
    }

    const current = coupons[index];
    let newStatus: CouponStatus = "active";

    if (current.status === "active") {
      newStatus = "disabled";
    } else if (current.status === "disabled") {
      // Check if expired
      const isPast = new Date(current.endDate).getTime() < Date.now();
      newStatus = isPast ? "expired" : "active";
    } else if (current.status === "expired") {
      // If user toggles an expired coupon, extend it by 30 days and make active
      const newEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const updated: DiscountCoupon = {
        ...current,
        endDate: newEndDate,
        status: "active",
      };
      coupons[index] = updated;
      this.saveCoupons(coupons);
      return updated;
    }

    const updated: DiscountCoupon = {
      ...current,
      status: newStatus,
    };

    coupons[index] = updated;
    this.saveCoupons(coupons);
    return updated;
  }

  public async deleteCoupon(id: string): Promise<void> {
    await this.delay(400);
    const coupons = this.getStoredCoupons();
    const filtered = coupons.filter((c) => c.id !== id);
    if (filtered.length === coupons.length) {
      throw new Error(`کوپن با شناسه ${id} یافت نشد`);
    }
    this.saveCoupons(filtered);
  }

  public async resetCouponsToMock(): Promise<DiscountCoupon[]> {
    await this.delay(300);
    this.saveCoupons(INITIAL_MOCK_COUPONS);
    return INITIAL_MOCK_COUPONS;
  }
}

export const mockCouponService = new MockCouponService();
export default mockCouponService;
