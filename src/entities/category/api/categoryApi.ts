import { apiRequest } from "@/config/api";
import type {
  ArchiveCategoryParams,
  ArchiveCategoryResult,
  Category,
  CategoryListParams,
  CategorySlugCheckParams,
  CategoryStats,
  CategoryTree,
  CategoryTreeParams,
  CreateCategoryInput,
  ReorderCategoriesInput,
  SlugAvailability,
  UpdateCategoryInput,
} from "../types";

export const categoryApi = {
  list(
    params: CategoryListParams = {},
    signal?: AbortSignal,
  ): Promise<Category[]> {
    return apiRequest({ path: "/categories", query: { ...params }, signal });
  },

  get(categoryId: string, signal?: AbortSignal): Promise<Category> {
    return apiRequest({
      path: `/categories/${encodeURIComponent(categoryId)}`,
      signal,
    });
  },

  tree(
    params: CategoryTreeParams = {},
    signal?: AbortSignal,
  ): Promise<CategoryTree[]> {
    return apiRequest({ path: "/categories/tree", query: { ...params }, signal });
  },

  stats(signal?: AbortSignal): Promise<CategoryStats> {
    return apiRequest({ path: "/categories/stats", signal });
  },

  create(body: CreateCategoryInput, signal?: AbortSignal): Promise<Category> {
    return apiRequest({ path: "/categories", method: "POST", body, signal });
  },

  update(
    categoryId: string,
    body: UpdateCategoryInput,
    signal?: AbortSignal,
  ): Promise<Category> {
    return apiRequest({
      path: `/categories/${encodeURIComponent(categoryId)}`,
      method: "PATCH",
      body,
      signal,
    });
  },

  archive(
    { categoryId, cascadeDelete }: ArchiveCategoryParams,
    signal?: AbortSignal,
  ): Promise<ArchiveCategoryResult> {
    return apiRequest({
      path: `/categories/${encodeURIComponent(categoryId)}`,
      method: "DELETE",
      query: { cascadeDelete },
      signal,
    });
  },

  toggleStatus(categoryId: string, signal?: AbortSignal): Promise<Category> {
    return apiRequest({
      path: `/categories/${encodeURIComponent(categoryId)}/toggle-status`,
      method: "PATCH",
      signal,
    });
  },

  reorder(body: ReorderCategoriesInput, signal?: AbortSignal): Promise<void> {
    return apiRequest({
      path: "/categories/reorder",
      method: "PATCH",
      body,
      signal,
    });
  },

  checkSlug(
    params: CategorySlugCheckParams,
    signal?: AbortSignal,
  ): Promise<SlugAvailability> {
    return apiRequest({
      path: "/categories/slug-check",
      query: { ...params },
      signal,
    });
  },

  productOptions(signal?: AbortSignal): Promise<Category[]> {
    return apiRequest({ path: "/products/category-options", signal });
  },
};
