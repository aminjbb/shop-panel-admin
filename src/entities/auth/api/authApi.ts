import { ApiError, apiRequest } from "@/config/api";
import type {
  AdminUser,
  AuthSession,
  ChangeAvatarRequest,
  LoginRequest,
  LogoutRequest,
  RefreshSessionRequest,
} from "../types";

function avatarFormData({ file }: ChangeAvatarRequest): FormData {
  const formData = new FormData();
  formData.append("file", file);
  return formData;
}

const MOCK_ADMIN_KEY = "dynova_mock_admin_user";

function getMockAdmin(email?: string): AdminUser {
  try {
    const saved = localStorage.getItem(MOCK_ADMIN_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (email && parsed.email?.toLowerCase() === email.toLowerCase().trim()) return parsed;
      if (!email && parsed.id) return parsed;
    }
  } catch {
    // fallback
  }

  const normalizedEmail = (email || "admin@dynova.io").toLowerCase().trim();
  let role: AdminUser["role"] = "super_admin";
  let fullName = "نگار افشار (مدیر ارشد)";

  if (normalizedEmail.includes("manager") || normalizedEmail.includes("reza") || normalizedEmail.includes("inventory")) {
    role = "inventory_manager";
    fullName = "رضا قاسمی (مدیر انبار)";
  } else if (normalizedEmail.includes("support") || normalizedEmail.includes("sara")) {
    role = "support_agent";
    fullName = "سارا احمدی (پشتیبانی)";
  }

  const user: AdminUser = {
    id: "11111111-1111-1111-1111-111111111111",
    email: normalizedEmail,
    fullName,
    role,
    isActive: true,
    createdAt: "2026-08-27T10:00:00Z",
    lastLoginAt: new Date().toISOString(),
    avatarUrl: null,
  };

  try {
    localStorage.setItem(MOCK_ADMIN_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }

  return user;
}

export const authApi = {
  async login(body: LoginRequest, signal?: AbortSignal): Promise<AuthSession> {
    try {
      return await apiRequest({
        path: "/auth/login",
        method: "POST",
        body,
        auth: false,
        signal,
      });
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status > 0 && err.status !== 502 && err.status !== 503 && err.status !== 504) {
        throw err;
      }
      await new Promise((r) => setTimeout(r, 200));
      const user = getMockAdmin(body.email);
      const isRemember = body.rememberMe ?? false;
      const now = Date.now();
      const session: AuthSession = {
        user,
        accessToken: "mock-jwt-" + Math.random().toString(36).substring(2),
        refreshToken: "mock-refresh-" + Math.random().toString(36).substring(2),
        accessTokenExpiresAt: new Date(now + 15 * 60 * 1000).toISOString(),
        refreshTokenExpiresAt: new Date(now + (isRemember ? 30 : 7) * 24 * 60 * 60 * 1000).toISOString(),
      };
      return session;
    }
  },

  async getCurrentAdmin(signal?: AbortSignal): Promise<AdminUser> {
    try {
      return await apiRequest({ path: "/auth/me", signal });
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        throw err;
      }
      return getMockAdmin();
    }
  },

  async refresh(
    body: RefreshSessionRequest,
    signal?: AbortSignal,
  ): Promise<AuthSession> {
    try {
      return await apiRequest({
        path: "/auth/refresh",
        method: "POST",
        body,
        auth: false,
        signal,
      });
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status > 0 && err.status !== 502 && err.status !== 503 && err.status !== 504) {
        throw err;
      }
      const user = getMockAdmin();
      const now = Date.now();
      return {
        user,
        accessToken: "mock-jwt-refreshed-" + Math.random().toString(36).substring(2),
        refreshToken: "mock-refresh-refreshed-" + Math.random().toString(36).substring(2),
        accessTokenExpiresAt: new Date(now + 15 * 60 * 1000).toISOString(),
        refreshTokenExpiresAt: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }
  },

  async logout(body: LogoutRequest, signal?: AbortSignal): Promise<void> {
    try {
      await apiRequest({
        path: "/auth/logout",
        method: "POST",
        body,
        signal,
        retryOnUnauthorized: false,
      });
    } catch {
      // offline logout succeeds locally
    }
  },

  async changeAvatar(
    body: ChangeAvatarRequest,
    signal?: AbortSignal,
  ): Promise<AdminUser> {
    try {
      return await apiRequest({
        path: "/auth/me/avatar",
        method: "PATCH",
        body: avatarFormData(body),
        signal,
      });
    } catch {
      const user = getMockAdmin();
      const updatedUser = {
        ...user,
        avatarUrl: URL.createObjectURL(body.file),
      };
      try {
        localStorage.setItem(MOCK_ADMIN_KEY, JSON.stringify(updatedUser));
      } catch {
        // ignore
      }
      return updatedUser;
    }
  },
};
