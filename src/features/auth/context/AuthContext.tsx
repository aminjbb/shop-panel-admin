import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { AdminUser, LoginCredentials, AuthSession } from "@/types/auth";
import { authMockApi } from "../api/authMockApi";

export interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberMe: boolean;
  login: (credentials: LoginCredentials) => Promise<AdminUser>;
  logout: () => Promise<void>;
  updateUserRoleForDemo?: (role: AdminUser["role"]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore stored session on mount (page refresh)
  useEffect(() => {
    try {
      const stored = authMockApi.getStoredAuthSession();
      if (stored) {
        setUser(stored.user);
        setToken(stored.token);
        setRememberMe(stored.rememberMe);
      }
    } catch (err) {
      console.error("Failed to restore auth session:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AdminUser> => {
    setIsLoading(true);
    try {
      const response = await authMockApi.mockLogin(credentials);
      setUser(response.user);
      setToken(response.token);
      setRememberMe(response.rememberMe);
      return response.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authMockApi.mockLogout();
      setUser(null);
      setToken(null);
      setRememberMe(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    rememberMe,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
