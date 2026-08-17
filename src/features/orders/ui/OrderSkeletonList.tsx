import React from "react";

export const OrderSkeletonList: React.FC = () => {
  return (
    <>
      {/* 1. Desktop Skeleton Table */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
          <div className="h-4 w-32 bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="divide-y divide-slate-800/60 p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 animate-pulse" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-28 bg-slate-800 rounded animate-pulse" />
                  <div className="h-2.5 w-20 bg-slate-800/60 rounded animate-pulse" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="h-3 w-24 bg-slate-800 rounded animate-pulse" />
                <div className="h-2.5 w-32 bg-slate-800/60 rounded animate-pulse" />
              </div>

              <div className="h-4 w-20 bg-slate-800 rounded animate-pulse" />
              <div className="h-6 w-20 bg-slate-800 rounded-full animate-pulse" />
              <div className="h-6 w-24 bg-slate-800 rounded-full animate-pulse" />

              <div className="flex gap-2">
                <div className="h-8 w-16 bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-8 w-16 bg-slate-800 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Mobile Skeleton Cards */}
      <div className="md:hidden space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
              <div className="h-5 w-20 bg-slate-800 rounded-full animate-pulse" />
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-xl bg-slate-800 shrink-0 animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-32 bg-slate-800 rounded animate-pulse" />
                <div className="h-2.5 w-24 bg-slate-800/60 rounded animate-pulse" />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="h-4 w-16 bg-slate-800 rounded animate-pulse" />
              <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <div className="h-9 bg-slate-800 rounded-xl animate-pulse" />
              <div className="h-9 bg-slate-800 rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default OrderSkeletonList;
