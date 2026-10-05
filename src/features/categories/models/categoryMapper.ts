import type {
  Category as CategoryDto,
  CategoryAttributeInput,
  CategoryStats as CategoryStatsDto,
  CategoryTree as CategoryTreeDto,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/entities/category";
import type { Category, CategoryFormData, CategoryStats, CategoryTreeItem } from "../types";

export function toCategoryViewModel(category: CategoryDto): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    parentId: category.parentId,
    productCount: 0,
    isActive: category.isActive,
    displayOrder: category.sortOrder,
    attributes: category.attributes.map((attribute, index) => ({
      id: `${category.id}-attribute-${index}`,
      name: attribute.name,
      type: attribute.type,
      options: attribute.options ?? undefined,
      isRequired: attribute.isRequired,
    })),
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export function toCategoryTreeViewModel(node: CategoryTreeDto): CategoryTreeItem {
  return {
    ...toCategoryViewModel(node),
    children: node.children.map(toCategoryTreeViewModel),
    depth: node.depth,
    pathNames: node.pathNames,
  };
}

export function toCategoryStatsViewModel(stats: CategoryStatsDto): CategoryStats {
  return {
    totalCategories: stats.total,
    rootCategories: stats.root,
    subCategories: Math.max(0, stats.total - stats.root),
    totalProducts: 0,
    activeCategories: stats.active,
  };
}

export function getDescendantIds(categoryId: string, categories: Category[]): string[] {
  const result: string[] = [];
  const visit = (parentId: string) => {
    categories.forEach((category) => {
      if (category.parentId === parentId) {
        result.push(category.id);
        visit(category.id);
      }
    });
  };
  visit(categoryId);
  return result;
}

function toAttributes(form: CategoryFormData): CategoryAttributeInput[] {
  return form.attributes.map(({ name, type, options, isRequired }) => {
    if (type === "select") {
      const normalizedOptions = (options ?? []).map((option) => option.trim()).filter(Boolean);
      if (!normalizedOptions.length) {
        throw new Error("برای ویژگی انتخابی حداقل یک گزینه لازم است.");
      }
      return {
        name: name.trim(),
        type,
        options: normalizedOptions as [string, ...string[]],
        isRequired,
      };
    }
    return { name: name.trim(), type, options: null, isRequired };
  });
}

export function toCreateCategoryInput(form: CategoryFormData): CreateCategoryInput {
  return {
    name: form.name.trim(),
    slug: form.slug.trim(),
    parentId: form.parentId,
    isActive: form.isActive,
    sortOrder: form.displayOrder,
    attributes: toAttributes(form),
  };
}

export function toUpdateCategoryInput(form: CategoryFormData): UpdateCategoryInput {
  return toCreateCategoryInput(form);
}
