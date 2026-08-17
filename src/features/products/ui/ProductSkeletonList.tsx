import React from "react";

export const ProductSkeletonList: React.FC = () => {
  return (
    <div className="w-full space-y-3 animate-pulse">
      {/* Mobile Card Skeletons (< 768px) */}
      <div className="flex flex-col gap-3.5 md:hidden">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-20 h-20 rounded-xl bg-slate-800 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 bg-slate-800 rounded" />
                <div className="h-4 w-3/4 bg-slate-800 rounded" />
                <div className="h-4 w-1/2 bg-slate-800 rounded" />
              </div>
            </div>
            <div className="h-10 bg-slate-800/60 rounded-xl" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-9 bg-slate-800 rounded-xl" />
              <div className="h-9 bg-slate-800 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Skeletons (>= 768px) */}
      <div className="hidden md:block rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="h-4 w-24 bg-slate-800 rounded" />
          <div className="h-4 w-40 bg-slate-800 rounded" />
        </div>
        <div className="divide-y divide-slate-800/80 p-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="flex items-center gap-4 py-3 px-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-slate-800 rounded" />
                <div className="h-3 w-1/4 bg-slate-800/60 rounded" />
              </div>
              <div className="h-4 w-24 bg-slate-800 rounded" />
              <div className="h-4 w-20 bg-slate-800 rounded" />
              <div className="h-8 w-24 bg-slate-800 rounded-xl" />
              <div className="h-6 w-20 bg-slate-800 rounded-full" />
              <div className="h-8 w-16 bg-slate-800 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSkeletonList;
