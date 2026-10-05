export type StockStatus = "out_of_stock" | "low_stock" | "in_stock";
export type ProductId = string;
export type ProductVariantId = string;
export type ProductCategoryId = string;
export type DecimalString = string;
export type IsoDateTime = string;

export type ProductSort =
  | "created_at_desc"
  | "created_at_asc"
  | "title_asc"
  | "title_desc"
  | "price_asc"
  | "price_desc"
  | "stock_asc"
  | "stock_desc";
export type ProductSortBy = ProductSort;

export type ProductConflictReason =
  | "inactive_or_missing"
  | "sku_taken"
  | "variant_sku_taken"
  | "slug_taken"
  | "variant_has_inventory_history"
  | "negative_stock"
  | "idempotency_key_reused"
  | "missing_or_inactive";

export interface ProductVariant {
  id: ProductVariantId;
  sku: string;
  name: string;
  stock: number;
}

export interface Product {
  id: ProductId;
  title: string;
  sku: string;
  category: ProductCategoryId;
  price: DecimalString;
  image: string;
  imageMediaId: string | null;
  description: string | null;
  slug: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  noIndex: boolean;
  focusKeywords: string[];
  variants: ProductVariant[];
  totalStock: number;
  stockStatus: StockStatus;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface ProductVariantInput {
  id?: ProductVariantId;
  sku: string;
  name: string;
  stock: number;
}

export interface CreateProductInput {
  title: string;
  sku: string;
  category: ProductCategoryId;
  price: DecimalString;
  imageMediaId: string;
  description?: string | null;
  slug?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  noIndex?: boolean;
  focusKeywords?: string[];
  variants?: ProductVariantInput[];
}

export interface UpdateProductFields {
  title: string;
  sku: string;
  category: ProductCategoryId;
  price: DecimalString;
  imageMediaId: string;
  description: string | null;
  slug: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  noIndex: boolean;
  focusKeywords: string[];
  variants: ProductVariantInput[];
}

export type UpdateProductInput = {
  [Key in keyof UpdateProductFields]: Pick<UpdateProductFields, Key> &
    Partial<Omit<UpdateProductFields, Key>>;
}[keyof UpdateProductFields];

export interface ProductListParams {
  search?: string;
  category?: ProductCategoryId;
  stockStatus?: StockStatus;
  sortBy?: ProductSort;
  page?: number;
  pageSize?: number;
}
export type ProductListQuery = ProductListParams;

export interface ProductListResponse {
  products: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  activeFiltersCount: number;
}

export interface AdjustProductStockInput {
  variantId: ProductVariantId;
  delta: number;
}

export interface AdjustProductStockRequest {
  productId: ProductId;
  idempotencyKey: string;
  input: AdjustProductStockInput;
}

export interface ProductSlugCheckParams {
  slug: string;
  excludeId?: ProductId;
}
export type ProductSlugCheckQuery = ProductSlugCheckParams;

export interface SlugAvailability {
  available: boolean;
}
export type SlugAvailabilityResponse = SlugAvailability;
