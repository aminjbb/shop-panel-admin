import React from "react";
import type { ProductVariant } from "@/types/product";
import ETextField from "@/shared-app/designSystem/textField";
import EButton from "@/shared-app/designSystem/button";
import { Plus, Trash2, Layers } from "lucide-react";

export interface ProductVariantManagerProps {
  variants: ProductVariant[];
  basePrice: number;
  baseSku: string;
  onChange: (variants: ProductVariant[]) => void;
  className?: string;
}

export const ProductVariantManager: React.FC<ProductVariantManagerProps> = ({
  variants,
  basePrice,
  baseSku,
  onChange,
  className = "",
}) => {
  const handleAddVariant = () => {
    const nextIndex = variants.length + 1;
    const newVariant: ProductVariant = {
      id: `var-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      name: `واریانت ${nextIndex}`,
      sku: `${baseSku || "SKU"}-V${nextIndex}`,
      price: basePrice || 0,
      stock: 5,
    };
    onChange([...variants, newVariant]);
  };

  const handleUpdateVariant = (
    index: number,
    field: keyof ProductVariant,
    val: string | number
  ) => {
    const updated = [...variants];
    updated[index] = {
      ...updated[index],
      [field]: val,
    };
    onChange(updated);
  };

  const handleRemoveVariant = (index: number) => {
    const updated = variants.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-white">
            مدیریت تنوع کالا و انبار (واریانت‌ها)
          </span>
          <span className="text-[11px] text-slate-400">
            ({variants.length} مورد)
          </span>
        </div>

        <EButton
          variant="secondary"
          size="sm"
          onClick={handleAddVariant}
          className="text-xs"
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          افزودن واریانت
        </EButton>
      </div>

      {variants.length === 0 ? (
        <div className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 text-center text-xs text-slate-400">
          برای این کالا هنوز واریانت اختصاصی تعریف نشده است. با کلیک بر روی دکمه
          «افزودن واریانت» می‌توانید رنگ‌ها، سایزها یا مشخصات متفاوت را ثبت کنید.
        </div>
      ) : (
        <div className="space-y-2.5">
          {variants.map((variant, index) => (
            <div
              key={variant.id}
              className="p-3 sm:p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 flex flex-col gap-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-indigo-300">
                  تنوع شماره {index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => handleRemoveVariant(index)}
                  className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  aria-label="حذف این واریانت"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Responsive Inputs: Stacked single-column on mobile, grid on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-2.5">
                <div className="sm:col-span-1">
                  <ETextField
                    label="عنوان واریانت (رنگ/سایز)"
                    placeholder="مثال: مشکی - XL"
                    value={variant.name}
                    onValueChange={(val) =>
                      handleUpdateVariant(index, "name", val)
                    }
                    className="py-1.5 text-xs"
                  />
                </div>

                <div className="sm:col-span-1">
                  <ETextField
                    label="کد SKU واریانت"
                    placeholder="DYN-VAR-01"
                    value={variant.sku}
                    onValueChange={(val) =>
                      handleUpdateVariant(index, "sku", val)
                    }
                    className="py-1.5 text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-1">
                  <ETextField
                    label="قیمت (تومان)"
                    type="number"
                    inputMode="numeric"
                    placeholder="قیمت اختصاصی"
                    value={variant.price?.toString() || ""}
                    onValueChange={(val) =>
                      handleUpdateVariant(index, "price", Number(val) || 0)
                    }
                    className="py-1.5 text-xs"
                  />
                </div>

                <div className="sm:col-span-1">
                  <ETextField
                    label="موجودی اولیه"
                    type="number"
                    inputMode="numeric"
                    placeholder="تعداد"
                    value={variant.stock?.toString() || "0"}
                    onValueChange={(val) =>
                      handleUpdateVariant(index, "stock", Math.max(0, parseInt(val, 10) || 0))
                    }
                    className="py-1.5 text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductVariantManager;
