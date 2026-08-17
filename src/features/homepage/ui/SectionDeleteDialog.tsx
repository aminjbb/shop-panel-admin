import React from "react";
import type { HomepageSection } from "@/types/homepage";
import EButton from "@/shared-app/designSystem/button";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface SectionDeleteDialogProps {
  section: HomepageSection | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  isUpdating?: boolean;
}

export const SectionDeleteDialog: React.FC<SectionDeleteDialogProps> = ({
  section,
  onClose,
  onConfirm,
  isUpdating = false,
}) => {
  if (!section) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Trash2 className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-base font-bold text-white">
              حذف سکشن «{section.title}»
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              آیا از حذف این بخش از صفحه اصلی فروشگاه اطمینان دارید؟ این عملیات
              تنظیمات این سکشن را از صفحه اصلی پاک می‌کند.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3">
            <EButton variant="outlined" size="sm" onClick={onClose}>
              انصراف
            </EButton>

            <EButton
              variant="destructive"
              size="sm"
              isLoading={isUpdating}
              onClick={() => onConfirm(section.id)}
              icon={<Trash2 className="w-4 h-4" />}
            >
              حذف قطعی سکشن
            </EButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionDeleteDialog;
