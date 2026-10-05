import type {
  HomepageSection as HomepageSectionDto,
  HomepageSectionInput,
  JsonObject,
} from "@/entities/homepage";
import type { StorefrontSection } from "@/entities/storefront";
import type {
  BannerGridSection,
  BannerItem,
  FlashDealsSection,
  HomepageSection,
  HeroBannerSection,
  ProductGridSection,
  RichTextSection,
  SectionType,
} from "@/types/homepage";

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const asString = (value: unknown, fallback = ""): string => typeof value === "string" ? value : fallback;
const asStringArray = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

const bannersFromConfig = (section: HomepageSectionDto): BannerItem[] => {
  const source = Array.isArray(section.config.banners)
    ? section.config.banners
    : Array.isArray(section.config.slides) ? section.config.slides : [];
  return source.map((raw, index) => {
    const item = asRecord(raw);
    return {
      id: asString(item.id, `${section.id}-${index}`),
      imageUrl: asString(item.imageUrl),
      title: asString(item.title) || undefined,
      subtitle: asString(item.subtitle) || undefined,
      linkUrl: asString(item.linkUrl),
      buttonText: asString(item.buttonText) || undefined,
    };
  });
};

export const toHomepageSectionViewModel = (section: HomepageSectionDto): HomepageSection => {
  const base = {
    id: section.id,
    title: section.title ?? "بدون عنوان",
    isActive: section.isActive,
    displayOrder: section.displayOrder,
    createdAt: section.createdAt,
    updatedAt: section.updatedAt,
  };
  if (section.type === "hero") return {
    ...base,
    type: "hero_banner",
    banners: bannersFromConfig(section),
    autoSlideIntervalSeconds: Number(section.config.autoSlideIntervalSeconds) || 5,
  } satisfies HeroBannerSection;
  if (section.type === "banner_grid_2" || section.type === "banner_grid_3") return {
    ...base,
    type: section.type,
    banners: bannersFromConfig(section),
  } satisfies BannerGridSection;
  if (section.type === "rich_text") return {
    ...base,
    type: "rich_text",
    config: section.config as unknown as Record<string, unknown>,
  } satisfies RichTextSection;
  return {
    ...base,
    type: "product_grid",
    subtitle: asString(section.config.subtitle) || undefined,
    productIds: asStringArray(section.config.productIds),
    viewAllLink: asString(section.config.viewAllLink) || undefined,
  } satisfies ProductGridSection;
};

const bannerConfig = (banners: BannerItem[]) => banners.map(({ id, ...banner }) => ({ id, ...banner }));

export const toHomepageSectionInput = (section: HomepageSection): HomepageSectionInput => {
  let type: HomepageSectionInput["type"];
  let config: JsonObject;
  switch (section.type) {
    case "hero_banner":
      type = "hero";
      config = { slides: bannerConfig(section.banners), autoSlideIntervalSeconds: section.autoSlideIntervalSeconds } as unknown as JsonObject;
      break;
    case "banner_grid_2":
    case "banner_grid_3":
      type = section.type;
      config = { banners: bannerConfig(section.banners) } as unknown as JsonObject;
      break;
    case "rich_text":
      type = "rich_text";
      config = section.config as JsonObject;
      break;
    case "flash_deals":
      type = "product_carousel";
      config = { productIds: section.productIds, endDateTime: section.endDateTime, discountPercentBadge: section.discountPercentBadge ?? null };
      break;
    default:
      type = "product_carousel";
      config = { productIds: section.productIds, subtitle: section.subtitle ?? null, viewAllLink: section.viewAllLink ?? null };
  }
  return { type, title: section.title, config, displayOrder: section.displayOrder, isActive: section.isActive };
};

export const createHomepageSectionInput = (type: SectionType, title: string, displayOrder: number): HomepageSectionInput => {
  const base = { id: "new", type, title, displayOrder, isActive: true } as HomepageSection;
  if (type === "hero_banner") return toHomepageSectionInput({ ...base, type, banners: [], autoSlideIntervalSeconds: 5 });
  if (type === "banner_grid_2" || type === "banner_grid_3") return toHomepageSectionInput({ ...base, type, banners: [] });
  if (type === "flash_deals") return toHomepageSectionInput({ ...base, type, productIds: [], endDateTime: new Date().toISOString() });
  if (type === "rich_text") return toHomepageSectionInput({ ...base, type, config: {} });
  return toHomepageSectionInput({ ...base, type: "product_grid", productIds: [] });
};

export const toPublishedSectionViewModel = (section: StorefrontSection): HomepageSection =>
  toHomepageSectionViewModel({
    ...section,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  });
