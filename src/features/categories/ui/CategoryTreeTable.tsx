import React from "react";
import type { Category, CategoryTreeItem } from "@/types/category";
import { renderCategoryIcon } from "./CategoryIconHelper";
import { ESwitch } from "@/shared-app/designSystem/switch";
import EButton from "@/shared-app/designSystem/button";
import {
  ChevronDown,
  ChevronLeft,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CornerDownLeft,
  FolderTree,
  Tag,
  Package,
} from "lucide-react";

interface CategoryTreeTableProps {
  tree: CategoryTreeItem[];
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onOpenCreateChildModal: (parent: Category) => void;
  onOpenEditModal: (category: Category) => void;
  onOpenDeleteDialog: (category: Category) => void;
  onOpenDetailDrawer: (category: Category) => void;
  onToggleStatus: (id: string) => void;
}

export const CategoryTreeTable: React.FC<CategoryTreeTableProps> = ({
  tree,
  expandedIds,
  onToggleExpand,
  onOpenCreateChildModal,
  onOpenEditModal,
  onOpenDeleteDialog,
  onOpenDetailDrawer,
  onToggleStatus,
}) => {
  // Flatten tree according to expanded state for row rendering
  const renderRow = (item: CategoryTreeItem): React.ReactNode => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedIds.has(item.id);
    const depth = item.depth || 0;

    // Indentation padding in RTL (starts on the right)
    const indentPadding = depth * 32;

    return (
      <React.Fragment key={item.id}>
        <tr className="border-b border-slate-800/60 hover:bg-slate-850/60 transition-colors group">
          {/* 1. Category Name & Tree Indent */}
          <td className="py-3.5 px-4 text-start">
            <div
              className="flex items-center gap-2"
              style={{ paddingInlineStart: `${indentPadding}px` }}
            >
              {/* Depth connecting line indicator */}
              {depth > 0 && (
                <CornerDownLeft className="w-3.5 h-3.5 text-indigo-400/60 shrink-0 select-none" />
              )}

              {/* Expand / Collapse Button */}
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => onToggleExpand(item.id)}
                  className="w-6 h-6 rounded-md flex items-center justify-center bg-slate-800/90 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer select-none shrink-0"
                  title={isExpanded ? "بستن شاخه" : "باز کردن شاخه"}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronLeft className="w-3.5 h-3.5" />
                  )}
                </button>
              ) : (
                <span className="w-6 h-6 inline-flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                </span>
              )}

              {/* Icon Container */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  depth === 0
                    ? "bg-indigo-950/80 border-indigo-500/30 text-indigo-300 shadow-sm"
                    : depth === 1
                    ? "bg-slate-800 border-slate-700 text-cyan-300"
                    : "bg-slate-850 border-slate-800 text-amber-300"
                }`}
              >
                {renderCategoryIcon(item.icon, "w-4 h-4")}
              </div>

              {/* Title, Level badge & Children count */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-100 text-sm truncate max-w-[200px]">
                    {item.name}
                  </span>

                  {depth === 0 ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                      دسته اصلی
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                      سطح {depth}
                    </span>
                  )}

                  {hasChildren && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 font-mono">
                      {item.children.length} زیردسته
                    </span>
                  )}
                </div>

                {item.description && (
                  <span className="text-xs text-slate-400 truncate max-w-[280px]">
                    {item.description}
                  </span>
                )}
              </div>
            </div>
          </td>

          {/* 2. Slug */}
          <td className="py-3.5 px-3 text-start">
            <code className="text-xs font-mono px-2 py-1 rounded bg-slate-950/80 text-cyan-300 border border-slate-800/80" dir="ltr">
              {item.slug}
            </code>
          </td>

          {/* 3. Parent Category */}
          <td className="py-3.5 px-3 text-start">
            {item.pathNames && item.pathNames.length > 1 ? (
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <FolderTree className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate max-w-[140px]" title={item.pathNames.slice(0, -1).join(" > ")}>
                  {item.pathNames[item.pathNames.length - 2]}
                </span>
              </span>
            ) : (
              <span className="text-xs text-slate-400 italic">بدون والد (ریشه)</span>
            )}
          </td>

          {/* 4. Product Count */}
          <td className="py-3.5 px-3 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-medium text-slate-200">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>{item.productCount.toLocaleString("fa-IR")} کالا</span>
            </div>
          </td>

          {/* 5. Custom Attributes */}
          <td className="py-3.5 px-3 text-start">
            {item.attributes && item.attributes.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1 max-w-[200px]">
                {item.attributes.slice(0, 2).map((attr) => (
                  <span
                    key={attr.id}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700 truncate"
                    title={`${attr.name} (${attr.type === "select" ? "انتخابی" : attr.type === "number" ? "عددی" : "متنی"})`}
                  >
                    {attr.name}
                  </span>
                ))}
                {item.attributes.length > 2 && (
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono cursor-pointer"
                    onClick={() => onOpenDetailDrawer(item)}
                    title="مشاهده همه ویژگی‌ها"
                  >
                    +{item.attributes.length - 2}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs text-slate-400 italic">بدون ویژگی اختصاصی</span>
            )}
          </td>

          {/* 6. Status Switch */}
          <td className="py-3.5 px-3 text-center">
            <div className="flex items-center justify-center">
              <ESwitch
                checked={item.isActive}
                onCheckedChange={() => onToggleStatus(item.id)}
                activeLabel="فعال"
                inActiveLabel="غیرفعال"
              />
            </div>
          </td>

          {/* 7. Display Order */}
          <td className="py-3.5 px-3 text-center">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
              #{item.displayOrder}
            </span>
          </td>

          {/* 8. Action Buttons */}
          <td className="py-3.5 px-4 text-end">
            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => onOpenCreateChildModal(item)}
                className="p-1.5 rounded-lg text-indigo-400 hover:text-indigo-200 hover:bg-indigo-950/60 transition-colors cursor-pointer"
                title="افزودن زیردسته برای این شاخه"
              >
                <Plus className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onOpenDetailDrawer(item)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
                title="مشاهده جزئیات و ساختار"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onOpenEditModal(item)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors cursor-pointer"
                title="ویرایش دسته‌بندی"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onOpenDeleteDialog(item)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 transition-colors cursor-pointer"
                title="حذف دسته‌بندی"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>

        {/* Render nested children if expanded */}
        {hasChildren && isExpanded && item.children.map((child) => renderRow(child))}
      </React.Fragment>
    );
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-slate-300">
          <thead className="bg-slate-950/90 text-xs font-semibold text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 text-start">عنوان و آیکون دسته‌بندی</th>
              <th className="py-3.5 px-3 text-start">اسلاگ (Slug)</th>
              <th className="py-3.5 px-3 text-start">دسته والد</th>
              <th className="py-3.5 px-3 text-center">کالاهای متصل</th>
              <th className="py-3.5 px-3 text-start">ویژگی‌های کالا</th>
              <th className="py-3.5 px-3 text-center">وضعیت</th>
              <th className="py-3.5 px-3 text-center">ترتیب</th>
              <th className="py-3.5 px-4 text-end">عملیات</th>
            </tr>
          </thead>
          <tbody>{tree.map((rootNode) => renderRow(rootNode))}</tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTreeTable;
