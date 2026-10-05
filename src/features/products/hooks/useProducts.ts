import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError, createRequestId } from "@/config/api";
import { categoryApi } from "@/entities/category";
import { mediaApi } from "@/entities/media";
import {
  productApi,
  type AdjustProductStockRequest,
  type Product as ProductDto,
  type ProductListResponse,
} from "@/entities/product";
import useToastStore from "@/shared-app/designSystem/toast/store";
import {
  toCreateProductInput,
  toProductListParams,
  toProductViewModel,
  toUpdateProductInput,
} from "../models/productMapper";
import type { Product, ProductFilterState, ProductFormData, ProductSortOption } from "../types";

export const initialFilterState: ProductFilterState = {
  search: "",
  category: "all",
  stockStatus: "all",
  sortBy: "createdAt_desc",
  page: 1,
  pageSize: 6,
};

const productKeys = {
  all: ["products"] as const,
  lists: ["products", "list"] as const,
  list: (params: object) => ["products", "list", params] as const,
  detail: (id: string) => ["products", "detail", id] as const,
};

function productErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof ApiError)) return error instanceof Error ? error.message : fallback;
  const messages: Partial<Record<string, string>> = {
    sku_taken: "شناسه SKU محصول قبلاً استفاده شده است.",
    variant_sku_taken: "شناسه SKU یکی از تنوع‌های کالا تکراری است.",
    slug_taken: "آدرس انتخاب‌شده برای محصول قبلاً ثبت شده است.",
    inactive_or_missing: "دسته‌بندی انتخاب‌شده وجود ندارد یا غیرفعال است.",
    variant_has_inventory_history: "تنوعی که سابقه موجودی دارد قابل حذف نیست.",
    missing_or_inactive: "فایل رسانه‌ای وجود ندارد یا غیرفعال شده است.",
    negative_stock: "این تغییر باعث منفی‌شدن موجودی می‌شود.",
    idempotency_key_reused: "درخواست موجودی تکراری و ناسازگار بود؛ داده‌ها تازه‌سازی شدند.",
  };
  const reason = typeof error.details.reason === "string" ? error.details.reason : "";
  return messages[reason] ??
    (error.requestId ? `${fallback} (شناسه پیگیری: ${error.requestId})` : fallback);
}

function updateStockProduct(product: ProductDto, variantId: string, delta: number): ProductDto {
  const variants = product.variants.map((variant) =>
    variant.id === variantId ? { ...variant, stock: Math.max(0, variant.stock + delta) } : variant,
  );
  const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);
  return {
    ...product,
    variants,
    totalStock,
    stockStatus: totalStock <= 0 ? "out_of_stock" : totalStock <= 10 ? "low_stock" : "in_stock",
  };
}

export function useProducts() {
  const queryClient = useQueryClient();
  const uploadedMediaRef = useRef<{ file: File; id: string } | null>(null);
  const [filters, setFilters] = useState<ProductFilterState>(initialFilterState);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingSnapshot, setEditingSnapshot] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const stockQueues = useRef(new Map<string, Promise<unknown>>());
  const [, startTransition] = useTransition();

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(filters.search), 350);
    return () => window.clearTimeout(timer);
  }, [filters.search]);

  const listParams = useMemo(
    () => toProductListParams(filters, debouncedSearch),
    [debouncedSearch, filters],
  );

  const categoryOptionsQuery = useQuery({
    queryKey: ["categories", "product-options"],
    queryFn: ({ signal }) => categoryApi.productOptions(signal),
  });
  const categoryNames = useMemo(
    () => new Map((categoryOptionsQuery.data ?? []).map((category) => [category.id, category.name])),
    [categoryOptionsQuery.data],
  );
  const listQuery = useQuery({
    queryKey: productKeys.list(listParams),
    queryFn: ({ signal }) => productApi.list(listParams, signal),
    placeholderData: (previous) => previous,
  });
  const detailQuery = useQuery({
    queryKey: productKeys.detail(editingProductId ?? "none"),
    queryFn: ({ signal }) => productApi.get(editingProductId as string, signal),
    enabled: isFormModalOpen && Boolean(editingProductId),
  });

  useEffect(() => {
    const totalPages = listQuery.data?.totalPages;
    if (totalPages && filters.page > totalPages) {
      setFilters((current) => ({ ...current, page: totalPages }));
    }
  }, [filters.page, listQuery.data?.totalPages]);

  const invalidateProducts = () => queryClient.invalidateQueries({ queryKey: productKeys.all });

  const saveMutation = useMutation({
    mutationFn: async ({ formData, editId }: { formData: ProductFormData; editId?: string }) => {
      const slug = formData.seo.slug.trim();
      if (slug) {
        const availability = await productApi.checkSlug({ slug, excludeId: editId });
        if (!availability.available) throw new Error("آدرس انتخاب‌شده برای محصول قبلاً ثبت شده است.");
      }
      let imageMediaId = formData.imageMediaId ?? undefined;
      if (formData.imageFile) {
        if (uploadedMediaRef.current?.file === formData.imageFile) {
          imageMediaId = uploadedMediaRef.current.id;
        } else {
          imageMediaId = (await mediaApi.upload({ kind: "product", file: formData.imageFile })).id;
          uploadedMediaRef.current = { file: formData.imageFile, id: imageMediaId };
        }
      }
      if (editId) return productApi.update(editId, toUpdateProductInput(formData, imageMediaId));
      if (!imageMediaId) throw new Error("برای ایجاد محصول، انتخاب و آپلود تصویر الزامی است.");
      return productApi.create(toCreateProductInput(formData, imageMediaId));
    },
    onSuccess: async (product, variables) => {
      queryClient.setQueryData(productKeys.detail(product.id), product);
      await invalidateProducts();
      useToastStore.success(variables.editId
        ? `محصول «${variables.formData.title}» با موفقیت ویرایش شد.`
        : `محصول «${variables.formData.title}» با موفقیت به کاتالوگ اضافه شد.`);
      setIsFormModalOpen(false);
      setEditingProductId(null);
      setEditingSnapshot(null);
      uploadedMediaRef.current = null;
    },
    onError: (error) => useToastStore.error(productErrorMessage(error, "خطا در ذخیره محصول")),
  });

  const archiveMutation = useMutation({
    mutationFn: (productId: string) => productApi.archive(productId),
    onSuccess: async () => {
      const title = productToDelete?.title;
      await invalidateProducts();
      useToastStore.success(title ? `محصول «${title}» با موفقیت آرشیو شد.` : "محصول آرشیو شد.");
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    },
    onError: (error) => useToastStore.error(productErrorMessage(error, "خطا در آرشیو محصول")),
  });

  const stockMutation = useMutation({
    mutationFn: (request: AdjustProductStockRequest) => productApi.adjustStock(request),
    onMutate: async (request) => {
      await queryClient.cancelQueries({ queryKey: productKeys.lists });
      const snapshots = queryClient.getQueriesData<ProductListResponse>({ queryKey: productKeys.lists });
      snapshots.forEach(([key, current]) => current && queryClient.setQueryData<ProductListResponse>(key, {
        ...current,
        products: current.products.map((product) => product.id === request.productId
          ? updateStockProduct(product, request.input.variantId, request.input.delta)
          : product),
      }));
      return { snapshots };
    },
    onError: (error, _request, context) => {
      context?.snapshots.forEach(([key, value]) => queryClient.setQueryData(key, value));
      useToastStore.error(productErrorMessage(error, "خطا در ویرایش موجودی"));
    },
    onSuccess: (product) => {
      queryClient.setQueryData(productKeys.detail(product.id), product);
      useToastStore.info("موجودی کالا به‌روزرسانی شد.");
    },
    onSettled: async (_data, error, request) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: productKeys.lists }),
        queryClient.invalidateQueries({ queryKey: productKeys.detail(request.productId) }),
        queryClient.invalidateQueries({ queryKey: ["notifications"] }),
      ]);
      if (error instanceof ApiError && ["negative_stock", "idempotency_key_reused"].includes(String(error.details.reason))) {
        await queryClient.refetchQueries({ queryKey: productKeys.lists });
      }
    },
  });

  const products = useMemo(
    () => (listQuery.data?.products ?? []).map((product) => toProductViewModel(product, categoryNames)),
    [categoryNames, listQuery.data?.products],
  );
  const editingProduct = useMemo(
    () => detailQuery.data ? toProductViewModel(detailQuery.data, categoryNames) : editingSnapshot,
    [categoryNames, detailQuery.data, editingSnapshot],
  );
  const categoryOptions = useMemo(
    () => (categoryOptionsQuery.data ?? []).map((category) => ({ id: category.id, label: category.name })),
    [categoryOptionsQuery.data],
  );

  const handleQuickStockUpdate = async (productId: string, variantId: string | null, delta: number) => {
    const targetVariantId = variantId ?? products.find((item) => item.id === productId)?.variants[0]?.id;
    if (!targetVariantId) {
      useToastStore.error("تنوع کالای معتبری برای تغییر موجودی پیدا نشد.");
      return;
    }
    const queueKey = `${productId}:${targetVariantId}`;
    const request: AdjustProductStockRequest = {
      productId,
      idempotencyKey: createRequestId("stock"),
      input: { variantId: targetVariantId, delta },
    };
    const previous = stockQueues.current.get(queueKey) ?? Promise.resolve();
    const current = previous.catch(() => undefined).then(() => stockMutation.mutateAsync(request));
    stockQueues.current.set(queueKey, current);
    try { await current; } catch { /* callbacks handle rollback and feedback */ }
    finally { if (stockQueues.current.get(queueKey) === current) stockQueues.current.delete(queueKey); }
  };

  const error = listQuery.error
    ? productErrorMessage(listQuery.error, "خطا در دریافت لیست محصولات")
    : categoryOptionsQuery.error
      ? productErrorMessage(categoryOptionsQuery.error, "خطا در دریافت دسته‌بندی‌ها")
      : null;

  return {
    products,
    totalCount: listQuery.data?.totalCount ?? 0,
    currentPage: listQuery.data?.page ?? filters.page,
    pageSize: listQuery.data?.pageSize ?? filters.pageSize,
    totalPages: listQuery.data?.totalPages ?? 0,
    activeFiltersCount: listQuery.data?.activeFiltersCount ?? 0,
    filters,
    categoryOptions,
    isLoading: listQuery.isLoading || categoryOptionsQuery.isLoading,
    isMutating: saveMutation.isPending || archiveMutation.isPending || stockMutation.isPending,
    error,
    isFormModalOpen,
    editingProduct,
    isDeleteDialogOpen,
    productToDelete,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    onSearch: (search: string) => startTransition(() => setFilters((current) => ({ ...current, search, page: 1 }))),
    onCategoryChange: (category: string) => setFilters((current) => ({ ...current, category, page: 1 })),
    onStockStatusChange: (stockStatus: string) => setFilters((current) => ({ ...current, stockStatus, page: 1 })),
    onSortChange: (sortBy: ProductSortOption) => setFilters((current) => ({ ...current, sortBy })),
    onPageChange: (page: number) => setFilters((current) => ({ ...current, page })),
    onResetFilters: () => setFilters(initialFilterState),
    onOpenCreateModal: () => { uploadedMediaRef.current = null; setEditingProductId(null); setEditingSnapshot(null); setIsFormModalOpen(true); },
    onOpenEditModal: (product: Product) => { uploadedMediaRef.current = null; setEditingProductId(product.id); setEditingSnapshot(product); setIsFormModalOpen(true); },
    onCloseFormModal: () => { uploadedMediaRef.current = null; setIsFormModalOpen(false); setEditingProductId(null); setEditingSnapshot(null); },
    onSaveProduct: (formData: ProductFormData, editId?: string) => saveMutation.mutateAsync({ formData, editId }).then(() => undefined),
    onOpenDeleteDialog: (product: Product) => { setProductToDelete(product); setIsDeleteDialogOpen(true); },
    onCloseDeleteDialog: () => { setIsDeleteDialogOpen(false); setProductToDelete(null); },
    onConfirmDelete: () => productToDelete ? archiveMutation.mutateAsync(productToDelete.id).then(() => undefined) : Promise.resolve(),
    onQuickStockUpdate: handleQuickStockUpdate,
    refetch: () => listQuery.refetch(),
  };
}

export default useProducts;
