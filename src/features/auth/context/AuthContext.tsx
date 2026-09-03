import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ApiError,
  setAccessTokenProvider,
  setUnauthorizedHandler,
} from "@/config/api";
import {
  authApi,
  type AdminUser,
  type AuthSession,
  type LoginRequest,
} from "@/entities/auth";
import type { AuthContextType, AuthProviderProps } from "../types";
import { refreshSessionSingleFlight } from "../models/refreshCoordinator";
import {
  clearStoredAuthSession,
  isRefreshExpired,
  loadStoredAuthSession,
  persistAuthSession,
  publishAuthChange,
  subscribeToAuthChanges,
  type StoredAuthSession,
} from "../models/sessionStorage";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [record, setRecord] = useState<StoredAuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const recordRef = useRef<StoredAuthSession | null>(null);
  const loginInFlight = useRef<Promise<AdminUser> | null>(null);

  const commitSession = useCallback(
    (session: AuthSession, rememberMe: boolean, broadcast = true) => {
      const next = persistAuthSession(session, rememberMe);
      recordRef.current = next;
      setRecord(next);
      if (broadcast && rememberMe) publishAuthChange("changed");
      return next;
    },
    [],
  );

  const clearSession = useCallback((broadcast = true) => {
    clearStoredAuthSession();
    recordRef.current = null;
    setRecord(null);
    if (broadcast) publishAuthChange("logout");
  }, []);

  useEffect(() => {
    setAccessTokenProvider(() => recordRef.current?.session.accessToken ?? null);
    setUnauthorizedHandler(async () => {
      const current = recordRef.current;
      if (!current) return false;

      try {
        const refreshed = await refreshSessionSingleFlight(current);
        recordRef.current = refreshed;
        setRecord(refreshed);
        if (refreshed.rememberMe) publishAuthChange("changed");
        return true;
      } catch (error) {
        if (error instanceof ApiError && error.code === "rate_limited") {
          throw error;
        }
        clearSession();
        throw error;
      }
    });

    return () => {
      setAccessTokenProvider(() => null);
      setUnauthorizedHandler(null);
    };
  }, [clearSession]);

  useEffect(() => {
    const controller = new AbortController();
    const stored = loadStoredAuthSession();

    if (!stored || isRefreshExpired(stored)) {
      if (stored) clearSession(false);
      setIsLoading(false);
      return () => controller.abort();
    }

    recordRef.current = stored;

    void authApi
      .getCurrentAdmin(controller.signal)
      .then((user) => {
        const activeRecord = recordRef.current;
        if (!activeRecord) return;
        commitSession(
          { ...activeRecord.session, user },
          activeRecord.rememberMe,
          false,
        );
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (
          error instanceof ApiError &&
          (error.code === "authentication_required" ||
            error.code === "invalid_access_token" ||
            error.code === "invalid_refresh_token")
        ) {
          clearSession();
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [clearSession, commitSession]);

  useEffect(
    () =>
      subscribeToAuthChanges((type) => {
        if (type === "logout") {
          recordRef.current = null;
          setRecord(null);
          return;
        }

        const stored = loadStoredAuthSession();
        if (stored?.rememberMe && !isRefreshExpired(stored)) {
          recordRef.current = stored;
          setRecord(stored);
        }
      }),
    [],
  );

  const login = useCallback(
    (credentials: LoginRequest): Promise<AdminUser> => {
      if (loginInFlight.current) return loginInFlight.current;

      setIsLoading(true);
      const rememberMe = credentials.rememberMe ?? false;
      const request = authApi
        .login({ ...credentials, email: credentials.email.trim() })
        .then((session) => {
          commitSession(session, rememberMe);
          return session.user;
        })
        .finally(() => {
          loginInFlight.current = null;
          setIsLoading(false);
        });

      loginInFlight.current = request;
      return request;
    },
    [commitSession],
  );

  const logout = useCallback(async (): Promise<void> => {
    const current = recordRef.current;
    setIsLoading(true);
    try {
      if (current) {
        await authApi.logout({ refreshToken: current.session.refreshToken });
      }
    } catch {
      // The browser session is still cleared when server revocation is uncertain.
    } finally {
      clearSession();
      setIsLoading(false);
    }
  }, [clearSession]);

  const value = useMemo<AuthContextType>(
    () => ({
      user: record?.session.user ?? null,
      isAuthenticated: Boolean(record?.session.user && record.session.accessToken),
      isLoading,
      rememberMe: record?.rememberMe ?? false,
      accessTokenExpiresAt: record?.session.accessTokenExpiresAt ?? null,
      refreshTokenExpiresAt: record?.session.refreshTokenExpiresAt ?? null,
      login,
      logout,
    }),
    [isLoading, login, logout, record],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
