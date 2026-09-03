import { Loader2, RefreshCw, ServerOff, ShieldCheck } from "lucide-react";
import EButton from "@/shared-app/designSystem/button";
import { useAppBootstrap } from "../models/useAppBootstrap";
import type { AppBootstrapProps } from "../types";

export function AppBootstrap({ children }: AppBootstrapProps) {
  const model = useAppBootstrap();

  if (model.isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white p-4">
        <ShieldCheck className="w-10 h-10 text-indigo-400 mb-4" />
        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-3" />
        <p className="text-sm text-slate-300">در حال بررسی آمادگی سرویس...</p>
      </div>
    );
  }

  if (model.isUnavailable) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white p-4">
        <div className="glass-card max-w-md w-full p-8 text-center">
          <ServerOff className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">سرویس موقتاً در دسترس نیست</h1>
          <p className="text-sm text-slate-400 mb-6">
            ارتباط با API یا پایگاه داده برقرار نشد. نشست ذخیره‌شده شما حذف نشده است.
          </p>
          <EButton
            variant="primary"
            size="md"
            onClick={() => void model.retry()}
            isLoading={model.isRetrying}
            icon={<RefreshCw className="w-4 h-4" />}
            className="w-full justify-center"
          >
            تلاش دوباره
          </EButton>
        </div>
      </div>
    );
  }

  return children;
}
