import { apiRequest } from "@/config/api";
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

export const authApi = {
  login(body: LoginRequest, signal?: AbortSignal): Promise<AuthSession> {
    return apiRequest({
      path: "/auth/login",
      method: "POST",
      body,
      auth: false,
      signal,
    });
  },

  getCurrentAdmin(signal?: AbortSignal): Promise<AdminUser> {
    return apiRequest({ path: "/auth/me", signal });
  },

  refresh(
    body: RefreshSessionRequest,
    signal?: AbortSignal,
  ): Promise<AuthSession> {
    return apiRequest({
      path: "/auth/refresh",
      method: "POST",
      body,
      auth: false,
      signal,
    });
  },

  logout(body: LogoutRequest, signal?: AbortSignal): Promise<void> {
    return apiRequest({
      path: "/auth/logout",
      method: "POST",
      body,
      signal,
      retryOnUnauthorized: false,
    });
  },

  changeAvatar(
    body: ChangeAvatarRequest,
    signal?: AbortSignal,
  ): Promise<AdminUser> {
    return apiRequest({
      path: "/auth/me/avatar",
      method: "PATCH",
      body: avatarFormData(body),
      signal,
    });
  },
};
