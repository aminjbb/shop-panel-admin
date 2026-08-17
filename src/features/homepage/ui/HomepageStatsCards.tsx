import React from "react";
import type { HomepageStats } from "@/types/homepage";
import StatCard from "@/shared-app/statCard";
import { LayoutTemplate, CheckCircle2, Image as ImageIcon, ShoppingBag, Eye } from "lucide-react";

interface HomepageStatsCardsProps {
  stats: HomepageStats | null;
  isLoading?: boolean;
}

export const HomepageStatsCards: React.FC<HomepageStatsCardsProps> = ({
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
        title="کل سکشن‌های صفحه اصلی"
        value={stats.totalSections.toLocaleString("fa-IR")}
        subtitle={`${stats.activeSections} سکشن فعال در خروجی`}
        icon={<LayoutTemplate className="w-5 h-5 text-indigo-400" />}
        iconBgClassName="bg-indigo-600/20 border-indigo-500/30 text-indigo-400"
      />

      <StatCard
        title="وضعیت انتشار"
        value={stats.activeSections.toLocaleString("fa-IR")}
        subtitle="بلوک‌های نمایش داده شده در ویترین"
        icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        iconBgClassName="bg-emerald-600/20 border-emerald-500/30 text-emerald-400"
      />

      <StatCard
        title="بنرهای تصویری فعال"
        value={stats.totalBanners.toLocaleString("fa-IR")}
        subtitle={`${stats.heroSlidesCount} اسلاید هیرو + بنرهای گرید`}
        icon={<ImageIcon className="w-5 h-5 text-cyan-400" />}
        iconBgClassName="bg-cyan-600/20 border-cyan-500/30 text-cyan-400"
      />

      <StatCard
        title="کالاهای متصل به ردیف‌ها"
        value={stats.totalProductsLinked.toLocaleString("fa-IR")}
        subtitle="شگفت‌انگیزها و ردیف‌های کالایی"
        icon={<ShoppingBag className="w-5 h-5 text-amber-400" />}
        iconBgClassName="bg-amber-600/20 border-amber-500/30 text-amber-400"
      />
    </div>
  );
};

export default HomepageStatsCards;
