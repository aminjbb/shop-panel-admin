import React from "react";
import type { CategoryStats } from "@/types/category";
import StatCard from "@/shared-app/statCard";
import { FolderTree, Layers, Package, CheckCircle2 } from "lucide-react";

interface CategoryStatsCardsProps {
  stats: CategoryStats | null;
  isLoading?: boolean;
}

export const CategoryStatsCards: React.FC<CategoryStatsCardsProps> = ({
  stats,
  isLoading = false,
}) => {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse p-4"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="کل دسته‌بندی‌ها"
        value={stats.totalCategories.toLocaleString("fa-IR")}
        subtitle={`${stats.activeCategories} دسته فعال`}
        icon={<FolderTree className="w-5 h-5 text-indigo-400" />}
        iconBgClassName="bg-indigo-600/20 border-indigo-500/30 text-indigo-400"
      />

      <StatCard
        title="دسته‌های اصلی (ریشه)"
        value={stats.rootCategories.toLocaleString("fa-IR")}
        subtitle="سطح صفر سلسله‌مراتب"
        icon={<Layers className="w-5 h-5 text-cyan-400" />}
        iconBgClassName="bg-cyan-600/20 border-cyan-500/30 text-cyan-400"
      />

      <StatCard
        title="زیردسته‌های تودرتو"
        value={stats.subCategories.toLocaleString("fa-IR")}
        subtitle="سطوح ۱ و ۲ و عمیق‌تر"
        icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        iconBgClassName="bg-emerald-600/20 border-emerald-500/30 text-emerald-400"
      />

      <StatCard
        title="کالاهای متصل"
        value={stats.totalProducts.toLocaleString("fa-IR")}
        subtitle="مجموع موجودی در دسته‌ها"
        icon={<Package className="w-5 h-5 text-amber-400" />}
        iconBgClassName="bg-amber-600/20 border-amber-500/30 text-amber-400"
      />
    </div>
  );
};

export default CategoryStatsCards;
