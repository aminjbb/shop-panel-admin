import { useState, useEffect, useCallback } from "react";
import type {
  AdminStaff,
  AdminRole,
  StaffFilterParams,
  CreateStaffPayload,
} from "@/types/settings";
import mockSettingsService from "../api/mockSettingsService";
import useToastStore from "@/shared-app/designSystem/toast/store";

export function useAdminStaff() {
  const [staff, setStaff] = useState<AdminStaff[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState({
    all: 0,
    super_admin: 0,
    inventory_manager: 0,
    support_agent: 0,
    active: 0,
    inactive: 0,
  });

  const [filterParams, setFilterParams] = useState<StaffFilterParams>({
    search: "",
    role: "all",
    status: "all",
    page: 1,
    pageSize: 8,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await mockSettingsService.getStaff(filterParams);
      setStaff(res.staff);
      setTotal(res.total);
      setPage(res.page);
      setTotalPages(res.totalPages);
      setCounts(res.counts);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در دریافت لیست مدیران";
      useToastStore.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [filterParams]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleSearchChange = (search: string) => {
    setFilterParams((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleRoleChange = (role: AdminRole | "all") => {
    setFilterParams((prev) => ({ ...prev, role, page: 1 }));
  };

  const handleStatusChange = (status: StaffFilterParams["status"]) => {
    setFilterParams((prev) => ({ ...prev, status, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilterParams((prev) => ({ ...prev, page: newPage }));
  };

  const createStaff = async (payload: CreateStaffPayload) => {
    setIsSubmitting(true);
    try {
      const created = await mockSettingsService.createStaff(payload);
      useToastStore.success(`مدیر «${created.fullName}» با موفقیت افزوده شد.`);
      await fetchStaff();
      return { success: true };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در ثبت مدیر جدید";
      useToastStore.error(errMsg);
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateRole = async (id: string, role: AdminRole) => {
    try {
      const updated = await mockSettingsService.updateStaffRole(id, role);
      setStaff((prev) => prev.map((s) => (s.id === id ? updated : s)));
      useToastStore.info(`نقش کاربری «${updated.fullName}» تغییر یافت.`);
      return { success: true };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در تغییر نقش کاربری";
      useToastStore.error(errMsg);
      return { success: false };
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const updated = await mockSettingsService.toggleStaffStatus(id);
      setStaff((prev) => prev.map((s) => (s.id === id ? updated : s)));
      useToastStore.info(
        `حساب «${updated.fullName}» ${updated.status === "active" ? "فعال" : "غیرفعال"} گردید.`
      );
      return { success: true };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در تغییر وضعیت حساب";
      useToastStore.error(errMsg);
      return { success: false };
    }
  };

  const deleteStaffMember = async (id: string) => {
    setIsSubmitting(true);
    try {
      await mockSettingsService.deleteStaff(id);
      useToastStore.success("حساب کاربر با موفقیت حذف شد.");
      await fetchStaff();
      return { success: true };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در حذف کاربر";
      useToastStore.error(errMsg);
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    staff,
    total,
    page,
    totalPages,
    counts,
    filterParams,
    isLoading,
    isSubmitting,
    handleSearchChange,
    handleRoleChange,
    handleStatusChange,
    handlePageChange,
    createStaff,
    updateRole,
    toggleStatus,
    deleteStaffMember,
    refetch: fetchStaff,
  };
}

export default useAdminStaff;
