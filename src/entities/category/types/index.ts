export type CategoryAttributeType = "text" | "number" | "select";

export type CategorySort =
  | "sort_order_asc"
  | "sort_order_desc"
  | "name_asc"
  | "name_desc"
  | "created_at_asc"
  | "created_at_desc";

export interface CategoryAttribute {
  name: string;
  type: CategoryAttributeType;
  options: string[] | null;
  isRequired: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  isActive: boolean;
  sortOrder: number;
  attributes: CategoryAttribute[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
  depth: number;
  pathNames: string[];
}

export interface CategoryStats {
  total: number;
  active: number;
  root: number;
}

export interface CategoryListParams {
  search?: string;
  status?: boolean;
  parentId?: string;
  sortBy?: CategorySort;
}

export interface CategoryTreeParams {
  search?: string;
  status?: boolean;
}

export interface CategoryAttributeInput {
  name: string;
  type: CategoryAttributeType;
  options?: string[] | null;
  isRequired: boolean;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  parentId?: string | null;
  isActive?: boolean;
  sortOrder?: number;
  attributes?: CategoryAttributeInput[];
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  parentId?: string | null;
  isActive?: boolean;
  sortOrder?: number;
  attributes?: CategoryAttributeInput[];
}

export interface ArchiveCategoryParams {
  categoryId: string;
  cascadeDelete?: boolean;
}

export interface ArchiveCategoryResult {
  deletedIds: string[];
  reassignedIds: string[];
}

export interface ReorderCategoriesInput {
  orderedIds: string[];
}

export interface CategorySlugCheckParams {
  slug: string;
  excludeId?: string;
}

export interface SlugAvailability {
  available: boolean;
}
