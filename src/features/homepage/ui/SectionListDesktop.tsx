import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import type {
  HomepageSection,
  HeroBannerSection,
  FlashDealsSection,
  ProductGridSection,
  BannerGridSection,
} from "@/types/homepage";
import { getSectionMeta } from "./SectionTypeHelper";
import { ESwitch } from "@/shared-app/designSystem/switch";
import {
  ArrowUp,
  ArrowDown,
  GripVertical,
  Settings,
  Trash2,
  Image as ImageIcon,
  ShoppingBag,
  Flame,
  Sparkles,
} from "lucide-react";

interface SectionListDesktopProps {
  sections: HomepageSection[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onReorder: (activeId: string, overId: string) => void;
  onToggleActive: (id: string) => void;
  onOpenConfig: (section: HomepageSection) => void;
  onDeleteClick: (section: HomepageSection) => void;
  isFilterActive?: boolean;
}

// Helper to render content summary inside row
const renderContentSummary = (section: HomepageSection) => {
  switch (section.type) {
    case "hero_banner": {
      const count = (section as HeroBannerSection).banners?.length || 0;
      const interval = (section as HeroBannerSection).autoSlideIntervalSeconds || 5;
      return (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-300">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{count} اسلاید بنر</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono">({interval} ثانیه اسلاید)</span>
        </div>
      );
    }

    case "flash_deals": {
      const prodCount = (section as FlashDealsSection).productIds?.length || 0;
      const discount = (section as FlashDealsSection).discountPercentBadge || 30;
      return (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-500/30 text-xs text-rose-300">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>{prodCount} کالای شگفت‌انگیز</span>
          </span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
            تا {discount}٪ تخفیف
          </span>
        </div>
      );
    }

    case "banner_grid_2":
    case "banner_grid_3": {
      const banners = (section as BannerGridSection).banners || [];
      return (
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-2 space-x-reverse overflow-hidden">
            {banners.map((b, idx) => (
              <img
                key={b.id || idx}
                src={b.imageUrl}
                alt={b.title || `بنر ${idx + 1}`}
                className="inline-block w-8 h-8 rounded-lg object-cover ring-2 ring-slate-900"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
          <span className="text-xs text-slate-400 font-mono ps-1">
            {banners.length} بنر متصل
          </span>
        </div>
      );
    }

    case "product_grid":
    default: {
      const pCount = (section as ProductGridSection).productIds?.length || 0;
      return (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-xs text-emerald-300">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{pCount} کالا در ردیف</span>
          </span>
        </div>
      );
    }
  }
};

// Sortable Row Component for Desktop Table
interface SortableDesktopRowProps {
  section: HomepageSection;
  index: number;
  totalCount: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onToggleActive: (id: string) => void;
  onOpenConfig: (section: HomepageSection) => void;
  onDeleteClick: (section: HomepageSection) => void;
}

const SortableDesktopRow: React.FC<SortableDesktopRowProps> = ({
  section,
  index,
  totalCount,
  onMoveUp,
  onMoveDown,
  onToggleActive,
  onOpenConfig,
  onDeleteClick,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: isDragging ? "relative" : undefined,
  };

  const meta = getSectionMeta(section.type);
  const isFirst = index === 0;
  const isLast = index === totalCount - 1;

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`transition-colors group ${
        isDragging
          ? "opacity-60 bg-indigo-950/60 ring-2 ring-indigo-500/60 shadow-2xl"
          : "hover:bg-slate-850/60"
      }`}
    >
      {/* 1. Drag Handle, Order Index & Arrow Controls */}
      <td className="py-4 px-3 text-center">
        <div className="flex items-center justify-center gap-2">
          {/* Dedicated Drag Handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-slate-800 transition-colors cursor-grab active:cursor-grabbing focus:outline-none"
            title="برای جابجایی بکشید و رها کنید (Drag to Reorder)"
            aria-label="دستگیره جابجایی ردیف"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          {/* Display Order Number */}
          <span className="w-6 h-6 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-slate-300 flex items-center justify-center">
            {section.displayOrder}
          </span>

          {/* Move Up / Down Buttons (Fallback & Accessibility) */}
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              disabled={isFirst}
              onClick={() => onMoveUp(index)}
              className={`p-1 rounded transition-colors cursor-pointer ${
                isFirst
                  ? "text-slate-700 cursor-not-allowed"
                  : "text-slate-400 hover:text-indigo-300 hover:bg-slate-800"
              }`}
              title="انتقال به یک ردیف بالاتر"
            >
              <ArrowUp className="w-3 h-3" />
            </button>

            <button
              type="button"
              disabled={isLast}
              onClick={() => onMoveDown(index)}
              className={`p-1 rounded transition-colors cursor-pointer ${
                isLast
                  ? "text-slate-700 cursor-not-allowed"
                  : "text-slate-400 hover:text-indigo-300 hover:bg-slate-800"
              }`}
              title="انتقال به یک ردیف پایین‌تر"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </td>

      {/* 2. Type, Icon, Title & Subtitle */}
      <td className="py-4 px-4 text-start">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${meta.badgeBg} ${meta.badgeBorder}`}
          >
            {meta.icon}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-100 text-sm truncate max-w-[240px]">
                {section.title}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}
              >
                {meta.shortLabel}
              </span>
            </div>

            {section.type === "product_grid" &&
              (section as ProductGridSection).subtitle && (
                <span className="text-xs text-slate-400 truncate max-w-[320px] mt-0.5">
                  {(section as ProductGridSection).subtitle}
                </span>
              )}

            {section.type === "hero_banner" && (
              <span className="text-xs text-slate-400 truncate mt-0.5">
                اسلایدر بالای صفحه (Hero Section)
              </span>
            )}
          </div>
        </div>
      </td>

      {/* 3. Linked Content Summary */}
      <td className="py-4 px-4 text-start">
        {renderContentSummary(section)}
      </td>

      {/* 4. Active Switch */}
      <td className="py-4 px-4 text-center">
        <div className="flex items-center justify-center">
          <ESwitch
            checked={section.isActive}
            onCheckedChange={() => onToggleActive(section.id)}
            activeLabel="فعال"
            inActiveLabel="مخفی"
          />
        </div>
      </td>

      {/* 5. Actions */}
      <td className="py-4 px-4 text-end">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onOpenConfig(section)}
            className="px-3 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="ویرایش و تنظیم محتوای سکشن"
          >
            <Settings className="w-3.5 h-3.5 text-indigo-400" />
            <span>پیکربندی</span>
          </button>

          <button
            type="button"
            onClick={() => onDeleteClick(section)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 transition-colors cursor-pointer"
            title="حذف این سکشن از صفحه اصلی"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export const SectionListDesktop: React.FC<SectionListDesktopProps> = ({
  sections,
  onMoveUp,
  onMoveDown,
  onReorder,
  onToggleActive,
  onOpenConfig,
  onDeleteClick,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Set up dnd sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(active.id as string, over.id as string);
    }
    setActiveId(null);
  };

  const activeSection = activeId
    ? sections.find((s) => s.id === activeId)
    : null;

  return (
    <div className="space-y-2">
      {/* Helpful Hint Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-indigo-950/30 border border-indigo-500/20 rounded-xl text-xs text-indigo-300">
        <span className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-indigo-400" />
          <span>
            قابلیت جابجایی بصری: دستگیره <strong className="text-white font-mono">⠿</strong> را در هر ردیف بگیرید و برای تغییر ترتیب سکشن‌ها بکشید و رها کنید (Drag & Drop).
          </span>
        </span>
        <span className="text-[11px] text-indigo-400 font-mono hidden sm:inline">
          {sections.length} بخش کل چیدمان
        </span>
      </div>

      {/* Main Table with DnD Context */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm text-slate-300">
              <thead className="bg-slate-950/90 text-xs font-semibold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 text-center w-28">جابجایی و ترتیب</th>
                  <th className="py-3.5 px-4 text-start">نوع و عنوان بخش</th>
                  <th className="py-3.5 px-4 text-start">محتوای متصل و آیتم‌ها</th>
                  <th className="py-3.5 px-4 text-center w-28">وضعیت انتشار</th>
                  <th className="py-3.5 px-4 text-end w-36">تنظیمات و عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <SortableContext
                  items={sections.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {sections.map((section, index) => (
                    <SortableDesktopRow
                      key={section.id}
                      section={section}
                      index={index}
                      totalCount={sections.length}
                      onMoveUp={onMoveUp}
                      onMoveDown={onMoveDown}
                      onToggleActive={onToggleActive}
                      onOpenConfig={onOpenConfig}
                      onDeleteClick={onDeleteClick}
                    />
                  ))}
                </SortableContext>
              </tbody>
            </table>
          </div>

          {/* Drag Overlay for smooth ghosting feedback */}
          <DragOverlay>
            {activeSection ? (
              <div className="bg-indigo-950/90 border-2 border-indigo-500 rounded-xl p-3 shadow-2xl flex items-center justify-between text-white text-xs font-bold">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-indigo-400" />
                  <span>درحال جابجایی سکشن: {activeSection.title}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-600 text-white font-mono">
                  موقعیت جدید
                </span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default SectionListDesktop;
