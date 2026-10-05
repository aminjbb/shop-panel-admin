export type ProductCategory = string;

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
  metaTitle: string;
  metaDescription: string;
  slug: string;
  canonicalUrl?: string;
  focusKeywords: string[];
  ogImage?: string;
  noIndex: boolean;
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
  imageMediaId: string | null;
  description?: string;
  variants: ProductVariant[];
  seo?: ProductSeoData;
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
  | "title_asc"
  | "title_desc";

export interface ProductFilterState {
  search: string;
  category: string;
  stockStatus: string;
  sortBy: ProductSortOption;
  page: number;
  pageSize: number;
}

export interface ProductFormData {
  title: string;
  sku: string;
  category: ProductCategory;
  price: number;
  costPrice?: number;
  image: string;
  imageMediaId?: string | null;
  imageFile?: File | null;
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
  id: string;
  label: string;
}

