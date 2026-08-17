import React from "react";
import type { Product } from "@/types/product";
import BottomSheet from "@/shared-app/bottomSheet";
import EButton from "@/shared-app/designSystem/button";
import { AlertTriangle, Trash2 } from "lucide-react";

export interface ProductDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export const ProductDeleteDialog: React.FC<ProductDeleteDialogProps> = ({
  isOpen,
  onClose,
  product,
  onConfirm,
  isLoading = false,
}) => {
  if (!product) return null;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title={
        <div className="flex items-center gap-2 text-rose-400">
          <AlertTriangle className="w-5 h-5" />
          <span>تأیید حذف محصول</span>
        </div>
      }
      subtitle="این عملیات غیرقابل بازگشت است."
      footer={
        <div className="flex items-center justify-end gap-2.5">
          <EButton
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isLoading}
            className="text-xs"
          >
            انصراف
          </EButton>

          <EButton
            variant="destructive"
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}
            className="text-xs font-bold px-4"
            icon={<Trash2 className="w-4 h-4" />}
          >
            بله، حذف شود
          </EButton>
        </div>
      }
    >
      <div className="space-y-3 py-1">
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          آیا از حذف محصول{" "}
          <strong className="text-white font-bold">«{product.title}»</strong> با
          کد شناسایی{" "}
          <span className="font-mono text-indigo-400">{product.sku}</span> از
          کاتالوگ و انبار اطمینان دارید؟
        </p>

        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs flex items-center gap-2">
          <span>
            کلیه واریانت‌ها ({product.variants.length} مورد) و موجودی ثبت‌شده
            این کالا ({product.totalStock} عدد) از حافظه لوکال حذف خواهند شد.
          </span>
        </div>
      </div>
    </BottomSheet>
  );
};

export default ProductDeleteDialog;
