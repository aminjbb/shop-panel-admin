import { apiRequest } from "@/config/api";
import type {
  AdminStaff,
  AdminStaffListParams,
  AdminStaffListResponse,
  CreateAdminStaffInput,
  UpdateAdminStaffRoleInput,
} from "../types";

export const adminStaffApi = {
  list(params: AdminStaffListParams = {}, signal?: AbortSignal): Promise<AdminStaffListResponse> {
    return apiRequest({ path: "/admin-staff", query: { ...params }, signal });
  },
  create(body: CreateAdminStaffInput): Promise<AdminStaff> {
    return apiRequest({ path: "/admin-staff", method: "POST", body });
  },
  updateRole(id: string, body: UpdateAdminStaffRoleInput): Promise<AdminStaff> {
    return apiRequest({ path: `/admin-staff/${encodeURIComponent(id)}/role`, method: "PATCH", body });
  },
  toggleStatus(id: string): Promise<AdminStaff> {
    return apiRequest({ path: `/admin-staff/${encodeURIComponent(id)}/toggle-status`, method: "PATCH" });
  },
  remove(id: string): Promise<void> {
    return apiRequest({ path: `/admin-staff/${encodeURIComponent(id)}`, method: "DELETE" });
  },
};
