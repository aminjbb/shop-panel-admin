export type SectionType =
  | "hero_banner"
  | "flash_deals"
  | "product_grid"
  | "banner_grid_2"
  | "banner_grid_3";

export interface BannerItem {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  linkUrl: string;
  buttonText?: string;
}

export interface SectionBase {
  id: string;
  type: SectionType;
  title: string;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface HeroBannerSection extends SectionBase {
  type: "hero_banner";
  banners: BannerItem[];
  autoSlideIntervalSeconds: number;
}

export interface FlashDealsSection extends SectionBase {
  type: "flash_deals";
  endDateTime: string;
  productIds: string[];
  discountPercentBadge?: number;
}

export interface ProductGridSection extends SectionBase {
  type: "product_grid";
  subtitle?: string;
  productIds: string[];
  viewAllLink?: string;
}

export interface BannerGridSection extends SectionBase {
  type: "banner_grid_2" | "banner_grid_3";
  banners: BannerItem[]; // exactly 2 or 3 banners matching the type
}

export type HomepageSection =
  | HeroBannerSection
  | FlashDealsSection
  | ProductGridSection
  | BannerGridSection;

export interface HomepageConfig {
  version: number;
  lastUpdated: string;
  sections: HomepageSection[];
}

export interface HomepageStats {
  totalSections: number;
  activeSections: number;
  totalBanners: number;
  totalProductsLinked: number;
  heroSlidesCount: number;
}

export type PreviewDeviceMode = "desktop" | "mobile";
