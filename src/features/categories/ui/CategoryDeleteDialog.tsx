import React, { useState } from "react";
import type { Category } from "@/types/category";
import BottomSheet from "@/shared-app/bottomSheet";
import EButton from "@/shared-app/designSystem/button";
import { AlertTriangle, Trash2, Layers, Package, ShieldAlert } from "lucide-react";

export interface CategoryDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  childCount?: number;
  onConfirmDelete: (id: string, cascadeDelete: boolean) => Promise<void>;
  isLoading?: boolean;
}

export const CategoryDeleteDialog: React.FC<CategoryDeleteDialogProps> = ({
  isOpen,
  onClose,
  category,
  childCount = 0,
  onConfirmDelete,
  isLoading = false,
}) => {
  const [cascadeDelete, setCascadeDelete] = useState<boolean>(false);

  if (!category) return null;

  const hasChildren = childCount > 0;
  const hasProducts = (category.productCount || 0) > 0;

  const handleConfirm = async () => {
    await onConfirmDelete(category.id, cascadeDelete);
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="تایید حذف دسته‌بندی"
      subtitle={`آیا از حذف دسته‌بندی «${category.name}» اطمینان دارید؟`}
      size="md"
    >
      <div className="space-y-5">
        {/* Warning Icon & Message */}
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-3.5">
          <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-rose-200 text-sm">
              عملیات غیرقابل بازگشت
            </h4>
            <p className="text-rose-300/90 leading-relaxed">
              با حذف این دسته‌بندی، تمامی ارجاعات این دسته از منوهای عمومی و فیلترها حذف خواهد شد.
            </p>
          </div>
        </div>

        {/* Affected Products Alert */}
        {hasProducts && (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-300">
            <Package className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>هشدار کالاهای متصل:</strong> این دسته‌بندی شامل{" "}
              <strong className="text-white underline">{category.productCount} کالا</strong> است.
              پس از حذف، این کالاها به وضعیت <em>«بدون دسته‌بندی»</em> منتقل خواهند شد.
            </span>
          </div>
        )}

        {/* Subcategories handling choice if category has children */}
        {hasChildren ? (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>
                این شاخه دارای <strong>{childCount} زیردسته فعال</strong> است. نحوه مدیریت زیردسته‌ها:
              </span>
            </div>

            <div className="space-y-2">
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  !cascadeDelete
                    ? "bg-indigo-950/40 border-indigo-500/40 text-indigo-200"
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                <input
                  type="radio"
                  name="cascadeOption"
                  checked={!cascadeDelete}
                  onChange={() => setCascadeDelete(false)}
                  className="mt-0.5 text-indigo-600 focus:ring-0"
                />
                <div className="text-xs space-y-0.5">
                  <span className="font-semibold block text-slate-200">
                    انتقال زیردسته‌ها به دسته والد / ریشه (پیش‌نهادی)
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    زیرشاخه‌ها حفظ شده و یک سطح به سمت بالا منتقل می‌شوند.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  cascadeDelete
                    ? "bg-rose-950/40 border-rose-500/40 text-rose-200"
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                <input
                  type="radio"
                  name="cascadeOption"
                  checked={cascadeDelete}
                  onChange={() => setCascadeDelete(true)}
                  className="mt-0.5 text-rose-600 focus:ring-0"
                />
                <div className="text-xs space-y-0.5">
                  <span className="font-semibold block text-rose-200 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    حذف آبشاری (Cascade Delete)
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    تمام {childCount} زیردسته و شاخه‌های تودرتوی آن همزمان حذف شوند.
                  </span>
                </div>
              </label>
            </div>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <EButton variant="outlined" onClick={onClose} disabled={isLoading}>
            انصراف
          </EButton>

          <EButton
            variant="destructive"
            onClick={handleConfirm}
            isLoading={isLoading}
            icon={<Trash2 className="w-4 h-4" />}
          >
            تایید و حذف قطعی
          </EButton>
        </div>
      </div>
    </BottomSheet>
  );
};

export default CategoryDeleteDialog;
