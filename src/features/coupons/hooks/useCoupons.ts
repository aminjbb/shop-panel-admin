import { useState, useEffect, useCallback, useTransition } from "react";
import type {
  DiscountCoupon,
  CouponFilterParams,
  CouponListResponse,
  CreateCouponPayload,
  UpdateCouponPayload,
  CouponStatus,
  CouponType,
} from "@/types/crm";
import { mockCouponService } from "../api/mockCouponService";
import useToastStore from "@/shared-app/designSystem/toast/store";

export const initialCouponFilterParams: CouponFilterParams = {
  search: "",
  status: "all",
  type: "all",
  page: 1,
  limit: 8,
  sortBy: "createdAt",
  sortOrder: "desc",
};

export function useCoupons() {
  const [filters, setFilters] = useState<CouponFilterParams>(initialCouponFilterParams);
  const [data, setData] = useState<CouponListResponse>({
    coupons: [],
    total: 0,
    page: 1,
    limit: 8,
    totalPages: 1,
    counts: {
      all: 0,
      active: 0,
      expired: 0,
      disabled: 0,
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [selectedCoupon, setSelectedCoupon] = useState<DiscountCoupon | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const [, startTransition] = useTransition();

  const fetchCoupons = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await mockCouponService.getCoupons(filters);
      setData(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطا در دریافت لیست کوپن‌ها";
      useToastStore.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleStatusTabChange = useCallback((status: CouponStatus | "all") => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  }, []);

  const handleTypeFilterChange = useCallback((type: CouponType | "all") => {
    setFilters((prev) => ({ ...prev, type, page: 1 }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    startTransition(() => {
      setFilters((prev) => ({ ...prev, search, page: 1 }));
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleOpenCreateModal = useCallback(() => {
    setSelectedCoupon(null);
    setFormMode("create");
    setIsFormModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((coupon: DiscountCoupon) => {
    setSelectedCoupon(coupon);
    setFormMode("edit");
    setIsFormModalOpen(true);
  }, []);

  const handleCloseFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setSelectedCoupon(null);
  }, []);

  const handleCreateCoupon = useCallback(
    async (payload: CreateCouponPayload) => {
      setIsMutating(true);
      try {
        const created = await mockCouponService.createCoupon(payload);
        useToastStore.success(`کد تخفیف «${created.code}» با موفقیت ایجاد گردید.`);
        setIsFormModalOpen(false);
        await fetchCoupons();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "خطا در ایجاد کد تخفیف";
        useToastStore.error(msg);
      } finally {
        setIsMutating(false);
      }
    },
    [fetchCoupons]
  );

  const handleUpdateCoupon = useCallback(
    async (id: string, payload: UpdateCouponPayload) => {
      setIsMutating(true);
      try {
        const updated = await mockCouponService.updateCoupon(id, payload);
        useToastStore.success(`کد تخفیف «${updated.code}» به‌روزرسانی شد.`);
        setIsFormModalOpen(false);
        await fetchCoupons();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "خطا در ویرایش کد تخفیف";
        useToastStore.error(msg);
      } finally {
        setIsMutating(false);
      }
    },
    [fetchCoupons]
  );

  const handleToggleCouponStatus = useCallback(
    async (couponId: string) => {
      setIsMutating(true);
      try {
        const updated = await mockCouponService.toggleCouponStatus(couponId);
        useToastStore.success(
          `وضعیت کوپن «${updated.code}» به ${
            updated.status === "active"
              ? "فعال"
              : updated.status === "disabled"
              ? "غیرفعال"
              : "منقضی‌شده"
          } تغییر کرد.`
        );
        await fetchCoupons();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "خطا در تغییر وضعیت کوپن";
        useToastStore.error(msg);
      } finally {
        setIsMutating(false);
      }
    },
    [fetchCoupons]
  );

  const handleDeleteCoupon = useCallback(
    async (couponId: string) => {
      setIsMutating(true);
      try {
        await mockCouponService.deleteCoupon(couponId);
        useToastStore.success("کد تخفیف با موفقیت حذف گردید.");
        await fetchCoupons();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "خطا در حذف کد تخفیف";
        useToastStore.error(msg);
      } finally {
        setIsMutating(false);
      }
    },
    [fetchCoupons]
  );

  const handleResetMockData = useCallback(async () => {
    setIsLoading(true);
    try {
      await mockCouponService.resetCouponsToMock();
      useToastStore.info("داده‌های کدهای تخفیف با موفقیت بازنشانی شد.");
      setFilters(initialCouponFilterParams);
      await fetchCoupons();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطا در بازنشانی داده‌ها";
      useToastStore.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [fetchCoupons]);

  return {
    filters,
    data,
    isLoading,
    isMutating,
    selectedCoupon,
    isFormModalOpen,
    formMode,
    handleStatusTabChange,
    handleTypeFilterChange,
    handleSearch,
    handlePageChange,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseFormModal,
    handleCreateCoupon,
    handleUpdateCoupon,
    handleToggleCouponStatus,
    handleDeleteCoupon,
    handleResetMockData,
    fetchCoupons,
  };
}

export default useCoupons;
