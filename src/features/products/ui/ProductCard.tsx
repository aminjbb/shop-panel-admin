import React, { useState } from "react";
import type { Product } from "@/types/product";
import ProductStatusBadge from "./ProductStatusBadge";
import ProductQuickStockControl from "./ProductQuickStockControl";
import EButton from "@/shared-app/designSystem/button";
import { Edit2, Trash2, Layers, ChevronDown, ChevronUp } from "lucide-react";

export interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onQuickStockUpdate: (productId: string, variantId: string | null, delta: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onQuickStockUpdate,
}) => {
  const [showVariants, setShowVariants] = useState(false);

  const formattedPrice = new Intl.NumberFormat("fa-IR").format(product.price);

  return (
    <div
      className="glass-card p-4 flex flex-col gap-3.5 transition-all duration-200 hover:border-slate-700 bg-slate-900 border border-slate-800"
      id={`product-card-${product.id}`}
    >
      {/* Top Header: Image + Title + Status */}
      <div className="flex items-start gap-3.5">
        {/* Product Image */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/80 shrink-0">
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

        {/* Title & Meta Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] font-mono font-medium text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/20 truncate">
              {product.sku}
            </span>
            <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
              {product.categoryLabel}
            </span>
          </div>

          <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 mb-1.5">
            {product.title}
          </h3>

          <div className="flex items-center gap-2 flex-wrap">
            <ProductStatusBadge
              status={product.stockStatus}
              totalStock={product.totalStock}
            />
          </div>
        </div>
      </div>

      {/* Price & Quick Stock Control Bar */}
      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-800/80">
        <div>
          <span className="text-[10px] text-slate-400 block">قیمت واحد:</span>
          <div className="text-sm sm:text-base font-bold text-white tracking-tight">
            {formattedPrice}{" "}
            <span className="text-[10px] font-normal text-slate-400">تومان</span>
          </div>
        </div>

        {/* Quick Stock Controls (+ / -) */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-400 mb-1">موجودی انبار:</span>
          <ProductQuickStockControl
            stock={product.totalStock}
            onIncrease={() => onQuickStockUpdate(product.id, null, 1)}
            onDecrease={() => onQuickStockUpdate(product.id, null, -1)}
            size="md"
          />
        </div>
      </div>

      {/* Variants summary toggle if available */}
      {product.variants && product.variants.length > 0 && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowVariants(!showVariants)}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {product.variants.length} واریانت / تنوع کالا
              </span>
            </div>
            {showVariants ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {showVariants && (
            <div className="mt-2 space-y-1.5 p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs animate-in fade-in duration-150">
              {product.variants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800/80"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {variant.color && (
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-slate-600 shrink-0"
                        style={{ backgroundColor: variant.color }}
                      />
                    )}
                    <span className="text-white text-xs truncate">
                      {variant.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-semibold text-slate-300">
                      {new Intl.NumberFormat("fa-IR").format(variant.price)} ت
                    </span>
                    <ProductQuickStockControl
                      stock={variant.stock}
                      onIncrease={() => onQuickStockUpdate(product.id, variant.id, 1)}
                      onDecrease={() => onQuickStockUpdate(product.id, variant.id, -1)}
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons for Mobile with 44px ergonomics */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
        <EButton
          variant="secondary"
          size="md"
          onClick={() => onEdit(product)}
          className="w-full text-xs justify-center min-h-[42px]"
          icon={<Edit2 className="w-3.5 h-3.5" />}
        >
          ویرایش
        </EButton>

        <EButton
          variant="destructive"
          size="md"
          onClick={() => onDelete(product)}
          className="w-full text-xs justify-center min-h-[42px]"
          icon={<Trash2 className="w-3.5 h-3.5" />}
        >
          حذف کالا
        </EButton>
      </div>
    </div>
  );
};

export default ProductCard;
