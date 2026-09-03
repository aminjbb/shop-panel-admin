import React, { useEffect, type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Loader2 } from "lucide-react";

export interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  onRedirectToLogin?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  onRedirectToLogin,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) onRedirectToLogin?.();
  }, [isAuthenticated, isLoading, onRedirectToLogin]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 p-4">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center animate-pulse">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
          </div>
          <Loader2 className="absolute -bottom-1 -right-1 w-6 h-6 text-indigo-500 animate-spin" />
        </div>
        <h3 className="text-sm font-medium text-white/80">در حال بررسی نشست کاربری...</h3>
        <p className="text-xs text-white/40 mt-1">لطفاً چند لحظه شکیبا باشید</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{fallback || null}</>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
