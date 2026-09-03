export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | JsonObject;
export type JsonObject = { [key: string]: JsonValue };

export type HomepageSectionType =
  | "hero"
  | "banner_grid_2"
  | "banner_grid_3"
  | "product_carousel"
  | "rich_text";

export interface HomepageBanner extends JsonObject {
  imageUrl: string;
}

export type HomepageSectionConfig = JsonObject & {
  banners?: HomepageBanner[];
  productIds?: string[];
  slides?: JsonObject[];
};

export interface HomepageSection {
  id: string;
  type: HomepageSectionType;
  title: string | null;
  config: HomepageSectionConfig;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HomepageSectionInput {
  type: HomepageSectionType;
  title?: string | null;
  config: HomepageSectionConfig;
  displayOrder?: number;
  isActive?: boolean;
}

export interface HomepageStats {
  totalSections: number;
  activeSections: number;
  totalBanners: number;
  totalProductsLinked: number;
  heroSlidesCount: number;
}

export interface ReorderHomepageSectionsInput {
  orderedIds: string[];
}

export interface PublishedHomepageSection {
  id: string;
  type: HomepageSectionType;
  title: string | null;
  config: HomepageSectionConfig;
  displayOrder: number;
}

export interface PublishedHomepage {
  sections: PublishedHomepageSection[];
}
