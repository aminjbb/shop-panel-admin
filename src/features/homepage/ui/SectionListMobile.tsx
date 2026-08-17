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
} from "lucide-react";

interface SectionListMobileProps {
  sections: HomepageSection[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onReorder: (activeId: string, overId: string) => void;
  onToggleActive: (id: string) => void;
  onOpenConfig: (section: HomepageSection) => void;
  onDeleteClick: (section: HomepageSection) => void;
}

// Sortable Card Component for Mobile View
interface SortableMobileCardProps {
  section: HomepageSection;
  index: number;
  totalCount: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onToggleActive: (id: string) => void;
  onOpenConfig: (section: HomepageSection) => void;
  onDeleteClick: (section: HomepageSection) => void;
}

const SortableMobileCard: React.FC<SortableMobileCardProps> = ({
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

  let contentBadge = "";
  if (section.type === "hero_banner") {
    contentBadge = `${(section as HeroBannerSection).banners?.length || 0} اسلاید بنر هیرو`;
  } else if (section.type === "flash_deals") {
    contentBadge = `${(section as FlashDealsSection).productIds?.length || 0} کالای شگفت‌انگیز`;
  } else if (section.type === "banner_grid_2") {
    contentBadge = "۲ بنر تبلیغاتی ۲ ستونه";
  } else if (section.type === "banner_grid_3") {
    contentBadge = "۳ بنر تبلیغاتی ۳ ستونه";
  } else if (section.type === "product_grid") {
    contentBadge = `${(section as ProductGridSection).productIds?.length || 0} کالای متصل`;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`backdrop-blur-md border rounded-2xl p-4 shadow-lg transition-all ${
        isDragging
          ? "opacity-60 bg-indigo-950/80 border-indigo-500 shadow-2xl scale-[1.02]"
          : section.isActive
          ? "bg-slate-900/90 border-slate-800"
          : "bg-slate-950/40 border-slate-800/50 opacity-75"
      }`}
    >
      {/* Header: Drag Handle, Type Badge, Order Number & Switch */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          {/* Drag Handle Touch target */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-slate-800 cursor-grab active:cursor-grabbing touch-none"
            title="برای جابجایی بکشید و رها کنید (Drag to Reorder)"
            aria-label="دستگیره جابجایی سکشن"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          <span className="w-6 h-6 rounded-lg bg-slate-950 border border-slate-850 text-xs font-mono font-bold text-slate-300 flex items-center justify-center">
            {section.displayOrder}
          </span>

          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center border ${meta.badgeBg} ${meta.badgeBorder}`}
          >
            {meta.icon}
          </div>

          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}
          >
            {meta.shortLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ESwitch
            checked={section.isActive}
            onCheckedChange={() => onToggleActive(section.id)}
            activeLabel="فعال"
            inActiveLabel="مخفی"
          />
        </div>
      </div>

      {/* Title & Content description */}
      <div className="py-3">
        <h4 className="font-bold text-slate-100 text-sm">
          {section.title}
        </h4>

        {section.type === "product_grid" &&
          (section as ProductGridSection).subtitle && (
            <p className="text-xs text-slate-400 mt-1">
              {(section as ProductGridSection).subtitle}
            </p>
          )}

        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
            {section.type === "flash_deals" ? (
              <Flame className="w-3.5 h-3.5 text-rose-400" />
            ) : section.type.includes("banner") ? (
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>{contentBadge}</span>
          </span>
        </div>
      </div>

      {/* Bottom Actions with 44px min touch targets */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
        {/* Order Controls (Touch Target >= 44px) */}
        <div className="flex items-center gap-1 bg-slate-950 rounded-xl p-1 border border-slate-800">
          <button
            type="button"
            disabled={isFirst}
            onClick={() => onMoveUp(index)}
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              isFirst
                ? "text-slate-700 cursor-not-allowed"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
            aria-label="بالا بردن ترتیب"
          >
            <ArrowUp className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono text-slate-400 px-1">
            {section.displayOrder}
          </span>

          <button
            type="button"
            disabled={isLast}
            onClick={() => onMoveDown(index)}
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              isLast
                ? "text-slate-700 cursor-not-allowed"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
            aria-label="پایین بردن ترتیب"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        {/* Config & Delete (Touch Target >= 44px) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDeleteClick(section)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors border border-transparent hover:border-rose-500/20 cursor-pointer"
            aria-label="حذف سکشن"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onOpenConfig(section)}
            className="min-h-[44px] px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2 transition-colors shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>پیکربندی محتوا</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const SectionListMobile: React.FC<SectionListMobileProps> = ({
  sections,
  onMoveUp,
  onMoveDown,
  onReorder,
  onToggleActive,
  onOpenConfig,
  onDeleteClick,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);

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
    <div className="space-y-3">
      {/* Mobile Hint Bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-indigo-950/30 border border-indigo-500/20 rounded-xl text-xs text-indigo-300">
        <GripVertical className="w-4 h-4 text-indigo-400 shrink-0" />
        <span>
          با کشیدن دستگیره <strong>⠿</strong> یا دکمه‌های بالا/پایین، ترتیب را تغییر دهید.
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {sections.map((section, index) => (
              <SortableMobileCard
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
          </div>
        </SortableContext>

        <DragOverlay>
          {activeSection ? (
            <div className="bg-indigo-950/95 border-2 border-indigo-500 rounded-2xl p-3 shadow-2xl text-white text-xs font-bold flex items-center justify-between">
              <span className="truncate">جابجایی: {activeSection.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-600">
                در حال انتقال
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default SectionListMobile;
