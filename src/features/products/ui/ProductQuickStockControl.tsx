import React from "react";
import { Plus, Minus } from "lucide-react";

export interface ProductQuickStockControlProps {
  stock: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export const ProductQuickStockControl: React.FC<ProductQuickStockControlProps> = ({
  stock,
  onIncrease,
  onDecrease,
  disabled = false,
  size = "md",
  className = "",
}) => {
  const isSm = size === "sm";

  return (
    <div
      className={`inline-flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1 gap-1 select-none ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Minus Button - Minimum 44x44px touch target on mobile via padding / min-w */}
      <button
        type="button"
        disabled={disabled || stock <= 0}
        onClick={onDecrease}
        className={`
          flex items-center justify-center rounded-lg text-slate-300 
          hover:text-white hover:bg-slate-800 active:bg-slate-700 
          disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer
          ${isSm ? "w-7 h-7 min-w-[28px]" : "w-9 h-9 min-w-[36px] sm:w-8 sm:h-8"}
        `}
        aria-label="کاهش موجودی"
        title="کاهش موجودی (-1)"
      >
        <Minus className={`${isSm ? "w-3.5 h-3.5" : "w-4 h-4"}`} />
      </button>

      {/* Stock Display Counter */}
      <span
        className={`
          font-bold text-center tabular-nums px-2
          ${stock === 0 ? "text-rose-400" : stock <= 10 ? "text-amber-400" : "text-white"}
          ${isSm ? "text-xs min-w-[28px]" : "text-sm min-w-[36px]"}
        `}
      >
        {stock}
      </span>

      {/* Plus Button - Minimum 44x44px touch target on mobile */}
      <button
        type="button"
        disabled={disabled}
        onClick={onIncrease}
        className={`
          flex items-center justify-center rounded-lg text-slate-300 
          hover:text-white hover:bg-slate-800 active:bg-slate-700 
          disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer
          ${isSm ? "w-7 h-7 min-w-[28px]" : "w-9 h-9 min-w-[36px] sm:w-8 sm:h-8"}
        `}
        aria-label="افزایش موجودی"
        title="افزایش موجودی (+1)"
      >
        <Plus className={`${isSm ? "w-3.5 h-3.5" : "w-4 h-4"}`} />
      </button>
    </div>
  );
};

export default ProductQuickStockControl;
