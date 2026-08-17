import { useState, useEffect, useCallback, useTransition } from "react";
import type {
  Product,
  ProductFilterState,
  ProductListResponse,
  ProductFormData,
  ProductSortOption,
} from "@/types/product";
import { mockProductService } from "../api/mockProductService";
import useToastStore from "@/shared-app/designSystem/toast/store";

export const initialFilterState: ProductFilterState = {
  search: "",
  category: "all",
  stockStatus: "all",
  sortBy: "createdAt_desc",
  page: 1,
  pageSize: 6,
};

export function useProducts() {
  const [filters, setFilters] = useState<ProductFilterState>(initialFilterState);
  const [data, setData] = useState<ProductListResponse>({
    products: [],
    totalCount: 0,
    page: 1,
    pageSize: 6,
    totalPages: 1,
    activeFiltersCount: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modals and dialogs state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const [, startTransition] = useTransition();

  // Load products list
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await mockProductService.getProducts(filters);
      setData(res);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در دریافت لیست محصولات";
      setError(errMsg);
      useToastStore.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter modifiers
  const handleSearch = useCallback((searchTerm: string) => {
    startTransition(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchTerm,
        page: 1, // reset to first page on search
      }));
    });
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setFilters((prev) => ({
      ...prev,
      category,
      page: 1,
    }));
  }, []);

  const handleStockStatusChange = useCallback((stockStatus: string) => {
    setFilters((prev) => ({
      ...prev,
      stockStatus,
      page: 1,
    }));
  }, []);

  const handleSortChange = useCallback((sortBy: ProductSortOption) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(initialFilterState);
    useToastStore.info("تمامی فیلترها و جستجو پاکسازی شدند.");
  }, []);

  // Modal Openers / Closers
  const handleOpenCreateModal = useCallback(() => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((product: Product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  }, []);

  const handleCloseFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setEditingProduct(null);
  }, []);

  const handleOpenDeleteDialog = useCallback((product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  }, []);

  // Save product (Create or Update)
  const handleSaveProduct = async (formData: ProductFormData, editId?: string) => {
    setIsMutating(true);
    try {
      if (editId) {
        await mockProductService.updateProduct(editId, formData);
        useToastStore.success(`محصول «${formData.title}» با موفقیت ویرایش شد.`);
      } else {
        await mockProductService.createProduct(formData);
        useToastStore.success(`محصول «${formData.title}» با موفقیت به کاتالوگ اضافه شد.`);
      }
      setIsFormModalOpen(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در ذخیره‌سازی اطلاعات محصول";
      useToastStore.error(errMsg);
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  // Confirm delete product
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsMutating(true);
    try {
      await mockProductService.deleteProduct(productToDelete.id);
      useToastStore.success(`محصول «${productToDelete.title}» با موفقیت حذف شد.`);
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      await fetchProducts();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در حذف محصول";
      useToastStore.error(errMsg);
    } finally {
      setIsMutating(false);
    }
  };

  // Quick stock adjustment (+1 / -1)
  const handleQuickStockUpdate = async (productId: string, variantId: string | null, delta: number) => {
    // Optimistic UI update for instant tactile feedback
    setData((prev) => {
      const updatedProducts = prev.products.map((p) => {
        if (p.id !== productId) return p;
        const variants = p.variants.map((v) => {
          if (variantId ? v.id === variantId : true) {
            const nextStock = Math.max(0, v.stock + delta);
            return { ...v, stock: nextStock };
          }
          return v;
        });
        const total = variants.reduce((s, v) => s + v.stock, 0);
        const status = total <= 0 ? ("out_of_stock" as const) : total <= 10 ? ("low_stock" as const) : ("in_stock" as const);
        return {
          ...p,
          variants,
          totalStock: total,
          stockStatus: status,
        };
      });
      return { ...prev, products: updatedProducts };
    });

    try {
      await mockProductService.updateStock(productId, variantId, delta);
      useToastStore.info(`موجودی کالا به‌روزرسانی شد.`);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در ویرایش موجودی";
      useToastStore.error(errMsg);
      await fetchProducts(); // Rollback on error
    }
  };

  // Reset to default mock data
  const handleResetToDefaultMock = async () => {
    setIsLoading(true);
    try {
      await mockProductService.resetToDefaultMockData();
      setFilters(initialFilterState);
      useToastStore.success("داده‌های ماک کاتالوگ با موفقیت به حالت اولیه بازگردانده شدند.");
      await fetchProducts();
    } catch {
      useToastStore.error("خطا در بازنشانی داده‌های ماک");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    products: data.products,
    totalCount: data.totalCount,
    currentPage: data.page,
    pageSize: data.pageSize,
    totalPages: data.totalPages,
    activeFiltersCount: data.activeFiltersCount,
    filters,
    isLoading,
    isMutating,
    error,
    // Modals
    isFormModalOpen,
    editingProduct,
    isDeleteDialogOpen,
    productToDelete,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    // Handlers
    onSearch: handleSearch,
    onCategoryChange: handleCategoryChange,
    onStockStatusChange: handleStockStatusChange,
    onSortChange: handleSortChange,
    onPageChange: handlePageChange,
    onResetFilters: handleResetFilters,
    onOpenCreateModal: handleOpenCreateModal,
    onOpenEditModal: handleOpenEditModal,
    onCloseFormModal: handleCloseFormModal,
    onSaveProduct: handleSaveProduct,
    onOpenDeleteDialog: handleOpenDeleteDialog,
    onCloseDeleteDialog: handleCloseDeleteDialog,
    onConfirmDelete: handleConfirmDelete,
    onQuickStockUpdate: handleQuickStockUpdate,
    onResetToDefaultMock: handleResetToDefaultMock,
    refetch: fetchProducts,
  };
}

export default useProducts;
