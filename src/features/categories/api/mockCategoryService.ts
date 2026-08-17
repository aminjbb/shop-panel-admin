import type {
  Category,
  CategoryAttribute,
  CategoryFormData,
  CategoryFilterParams,
  CategoryStats,
  CategoryTreeItem,
} from "@/types/category";

const STORAGE_KEY = "dynova_mock_categories_v1";
const NETWORK_LATENCY_MS = 400;

const delay = (ms: number = NETWORK_LATENCY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const INITIAL_MOCK_CATEGORIES: Category[] = [
  // 1. Digital & Electronics (Root)
  {
    id: "cat-electronics",
    name: "کالای دیجیتال و الکترونیک",
    slug: "electronics",
    parentId: null,
    description: "انواع گوشی هوشمند، لپ‌تاپ، لوازم جانبی و گجت‌های هوشمند",
    icon: "Smartphone",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80",
    productCount: 42,
    isActive: true,
    displayOrder: 1,
    createdAt: "2026-07-01T10:00:00.000Z",
    attributes: [
      { id: "attr-el-1", name: "برند سازنده", type: "select", options: ["اپل", "سامسونگ", "شیائومی", "ایسوس", "سونی"], isRequired: true },
      { id: "attr-el-2", name: "مدت گارانتی (ماه)", type: "number", isRequired: true },
      { id: "attr-el-3", name: "کشور سازنده", type: "text", isRequired: false },
    ],
  },
  // 1.1 Mobile & Tablet (Level 1)
  {
    id: "cat-mobiles",
    name: "موبایل و تبلت",
    slug: "mobile-and-tablets",
    parentId: "cat-electronics",
    description: "گوشی‌های هوشمند، تبلت و لوازم جانبی موبایل",
    icon: "Tablet",
    thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80",
    productCount: 24,
    isActive: true,
    displayOrder: 1,
    createdAt: "2026-07-02T11:00:00.000Z",
    attributes: [
      { id: "attr-mob-1", name: "حافظه داخلی (GB)", type: "select", options: ["64", "128", "256", "512", "1024"], isRequired: true },
      { id: "attr-mob-2", name: "حافظه رم (RAM)", type: "select", options: ["4 GB", "6 GB", "8 GB", "12 GB", "16 GB"], isRequired: true },
      { id: "attr-mob-3", name: "سیستم عامل", type: "select", options: ["iOS", "Android", "iPadOS"], isRequired: true },
      { id: "attr-mob-4", name: "تعداد سیم‌کارت", type: "number", isRequired: false },
    ],
  },
  // 1.1.1 Smartphones (Level 2)
  {
    id: "cat-smartphones",
    name: "گوشی هوشمند",
    slug: "smartphones",
    parentId: "cat-mobiles",
    description: "پرچمداران و میان‌رده‌های روز بازار موبایل",
    icon: "Smartphone",
    thumbnail: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&auto=format&fit=crop&q=80",
    productCount: 16,
    isActive: true,
    displayOrder: 1,
    createdAt: "2026-07-03T09:00:00.000Z",
    attributes: [
      { id: "attr-sph-1", name: "شبکه ارتباطی", type: "select", options: ["5G", "4G LTE", "3G"], isRequired: true },
      { id: "attr-sph-2", name: "ظرفیت باتری (mAh)", type: "number", isRequired: false },
      { id: "attr-sph-3", name: "رزولوشن دوربین اصلی (MP)", type: "number", isRequired: false },
    ],
  },
  // 1.1.2 Tablets (Level 2)
  {
    id: "cat-tablets",
    name: "تبلت و کتابخوان",
    slug: "tablets",
    parentId: "cat-mobiles",
    description: "تبلت‌های آموزشی، طراحی و اداری به همراه قلم",
    icon: "Tablet",
    thumbnail: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&auto=format&fit=crop&q=80",
    productCount: 8,
    isActive: true,
    displayOrder: 2,
    createdAt: "2026-07-03T10:30:00.000Z",
    attributes: [
      { id: "attr-tab-1", name: "اندازه صفحه نمایش (اینچ)", type: "text", isRequired: true },
      { id: "attr-tab-2", name: "پشتیبانی از قلم لمسی", type: "select", options: ["بله", "خیر"], isRequired: true },
    ],
  },
  // 1.2 Laptops & Computers (Level 1)
  {
    id: "cat-laptops",
    name: "لپ‌تاپ و کامپیوتر",
    slug: "laptops-computers",
    parentId: "cat-electronics",
    description: "لپ‌تاپ‌های گیمینگ، اداری، مهندسی و مینی پی‌سی",
    icon: "Laptop",
    thumbnail: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&auto=format&fit=crop&q=80",
    productCount: 12,
    isActive: true,
    displayOrder: 2,
    createdAt: "2026-07-04T12:00:00.000Z",
    attributes: [
      { id: "attr-lap-1", name: "پردازنده (CPU)", type: "select", options: ["Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 5", "AMD Ryzen 7", "Apple M2/M3"], isRequired: true },
      { id: "attr-lap-2", name: "کارت گرافیک (GPU)", type: "text", isRequired: true },
      { id: "attr-lap-3", name: "نوع حافظه ذخیره‌سازی", type: "select", options: ["NVMe SSD", "SATA SSD", "HDD"], isRequired: true },
      { id: "attr-lap-4", name: "وزن دستگاه (کیلوگرم)", type: "number", isRequired: false },
    ],
  },
  // 1.3 Audio & Headphones (Level 1)
  {
    id: "cat-audio",
    name: "صوتی و هدفون",
    slug: "audio-headphones",
    parentId: "cat-electronics",
    description: "اسپیکرهای بلوتوثی، هدفون‌های نویزکنسلینگ و هندزفری",
    icon: "Headphones",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80",
    productCount: 6,
    isActive: true,
    displayOrder: 3,
    createdAt: "2026-07-05T14:00:00.000Z",
    attributes: [
      { id: "attr-aud-1", name: "نوع اتصال", type: "select", options: ["بلوتوث بی‌سیم", "باسیم (جک ۳.۵)", "دانگل بی‌سیم"], isRequired: true },
      { id: "attr-aud-2", name: "حذف نویز فعال (ANC)", type: "select", options: ["دارد", "ندارد"], isRequired: true },
      { id: "attr-aud-3", name: "میزان شارژدهی (ساعت)", type: "number", isRequired: false },
    ],
  },

  // 2. Apparel & Fashion (Root)
  {
    id: "cat-apparel",
    name: "پوشاک، مد و کفش",
    slug: "apparel-fashion",
    parentId: null,
    description: "لباس‌های مردانه، زنانه، بچگانه، کفش و پوشاک ورزشی",
    icon: "Shirt",
    thumbnail: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&auto=format&fit=crop&q=80",
    productCount: 38,
    isActive: true,
    displayOrder: 2,
    createdAt: "2026-07-06T09:00:00.000Z",
    attributes: [
      { id: "attr-app-1", name: "جنس پارچه", type: "select", options: ["نخ پنبه", "کتان", "پلی‌استر", "ابریشم", "جین", "پشم"], isRequired: true },
      { id: "attr-app-2", name: "فصل استفاده", type: "select", options: ["بهار/تابستان", "پاییز/زمستان", "چهارفصل"], isRequired: false },
      { id: "attr-app-3", name: "راهنمای شستشو", type: "text", isRequired: false },
    ],
  },
  // 2.1 Men's Apparel (Level 1)
  {
    id: "cat-mens-apparel",
    name: "پوشاک مردانه",
    slug: "mens-clothing",
    parentId: "cat-apparel",
    description: "انواع پیراهن، تیشرت، شلوار و کت مردانه",
    icon: "Shirt",
    thumbnail: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=300&auto=format&fit=crop&q=80",
    productCount: 20,
    isActive: true,
    displayOrder: 1,
    createdAt: "2026-07-07T11:00:00.000Z",
    attributes: [
      { id: "attr-men-1", name: "سایز استاندارد", type: "select", options: ["S", "M", "L", "XL", "2XL", "3XL"], isRequired: true },
      { id: "attr-men-2", name: "مدل یقه / برش", type: "text", isRequired: false },
    ],
  },
  // 2.2 Women's Apparel (Level 1)
  {
    id: "cat-womens-apparel",
    name: "پوشاک زنانه",
    slug: "womens-clothing",
    parentId: "cat-apparel",
    description: "مانتو، پالتو، شومیز، شلوار و لباس مجلسی",
    icon: "Sparkles",
    thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&auto=format&fit=crop&q=80",
    productCount: 18,
    isActive: true,
    displayOrder: 2,
    createdAt: "2026-07-08T12:00:00.000Z",
    attributes: [
      { id: "attr-wom-1", name: "سایزبندی", type: "select", options: ["36", "38", "40", "42", "44", "Free Size"], isRequired: true },
      { id: "attr-wom-2", name: "طرح پارچه", type: "select", options: ["ساده", "طرح‌دار", "راه‌راه", "چهارخانه"], isRequired: false },
    ],
  },

  // 3. Home & Kitchen (Root)
  {
    id: "cat-home",
    name: "لوازم خانگی و آشپزخانه",
    slug: "home-kitchen",
    parentId: null,
    description: "لوازم برقی پخت و پز، ظروف، دکوراسیون و روشنایی",
    icon: "Home",
    thumbnail: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=300&auto=format&fit=crop&q=80",
    productCount: 22,
    isActive: true,
    displayOrder: 3,
    createdAt: "2026-07-09T08:30:00.000Z",
    attributes: [
      { id: "attr-hom-1", name: "توان مصرفی (وات)", type: "number", isRequired: false },
      { id: "attr-hom-2", name: "رده مصرف انرژی", type: "select", options: ["A+++", "A++", "A+", "A", "B"], isRequired: false },
      { id: "attr-hom-3", name: "جنس بدنه", type: "text", isRequired: true },
    ],
  },
  // 3.1 Kitchen Appliances (Level 1)
  {
    id: "cat-kitchen",
    name: "لوازم برقی آشپزخانه",
    slug: "kitchen-appliances",
    parentId: "cat-home",
    description: "سرخ‌کن، اسپرسوساز، خردکن، مخلوط‌کن و مایکروویو",
    icon: "Coffee",
    thumbnail: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=300&auto=format&fit=crop&q=80",
    productCount: 15,
    isActive: true,
    displayOrder: 1,
    createdAt: "2026-07-10T10:00:00.000Z",
    attributes: [
      { id: "attr-kit-1", name: "گنجایش مخزن (لیتر)", type: "number", isRequired: false },
      { id: "attr-kit-2", name: "قابلیت شستشوی قطعات در ماشین", type: "select", options: ["دارد", "ندارد"], isRequired: true },
    ],
  },

  // 4. Beauty & Personal Care (Root)
  {
    id: "cat-beauty",
    name: "زیبایی، بهداشت و سلامت",
    slug: "beauty-health",
    parentId: null,
    description: "محصولات مراقبت پوست و مو، عطر و ادکلن، لوازم آرایشی",
    icon: "Sparkles",
    thumbnail: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80",
    productCount: 19,
    isActive: true,
    displayOrder: 4,
    createdAt: "2026-07-11T13:00:00.000Z",
    attributes: [
      { id: "attr-bt-1", name: "نوع پوست/مو", type: "select", options: ["انواع پوست", "پوست چرب", "پوست خشک و حساس", "پوست مختلط"], isRequired: true },
      { id: "attr-bt-2", name: "حجم/وزن محصول (میلی‌لیتر/گرم)", type: "number", isRequired: true },
      { id: "attr-bt-3", name: "تاریخ انقضا (ماه)", type: "number", isRequired: true },
    ],
  },

  // 5. Sports & Outdoor (Root)
  {
    id: "cat-sports",
    name: "ورزش، سفر و کمپینگ",
    slug: "sports-outdoor",
    parentId: null,
    description: "تجهیزات باشگاه، کوله‌پشتی، چادر مسافرتی و اکسسوری سفر",
    icon: "Dumbbell",
    thumbnail: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&auto=format&fit=crop&q=80",
    productCount: 14,
    isActive: true,
    displayOrder: 5,
    createdAt: "2026-07-12T15:00:00.000Z",
    attributes: [
      { id: "attr-sp-1", name: "نوع ورزش / کاربری", type: "text", isRequired: true },
      { id: "attr-sp-2", name: "ضد آب بودن", type: "select", options: ["بله (مقاوم در برابر آب)", "خیر"], isRequired: true },
    ],
  },

  // 6. Accessories & Watches (Root)
  {
    id: "cat-accessories",
    name: "اکسسوری، ساعت و زیورآلات",
    slug: "accessories-watches",
    parentId: null,
    description: "ساعت مچی هوشمند، عینک آفتابی، کیف پول و کمربند چرم",
    icon: "Watch",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80",
    productCount: 17,
    isActive: false, // inactive for test toggle
    displayOrder: 6,
    createdAt: "2026-07-13T16:00:00.000Z",
    attributes: [
      { id: "attr-acc-1", name: "جنس بدنه / بند", type: "select", options: ["چرم طبیعی", "استیل ضد زنگ", "سیلیکون", "تیتانیوم", "رزین"], isRequired: true },
      { id: "attr-acc-2", name: "مقاومت در برابر آب (ATM)", type: "number", isRequired: false },
    ],
  },
];

class MockCategoryService {
  private getStorage(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveStorage(INITIAL_MOCK_CATEGORIES);
        return INITIAL_MOCK_CATEGORIES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MOCK_CATEGORIES;
    }
  }

  private saveStorage(categories: Category[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }

  // Generate hierarchical path names e.g. ["کالای دیجیتال", "موبایل", "گوشی هوشمند"]
  private getPathNames(category: Category, allCategories: Category[]): string[] {
    const path: string[] = [category.name];
    let current = category;

    while (current.parentId) {
      const parent = allCategories.find((c) => c.id === current.parentId);
      if (!parent || parent.id === current.id) break;
      path.unshift(parent.name);
      current = parent;
    }

    return path;
  }

  // Get all descendant IDs of a category (to prevent cycle selection)
  public getDescendantIds(categoryId: string, allCategories?: Category[]): string[] {
    const categories = allCategories || this.getStorage();
    const descendants: string[] = [];

    const findChildren = (parentId: string) => {
      const children = categories.filter((c) => c.parentId === parentId);
      for (const child of children) {
        descendants.push(child.id);
        findChildren(child.id);
      }
    };

    findChildren(categoryId);
    return descendants;
  }

  // Build tree from flat array
  private buildTree(
    categories: Category[],
    parentId: string | null = null,
    depth: number = 0,
    allCategories: Category[]
  ): CategoryTreeItem[] {
    return categories
      .filter((cat) => cat.parentId === parentId)
      .sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name))
      .map((cat) => ({
        ...cat,
        depth,
        pathNames: this.getPathNames(cat, allCategories),
        children: this.buildTree(categories, cat.id, depth + 1, allCategories),
      }));
  }

  // Filter tree items recursively based on search text
  private filterTree(tree: CategoryTreeItem[], search: string): CategoryTreeItem[] {
    const lowerSearch = search.toLowerCase().trim();
    if (!lowerSearch) return tree;

    const result: CategoryTreeItem[] = [];

    for (const item of tree) {
      const nameMatch = item.name.toLowerCase().includes(lowerSearch);
      const slugMatch = item.slug.toLowerCase().includes(lowerSearch);
      const descMatch = (item.description || "").toLowerCase().includes(lowerSearch);
      const attrMatch = item.attributes.some((a) =>
        a.name.toLowerCase().includes(lowerSearch)
      );

      const filteredChildren = this.filterTree(item.children, search);

      if (nameMatch || slugMatch || descMatch || attrMatch || filteredChildren.length > 0) {
        result.push({
          ...item,
          children: filteredChildren,
        });
      }
    }

    return result;
  }

  // Get categories with filter
  async getCategories(params?: CategoryFilterParams): Promise<Category[]> {
    await delay();
    let list = this.getStorage();

    if (params?.status && params.status !== "all") {
      const isActive = params.status === "active";
      list = list.filter((c) => c.isActive === isActive);
    }

    if (params?.parentId !== undefined && params.parentId !== "all") {
      list = list.filter((c) => c.parentId === params.parentId);
    }

    if (params?.search?.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          (c.description || "").toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (params?.sortBy) {
      case "order_desc":
        list.sort((a, b) => b.displayOrder - a.displayOrder);
        break;
      case "name_asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "products_desc":
        list.sort((a, b) => b.productCount - a.productCount);
        break;
      case "createdAt_desc":
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "order_asc":
      default:
        list.sort((a, b) => a.displayOrder - b.displayOrder);
        break;
    }

    return list;
  }

  // Get Tree Structure
  async getCategoryTree(params?: { search?: string; status?: "all" | "active" | "inactive" }): Promise<CategoryTreeItem[]> {
    await delay();
    let categories = this.getStorage();

    if (params?.status && params.status !== "all") {
      const isActive = params.status === "active";
      categories = categories.filter((c) => c.isActive === isActive);
    }

    const tree = this.buildTree(categories, null, 0, categories);

    if (params?.search?.trim()) {
      return this.filterTree(tree, params.search);
    }

    return tree;
  }

  // Get single category by ID
  async getCategoryById(id: string): Promise<Category | null> {
    await delay(100);
    const categories = this.getStorage();
    return categories.find((c) => c.id === id) || null;
  }

  // Check if slug is unique
  async checkSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
    const categories = this.getStorage();
    return !categories.some(
      (c) => c.slug.toLowerCase() === slug.toLowerCase() && c.id !== excludeId
    );
  }

  // Create new category
  async createCategory(payload: CategoryFormData): Promise<Category> {
    await delay();
    const categories = this.getStorage();

    // Check slug uniqueness
    const isUnique = await this.checkSlugUnique(payload.slug);
    if (!isUnique) {
      throw new Error(`اسلاگ "${payload.slug}" تکراری است. لطفاً یک اسلاگ یکتا انتخاب کنید.`);
    }

    const newCategory: Category = {
      id: `cat-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      name: payload.name.trim(),
      slug: payload.slug.trim().toLowerCase(),
      parentId: payload.parentId || null,
      description: payload.description?.trim() || "",
      icon: payload.icon || "Package",
      thumbnail: payload.thumbnail || "",
      productCount: 0,
      isActive: payload.isActive,
      displayOrder: payload.displayOrder ?? categories.length + 1,
      attributes: payload.attributes || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    categories.push(newCategory);
    this.saveStorage(categories);
    return newCategory;
  }

  // Update existing category
  async updateCategory(id: string, payload: Partial<CategoryFormData>): Promise<Category> {
    await delay();
    const categories = this.getStorage();
    const index = categories.findIndex((c) => c.id === id);

    if (index === -1) {
      throw new Error("دسته‌بندی مورد نظر یافت نشد.");
    }

    // Check if user is trying to set parentId to self or any descendant (cycle prevention)
    if (payload.parentId !== undefined) {
      if (payload.parentId === id) {
        throw new Error("یک دسته‌بندی نمی‌تواند والد خودش باشد.");
      }
      if (payload.parentId) {
        const descendants = this.getDescendantIds(id, categories);
        if (descendants.includes(payload.parentId)) {
          throw new Error("امکان انتخاب زیردسته به عنوان والد وجود ندارد (جلوگیری از حلقه تودرتو).");
        }
      }
    }

    // Slug check if changed
    if (payload.slug && payload.slug !== categories[index].slug) {
      const isUnique = await this.checkSlugUnique(payload.slug, id);
      if (!isUnique) {
        throw new Error(`اسلاگ "${payload.slug}" تکراری است.`);
      }
    }

    const updated: Category = {
      ...categories[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    categories[index] = updated;
    this.saveStorage(categories);
    return updated;
  }

  // Delete category (Smart Delete)
  async deleteCategory(
    id: string,
    options: { cascadeDelete?: boolean } = { cascadeDelete: false }
  ): Promise<{ deletedIds: string[]; reassignedIds: string[] }> {
    await delay();
    const categories = this.getStorage();
    const target = categories.find((c) => c.id === id);

    if (!target) {
      throw new Error("دسته‌بندی مورد نظر یافت نشد.");
    }

    const deletedIds: string[] = [id];
    const reassignedIds: string[] = [];

    if (options.cascadeDelete) {
      // Cascade delete all descendants
      const descendants = this.getDescendantIds(id, categories);
      deletedIds.push(...descendants);
      const remaining = categories.filter((c) => !deletedIds.includes(c.id));
      this.saveStorage(remaining);
    } else {
      // Reassign immediate children to target's parent (or null for root)
      const newParentId = target.parentId;
      const updatedCategories = categories
        .filter((c) => c.id !== id)
        .map((c) => {
          if (c.parentId === id) {
            reassignedIds.push(c.id);
            return { ...c, parentId: newParentId, updatedAt: new Date().toISOString() };
          }
          return c;
        });

      this.saveStorage(updatedCategories);
    }

    return { deletedIds, reassignedIds };
  }

  // Reorder categories
  async reorderCategories(orderedIds: string[]): Promise<void> {
    await delay(200);
    const categories = this.getStorage();

    const updated = categories.map((cat) => {
      const newOrder = orderedIds.indexOf(cat.id);
      if (newOrder !== -1) {
        return { ...cat, displayOrder: newOrder + 1, updatedAt: new Date().toISOString() };
      }
      return cat;
    });

    this.saveStorage(updated);
  }

  // Quick toggle active status
  async toggleCategoryStatus(id: string): Promise<Category> {
    await delay(200);
    const categories = this.getStorage();
    const index = categories.findIndex((c) => c.id === id);

    if (index === -1) {
      throw new Error("دسته‌بندی یافت نشد.");
    }

    categories[index].isActive = !categories[index].isActive;
    categories[index].updatedAt = new Date().toISOString();

    this.saveStorage(categories);
    return categories[index];
  }

  // Get statistics
  async getCategoryStats(): Promise<CategoryStats> {
    await delay(150);
    const categories = this.getStorage();

    const rootCategories = categories.filter((c) => c.parentId === null).length;
    const subCategories = categories.filter((c) => c.parentId !== null).length;
    const totalProducts = categories.reduce((sum, c) => sum + (c.productCount || 0), 0);
    const activeCategories = categories.filter((c) => c.isActive).length;

    return {
      totalCategories: categories.length,
      rootCategories,
      subCategories,
      totalProducts,
      activeCategories,
    };
  }

  // Reset to initial mock data
  async resetToDefaults(): Promise<void> {
    await delay(300);
    this.saveStorage(INITIAL_MOCK_CATEGORIES);
  }
}

export const mockCategoryService = new MockCategoryService();
