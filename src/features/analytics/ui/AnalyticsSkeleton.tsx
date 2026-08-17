import React from "react";

export const AnalyticsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="h-3.5 w-24 bg-slate-800 rounded animate-pulse" />
              <div className="w-8 h-8 rounded-xl bg-slate-800 animate-pulse" />
            </div>
            <div className="h-7 w-32 bg-slate-800 rounded animate-pulse" />
            <div className="h-3 w-40 bg-slate-800/60 rounded animate-pulse" />
            <div className="pt-2 border-t border-slate-800 flex justify-between">
              <div className="h-4 w-16 bg-slate-800 rounded-full animate-pulse" />
              <div className="h-3 w-20 bg-slate-800/60 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* 2. Charts Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <div className="h-4 w-36 bg-slate-800 rounded animate-pulse" />
            <div className="h-7 w-32 bg-slate-800 rounded-xl animate-pulse" />
          </div>
          <div className="h-64 w-full bg-slate-800/40 rounded-xl animate-pulse" />
        </div>

        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="h-4 w-32 bg-slate-800 rounded animate-pulse pb-4 border-b border-slate-800" />
          <div className="h-44 w-44 mx-auto rounded-full bg-slate-800/50 animate-pulse" />
          <div className="space-y-2 pt-2">
            <div className="h-3 w-full bg-slate-800/60 rounded animate-pulse" />
            <div className="h-3 w-full bg-slate-800/60 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* 3. Bottom Snippets Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="h-4 w-36 bg-slate-800 rounded animate-pulse pb-2" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-800/40 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="h-4 w-36 bg-slate-800 rounded animate-pulse pb-2" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-800/40 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSkeleton;
