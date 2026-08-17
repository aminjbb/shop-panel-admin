import React, { useState } from "react";
import type { SalesTrendPoint } from "@/types/analytics";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  ComposedChart,
} from "recharts";
import { BarChart3, TrendingUp, Calendar } from "lucide-react";

interface SalesTrendChartProps {
  data: SalesTrendPoint[];
  title?: string;
  subtitle?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string; payload: SalesTrendPoint }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="p-3 rounded-xl bg-slate-950/95 border border-slate-700 shadow-2xl backdrop-blur-md text-right text-xs space-y-1.5 min-w-[160px]">
        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-800 text-slate-300 font-semibold">
          <span>{label}</span>
          {item.dayName && (
            <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
              {item.dayName}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-indigo-300 font-medium pt-1">
          <span>فروش ناخالص:</span>
          <span className="font-bold text-white">
            {item.revenue.toLocaleString("fa-IR")} تومان
          </span>
        </div>

        <div className="flex items-center justify-between text-sky-300 font-medium">
          <span>تعداد سفارش:</span>
          <span className="font-bold text-white">
            {item.orders.toLocaleString("fa-IR")} سفارش
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const SalesTrendChart: React.FC<SalesTrendChartProps> = ({
  data,
  title = "روند درآمد و سفارش‌های روزانه",
  subtitle = "تحلیل حجم تراکنش‌ها و فروش به تفکیک تاریخ",
}) => {
  const [chartMode, setChartMode] = useState<"area" | "composed">("area");

  return (
    <div
      id="sales-trend-chart-card"
      className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {title}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>

        {/* View Mode Toggle */}
        <div className="inline-flex rounded-xl bg-slate-950 border border-slate-800 p-1 text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartMode("area")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              chartMode === "area"
                ? "bg-indigo-600 text-white font-semibold shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>نمودار مساحتی</span>
          </button>

          <button
            type="button"
            onClick={() => setChartMode("composed")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              chartMode === "composed"
                ? "bg-indigo-600 text-white font-semibold shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>ترکیبی با ستونی</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full h-[240px] sm:h-[290px] mt-4 relative">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === "area" ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />

              <XAxis
                dataKey="date"
                stroke="#64748b"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
              />

              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="revenue"
                name="فروش (تومان)"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                activeDot={{ r: 6, fill: "#818cf8", stroke: "#1e1b4b", strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity={0.6} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />

              <XAxis
                dataKey="date"
                stroke="#64748b"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
              />

              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
              />

              <Tooltip content={<CustomTooltip />} />

              <Bar
                dataKey="revenue"
                name="فروش روزانه"
                fill="url(#barGradient)"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Indicator */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>درآمد ناخالص (تومان)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span>تعداد سفارش‌ها</span>
          </span>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-slate-400">
          <Calendar className="w-3 h-3 text-indigo-400" />
          <span>به‌روزرسانی خودکار دیتای سفارش‌ها</span>
        </span>
      </div>
    </div>
  );
};

export default SalesTrendChart;
