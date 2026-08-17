import React from "react";
import type { Product } from "@/types/product";
import ProductStatusBadge from "./ProductStatusBadge";
import ProductQuickStockControl from "./ProductQuickStockControl";
import EButton from "@/shared-app/designSystem/button";
import { Edit2, Trash2, Layers } from "lucide-react";

export interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onQuickStockUpdate: (productId: string, variantId: string | null, delta: number) => void;
  className?: string;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
  onQuickStockUpdate,
  className = "",
}) => {
  return (
    <div
      className={`w-full overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 ${className}`}
    >
      <table className="w-full text-start text-sm border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs font-semibold">
            <th className="py-3.5 px-4 text-start w-16">تصویر</th>
            <th className="py-3.5 px-4 text-start">عنوان محصول و شناسه SKU</th>
            <th className="py-3.5 px-4 text-start">دسته‌بندی</th>
            <th className="py-3.5 px-4 text-start">قیمت (تومان)</th>
            <th className="py-3.5 px-4 text-center">موجودی انبار</th>
            <th className="py-3.5 px-4 text-center">وضعیت</th>
            <th className="py-3.5 px-4 text-end">عملیات</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-slate-800/80">
          {products.map((product) => {
            const formattedPrice = new Intl.NumberFormat("fa-IR").format(product.price);

            return (
              <tr
                key={product.id}
                className="hover:bg-slate-800/40 transition-colors group"
                id={`product-row-${product.id}`}
              >
                {/* Image Thumbnail */}
                <td className="py-3 px-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/80 shrink-0">
                    <img
                      src={product.image}
                      alt={product.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80";
                      }}
                    />
                  </div>
                </td>

                {/* Title and SKU */}
                <td className="py-3 px-4 max-w-xs">
                  <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {product.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-500/20">
                      {product.sku}
                    </span>
                    {product.variants && product.variants.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                        <Layers className="w-3 h-3 text-slate-500" />
                        <span>{product.variants.length} تنوع</span>
                      </span>
                    )}
                  </div>
                </td>

                {/* Category */}
                <td className="py-3 px-4 text-slate-300 whitespace-nowrap text-xs">
                  {product.categoryLabel}
                </td>

                {/* Price */}
                <td className="py-3 px-4 whitespace-nowrap font-semibold text-white">
                  {formattedPrice}
                </td>

                {/* Stock Quick Adjustment */}
                <td className="py-3 px-4 text-center whitespace-nowrap">
                  <div className="inline-flex justify-center">
                    <ProductQuickStockControl
                      stock={product.totalStock}
                      onIncrease={() => onQuickStockUpdate(product.id, null, 1)}
                      onDecrease={() => onQuickStockUpdate(product.id, null, -1)}
                      size="sm"
                    />
                  </div>
                </td>

                {/* Stock Status Badge */}
                <td className="py-3 px-4 text-center whitespace-nowrap">
                  <ProductStatusBadge
                    status={product.stockStatus}
                    totalStock={product.totalStock}
                  />
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-end whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5 justify-end">
                    <EButton
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(product)}
                      className="text-xs p-1.5 sm:px-2.5"
                      icon={<Edit2 className="w-3.5 h-3.5" />}
                    >
                      <span className="hidden lg:inline">ویرایش</span>
                    </EButton>

                    <EButton
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(product)}
                      className="text-xs p-1.5 sm:px-2.5"
                      icon={<Trash2 className="w-3.5 h-3.5" />}
                    >
                      <span className="hidden lg:inline">حذف</span>
                    </EButton>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
