export type ProductCategory =
  | "electronics"
  | "apparel"
  | "home"
  | "accessories"
  | "beauty"
  | "sports";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  color?: string;
  size?: string;
}

export interface ProductSeoData {
  metaTitle: string; // حداکثر ۶۰ کاراکتر
  metaDescription: string; // حداکثر ۱۶۰ کاراکتر
  slug: string; // URL-friendly (e.g. "nike-air-zoom-pegasus")
  canonicalUrl?: string;
  focusKeywords: string[]; // تگ‌های کلیدی
  ogImage?: string; // تصویر برای اشتراک‌گذاری در شبکه‌های اجتماعی
  noIndex: boolean; // فعال‌سازی تگ noindex / nofollow
}

export interface Product {
  id: string;
  title: string;
  sku: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  costPrice?: number;
  totalStock: number;
  stockStatus: StockStatus;
  image: string;
  description?: string;
  variants: ProductVariant[];
  seo?: ProductSeoData; // اضافه شدن آبجکت سئو به مدل محصول
  createdAt: string;
  updatedAt: string;
}

export type ProductSortOption =
  | "createdAt_desc"
  | "createdAt_asc"
  | "price_asc"
  | "price_desc"
  | "stock_asc"
  | "stock_desc"
  | "title_asc";

export interface ProductFilterState {
  search: string;
  category: string; // 'all' or ProductCategory
  stockStatus: string; // 'all' or StockStatus
  sortBy: ProductSortOption;
  page: number;
  pageSize: number;
}

export interface ProductListResponse {
  products: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  activeFiltersCount: number;
}

export interface ProductFormData {
  title: string;
  sku: string;
  category: ProductCategory;
  price: number;
  costPrice?: number;
  image: string;
  description?: string;
  variants: ProductVariant[];
  seo: ProductSeoData;
}

export interface ProductFormErrors {
  title?: string;
  sku?: string;
  category?: string;
  price?: string;
  image?: string;
  variants?: string;
  slug?: string;
}

export interface CategoryOption {
  id: ProductCategory;
  label: string;
}
