import React from "react";

export const CouponSkeletonList: React.FC = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Desktop table skeleton */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-950/40 border border-slate-800/40 gap-4"
          >
            <div className="flex items-center gap-3 w-1/4">
              <div className="w-8 h-8 rounded-xl bg-slate-800 animate-pulse" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 w-24 bg-slate-800 rounded animate-pulse" />
                <div className="h-2.5 w-32 bg-slate-800/60 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-6 w-20 bg-slate-800 rounded-full animate-pulse" />
            <div className="h-3.5 w-24 bg-slate-800 rounded animate-pulse" />
            <div className="h-3 w-28 bg-slate-800 rounded-full animate-pulse" />
            <div className="h-3.5 w-20 bg-slate-800 rounded animate-pulse" />
            <div className="h-6 w-16 bg-slate-800 rounded-full animate-pulse" />
            <div className="h-8 w-16 bg-slate-800 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>

      {/* Mobile card skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-800 animate-pulse" />
                <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
              </div>
              <div className="h-5 w-12 bg-slate-800 rounded-full animate-pulse" />
            </div>
            <div className="h-6 w-28 bg-slate-800 rounded-full animate-pulse" />
            <div className="h-10 bg-slate-950/60 rounded-xl animate-pulse" />
            <div className="flex justify-between pt-1">
              <div className="h-4 w-20 bg-slate-800 rounded animate-pulse" />
              <div className="h-6 w-16 bg-slate-800 rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CouponSkeletonList;
