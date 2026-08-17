import React, { useEffect, useState } from "react";
import { useToastStore, type ToastItem } from "./store";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsubscribe = useToastStore.subscribe((newToasts) => {
      setToasts(newToasts);
    });
    return unsubscribe;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      id="toast-container"
      className="fixed bottom-4 start-4 sm:start-auto sm:end-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        let borderClass = "border-slate-700 bg-slate-900 text-white";
        let icon = <Info className="w-5 h-5 text-indigo-400 shrink-0" />;

        if (toast.type === "success") {
          borderClass = "border-emerald-500/40 bg-slate-900 text-emerald-100";
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
        } else if (toast.type === "error") {
          borderClass = "border-rose-500/40 bg-slate-900 text-rose-100";
          icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
        } else if (toast.type === "warning") {
          borderClass = "border-amber-500/40 bg-slate-900 text-amber-100";
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg transition-all duration-200 ${borderClass}`}
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              {toast.title && (
                <div className="text-xs font-bold text-white mb-0.5">
                  {toast.title}
                </div>
              )}
              <div className="text-xs text-slate-300 leading-relaxed">
                {toast.message}
              </div>
            </div>
            <button
              type="button"
              onClick={() => useToastStore.dismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="بستن اعلان"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
