import type {
  HomepageSection,
  HomepageConfig,
  HeroBannerSection,
  FlashDealsSection,
  ProductGridSection,
  BannerGridSection,
  SectionType,
  HomepageStats,
} from "@/types/homepage";

const STORAGE_KEY = "dynova_mock_homepage_v1";
const NETWORK_LATENCY_MS = 400;

const delay = (ms: number = NETWORK_LATENCY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Helper to generate a future ISO date string (48 hours from now)
const getFutureIsoDate = (hoursAhead: number = 48) => {
  const date = new Date(Date.now() + hoursAhead * 60 * 60 * 1000);
  return date.toISOString();
};

export const INITIAL_MOCK_SECTIONS: HomepageSection[] = [
  // 1. Hero Banner Top Slider
  {
    id: "sec-hero-01",
    type: "hero_banner",
    title: "اسلایدر بنر هیرو بالا",
    isActive: true,
    displayOrder: 1,
    autoSlideIntervalSeconds: 5,
    createdAt: "2026-08-01T10:00:00.000Z",
    banners: [
      {
        id: "banner-hero-1",
        title: "جشنواره تابستانه داینوا پرو",
        subtitle: "تا ۴۰٪ تخفیف روی برترین هدفون‌ها و گجت‌های هوشمند",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&auto=format&fit=crop&q=80",
        linkUrl: "/products?category=electronics",
        buttonText: "مشاهده محصولات جشنواره",
      },
      {
        id: "banner-hero-2",
        title: "رونمایی از ساعت‌های هوشمند الترا ۲",
        subtitle: "با پایش دقیق سلامتی، ضد آب و بدنه تیتانیوم ارتقا یافته",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&auto=format&fit=crop&q=80",
        linkUrl: "/products?category=accessories",
        buttonText: "خرید با ارسال رایگان",
      },
      {
        id: "banner-hero-3",
        title: "کالکشن جدید پوشاک و مد چهارفصل",
        subtitle: "طراحی مدرن، پارچه‌های باکیفیت و استایل شیک روزمره",
        imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1600&auto=format&fit=crop&q=80",
        linkUrl: "/products?category=apparel",
        buttonText: "مشاهده کالکشن جدید",
      },
    ],
  },
  // 2. Flash Deals (شگفت‌انگیزها)
  {
    id: "sec-flash-02",
    type: "flash_deals",
    title: "پیشنهادهای شگفت‌انگیز روز",
    isActive: true,
    displayOrder: 2,
    endDateTime: getFutureIsoDate(36),
    discountPercentBadge: 35,
    productIds: ["prod-001", "prod-002", "prod-003", "prod-004"],
    createdAt: "2026-08-02T11:00:00.000Z",
  },
  // 3. Banner Grid 2 (دو بنر تبلیغاتی پهن)
  {
    id: "sec-grid2-03",
    type: "banner_grid_2",
    title: "بنرهای تبلیغاتی دو ستونه (پیشنهاد ویژه)",
    isActive: true,
    displayOrder: 3,
    createdAt: "2026-08-03T12:00:00.000Z",
    banners: [
      {
        id: "banner-g2-1",
        title: "ست لوازم دیجیتال اداری و مهندسی",
        subtitle: "لپ‌تاپ، کیبورد مکانیکال و ماوس ارگونومیک",
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
        linkUrl: "/products?category=electronics",
        buttonText: "مشاهده ست اداری",
      },
      {
        id: "banner-g2-2",
        title: "تجهیزات مدرن خانه و آشپزخانه",
        subtitle: "اسپرسوسازهای حرفه‌ای و لوازم پخت و پز",
        imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80",
        linkUrl: "/products?category=home",
        buttonText: "خرید با ضمانت اصالت",
      },
    ],
  },
  // 4. Product Grid (پرفروش‌ترین‌های دیجیتال)
  {
    id: "sec-pgrid-04",
    type: "product_grid",
    title: "پرفروش‌ترین‌های دیجیتال و گجت‌های هوشمند",
    subtitle: "محبوب‌ترین محصولات از نگاه خریداران در هفته گذشته",
    isActive: true,
    displayOrder: 4,
    viewAllLink: "/products?category=electronics",
    productIds: ["prod-001", "prod-002", "prod-003", "prod-006"],
    createdAt: "2026-08-04T13:00:00.000Z",
  },
  // 5. Banner Grid 3 (سه بنر دسته‌بندی مربعی)
  {
    id: "sec-grid3-05",
    type: "banner_grid_3",
    title: "بنرهای تبلیغاتی سه ستونه (دسته‌های منتخب)",
    isActive: true,
    displayOrder: 5,
    createdAt: "2026-08-05T14:00:00.000Z",
    banners: [
      {
        id: "banner-g3-1",
        title: "پوشاک مردانه و زنانه",
        subtitle: "استایل اسپرت و روزمره",
        imageUrl: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop&q=80",
        linkUrl: "/products?category=apparel",
      },
      {
        id: "banner-g3-2",
        title: "سلامت، زیبایی و پوست",
        subtitle: "محصولات مراقبتی اورجینال",
        imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
        linkUrl: "/products?category=beauty",
      },
      {
        id: "banner-g3-3",
        title: "لوازم ورزش و کمپینگ",
        subtitle: "تجهیزات سفر و بدنسازی",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
        linkUrl: "/products?category=sports",
      },
    ],
  },
  // 6. Product Grid (جدیدترین پوشاک و اکسسوری)
  {
    id: "sec-pgrid-06",
    type: "product_grid",
    title: "جدیدترین پوشاک و اکسسوری‌های استایل",
    subtitle: "تازه رسیده‌های مد، ساعت‌های لوکس و کیف‌های چرم",
    isActive: true,
    displayOrder: 6,
    viewAllLink: "/products?category=apparel",
    productIds: ["prod-004", "prod-005", "prod-007", "prod-008"],
    createdAt: "2026-08-06T15:00:00.000Z",
  },
];

class MockHomepageService {
  private getStorage(): HomepageSection[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveStorage(INITIAL_MOCK_SECTIONS);
        return INITIAL_MOCK_SECTIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MOCK_SECTIONS;
    }
  }

  private saveStorage(sections: HomepageSection[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
  }

  // Get all sections sorted by displayOrder
  async getHomepageLayout(): Promise<HomepageSection[]> {
    await delay();
    const sections = this.getStorage();
    return sections.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  // Save whole layout
  async saveHomepageLayout(sections: HomepageSection[]): Promise<HomepageSection[]> {
    await delay();
    const normalized = sections.map((sec, idx) => ({
      ...sec,
      displayOrder: idx + 1,
      updatedAt: new Date().toISOString(),
    }));
    this.saveStorage(normalized);
    return normalized;
  }

  // Add new section
  async addSection(sectionData: Partial<HomepageSection>): Promise<HomepageSection> {
    await delay();
    const sections = this.getStorage();
    const type: SectionType = sectionData.type || "product_grid";
    const nextOrder = sections.length + 1;
    const newId = `sec-${type.replace(/_/g, "")}-${Date.now().toString(36)}`;

    let newSection: HomepageSection;

    switch (type) {
      case "hero_banner":
        newSection = {
          id: newId,
          type: "hero_banner",
          title: sectionData.title || "اسلایدر بنر هیرو",
          isActive: sectionData.isActive ?? true,
          displayOrder: nextOrder,
          autoSlideIntervalSeconds: (sectionData as HeroBannerSection).autoSlideIntervalSeconds || 5,
          banners: (sectionData as HeroBannerSection).banners || [
            {
              id: `banner-${Date.now()}-1`,
              title: "عنوان بنر اول",
              subtitle: "توضیح کوتاه و جذاب",
              imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&auto=format&fit=crop&q=80",
              linkUrl: "/products",
              buttonText: "مشاهده محصولات",
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        break;

      case "flash_deals":
        newSection = {
          id: newId,
          type: "flash_deals",
          title: sectionData.title || "پیشنهادهای شگفت‌انگیز",
          isActive: sectionData.isActive ?? true,
          displayOrder: nextOrder,
          endDateTime: (sectionData as FlashDealsSection).endDateTime || getFutureIsoDate(24),
          discountPercentBadge: (sectionData as FlashDealsSection).discountPercentBadge || 30,
          productIds: (sectionData as FlashDealsSection).productIds || ["prod-001", "prod-002"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        break;

      case "banner_grid_2":
        newSection = {
          id: newId,
          type: "banner_grid_2",
          title: sectionData.title || "بنرهای تبلیغاتی دو ستونه",
          isActive: sectionData.isActive ?? true,
          displayOrder: nextOrder,
          banners: (sectionData as BannerGridSection).banners || [
            {
              id: `banner-g2-${Date.now()}-1`,
              title: "بنر تبلیغاتی اول",
              subtitle: "توضیح تکمیلی بنر",
              imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
              linkUrl: "/products",
              buttonText: "مشاهده بیشتر",
            },
            {
              id: `banner-g2-${Date.now()}-2`,
              title: "بنر تبلیغاتی دوم",
              subtitle: "توضیح تکمیلی بنر",
              imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80",
              linkUrl: "/products",
              buttonText: "مشاهده بیشتر",
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        break;

      case "banner_grid_3":
        newSection = {
          id: newId,
          type: "banner_grid_3",
          title: sectionData.title || "بنرهای تبلیغاتی سه ستونه",
          isActive: sectionData.isActive ?? true,
          displayOrder: nextOrder,
          banners: (sectionData as BannerGridSection).banners || [
            {
              id: `banner-g3-${Date.now()}-1`,
              title: "بنر ستون اول",
              imageUrl: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop&q=80",
              linkUrl: "/products",
            },
            {
              id: `banner-g3-${Date.now()}-2`,
              title: "بنر ستون دوم",
              imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
              linkUrl: "/products",
            },
            {
              id: `banner-g3-${Date.now()}-3`,
              title: "بنر ستون سوم",
              imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
              linkUrl: "/products",
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        break;

      case "product_grid":
      default:
        newSection = {
          id: newId,
          type: "product_grid",
          title: sectionData.title || "ردیف کالاهای منتخب",
          subtitle: (sectionData as ProductGridSection).subtitle || "برترین و جدیدترین محصولات فروشگاه",
          isActive: sectionData.isActive ?? true,
          displayOrder: nextOrder,
          viewAllLink: (sectionData as ProductGridSection).viewAllLink || "/products",
          productIds: (sectionData as ProductGridSection).productIds || ["prod-001", "prod-002", "prod-003"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        break;
    }

    sections.push(newSection);
    this.saveStorage(sections);
    return newSection;
  }

  // Update existing section
  async updateSection(id: string, updates: Partial<HomepageSection>): Promise<HomepageSection> {
    await delay();
    const sections = this.getStorage();
    const index = sections.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error("سکشن مورد نظر برای ویرایش یافت نشد.");
    }

    // Banner count validation for grids
    if (updates.type === "banner_grid_2" && (updates as BannerGridSection).banners) {
      if ((updates as BannerGridSection).banners.length !== 2) {
        throw new Error("گرید ۲ ستونه باید دقیقاً شامل ۲ بنر باشد.");
      }
    } else if (updates.type === "banner_grid_3" && (updates as BannerGridSection).banners) {
      if ((updates as BannerGridSection).banners.length !== 3) {
        throw new Error("گرید ۳ ستونه باید دقیقاً شامل ۳ بنر باشد.");
      }
    }

    const updated = {
      ...sections[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    } as HomepageSection;

    sections[index] = updated;
    this.saveStorage(sections);
    return updated;
  }

  // Delete section
  async deleteSection(sectionId: string): Promise<string> {
    await delay();
    let sections = this.getStorage();
    const exists = sections.some((s) => s.id === sectionId);

    if (!exists) {
      throw new Error("سکشن مورد نظر یافت نشد.");
    }

    sections = sections.filter((s) => s.id !== sectionId);
    // Renumber displayOrders
    sections = sections.map((sec, idx) => ({ ...sec, displayOrder: idx + 1 }));

    this.saveStorage(sections);
    return sectionId;
  }

  // Reorder sections by given ordered IDs
  async reorderSections(orderedIds: string[]): Promise<HomepageSection[]> {
    await delay(200);
    const sections = this.getStorage();

    const reordered: HomepageSection[] = [];
    orderedIds.forEach((id, index) => {
      const match = sections.find((s) => s.id === id);
      if (match) {
        reordered.push({
          ...match,
          displayOrder: index + 1,
          updatedAt: new Date().toISOString(),
        });
      }
    });

    // Include any missing sections at end
    sections.forEach((sec) => {
      if (!orderedIds.includes(sec.id)) {
        reordered.push({
          ...sec,
          displayOrder: reordered.length + 1,
        });
      }
    });

    this.saveStorage(reordered);
    return reordered;
  }

  // Toggle active status
  async toggleSectionActive(id: string): Promise<HomepageSection> {
    await delay(150);
    const sections = this.getStorage();
    const index = sections.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error("سکشن مورد نظر یافت نشد.");
    }

    sections[index].isActive = !sections[index].isActive;
    sections[index].updatedAt = new Date().toISOString();

    this.saveStorage(sections);
    return sections[index];
  }

  // Reset to default layout
  async resetToDefaults(): Promise<HomepageSection[]> {
    await delay(300);
    // Re-generate flash deals date
    const defaults = INITIAL_MOCK_SECTIONS.map((sec) => {
      if (sec.type === "flash_deals") {
        return {
          ...sec,
          endDateTime: getFutureIsoDate(48),
        };
      }
      return sec;
    });
    this.saveStorage(defaults);
    return defaults;
  }

  // Get statistics
  async getSectionStats(): Promise<HomepageStats> {
    await delay(100);
    const sections = this.getStorage();

    let totalBanners = 0;
    let totalProductsLinked = 0;
    let heroSlidesCount = 0;

    sections.forEach((sec) => {
      if (sec.type === "hero_banner") {
        heroSlidesCount += sec.banners.length;
        totalBanners += sec.banners.length;
      } else if (sec.type === "banner_grid_2" || sec.type === "banner_grid_3") {
        totalBanners += sec.banners.length;
      } else if (sec.type === "flash_deals" || sec.type === "product_grid") {
        totalProductsLinked += sec.productIds.length;
      }
    });

    return {
      totalSections: sections.length,
      activeSections: sections.filter((s) => s.isActive).length,
      totalBanners,
      totalProductsLinked,
      heroSlidesCount,
    };
  }
}

export const mockHomepageService = new MockHomepageService();
