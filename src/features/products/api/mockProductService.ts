import type {
  Product,
  ProductCategory,
  ProductFilterState,
  ProductListResponse,
  ProductVariant,
  StockStatus,
  CategoryOption,
} from "@/types/product";
import { generateDefaultSeo } from "../utils/seoUtils";

const STORAGE_KEY = "dynova_mock_products_v1";
const NETWORK_LATENCY_MS = 500;

export const PRODUCT_CATEGORIES: CategoryOption[] = [
  { id: "electronics", label: "کالای دیجیتال و الکترونیک" },
  { id: "apparel", label: "پوشاک و مد" },
  { id: "accessories", label: "اکسسوری و ساعت" },
  { id: "home", label: "لوازم خانگی و دکوراسیون" },
  { id: "beauty", label: "آرایشی و بهداشتی" },
  { id: "sports", label: "ورزش و سفر" },
];

export const INITIAL_MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-001",
    title: "هدفون بی‌سیم نویز کنسلینگ داینوا پرو",
    sku: "DYN-AUD-001",
    category: "electronics",
    categoryLabel: "کالای دیجیتال و الکترونیک",
    price: 4850000,
    costPrice: 3800000,
    totalStock: 35,
    stockStatus: "in_stock",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    description: "هدفون پرچمدار با قابلیت حذف نویز فعال (ANC)، شارژدهی ۴۰ ساعته و اتصال چندنقطه‌ای بلوتوث ۵.۳.",
    variants: [
      {
        id: "var-001-1",
        name: "مشکی مات",
        sku: "DYN-AUD-001-BLK",
        price: 4850000,
        stock: 20,
        color: "#1e293b",
      },
      {
        id: "var-001-2",
        name: "نقره‌ای تیتانیوم",
        sku: "DYN-AUD-001-SLV",
        price: 4950000,
        stock: 15,
        color: "#94a3b8",
      },
    ],
    seo: {
      metaTitle: "خرید هدفون بی‌سیم نویز کنسلینگ داینوا پرو | Dynova",
      metaDescription: "هدفون بلوتوثی پرچمدار با قابلیت حذف نویز فعال ANC، شارژدهی باتری ۴۰ ساعته و تفکیک صدای استودیویی با ارسال رایگان و ضمانت اصالت.",
      slug: "هدفون-بی-سیم-نویز-کنسلینگ-داینوا-پرو",
      canonicalUrl: "https://dynova.store/products/هدفون-بی-سیم-نویز-کنسلینگ-داینوا-پرو",
      focusKeywords: ["هدفون بی‌سیم", "نویز کنسلینگ", "هدفون داینوا"],
      ogImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      noIndex: false,
    },
    createdAt: "2026-08-10T09:30:00.000Z",
    updatedAt: "2026-08-15T14:20:00.000Z",
  },
  {
    id: "prod-002",
    title: "ساعت هوشمند داینوا واچ الترا ۲",
    sku: "DYN-WCH-002",
    category: "accessories",
    categoryLabel: "اکسسوری و ساعت",
    price: 8900000,
    costPrice: 7200000,
    totalStock: 8,
    stockStatus: "low_stock",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
    description: "صفحه نمایش امولد ۱.۹۶ اینچی، سنسورهای پایش سلامت و GPS دوفرکانسه مقاوم تا عمق ۵۰ متر.",
    variants: [
      {
        id: "var-002-1",
        name: "بند نارنجی آلپاین",
        sku: "DYN-WCH-002-ORG",
        price: 8900000,
        stock: 3,
        color: "#f97316",
        size: "49mm",
      },
      {
        id: "var-002-2",
        name: "بند مشکی سیلیکونی",
        sku: "DYN-WCH-002-BLK",
        price: 8900000,
        stock: 5,
        color: "#0f172a",
        size: "49mm",
      },
    ],
    seo: {
      metaTitle: "ساعت هوشمند داینوا واچ الترا ۲ با GPS دوفرکانسه",
      metaDescription: "بررسی و خرید ساعت هوشمند داینوا واچ الترا ۲ ضدآب با نمایشگر امولد همیشه روشن و سنسورهای پیشرفته ضربان قلب و اکسیژن خون.",
      slug: "ساعت-هوشمند-داینوا-واچ-الترا-۲",
      canonicalUrl: "https://dynova.store/products/ساعت-هوشمند-داینوا-واچ-الترا-۲",
      focusKeywords: ["ساعت هوشمند", "داینوا واچ", "اسمارت واچ"],
      ogImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      noIndex: false,
    },
    createdAt: "2026-08-11T11:00:00.000Z",
    updatedAt: "2026-08-16T10:15:00.000Z",
  },
  {
    id: "prod-003",
    title: "کیبورد مکانیکال بی‌سیم RGB داینوا",
    sku: "DYN-KBD-003",
    category: "electronics",
    categoryLabel: "کالای دیجیتال و الکترونیک",
    price: 3400000,
    costPrice: 2600000,
    totalStock: 0,
    stockStatus: "out_of_stock",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80",
    description: "کیبورد مکانیکال ۷۵ درصد با سوئیچ‌های قرمز بی‌صدا، نورپردازی سفارشی و باتری ۴۰۰۰ میلی‌آمپر.",
    variants: [
      {
        id: "var-003-1",
        name: "سوئیچ قرمز خطی",
        sku: "DYN-KBD-003-RED",
        price: 3400000,
        stock: 0,
        color: "#ef4444",
      },
    ],
    seo: {
      metaTitle: "کیبورد مکانیکال بی‌سیم گیمینگ RGB داینوا ۷۵ درصد",
      metaDescription: "کیبورد مکانیکال گیمینگ بیسیم داینوا با سوییچ قرمز خطی هات‌سواپ، بدنه آلومینیومی و باتری بادوام ۴۰۰۰ میلی‌آمپر با بهترین قیمت.",
      slug: "کیبورد-مکانیکال-بی-سیم-rgb-داینوا",
      canonicalUrl: "https://dynova.store/products/کیبورد-مکانیکال-بی-سیم-rgb-داینوا",
      focusKeywords: ["کیبورد مکانیکال", "کیبورد گیمینگ", "کیبورد rgb"],
      ogImage: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      noIndex: false,
    },
    createdAt: "2026-08-08T15:45:00.000Z",
    updatedAt: "2026-08-16T18:00:00.000Z",
  },
  {
    id: "prod-004",
    title: "هودی اورسایز پنبه‌ای پریمیوم",
    sku: "DYN-CLO-004",
    category: "apparel",
    categoryLabel: "پوشاک و مد",
    price: 1650000,
    costPrice: 950000,
    totalStock: 42,
    stockStatus: "in_stock",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=80",
    description: "دوخته‌شده از پنبه ۱۰۰٪ ارگانیک شسته‌شده ۳۸۰ گرم با آستر پرزی لطیف و کش‌بافت ضد افتادگی.",
    variants: [
      {
        id: "var-004-1",
        name: "سرمه‌ای - لارج (L)",
        sku: "DYN-CLO-004-NVY-L",
        price: 1650000,
        stock: 18,
        color: "#1e3a8a",
        size: "L",
      },
      {
        id: "var-004-2",
        name: "سرمه‌ای - ایکس‌لارج (XL)",
        sku: "DYN-CLO-004-NVY-XL",
        price: 1650000,
        stock: 14,
        color: "#1e3a8a",
        size: "XL",
      },
      {
        id: "var-004-3",
        name: "دودی - مدیوم (M)",
        sku: "DYN-CLO-004-SMK-M",
        price: 1650000,
        stock: 10,
        color: "#475569",
        size: "M",
      },
    ],
    seo: {
      metaTitle: "خرید هودی اورسایز پنبه‌ای پریمیوم داینوا اصل",
      metaDescription: "هودی اورسایز اسپرت پنبه ۱۰۰ درصد ارگانیک سوپراعلا، گرم و نرم با تن‌خور بی‌نظیر و کیفیت دوخت صنعتی در رنگ‌های جذاب.",
      slug: "هودی-اورسایز-پنبه-ای-پریمیوم",
      canonicalUrl: "https://dynova.store/products/هودی-اورسایز-پنبه-ای-پریمیوم",
      focusKeywords: ["هودی اورسایز", "هودی پنبه‌ای", "پوشاک زمستانه"],
      ogImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
      noIndex: false,
    },
    createdAt: "2026-08-05T08:20:00.000Z",
    updatedAt: "2026-08-14T12:00:00.000Z",
  },
  {
    id: "prod-005",
    title: "اسپرسوساز تمام اتوماتیک لمسی داینوا باریسما",
    sku: "DYN-APP-005",
    category: "home",
    categoryLabel: "لوازم خانگی و دکوراسیون",
    price: 14200000,
    costPrice: 11500000,
    totalStock: 5,
    stockStatus: "low_stock",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&auto=format&fit=crop&q=80",
    description: "پمپ ایتالیایی ۲۰ بار با آسیاب مخروطی فولادی ضدزنگ و سیستم فوم‌ساز اتوماتیک شیر لاته و کاپوچینو.",
    variants: [
      {
        id: "var-005-1",
        name: "استیل براق",
        sku: "DYN-APP-005-SS",
        price: 14200000,
        stock: 3,
        color: "#cbd5e1",
      },
      {
        id: "var-005-2",
        name: "مشکی پیانویی",
        sku: "DYN-APP-005-BLK",
        price: 14500000,
        stock: 2,
        color: "#020617",
      },
    ],
    seo: {
      metaTitle: "دستگاه اسپرسوساز تمام اتوماتیک لمسی داینوا باریسما",
      metaDescription: "خرید اینترنتی دستگاه قهوه‌ساز و اسپرسوساز حرفه‌ای داینوا با پمپ ۲۰ بار ایتالیایی، آسیاب توکار و نازل بخار شیر اتوماتیک با گارانتی ۲۴ ماهه.",
      slug: "اسپرسوساز-تمام-اتوماتیک-لمسی-داینوا-باریسما",
      canonicalUrl: "https://dynova.store/products/اسپرسوساز-تمام-اتوماتیک-لمسی-داینوا-باریسما",
      focusKeywords: ["اسپرسوساز", "قهوه ساز اتوماتیک", "اسپرسوساز خانگی"],
      ogImage: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80",
      noIndex: false,
    },
    createdAt: "2026-08-01T14:10:00.000Z",
    updatedAt: "2026-08-15T09:40:00.000Z",
  },
  {
    id: "prod-006",
    title: "کوله پشتی ضدآب مسافرتی ۴۰ لیتری",
    sku: "DYN-BAG-006",
    category: "sports",
    categoryLabel: "ورزش و سفر",
    price: 2750000,
    costPrice: 1900000,
    totalStock: 28,
    stockStatus: "in_stock",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
    description: "طراحی ارگونومیک طبی با محفظه امن لپ‌تاپ تا ۱۷ اینچ و پورت شارژ USB بیرونی ضد نفوذ آب باران.",
    variants: [
      {
        id: "var-006-1",
        name: "مشکی کربنی",
        sku: "DYN-BAG-006-BLK",
        price: 2750000,
        stock: 16,
        color: "#0f172a",
      },
      {
        id: "var-006-2",
        name: "سبز زیتونی",
        sku: "DYN-BAG-006-GRN",
        price: 2750000,
        stock: 12,
        color: "#3f6212",
      },
    ],
    seo: {
      metaTitle: "کوله پشتی ضدآب مسافرتی ۴۰ لیتری با محفظه لپ‌تاپ",
      metaDescription: "کوله پشتی کوهنوردی و مسافرتی ضدآب ۴۰ لیتری با پد طبی تنفسی ضدتعریق، محفظه ضربه‌گیر لپتاپ و پورت یو اس بی خروجی با تضمین کیفیت.",
      slug: "کوله-پشتی-ضدآب-مسافرتی-۴۰-لیتری",
      canonicalUrl: "https://dynova.store/products/کوله-پشتی-ضدآب-مسافرتی-۴۰-لیتری",
      focusKeywords: ["کوله پشتی", "کوله مسافرتی", "کوله ضدآب"],
      ogImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      noIndex: false,
    },
    createdAt: "2026-08-03T16:00:00.000Z",
    updatedAt: "2026-08-12T11:20:00.000Z",
  },
  {
    id: "prod-007",
    title: "سرم جوانساز و آبرسان هیالورونیک اسید",
    sku: "DYN-BEA-007",
    category: "beauty",
    categoryLabel: "آرایشی و بهداشتی",
    price: 980000,
    costPrice: 550000,
    totalStock: 64,
    stockStatus: "in_stock",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80",
    description: "فرموله شده با اسید هیالورونیک چندمولکولی و ویتامین B5 جهت آبرسانی عمیق ۲۴ ساعته پوست.",
    variants: [
      {
        id: "var-007-1",
        name: "حجم ۳۰ میلی‌لیتر",
        sku: "DYN-BEA-007-30ML",
        price: 980000,
        stock: 40,
        size: "30ml",
      },
      {
        id: "var-007-2",
        name: "حجم ۶۰ میلی‌لیتر (پک اقتصادی)",
        sku: "DYN-BEA-007-60ML",
        price: 1650000,
        stock: 24,
        size: "60ml",
      },
    ],
    seo: {
      metaTitle: "سرم جوانساز و آبرسان هیالورونیک اسید و ویتامین B5",
      metaDescription: "سرم اصل آبرسان قوی هیالورونیک اسید برای رفع چین و چروک ریز و افزایش لطافت و درخشندگی پوست، جذب سریع بدون ایجاد چربی.",
      slug: "سرم-جوانساز-و-آبرسان-هیالورونیک-اسید",
      canonicalUrl: "https://dynova.store/products/سرم-جوانساز-و-آبرسان-هیالورونیک-اسید",
      focusKeywords: ["سرم هیالورونیک اسید", "آبرسان پوست", "سرم جوانساز"],
      ogImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
      noIndex: false,
    },
    createdAt: "2026-08-04T12:00:00.000Z",
    updatedAt: "2026-08-14T15:30:00.000Z",
  },
  {
    id: "prod-008",
    title: "عینک آفتابی پلاریزه کلاسیک داینوا",
    sku: "DYN-SUN-008",
    category: "accessories",
    categoryLabel: "اکسسوری و ساعت",
    price: 1890000,
    costPrice: 1100000,
    totalStock: 19,
    stockStatus: "in_stock",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=80",
    description: "فریم سبک استات با عدسی‌های UV400 محافظت کامل در برابر پرتوهای مضر آفتاب و انعکاس نور.",
    variants: [
      {
        id: "var-008-1",
        name: "فریم مشکی / عدسی دودی",
        sku: "DYN-SUN-008-BLK",
        price: 1890000,
        stock: 11,
        color: "#0f172a",
      },
      {
        id: "var-008-2",
        name: "فریم هاوانا / عدسی قهوه‌ای",
        sku: "DYN-SUN-008-HAV",
        price: 1890000,
        stock: 8,
        color: "#78350f",
      },
    ],
    seo: {
      metaTitle: "عینک آفتابی پلاریزه اورجینال داینوا UV400",
      metaDescription: "خرید عینک آفتابی پلاریزه مردانه و زنانه داینوا با محافظت ۱۰۰٪ در برابر اشعه UV، فریم فوق‌سبک ضدحساسیت و لنزهای نشکن پلی‌کربنات.",
      slug: "عینک-آفتابی-پلاریزه-کلاسیک-داینوا",
      canonicalUrl: "https://dynova.store/products/عینک-آفتابی-پلاریزه-کلاسیک-داینوا",
      focusKeywords: ["عینک آفتابی", "عینک پلاریزه", "عینک uv400"],
      ogImage: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
      noIndex: false,
    },
    createdAt: "2026-08-06T10:00:00.000Z",
    updatedAt: "2026-08-13T17:40:00.000Z",
  },
];

// Helper to calculate stock status
export function calculateStockStatus(totalStock: number): StockStatus {
  if (totalStock <= 0) return "out_of_stock";
  if (totalStock <= 10) return "low_stock";
  return "in_stock";
}

// Calculate total stock of variants
export function calculateTotalStock(variants: ProductVariant[]): number {
  return variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
}

// Helper to delay execution (simulated network latency)
const delay = (ms: number = NETWORK_LATENCY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

class MockProductService {
  // Initialize or read from localStorage
  private getStoredProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveStoredProducts(INITIAL_MOCK_PRODUCTS);
        return INITIAL_MOCK_PRODUCTS;
      }
      const parsed = JSON.parse(data) as Product[];
      // Backwards compatibility: ensure all products have valid SEO data
      return parsed.map((p) => {
        if (!p.seo) {
          return {
            ...p,
            seo: generateDefaultSeo(p.title, p.description, p.image),
          };
        }
        return p;
      });
    } catch {
      return INITIAL_MOCK_PRODUCTS;
    }
  }

  private saveStoredProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error("Failed to save products to localStorage", e);
    }
  }

  // PBI-2.1: Get list with filtering, searching, sorting & pagination
  async getProducts(filters?: Partial<ProductFilterState>): Promise<ProductListResponse> {
    await delay();

    let list = this.getStoredProducts();

    const search = filters?.search?.trim().toLowerCase() || "";
    const category = filters?.category || "all";
    const stockStatus = filters?.stockStatus || "all";
    const sortBy = filters?.sortBy || "createdAt_desc";
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 6;

    let activeFiltersCount = 0;
    if (category !== "all") activeFiltersCount++;
    if (stockStatus !== "all") activeFiltersCount++;
    if (search) activeFiltersCount++;

    // 1. Search Filter (Title, SKU, Description, Variant SKU/Name)
    if (search) {
      list = list.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(search);
        const skuMatch = p.sku.toLowerCase().includes(search);
        const descMatch = p.description?.toLowerCase().includes(search) || false;
        const variantMatch = p.variants.some(
          (v) =>
            v.name.toLowerCase().includes(search) ||
            v.sku.toLowerCase().includes(search)
        );
        return titleMatch || skuMatch || descMatch || variantMatch;
      });
    }

    // 2. Category Filter
    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    // 3. Stock Status Filter
    if (stockStatus !== "all") {
      list = list.filter((p) => p.stockStatus === stockStatus);
    }

    // 4. Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case "createdAt_asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "stock_asc":
          return a.totalStock - b.totalStock;
        case "stock_desc":
          return b.totalStock - a.totalStock;
        case "title_asc":
          return a.title.localeCompare(b.title, "fa");
        case "createdAt_desc":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    const totalCount = list.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const clampedPage = Math.min(Math.max(1, page), totalPages);

    const startIndex = (clampedPage - 1) * pageSize;
    const paginatedProducts = list.slice(startIndex, startIndex + pageSize);

    return {
      products: paginatedProducts,
      totalCount,
      page: clampedPage,
      pageSize,
      totalPages,
      activeFiltersCount,
    };
  }

  // Get single product by id
  async getProductById(id: string): Promise<Product | null> {
    await delay();
    const products = this.getStoredProducts();
    const found = products.find((p) => p.id === id);
    return found || null;
  }

  // PBI-2.1: Create Product with auto ID & totalStock calculation
  async createProduct(
    data: Omit<Product, "id" | "createdAt" | "updatedAt" | "totalStock" | "stockStatus" | "categoryLabel"> & {
      variants?: ProductVariant[];
    }
  ): Promise<Product> {
    await delay();

    const products = this.getStoredProducts();
    const newId = `prod-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const variants = data.variants && data.variants.length > 0
      ? data.variants
      : [
          {
            id: `var-${newId}-default`,
            name: "ساده / پیش‌فرض",
            sku: `${data.sku}-DEF`,
            price: data.price,
            stock: 10,
          },
        ];

    const totalStock = calculateTotalStock(variants);
    const stockStatus = calculateStockStatus(totalStock);

    const categoryObj = PRODUCT_CATEGORIES.find((c) => c.id === data.category);
    const categoryLabel = categoryObj ? categoryObj.label : data.category;
    const seo = data.seo || generateDefaultSeo(data.title, data.description, data.image);

    const newProduct: Product = {
      ...data,
      id: newId,
      categoryLabel,
      variants,
      totalStock,
      stockStatus,
      seo,
      createdAt: now,
      updatedAt: now,
    };

    const updatedList = [newProduct, ...products];
    this.saveStoredProducts(updatedList);

    return newProduct;
  }

  // PBI-2.1: Update Product
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    await delay();

    const products = this.getStoredProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error(`محصول با شناسه ${id} یافت نشد.`);
    }

    const current = products[index];
    const updatedVariants = updates.variants !== undefined ? updates.variants : current.variants;
    const totalStock = calculateTotalStock(updatedVariants);
    const stockStatus = calculateStockStatus(totalStock);

    let categoryLabel = current.categoryLabel;
    if (updates.category) {
      const catObj = PRODUCT_CATEGORIES.find((c) => c.id === updates.category);
      if (catObj) categoryLabel = catObj.label;
    }

    const updatedProduct: Product = {
      ...current,
      ...updates,
      categoryLabel,
      variants: updatedVariants,
      totalStock,
      stockStatus,
      updatedAt: new Date().toISOString(),
    };

    products[index] = updatedProduct;
    this.saveStoredProducts(products);

    return updatedProduct;
  }

  // PBI-2.1 & 2.4: Delete Product
  async deleteProduct(id: string): Promise<{ success: boolean }> {
    await delay();

    const products = this.getStoredProducts();
    const filtered = products.filter((p) => p.id !== id);

    if (filtered.length === products.length) {
      throw new Error(`محصول با شناسه ${id} یافت نشد.`);
    }

    this.saveStoredProducts(filtered);
    return { success: true };
  }

  // PBI-2.4: Quick stock adjustment (+ / -)
  async updateStock(id: string, variantId: string | null, delta: number): Promise<Product> {
    await delay(300); // slightly faster for immediate tactile feel

    const products = this.getStoredProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error(`محصول با شناسه ${id} یافت نشد.`);
    }

    const product = { ...products[index] };
    const variants = [...product.variants];

    if (variantId && variants.length > 0) {
      const vIndex = variants.findIndex((v) => v.id === variantId);
      if (vIndex !== -1) {
        const newStock = Math.max(0, variants[vIndex].stock + delta);
        variants[vIndex] = { ...variants[vIndex], stock: newStock };
      }
    } else if (variants.length > 0) {
      // Adjust first variant or all
      const newStock = Math.max(0, variants[0].stock + delta);
      variants[0] = { ...variants[0], stock: newStock };
    }

    const totalStock = calculateTotalStock(variants);
    const stockStatus = calculateStockStatus(totalStock);

    const updatedProduct: Product = {
      ...product,
      variants,
      totalStock,
      stockStatus,
      updatedAt: new Date().toISOString(),
    };

    products[index] = updatedProduct;
    this.saveStoredProducts(products);

    return updatedProduct;
  }

  // Reset to default dataset
  async resetToDefaultMockData(): Promise<Product[]> {
    await delay();
    this.saveStoredProducts(INITIAL_MOCK_PRODUCTS);
    return INITIAL_MOCK_PRODUCTS;
  }

  getCategories(): CategoryOption[] {
    return PRODUCT_CATEGORIES;
  }
}

export const mockProductService = new MockProductService();
export default mockProductService;
