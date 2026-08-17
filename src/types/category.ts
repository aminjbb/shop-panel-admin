export type AttributeType = "text" | "number" | "select";

export interface CategoryAttribute {
  id: string;
  name: string; // e.g. "جنس", "سیستم عامل", "گارانتی", "سایز"
  type: AttributeType;
  options?: string[]; // e.g. ["کتان", "پلی استر", "نخ"]
  isRequired: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null; // null for root categories
  description?: string;
  icon?: string;
  thumbnail?: string;
  productCount: number;
  isActive: boolean;
  attributes: CategoryAttribute[];
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryTreeItem extends Category {
  children: CategoryTreeItem[];
  depth: number;
  pathNames?: string[];
}

export interface CategoryFormData {
  name: string;
  slug: string;
  parentId: string | null;
  description?: string;
  icon?: string;
  thumbnail?: string;
  isActive: boolean;
  attributes: CategoryAttribute[];
  displayOrder: number;
}

export interface CategoryFilterParams {
  search?: string;
  status?: "all" | "active" | "inactive";
  parentId?: string | null | "all";
  sortBy?: "order_asc" | "order_desc" | "name_asc" | "products_desc" | "createdAt_desc";
}

export interface CategoryStats {
  totalCategories: number;
  rootCategories: number;
  subCategories: number;
  totalProducts: number;
  activeCategories: number;
}
