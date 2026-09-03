import React from "react";
import type { DashboardSessionInspectorProps } from "../types";
import { EButton } from "@/shared-app/designSystem/button";
import { RefreshCw, KeyRound, Database } from "lucide-react";

function formatExpiry(value: string | null): string {
  return value ? new Date(value).toLocaleString("fa-IR") : "نامشخص";
}

export const DashboardSessionInspector: React.FC<DashboardSessionInspectorProps> = ({
  user,
  rememberMe,
  accessTokenExpiresAt,
  refreshTokenExpiresAt,
}) => {
  const safeSessionInfo = JSON.stringify(
    {
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
      storageType: rememberMe ? "localStorage" : "sessionStorage",
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
      tokens: "hidden",
    },
    null,
    2,
  );

  return (
    <div className="glass-card p-6 border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">اطلاعات امن نشست کاربری</h3>
          <p className="text-xs text-white/50 mt-1">
            انقضای access: {formatExpiry(accessTokenExpiresAt)} · انقضای refresh: {formatExpiry(refreshTokenExpiresAt)}
          </p>
        </div>
        <EButton
          variant="outlined"
          size="sm"
          onClick={() => window.location.reload()}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          بررسی بازیابی نشست
        </EButton>
      </div>

      <div className="rounded-xl bg-slate-950/80 border border-white/10 p-4 font-mono text-xs text-indigo-300/90 overflow-x-auto dir-ltr text-start">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 text-[11px] text-white/40">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Session metadata</span>
          </span>
          <span>{rememberMe ? "LOCAL_STORAGE" : "SESSION_STORAGE"}</span>
        </div>
        <pre className="whitespace-pre-wrap break-all leading-relaxed text-indigo-200">{safeSessionInfo}</pre>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
        <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>مقدار access token و refresh token عمداً در رابط کاربری نمایش داده نمی‌شود.</span>
      </div>
    </div>
  );
};

export default DashboardSessionInspector;
