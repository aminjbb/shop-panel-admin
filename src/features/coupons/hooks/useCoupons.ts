import { useCallback, useMemo, useState, useTransition } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "@/entities/category";
import { couponApi } from "@/entities/coupon";
import type {
  CouponFilterParams,
  CouponStatus,
  CouponType,
  CreateCouponPayload,
  DiscountCoupon,
  UpdateCouponPayload,
} from "@/types/crm";
import useToastStore from "@/shared-app/designSystem/toast/store";
import { useAuth } from "@/entities/auth";
import {
  toCouponListParams,
  toCouponViewModel,
  toCreateCouponInput,
  toUpdateCouponInput,
} from "../models/couponMapper";

export const initialCouponFilterParams: CouponFilterParams = {
  search: "",
  status: "all",
  type: "all",
  page: 1,
  limit: 8,
  sortBy: "createdAt",
  sortOrder: "desc",
};

const couponKeys = { all: ["coupons"] as const };

export function useCoupons() {
  const { user } = useAuth();
  const canManage = user?.role === "super_admin";
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<CouponFilterParams>(initialCouponFilterParams);
  const [selectedCoupon, setSelectedCoupon] = useState<DiscountCoupon | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [, startTransition] = useTransition();

  const listQuery = useQuery({
    queryKey: ["coupons", "list", filters],
    queryFn: ({ signal }) => couponApi.list(toCouponListParams(filters), signal),
  });
  const countQueries = {
    all: useQuery({ queryKey: ["coupons", "count", "all"], queryFn: ({ signal }) => couponApi.list({ page: 1, limit: 1 }, signal) }),
    active: useQuery({ queryKey: ["coupons", "count", "active"], queryFn: ({ signal }) => couponApi.list({ status: "active", page: 1, limit: 1 }, signal) }),
    expired: useQuery({ queryKey: ["coupons", "count", "expired"], queryFn: ({ signal }) => couponApi.list({ status: "expired", page: 1, limit: 1 }, signal) }),
    disabled: useQuery({ queryKey: ["coupons", "count", "disabled"], queryFn: ({ signal }) => couponApi.list({ status: "disabled", page: 1, limit: 1 }, signal) }),
  };
  const categoriesQuery = useQuery({
    queryKey: ["categories", "coupon-options"],
    queryFn: ({ signal }) => categoryApi.list({ status: true, sortBy: "name_asc" }, signal),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: couponKeys.all });
  const createMutation = useMutation({
    mutationFn: (payload: CreateCouponPayload) => couponApi.create(toCreateCouponInput(payload)),
    retry: false,
    onSuccess: async (coupon) => { await invalidate(); setIsFormModalOpen(false); useToastStore.success(`کد تخفیف «${coupon.code}» ایجاد شد.`); },
    onError: () => useToastStore.error("خطا در ایجاد کد تخفیف"),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCouponPayload }) => couponApi.update(id, toUpdateCouponInput(payload)),
    retry: false,
    onSuccess: async (coupon) => { await invalidate(); setIsFormModalOpen(false); useToastStore.success(`کد تخفیف «${coupon.code}» به‌روزرسانی شد.`); },
    onError: () => useToastStore.error("خطا در ویرایش کد تخفیف"),
  });
  const toggleMutation = useMutation({
    mutationFn: (id: string) => couponApi.toggleStatus(id),
    retry: false,
    onSuccess: async () => { await invalidate(); useToastStore.success("وضعیت کوپن تغییر کرد."); },
    onError: () => useToastStore.error("خطا در تغییر وضعیت کوپن"),
  });
  const archiveMutation = useMutation({
    mutationFn: (id: string) => couponApi.archive(id),
    retry: false,
    onSuccess: async () => { await invalidate(); useToastStore.success("کد تخفیف آرشیو شد."); },
    onError: () => useToastStore.error("خطا در حذف کد تخفیف"),
  });

  const data = useMemo(() => {
    const response = listQuery.data;
    const limit = response?.limit ?? filters.limit ?? 8;
    return {
      coupons: (response?.coupons ?? []).map(toCouponViewModel),
      total: response?.totalCount ?? 0,
      page: response?.page ?? filters.page ?? 1,
      limit,
      totalPages: Math.max(1, Math.ceil((response?.totalCount ?? 0) / limit)),
      counts: {
        all: countQueries.all.data?.totalCount ?? 0,
        active: countQueries.active.data?.totalCount ?? 0,
        expired: countQueries.expired.data?.totalCount ?? 0,
        disabled: countQueries.disabled.data?.totalCount ?? 0,
      },
    };
  }, [countQueries.active.data, countQueries.all.data, countQueries.disabled.data, countQueries.expired.data, filters.limit, filters.page, listQuery.data]);

  const handleStatusTabChange = useCallback((status: CouponStatus | "all") => setFilters((old) => ({ ...old, status, page: 1 })), []);
  const handleTypeFilterChange = useCallback((type: CouponType | "all") => setFilters((old) => ({ ...old, type, page: 1 })), []);
  const handleSearch = useCallback((search: string) => startTransition(() => setFilters((old) => ({ ...old, search, page: 1 }))), []);

  return {
    canManage,
    filters,
    data,
    categoryOptions: (categoriesQuery.data ?? []).map((category) => ({ value: category.id, label: category.name })),
    isLoading: listQuery.isLoading,
    isMutating: createMutation.isPending || updateMutation.isPending || toggleMutation.isPending || archiveMutation.isPending,
    selectedCoupon,
    isFormModalOpen,
    formMode,
    handleStatusTabChange,
    handleTypeFilterChange,
    handleSearch,
    handlePageChange: (page: number) => { setFilters((old) => ({ ...old, page })); window.scrollTo({ top: 0, behavior: "smooth" }); },
    handleOpenCreateModal: () => { setSelectedCoupon(null); setFormMode("create"); setIsFormModalOpen(true); },
    handleOpenEditModal: (coupon: DiscountCoupon) => { setSelectedCoupon(coupon); setFormMode("edit"); setIsFormModalOpen(true); },
    handleCloseFormModal: () => { setIsFormModalOpen(false); setSelectedCoupon(null); },
    handleCreateCoupon: (payload: CreateCouponPayload) => createMutation.mutateAsync(payload).then(() => undefined),
    handleUpdateCoupon: (id: string, payload: UpdateCouponPayload) => updateMutation.mutateAsync({ id, payload }).then(() => undefined),
    handleToggleCouponStatus: (id: string) => toggleMutation.mutateAsync(id).then(() => undefined),
    handleDeleteCoupon: (id: string) => archiveMutation.mutateAsync(id).then(() => undefined),
    fetchCoupons: () => listQuery.refetch(),
  };
}

export default useCoupons;
