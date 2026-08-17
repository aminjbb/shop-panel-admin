import React, { useState } from "react";
import type { DashboardSessionInspectorProps } from "../types";
import { EButton } from "@/shared-app/designSystem/button";
import { Terminal, Copy, Check, RefreshCw, KeyRound, Database } from "lucide-react";

export const DashboardSessionInspector: React.FC<DashboardSessionInspectorProps> = ({
  user,
  token,
  rememberMe,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateRefresh = () => {
    window.location.reload();
  };

  const sessionJson = JSON.stringify(
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
      token: token,
      rememberMe: rememberMe,
      storageType: rememberMe ? "localStorage" : "sessionStorage",
      issuedAt: new Date().toISOString(),
    },
    null,
    2
  );

  return (
    <div className="glass-card p-6 border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">
            بررسی زنده سشن و توکن جعلی (Client Session Inspector)
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <EButton
            variant="secondary"
            size="sm"
            onClick={handleCopyToken}
            icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? "کپی شد!" : "کپی توکن"}
          </EButton>

          <EButton
            variant="outlined"
            size="sm"
            onClick={handleSimulateRefresh}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            تست رفرش صفحه (F5)
          </EButton>
        </div>
      </div>

      <div className="relative rounded-xl bg-slate-950/80 border border-white/10 p-4 font-mono text-xs text-indigo-300/90 overflow-x-auto max-h-60 dir-ltr text-start">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 text-[11px] text-white/40">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Key: dynova_admin_auth_session</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
            {rememberMe ? "LOCAL_STORAGE" : "SESSION_STORAGE"}
          </span>
        </div>
        <pre className="whitespace-pre-wrap break-all leading-relaxed text-indigo-200">
          {sessionJson}
        </pre>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
        <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>
          با زدن دکمه «تست رفرش صفحه»، صفحه مرورگر مجدداً بارگذاری شده و نشست بدون خروج کاربر بازیابی می‌شود.
        </span>
      </div>
    </div>
  );
};

export default DashboardSessionInspector;
