import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import EButton from "@/shared-app/designSystem/button";
import ETextField from "@/shared-app/designSystem/textField";
import { useDevelopmentReset } from "../hooks/useDevelopmentReset";

const CONFIRMATION = "development-data";

export default function DevelopmentResetPanel() {
  const [confirmation, setConfirmation] = useState("");
  const { isAvailable, isResetting, reset } = useDevelopmentReset();
  if (!isAvailable) return null;
  return (
    <section className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4 space-y-3">
      <div className="flex items-center gap-2 text-rose-300">
        <AlertTriangle className="h-5 w-5" />
        <h2 className="text-sm font-bold">ابزار محیط توسعه</h2>
      </div>
      <p className="text-xs text-slate-400">این عملیات داده‌های fixture محیط محلی را بازنشانی می‌کند. برای تأیید دقیقاً <span className="font-mono text-rose-300">{CONFIRMATION}</span> را وارد کنید.</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <ETextField value={confirmation} onChange={(event) => setConfirmation(event.target.value)} dir="ltr" placeholder={CONFIRMATION} />
        <EButton variant="secondary" size="md" disabled={confirmation !== CONFIRMATION} isLoading={isResetting} onClick={() => void reset()}>
          بازنشانی داده‌های توسعه
        </EButton>
      </div>
    </section>
  );
}
