import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminStaffApi } from "@/entities/admin-staff";
import type { AdminRole, CreateStaffPayload, StaffFilterParams } from "@/types/settings";
import useToastStore from "@/shared-app/designSystem/toast/store";
import { mapAdminStaff } from "../models/settingsMappers";

export function useAdminStaff() {
  const queryClient = useQueryClient();
  const [filterParams, setFilterParams] = useState<StaffFilterParams>({ search: "", role: "all", status: "all", page: 1, pageSize: 8 });
  const query = useQuery({
    queryKey: ["admin-staff", "list", filterParams],
    queryFn: ({ signal }) => adminStaffApi.list({
      search: filterParams.search?.trim() || undefined,
      role: filterParams.role === "all" ? undefined : filterParams.role,
      status: filterParams.status === "all" ? undefined : filterParams.status === "active",
      page: filterParams.page,
      limit: filterParams.pageSize,
    }, signal),
  });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
  const create = useMutation({ mutationFn: adminStaffApi.create, onSuccess: invalidate });
  const role = useMutation({ mutationFn: ({ id, value }: { id: string; value: AdminRole }) => adminStaffApi.updateRole(id, { role: value }), onSuccess: invalidate });
  const toggle = useMutation({ mutationFn: adminStaffApi.toggleStatus, onSuccess: invalidate });
  const remove = useMutation({ mutationFn: adminStaffApi.remove, onSuccess: invalidate });
  const run = async <T,>(promise: Promise<T>, message: string) => {
    try { await promise; useToastStore.success(message); return { success: true }; }
    catch (error) { useToastStore.error(error instanceof Error ? error.message : "خطا در مدیریت کاربران"); return { success: false }; }
  };
  const staff = query.data?.staff.map(mapAdminStaff) ?? [];
  const counts = staff.reduce((result, member) => {
    result.all += 1; result[member.role] += 1; result[member.status] += 1; return result;
  }, { all: 0, super_admin: 0, inventory_manager: 0, support_agent: 0, active: 0, inactive: 0 });
  const limit = query.data?.limit ?? filterParams.pageSize ?? 8;
  return {
    staff, total: query.data?.totalCount ?? 0, page: query.data?.page ?? 1,
    totalPages: Math.max(1, Math.ceil((query.data?.totalCount ?? 0) / limit)), counts, filterParams,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    isSubmitting: create.isPending || remove.isPending,
    handleSearchChange: (search: string) => setFilterParams((p) => ({ ...p, search, page: 1 })),
    handleRoleChange: (value: AdminRole | "all") => setFilterParams((p) => ({ ...p, role: value, page: 1 })),
    handleStatusChange: (value: StaffFilterParams["status"]) => setFilterParams((p) => ({ ...p, status: value, page: 1 })),
    handlePageChange: (page: number) => setFilterParams((p) => ({ ...p, page })),
    createStaff: (payload: CreateStaffPayload) => run(create.mutateAsync(payload), "مدیر جدید ایجاد شد."),
    updateRole: (id: string, value: AdminRole) => run(role.mutateAsync({ id, value }), "نقش کاربر تغییر کرد."),
    toggleStatus: (id: string) => run(toggle.mutateAsync(id), "وضعیت حساب تغییر کرد."),
    deleteStaffMember: (id: string) => run(remove.mutateAsync(id), "حساب کاربر حذف شد."),
    refetch: query.refetch,
  };
}
export default useAdminStaff;
