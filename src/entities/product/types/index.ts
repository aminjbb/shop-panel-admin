export type StockStatus = "out_of_stock" | "low_stock" | "in_stock";

export type ProductSort =
  | "created_at_desc"
  | "created_at_asc"
  | "title_asc"
  | "title_desc"
  | "price_asc"
  | "price_desc"
  | "stock_asc"
  | "stock_desc";

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  stock: number;
}

export interface Product {
  id: string;
  title: string;
  sku: string;
  category: string;
  price: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariantInput {
  id?: string;
  sku: string;
  name: string;
  stock: number;
}

export interface CreateProductInput {
  title: string;
  sku: string;
  category: string;
  price: string;
  imageMediaId: string;
  description?: string | null;
  slug?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  noIndex?: boolean;
  focusKeywords?: string[];
  variants?: ProductVariantInput[];
}

export interface UpdateProductInput {
  title?: string;
  sku?: string;
  category?: string;
  price?: string;
  imageMediaId?: string;
  description?: string | null;
  slug?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  noIndex?: boolean;
  focusKeywords?: string[];
  variants?: ProductVariantInput[];
}

export interface ProductListParams {
  search?: string;
  category?: string;
  stockStatus?: StockStatus;
  sortBy?: ProductSort;
  page?: number;
  pageSize?: number;
}

export interface ProductListResponse {
  products: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  activeFiltersCount: number;
}

export interface AdjustProductStockInput {
  variantId: string;
  delta: number;
}

export interface AdjustProductStockRequest {
  productId: string;
  idempotencyKey: string;
  input: AdjustProductStockInput;
}

export interface ProductSlugCheckParams {
  slug: string;
  excludeId?: string;
}

export interface SlugAvailability {
  available: boolean;
}
