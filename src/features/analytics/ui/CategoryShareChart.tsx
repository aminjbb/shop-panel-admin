import React from "react";
import type { CategorySalesShare } from "@/types/analytics";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { PieChart as PieIcon } from "lucide-react";

interface CategoryShareChartProps {
  data: CategorySalesShare[];
  title?: string;
  subtitle?: string;
}

interface CustomPieTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: CategorySalesShare;
  }>;
}

const CustomPieTooltip: React.FC<CustomPieTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="p-3 rounded-xl bg-slate-950/95 border border-slate-700 shadow-2xl backdrop-blur-md text-right text-xs space-y-1 min-w-[150px]">
        <div className="font-bold text-white pb-1 border-b border-slate-800 flex items-center justify-between">
          <span>{item.category}</span>
          <span className="text-indigo-400">%{item.percentage}</span>
        </div>
        {item.revenue && (
          <div className="text-slate-300 pt-1">
            سهم فروش:{" "}
            <span className="font-semibold text-white">
              {item.revenue.toLocaleString("fa-IR")} تومان
            </span>
          </div>
        )}
        {item.ordersCount && (
          <div className="text-slate-400">
            تعداد: {item.ordersCount.toLocaleString("fa-IR")} قلم
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const CategoryShareChart: React.FC<CategoryShareChartProps> = ({
  data,
  title = "سهم فروش دسته‌بندی‌ها",
  subtitle = "توزیع درصدی درآمد بین گروه‌های کالایی",
}) => {
  return (
    <div
      id="category-share-chart-card"
      className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between"
    >
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
            <PieIcon className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white">
            {title}
          </h3>
        </div>
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      </div>

      {/* Main Chart Body: 2 columns on tablet/desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-auto py-2">
        {/* Pie graphic */}
        <div className="sm:col-span-6 w-full h-[190px] sm:h-[220px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomPieTooltip />} />
              <Pie
                data={data}
                dataKey="percentage"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={78}
                paddingAngle={4}
                stroke="#0f172a"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[10px] text-slate-400 font-medium">پرفروش‌ترین</span>
            <span className="text-xs font-bold text-white">هدفون و صوتی</span>
          </div>
        </div>

        {/* Legend / Category breakdown list */}
        <div className="sm:col-span-6 flex flex-col gap-2">
          {data.map((cat, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-slate-300 font-medium truncate">
                  {cat.category}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="font-bold text-white">%{cat.percentage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>۵ دسته اصلی فروشگاه دینووا</span>
        <span className="text-indigo-400 font-semibold">مجموع ۱۰۰٪</span>
      </div>
    </div>
  );
};

export default CategoryShareChart;
