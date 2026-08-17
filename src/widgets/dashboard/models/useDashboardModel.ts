import { useState, useCallback } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";

export const useDashboardModel = (onLogoutCallback?: () => void) => {
  const { user, token, rememberMe, logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      if (onLogoutCallback) {
        onLogoutCallback();
      }
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout, onLogoutCallback]);

  return {
    user,
    token: token || "",
    rememberMe,
    isLoggingOut: isLoggingOut || isLoading,
    handleLogout,
  };
};
