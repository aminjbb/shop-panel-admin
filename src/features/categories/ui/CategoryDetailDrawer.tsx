import React from "react";
import type { Category } from "@/types/category";
import BottomSheet from "@/shared-app/bottomSheet";
import EButton from "@/shared-app/designSystem/button";
import { renderCategoryIcon } from "./CategoryIconHelper";
import {
  FolderTree,
  Package,
  Sparkles,
  Calendar,
  Layers,
  Code,
  Tag,
  CheckCircle2,
  XCircle,
  Edit2,
  Plus,
} from "lucide-react";

export interface CategoryDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  allCategories: Category[];
  onOpenEdit: (cat: Category) => void;
  onOpenAddChild: (parent: Category) => void;
}

export const CategoryDetailDrawer: React.FC<CategoryDetailDrawerProps> = ({
  isOpen,
  onClose,
  category,
  allCategories,
  onOpenEdit,
  onOpenAddChild,
}) => {
  if (!category) return null;

  // Build breadcrumb hierarchy
  const buildBreadcrumbs = () => {
    const crumbs: { id: string; name: string }[] = [{ id: category.id, name: category.name }];
    let curr = category;
    while (curr.parentId) {
      const parent = allCategories.find((c) => c.id === curr.parentId);
      if (!parent || parent.id === curr.id) break;
      crumbs.unshift({ id: parent.id, name: parent.name });
      curr = parent;
    }
    return crumbs;
  };

  const breadcrumbs = buildBreadcrumbs();
  const directChildren = allCategories.filter((c) => c.parentId === category.id);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-500/30 text-indigo-300 flex items-center justify-center">
            {renderCategoryIcon(category.icon, "w-4 h-4")}
          </div>
          <span>جزئیات و مشخصات: {category.name}</span>
        </div>
      }
      subtitle="شناسنامه دسته‌بندی، سلسله‌مراتب درختی و ویژگی‌های متصل به محصولات"
      size="lg"
    >
      <div className="space-y-6">
        {/* Breadcrumb Hierarchy */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 block">
            مسیر سلسله‌مراتب درختی:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-200">
            <span className="text-slate-400">ریشه فروشگاه</span>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.id}>
                <span className="text-indigo-400 font-bold">/</span>
                <span
                  className={`px-2 py-0.5 rounded-md font-medium ${
                    idx === breadcrumbs.length - 1
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {crumb.name}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Thumbnail and Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {category.thumbnail && (
            <div className="sm:col-span-1 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video sm:aspect-square relative">
              <img
                src={category.thumbnail}
                alt={category.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <div className={`${category.thumbnail ? "sm:col-span-2" : "sm:col-span-3"} space-y-3`}>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">شناسه URL (اسلاگ):</span>
                <code className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800" dir="ltr">
                  /{category.slug}
                </code>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">وضعیت نمایش:</span>
                {category.isActive ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    فعال در فروشگاه
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-rose-400 font-medium">
                    <XCircle className="w-3.5 h-3.5" />
                    غیرفعال و مخفی
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">تعداد محصولات متصل:</span>
                <span className="text-xs font-bold text-amber-300">
                  {category.productCount.toLocaleString("fa-IR")} محصول
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">ترتیب اولویت:</span>
                <span className="text-xs font-mono text-slate-200">
                  #{category.displayOrder}
                </span>
              </div>
            </div>

            {category.description && (
              <p className="text-xs text-slate-300 leading-relaxed p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Subcategories Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>زیردسته‌های مستقیم ({directChildren.length})</span>
            </h4>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAddChild(category);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>افزودن زیردسته</span>
            </button>
          </div>

          {directChildren.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-slate-950/40 border border-slate-800">
              این دسته‌بندی هنوز زیرشاخه‌ای ندارد.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {directChildren.map((child) => (
                <div
                  key={child.id}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-indigo-300 flex items-center justify-center">
                      {renderCategoryIcon(child.icon, "w-3.5 h-3.5")}
                    </span>
                    <span className="font-semibold text-slate-200">{child.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {child.productCount} کالا
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Category Attributes */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ویژگی‌های اختصاصی کالا ({category.attributes?.length || 0})</span>
          </h4>

          {!category.attributes || category.attributes.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-slate-950/40 border border-slate-800">
              ویژگی اختصاصی برای این دسته‌بندی تنظیم نشده است.
            </p>
          ) : (
            <div className="space-y-2">
              {category.attributes.map((attr, idx) => (
                <div
                  key={attr.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-mono">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-100">{attr.name}</span>
                      {attr.isRequired && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          الزامی
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700 font-mono">
                      {attr.type === "select"
                        ? "لیست انتخابی (Select)"
                        : attr.type === "number"
                        ? "عددی (Number)"
                        : "متنی (Text)"}
                    </span>
                  </div>

                  {attr.type === "select" && attr.options && attr.options.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 ps-7">
                      <span className="text-[11px] text-slate-400">گزینه‌ها:</span>
                      {attr.options.map((opt) => (
                        <span
                          key={opt}
                          className="px-2 py-0.5 rounded bg-slate-900 text-indigo-200 border border-slate-800 text-[11px]"
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <EButton variant="outlined" onClick={onClose}>
            بستن
          </EButton>

          <EButton
            variant="primary"
            onClick={() => {
              onClose();
              onOpenEdit(category);
            }}
            icon={<Edit2 className="w-4 h-4" />}
          >
            ویرایش مشخصات
          </EButton>
        </div>
      </div>
    </BottomSheet>
  );
};

export default CategoryDetailDrawer;
