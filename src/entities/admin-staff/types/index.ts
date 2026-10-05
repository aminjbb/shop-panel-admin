export type AdminRole = "super_admin" | "inventory_manager" | "support_agent";

export interface AdminStaff {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface AdminStaffListParams {
  search?: string;
  role?: AdminRole;
  status?: boolean;
  page?: number;
  limit?: number;
}

export interface AdminStaffListResponse {
  staff: AdminStaff[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface CreateAdminStaffInput {
  email: string;
  fullName: string;
  temporaryPassword: string;
  role: AdminRole;
}

export interface UpdateAdminStaffRoleInput { role: AdminRole }
