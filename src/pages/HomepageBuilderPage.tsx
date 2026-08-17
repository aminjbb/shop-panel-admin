import React from "react";
import HeaderPages from "@/shared-app/headerPages";
import HomepageContainer from "@/features/homepage/ui/HomepageContainer";
import { LayoutTemplate, Sparkles } from "lucide-react";

export const HomepageBuilderPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <HeaderPages
        title="صفحه‌ساز بصری و مدیریت صفحه اصلی (Homepage Builder)"
        subtitle="مدیریت چیدمان بلوک‌ها، اسلایدر بنر هیرو، کاروسل شگفت‌انگیزها، ردیف‌های کالایی و بنرهای چند ستونه با پیش‌نمایش زنده فروشگاه"
      >
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          اسپرینت ۸
        </span>
      </HeaderPages>

      {/* Main Builder Container */}
      <HomepageContainer />
    </div>
  );
};

export default HomepageBuilderPage;
