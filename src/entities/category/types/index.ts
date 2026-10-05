export type CategoryAttributeType = "text" | "number" | "select";
export type CategoryId = string;
export type IsoDateTime = string;

export type CategorySort =
  | "sort_order_asc"
  | "sort_order_desc"
  | "name_asc"
  | "name_desc"
  | "created_at_asc"
  | "created_at_desc";
export type CategorySortBy = CategorySort;

export type CategoryConflictReason =
  | "slug_taken"
  | "invalid_parent"
  | "invalid_attribute";

export interface CategoryAttribute {
  name: string;
  type: CategoryAttributeType;
  options: string[] | null;
  isRequired: boolean;
}

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  parentId: CategoryId | null;
  isActive: boolean;
  sortOrder: number;
  attributes: CategoryAttribute[];
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
  depth: number;
  pathNames: string[];
}
export type CategoryTreeNode = CategoryTree;

export interface CategoryStats {
  total: number;
  active: number;
  root: number;
}
export type CategoryStatsResponse = CategoryStats;

export interface CategoryListParams {
  search?: string;
  status?: boolean;
  parentId?: CategoryId;
  sortBy?: CategorySort;
}
export type CategoryListQuery = CategoryListParams;

export interface CategoryTreeParams {
  search?: string;
  status?: boolean;
}
export type CategoryTreeQuery = CategoryTreeParams;

interface CategoryAttributeInputBase {
  name: string;
  isRequired: boolean;
}

export type CategoryAttributeInput = CategoryAttributeInputBase & (
  | { type: "select"; options: [string, ...string[]] }
  | { type: "text" | "number"; options?: null }
);

export interface CreateCategoryInput {
  name: string;
  slug: string;
  parentId?: CategoryId | null;
  isActive?: boolean;
  sortOrder?: number;
  attributes?: CategoryAttributeInput[];
}

export interface UpdateCategoryFields {
  name: string;
  slug: string;
  parentId: CategoryId | null;
  isActive: boolean;
  sortOrder: number;
  attributes: CategoryAttributeInput[];
}

export type UpdateCategoryInput = {
  [Key in keyof UpdateCategoryFields]: Pick<UpdateCategoryFields, Key> &
    Partial<Omit<UpdateCategoryFields, Key>>;
}[keyof UpdateCategoryFields];

export interface ArchiveCategoryParams {
  categoryId: CategoryId;
  cascadeDelete?: boolean;
}
export type ArchiveCategoryQuery = Pick<ArchiveCategoryParams, "cascadeDelete">;

export interface ArchiveCategoryResult {
  deletedIds: CategoryId[];
  reassignedIds: CategoryId[];
}
export type ArchiveCategoryResponse = ArchiveCategoryResult;

export interface ReorderCategoriesInput {
  orderedIds: [CategoryId, ...CategoryId[]];
}

export interface CategorySlugCheckParams {
  slug: string;
  excludeId?: CategoryId;
}
export type CategorySlugCheckQuery = CategorySlugCheckParams;

export interface SlugAvailability {
  available: boolean;
}
export type SlugAvailabilityResponse = SlugAvailability;
