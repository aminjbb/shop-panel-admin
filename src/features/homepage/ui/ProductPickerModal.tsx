import React, { useState, useMemo } from "react";
import type { Product } from "@/types/product";
import SearchBox from "@/shared-app/designSystem/searchBox";
import BottomSheet from "@/shared-app/bottomSheet";
import EButton from "@/shared-app/designSystem/button";
import { Check, ShoppingBag, CheckSquare, Layers } from "lucide-react";

interface ProductPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  selectedProductIds: string[];
  onConfirm: (productIds: string[]) => void;
  title?: string;
  maxSelection?: number;
}

export const ProductPickerModal: React.FC<ProductPickerModalProps> = ({
  isOpen,
  onClose,
  products,
  selectedProductIds,
  onConfirm,
  title = "انتخاب کالاهای ردیف از کاتالوگ فروشگاه",
  maxSelection,
}) => {
  const [tempSelected, setTempSelected] = useState<string[]>(selectedProductIds);
  const [search, setSearch] = useState<string>("");
  const [selectedCat, setSelectedCat] = useState<string>("all");

  // Keep synced with props when opened
  React.useEffect(() => {
    if (isOpen) {
      setTempSelected(selectedProductIds);
    }
  }, [isOpen, selectedProductIds]);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => {
      if (p.category && p.categoryLabel) {
        map.set(p.category, p.categoryLabel);
      }
    });
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCat !== "all" && p.category !== selectedCat) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        return matchesTitle || matchesSku;
      }
      return true;
    });
  }, [products, search, selectedCat]);

  const toggleSelect = (id: string) => {
    setTempSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((pId) => pId !== id);
      } else {
        if (maxSelection && prev.length >= maxSelection) {
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleSelectAllFiltered = () => {
    const allFilteredIds = filteredProducts.map((p) => p.id);
    setTempSelected((prev) => {
      const merged = Array.from(new Set([...prev, ...allFilteredIds]));
      return maxSelection ? merged.slice(0, maxSelection) : merged;
    });
  };

  const handleClearAll = () => {
    setTempSelected([]);
  };

  const handleSave = () => {
    onConfirm(tempSelected);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="font-bold text-white text-base truncate">{title}</span>
        </div>
      }
      subtitle={
        <span className="text-xs text-slate-400">
          تعداد کالاهای انتخاب‌شده:{" "}
          <strong className="font-mono text-indigo-300 font-bold">
            {tempSelected.length.toLocaleString("fa-IR")} کالا
          </strong>
          {maxSelection ? ` (حداکثر مجاز: ${maxSelection})` : ""}
        </span>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-slate-400 hidden sm:inline">
            {tempSelected.length} کالا آماده انتساب به سکشن است.
          </span>

          <div className="flex items-center gap-3 ms-auto">
            <EButton variant="outlined" size="sm" onClick={onClose}>
              انصراف
            </EButton>

            <EButton
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSave}
              icon={<Check className="w-4 h-4" />}
              className="shadow-lg shadow-indigo-600/30"
            >
              تأیید و درج در سکشن
            </EButton>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Search & Bulk Filter Controls */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1">
              <SearchBox
                value={search}
                onSearch={setSearch}
                placeholder="جستجو بر اساس عنوان کالا، کد کاتالوگ SKU..."
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>انتخاب همه نتایج</span>
              </button>

              {tempSelected.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs font-medium border border-rose-500/30 transition-colors cursor-pointer shrink-0"
                >
                  پاکسازی انتخاب‌ها
                </button>
              )}
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 pt-1">
            <button
              type="button"
              onClick={() => setSelectedCat("all")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                selectedCat === "all"
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                  : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
              }`}
            >
              همه دسته‌ها ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat.id).length;
              const isSelected = selectedCat === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCat(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                      : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div>
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 bg-slate-950/40 border border-slate-800/50 rounded-2xl">
              <ShoppingBag className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-50" />
              <p className="text-sm">کالایی با عبارت جستجوی مورد نظر یافت نشد.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto custom-scrollbar p-1">
              {filteredProducts.map((prod) => {
                const isSelected = tempSelected.includes(prod.id);
                return (
                  <div
                    key={prod.id}
                    onClick={() => toggleSelect(prod.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 relative ${
                      isSelected
                        ? "bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-600/20 ring-1 ring-indigo-500"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850/50"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-14 h-14 rounded-xl object-cover bg-slate-900 border border-slate-800"
                        referrerPolicy="no-referrer"
                      />
                      {isSelected && (
                        <div className="absolute -top-1.5 -start-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-bold text-slate-100 truncate">
                        {prod.title}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {prod.sku}
                      </span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-mono font-bold text-indigo-300">
                          {prod.price.toLocaleString("fa-IR")} تومان
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {prod.categoryLabel || prod.category}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
};

export default ProductPickerModal;
