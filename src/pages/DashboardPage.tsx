import React, { useEffect, useState } from "react";
import AnalyticsContainer from "@/features/analytics/ui/AnalyticsContainer";
import DashboardWidget from "@/widgets/dashboard/ui/DashboardWidget";
import ProtectedRoute from "@/features/auth/ui/ProtectedRoute";
import { TrendingUp, ShieldCheck } from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";

export interface DashboardPageProps {
  onLogout?: () => void;
  onRedirectToLogin?: () => void;
  onNavigate?: (route: "orders" | "products" | "customers" | "coupons") => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onLogout,
  onRedirectToLogin,
  onNavigate,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"analytics" | "security">(
    user?.role === "support_agent" ? "security" : "analytics",
  );

  useEffect(() => {
    if (user?.role === "support_agent") setActiveTab("security");
  }, [user?.role]);

  return (
    <ProtectedRoute onRedirectToLogin={onRedirectToLogin}>
      <div className="flex flex-col gap-6">
        {/* Top switcher if user wants to inspect security/session token vs analytics */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
          <div className="inline-flex rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs">
            {user?.role !== "support_agent" && <button
              type="button"
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-indigo-600 text-white font-semibold shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>داشبورد تحلیلی و آمار فروشگاه</span>
            </button>}

            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "security"
                  ? "bg-indigo-600 text-white font-semibold shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>بازرسی نشست و سطوح دسترسی (RBAC)</span>
            </button>
          </div>
        </div>

        {activeTab === "analytics" ? (
          <AnalyticsContainer onNavigate={onNavigate} />
        ) : (
          <DashboardWidget onLogout={onLogout} />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
