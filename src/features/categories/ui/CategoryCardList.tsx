import React from "react";
import type { Category, CategoryTreeItem } from "@/types/category";
import { renderCategoryIcon } from "./CategoryIconHelper";
import { ESwitch } from "@/shared-app/designSystem/switch";
import {
  ChevronDown,
  ChevronLeft,
  Plus,
  Edit2,
  Trash2,
  Eye,
  FolderTree,
  Package,
  Sparkles,
} from "lucide-react";

interface CategoryCardListProps {
  tree: CategoryTreeItem[];
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onOpenCreateChildModal: (parent: Category) => void;
  onOpenEditModal: (category: Category) => void;
  onOpenDeleteDialog: (category: Category) => void;
  onOpenDetailDrawer: (category: Category) => void;
  onToggleStatus: (id: string) => void;
}

export const CategoryCardList: React.FC<CategoryCardListProps> = ({
  tree,
  expandedIds,
  onToggleExpand,
  onOpenCreateChildModal,
  onOpenEditModal,
  onOpenDeleteDialog,
  onOpenDetailDrawer,
  onToggleStatus,
}) => {
  const renderCategoryCard = (item: CategoryTreeItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedIds.has(item.id);
    const depth = item.depth || 0;

    return (
      <div
        key={item.id}
        className={`rounded-2xl border transition-all ${
          depth === 0
            ? "bg-slate-900/90 border-slate-800 shadow-md mb-3"
            : depth === 1
            ? "bg-slate-900/60 border-slate-800/80 ms-4 mt-2.5"
            : "bg-slate-950/70 border-slate-800/60 ms-8 mt-2"
        }`}
      >
        <div className="p-4 space-y-3">
          {/* Header Row: Icon, Title, Badges & Switch */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  depth === 0
                    ? "bg-indigo-950 border-indigo-500/30 text-indigo-300"
                    : depth === 1
                    ? "bg-slate-800 border-slate-700 text-cyan-300"
                    : "bg-slate-850 border-slate-800 text-amber-300"
                }`}
              >
                {renderCategoryIcon(item.icon, "w-5 h-5")}
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-slate-100 text-sm truncate">
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
                </div>

                <code className="text-[11px] font-mono text-cyan-400/90 mt-0.5" dir="ltr">
                  /{item.slug}
                </code>
              </div>
            </div>

            {/* Active Switch */}
            <div className="shrink-0 pt-0.5">
              <ESwitch
                checked={item.isActive}
                onCheckedChange={() => onToggleStatus(item.id)}
              />
            </div>
          </div>

          {/* Description if present */}
          {item.description && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Meta Information Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 pt-1 border-t border-slate-800/60">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>{item.productCount.toLocaleString("fa-IR")} محصول</span>
            </div>

            {item.attributes && item.attributes.length > 0 && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>{item.attributes.length} ویژگی اختصاصی</span>
              </div>
            )}

            {hasChildren && (
              <button
                type="button"
                onClick={() => onToggleExpand(item.id)}
                className="ms-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 text-xs font-medium cursor-pointer active:scale-95 transition-transform"
              >
                <span>{item.children.length} زیردسته</span>
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronLeft className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>

          {/* Action Buttons (Touch friendly min-height 44px) */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => onOpenCreateChildModal(item)}
              className="min-h-[44px] flex items-center justify-center gap-1 rounded-xl bg-slate-800/80 text-indigo-400 hover:bg-indigo-950 hover:text-indigo-300 border border-slate-700/60 active:scale-95 transition-all text-xs font-medium cursor-pointer"
              title="افزودن زیردسته"
            >
              <Plus className="w-4 h-4" />
              <span>زیردسته</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenDetailDrawer(item)}
              className="min-h-[44px] flex items-center justify-center gap-1 rounded-xl bg-slate-800/80 text-cyan-400 hover:bg-slate-750 border border-slate-700/60 active:scale-95 transition-all text-xs font-medium cursor-pointer"
              title="جزئیات"
            >
              <Eye className="w-4 h-4" />
              <span>جزئیات</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenEditModal(item)}
              className="min-h-[44px] flex items-center justify-center gap-1 rounded-xl bg-slate-800/80 text-amber-400 hover:bg-slate-750 border border-slate-700/60 active:scale-95 transition-all text-xs font-medium cursor-pointer"
              title="ویرایش"
            >
              <Edit2 className="w-4 h-4" />
              <span>ویرایش</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenDeleteDialog(item)}
              className="min-h-[44px] flex items-center justify-center gap-1 rounded-xl bg-rose-950/30 text-rose-400 hover:bg-rose-950/60 border border-rose-500/30 active:scale-95 transition-all text-xs font-medium cursor-pointer"
              title="حذف"
            >
              <Trash2 className="w-4 h-4" />
              <span>حذف</span>
            </button>
          </div>
        </div>

        {/* Render nested children */}
        {hasChildren && isExpanded && (
          <div className="pb-3 px-2 space-y-2 border-t border-slate-800/50 bg-slate-950/40 rounded-b-2xl">
            {item.children.map((child) => renderCategoryCard(child))}
          </div>
        )}
      </div>
    );
  };

  return <div className="space-y-3">{tree.map((rootNode) => renderCategoryCard(rootNode))}</div>;
};

export default CategoryCardList;
