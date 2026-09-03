export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | JsonObject;
export type JsonObject = { [key: string]: JsonValue };

export type StorefrontSectionType =
  | "hero"
  | "banner_grid_2"
  | "banner_grid_3"
  | "product_carousel"
  | "rich_text";

export interface StorefrontSection {
  id: string;
  type: StorefrontSectionType;
  title: string | null;
  config: JsonObject;
  displayOrder: number;
}

export interface StorefrontHomepage {
  sections: StorefrontSection[];
}
