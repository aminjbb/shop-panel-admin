import React from "react";
import type { SectionType } from "@/types/homepage";
import {
  SlidersHorizontal,
  Flame,
  LayoutGrid,
  Columns2,
  Columns3,
  Layers,
  Sparkles,
} from "lucide-react";

export interface SectionTypeMeta {
  type: SectionType;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ReactNode;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const SECTION_TYPE_META: Record<SectionType, SectionTypeMeta> = {
  hero_banner: {
    type: "hero_banner",
    label: "اسلایدر بنر هیرو (Hero Slider)",
    shortLabel: "بنر هیرو بالا",
    description: "اسلایدر عریض بالای صفحه با قابلیت اسلاید خودکار، عناوین و دکمه‌های اقدام (CTA)",
    icon: <SlidersHorizontal className="w-4 h-4 text-indigo-400" />,
    badgeBg: "bg-indigo-500/15",
    badgeText: "text-indigo-300",
    badgeBorder: "border-indigo-500/30",
  },
  flash_deals: {
    type: "flash_deals",
    label: "پیشنهادهای شگفت‌انگیز (Flash Deals)",
    shortLabel: "شگفت‌انگیزها",
    description: "اسلایدر قرمز هیجانی با تایمر معکوس زنده و بج‌های درصد تخفیف ویژه",
    icon: <Flame className="w-4 h-4 text-rose-400" />,
    badgeBg: "bg-rose-500/15",
    badgeText: "text-rose-300",
    badgeBorder: "border-rose-500/30",
  },
  banner_grid_2: {
    type: "banner_grid_2",
    label: "بنرهای تبلیغاتی ۲ ستونه (Banner Grid 2)",
    shortLabel: "گرید ۲ بنر",
    description: "دو بنر تصویری پهن کنار هم مناسب برای پیشنهادات فصلی و جشنواره‌ها",
    icon: <Columns2 className="w-4 h-4 text-cyan-400" />,
    badgeBg: "bg-cyan-500/15",
    badgeText: "text-cyan-300",
    badgeBorder: "border-cyan-500/30",
  },
  banner_grid_3: {
    type: "banner_grid_3",
    label: "بنرهای تبلیغاتی ۳ ستونه (Banner Grid 3)",
    shortLabel: "گرید ۳ بنر",
    description: "سه بنر تصویری برای معرفی دسته‌بندی‌های کلیدی و کالکشن‌ها",
    icon: <Columns3 className="w-4 h-4 text-amber-400" />,
    badgeBg: "bg-amber-500/15",
    badgeText: "text-amber-300",
    badgeBorder: "border-amber-500/30",
  },
  product_grid: {
    type: "product_grid",
    label: "ردیف کالاهای منتخب (Product Grid)",
    shortLabel: "ردیف کالاها",
    description: "گرید ۴ ستونه محصولات فروشگاه با عنوان دلخواه، زیرعنوان و دکمه مشاهده همه",
    icon: <LayoutGrid className="w-4 h-4 text-emerald-400" />,
    badgeBg: "bg-emerald-500/15",
    badgeText: "text-emerald-300",
    badgeBorder: "border-emerald-500/30",
  },
};

export function getSectionMeta(type: SectionType): SectionTypeMeta {
  return (
    SECTION_TYPE_META[type] || {
      type,
      label: type,
      shortLabel: type,
      description: "",
      icon: <Layers className="w-4 h-4 text-slate-400" />,
      badgeBg: "bg-slate-800",
      badgeText: "text-slate-300",
      badgeBorder: "border-slate-700",
    }
  );
}
