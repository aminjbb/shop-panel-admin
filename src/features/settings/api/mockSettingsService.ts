import type {
  StoreSettings,
  ShippingMethod,
  CreateShippingMethodPayload,
  AdminStaff,
  AdminRole,
  StaffFilterParams,
  CreateStaffPayload,
} from "@/types/settings";

const STORAGE_KEY_STORE = "dynova_store_settings_v1";
const STORAGE_KEY_SHIPPING = "dynova_shipping_methods_v1";
const STORAGE_KEY_STAFF = "dynova_admin_staff_v1";

const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: "فروشگاه اینترنتی داینوا (Dynova)",
  legalName: "شرکت تجارت الکترونیک داینوا پیشرو",
  supportPhone: "۰۲۱-۸۸۹۹۰۰۱۱",
  supportEmail: "support@dynova.store",
  address: "تهران، خیابان ولیعصر، برج فناوری تجارت، طبقه ۱۲، واحد ۱۲۰۴",
  currency: "IRT",
  taxRate: 10,
  freeShippingThreshold: 1500000,
  orderPrefix: "DYN-",
  enableOrderTracking: true,
  invoiceFooterNote: "با تشکر از خرید شما از داینوا. کلیه کالاها دارای ۷ روز ضمانت بازگشت و اصالت کالا می‌باشند.",
  logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
  updatedAt: new Date().toISOString(),
};

const DEFAULT_SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "ship-1",
    title: "ارسال اکسپرس داینوا (تهران)",
    description: "تحویل فوری در همان روز ویژه سفارش‌های مناطق ۲۲‌گانه تهران با پیک اختصاصی",
    cost: 45000,
    estimatedDays: "همان روز (۲ الی ۴ ساعت)",
    iconName: "zap",
    isActive: true,
    coveredCities: ["تهران", "شهر ری", "شمیرانات"],
    isFreeOverThreshold: true,
  },
  {
    id: "ship-2",
    title: "پست پیشتاز سراسری",
    description: "ارسال امن و بیمه‌شده به تمام نقاط کشور با کد رهگیری لحظه‌ای مرسوله پستی",
    cost: 58000,
    estimatedDays: "۲ الی ۴ روز کاری",
    iconName: "truck",
    isActive: true,
    coveredCities: ["all"],
    isFreeOverThreshold: true,
  },
  {
    id: "ship-3",
    title: "تیپاکس (سریع‌السیر بین‌شهری)",
    description: "تحویل درب به درب در مراکز استان‌ها و شهرستان‌های اصلی تحت پوشش تیپاکس",
    cost: 85000,
    estimatedDays: "۲۴ الی ۴۸ ساعت",
    iconName: "box",
    isActive: true,
    coveredCities: ["مشهد", "اصفهان", "شیراز", "تبریز", "اهواز", "کرج", "قم", "رشت"],
    isFreeOverThreshold: false,
  },
  {
    id: "ship-4",
    title: "پیک موتوری فوری (ویژه البرز و کرج)",
    description: "تحویل سریع ظرف ۶ ساعت در مناطق کرج، فردیس و مهرشهر",
    cost: 50000,
    estimatedDays: "ظرف ۶ ساعت کاری",
    iconName: "motorcycle",
    isActive: false,
    coveredCities: ["کرج", "فردیس"],
    isFreeOverThreshold: true,
  },
];

const DEFAULT_ADMIN_STAFF: AdminStaff[] = [
  {
    id: "staff-1",
    fullName: "نگار صادقی",
    email: "negar.admin@dynova.store",
    phone: "۰۹۱۲۱۱۱۰۰۲۲",
    role: "super_admin",
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    lastLogin: "لحظاتی پیش",
    createdAt: "۱۴۰۲/۰۱/۱۵",
  },
  {
    id: "staff-2",
    fullName: "امیررضا کمالی",
    email: "kamali.inv@dynova.store",
    phone: "۰۹۱۲۳۳۳۴۴۵۵",
    role: "inventory_manager",
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    lastLogin: "۲ ساعت قبل",
    createdAt: "۱۴۰۲/۰۳/۲۰",
  },
  {
    id: "staff-3",
    fullName: "سارا حسینی",
    email: "hosseini.support@dynova.store",
    phone: "۰۹۱۲۷۷۷۸۸۹۹",
    role: "support_agent",
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    lastLogin: "دیروز",
    createdAt: "۱۴۰۲/۰۵/۱۰",
  },
  {
    id: "staff-4",
    fullName: "پویا ابراهیمی",
    email: "ebrahimi.support@dynova.store",
    phone: "۰۹۱۹۴۴۴۵۵۶۶",
    role: "support_agent",
    status: "inactive",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    lastLogin: "۲ هفته قبل",
    createdAt: "۱۴۰۲/۰۶/۰۱",
  },
];

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockSettingsService = {
  // Store Settings
  async getStoreSettings(): Promise<StoreSettings> {
    await delay();
    const stored = localStorage.getItem(STORAGE_KEY_STORE);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY_STORE, JSON.stringify(DEFAULT_STORE_SETTINGS));
      return { ...DEFAULT_STORE_SETTINGS };
    }
    return JSON.parse(stored);
  },

  async updateStoreSettings(settings: StoreSettings): Promise<StoreSettings> {
    await delay();
    const updated = {
      ...settings,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY_STORE, JSON.stringify(updated));
    return updated;
  },

  // Shipping Methods
  async getShippingMethods(): Promise<ShippingMethod[]> {
    await delay();
    const stored = localStorage.getItem(STORAGE_KEY_SHIPPING);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY_SHIPPING, JSON.stringify(DEFAULT_SHIPPING_METHODS));
      return [...DEFAULT_SHIPPING_METHODS];
    }
    return JSON.parse(stored);
  },

  async createShippingMethod(payload: CreateShippingMethodPayload): Promise<ShippingMethod> {
    await delay();
    const current = await this.getShippingMethods();
    const newMethod: ShippingMethod = {
      ...payload,
      id: `ship-${Date.now()}`,
    };
    const updated = [newMethod, ...current];
    localStorage.setItem(STORAGE_KEY_SHIPPING, JSON.stringify(updated));
    return newMethod;
  },

  async updateShippingMethod(id: string, payload: Partial<ShippingMethod>): Promise<ShippingMethod> {
    await delay();
    const current = await this.getShippingMethods();
    const index = current.findIndex((m) => m.id === id);
    if (index === -1) throw new Error("روش ارسال مورد نظر یافت نشد.");

    const updatedMethod = { ...current[index], ...payload };
    current[index] = updatedMethod;
    localStorage.setItem(STORAGE_KEY_SHIPPING, JSON.stringify(current));
    return updatedMethod;
  },

  async toggleShippingMethodStatus(id: string): Promise<ShippingMethod> {
    await delay();
    const current = await this.getShippingMethods();
    const index = current.findIndex((m) => m.id === id);
    if (index === -1) throw new Error("روش ارسال یافت نشد.");

    current[index].isActive = !current[index].isActive;
    localStorage.setItem(STORAGE_KEY_SHIPPING, JSON.stringify(current));
    return current[index];
  },

  async deleteShippingMethod(id: string): Promise<void> {
    await delay();
    const current = await this.getShippingMethods();
    const filtered = current.filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEY_SHIPPING, JSON.stringify(filtered));
  },

  // Staff Management
  async getStaff(params?: StaffFilterParams): Promise<{
    staff: AdminStaff[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    counts: {
      all: number;
      super_admin: number;
      inventory_manager: number;
      support_agent: number;
      active: number;
      inactive: number;
    };
  }> {
    await delay();
    const stored = localStorage.getItem(STORAGE_KEY_STAFF);
    let allStaff: AdminStaff[] = stored ? JSON.parse(stored) : [...DEFAULT_ADMIN_STAFF];
    if (!stored) {
      localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(DEFAULT_ADMIN_STAFF));
    }

    const counts = {
      all: allStaff.length,
      super_admin: allStaff.filter((s) => s.role === "super_admin").length,
      inventory_manager: allStaff.filter((s) => s.role === "inventory_manager").length,
      support_agent: allStaff.filter((s) => s.role === "support_agent").length,
      active: allStaff.filter((s) => s.status === "active").length,
      inactive: allStaff.filter((s) => s.status === "inactive").length,
    };

    let filtered = [...allStaff];

    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.phone && s.phone.includes(q))
      );
    }

    if (params?.role && params.role !== "all") {
      filtered = filtered.filter((s) => s.role === params.role);
    }

    if (params?.status && params.status !== "all") {
      filtered = filtered.filter((s) => s.status === params.status);
    }

    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    return {
      staff: paginated,
      total,
      page,
      pageSize,
      totalPages,
      counts,
    };
  },

  async createStaff(payload: CreateStaffPayload): Promise<AdminStaff> {
    await delay();
    const stored = localStorage.getItem(STORAGE_KEY_STAFF);
    const allStaff: AdminStaff[] = stored ? JSON.parse(stored) : [...DEFAULT_ADMIN_STAFF];

    if (allStaff.some((s) => s.email.toLowerCase() === payload.email.toLowerCase())) {
      throw new Error("کاربری با این آدرس ایمیل قبلاً ثبت شده است.");
    }

    const newStaff: AdminStaff = {
      ...payload,
      id: `staff-${Date.now()}`,
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + allStaff.length}?w=150&auto=format&fit=crop&q=80`,
      lastLogin: "هنوز وارد نشده",
      createdAt: new Intl.DateTimeFormat("fa-IR").format(new Date()),
    };

    const updated = [newStaff, ...allStaff];
    localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(updated));
    return newStaff;
  },

  async updateStaffRole(id: string, role: AdminRole): Promise<AdminStaff> {
    await delay();
    const stored = localStorage.getItem(STORAGE_KEY_STAFF);
    const allStaff: AdminStaff[] = stored ? JSON.parse(stored) : [...DEFAULT_ADMIN_STAFF];
    const index = allStaff.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("کاربر مورد نظر یافت نشد.");

    allStaff[index].role = role;
    localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(allStaff));
    return allStaff[index];
  },

  async toggleStaffStatus(id: string): Promise<AdminStaff> {
    await delay();
    const stored = localStorage.getItem(STORAGE_KEY_STAFF);
    const allStaff: AdminStaff[] = stored ? JSON.parse(stored) : [...DEFAULT_ADMIN_STAFF];
    const index = allStaff.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("کاربر مورد نظر یافت نشد.");

    allStaff[index].status = allStaff[index].status === "active" ? "inactive" : "active";
    localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(allStaff));
    return allStaff[index];
  },

  async deleteStaff(id: string): Promise<void> {
    await delay();
    const stored = localStorage.getItem(STORAGE_KEY_STAFF);
    const allStaff: AdminStaff[] = stored ? JSON.parse(stored) : [...DEFAULT_ADMIN_STAFF];
    const filtered = allStaff.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(filtered));
  },

  async resetSettingsToDefault(): Promise<void> {
    await delay();
    localStorage.setItem(STORAGE_KEY_STORE, JSON.stringify(DEFAULT_STORE_SETTINGS));
    localStorage.setItem(STORAGE_KEY_SHIPPING, JSON.stringify(DEFAULT_SHIPPING_METHODS));
    localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(DEFAULT_ADMIN_STAFF));
  },
};

export default mockSettingsService;
