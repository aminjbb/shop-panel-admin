import type {
  CreateProductInput,
  Product as ProductDto,
  ProductListParams,
  ProductSort,
  ProductVariantInput,
  UpdateProductInput,
} from "@/entities/product";
import type {
  Product,
  ProductFilterState,
  ProductFormData,
  ProductSortOption,
} from "../types";

const sortMap: Record<ProductSortOption, ProductSort> = {
  createdAt_desc: "created_at_desc",
  createdAt_asc: "created_at_asc",
  price_asc: "price_asc",
  price_desc: "price_desc",
  stock_asc: "stock_asc",
  stock_desc: "stock_desc",
  title_asc: "title_asc",
  title_desc: "title_desc",
};

const isPersistedId = (id: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

export function toProductListParams(
  filters: ProductFilterState,
  debouncedSearch: string,
): ProductListParams {
  return {
    search: debouncedSearch.trim() || undefined,
    category: filters.category === "all" ? undefined : filters.category,
    stockStatus:
      filters.stockStatus === "all" ? undefined : filters.stockStatus as ProductListParams["stockStatus"],
    sortBy: sortMap[filters.sortBy],
    page: filters.page,
    pageSize: filters.pageSize,
  };
}

export function toProductViewModel(
  product: ProductDto,
  categoryNames: ReadonlyMap<string, string>,
): Product {
  const numericPrice = Number(product.price);
  return {
    id: product.id,
    title: product.title,
    sku: product.sku,
    category: product.category,
    categoryLabel: categoryNames.get(product.category) ?? product.category,
    price: Number.isFinite(numericPrice) ? numericPrice : 0,
    totalStock: product.totalStock,
    stockStatus: product.stockStatus,
    image: product.image,
    imageMediaId: product.imageMediaId,
    description: product.description ?? "",
    variants: product.variants.map((variant) => ({
      ...variant,
      price: Number.isFinite(numericPrice) ? numericPrice : 0,
    })),
    seo: {
      slug: product.slug ?? "",
      metaTitle: product.metaTitle ?? "",
      metaDescription: product.metaDescription ?? "",
      focusKeywords: product.focusKeywords,
      noIndex: product.noIndex,
      ogImage: product.image,
    },
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function toDecimalString(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "0";
  return value.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function toVariants(variants: ProductFormData["variants"]): ProductVariantInput[] {
  return variants.map(({ id, sku, name, stock }) => ({
    ...(isPersistedId(id) ? { id } : {}),
    sku: sku.trim(),
    name: name.trim(),
    stock,
  }));
}

function commonInput(form: ProductFormData) {
  return {
    title: form.title.trim(),
    sku: form.sku.trim(),
    category: form.category,
    price: toDecimalString(form.price),
    description: form.description?.trim() || null,
    slug: form.seo.slug.trim() || null,
    metaTitle: form.seo.metaTitle.trim() || null,
    metaDescription: form.seo.metaDescription.trim() || null,
    noIndex: form.seo.noIndex,
    focusKeywords: form.seo.focusKeywords.map((keyword) => keyword.trim()).filter(Boolean),
    variants: toVariants(form.variants),
  };
}

export function toCreateProductInput(
  form: ProductFormData,
  imageMediaId: string,
): CreateProductInput {
  return { ...commonInput(form), imageMediaId };
}

export function toUpdateProductInput(
  form: ProductFormData,
  imageMediaId: string | undefined,
): UpdateProductInput {
  return {
    ...commonInput(form),
    ...(imageMediaId ? { imageMediaId } : {}),
  };
}

