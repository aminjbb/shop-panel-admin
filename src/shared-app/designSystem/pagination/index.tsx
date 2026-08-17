import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface EPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const EPagination: React.FC<EPaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1 && (!totalCount || totalCount === 0)) {
    return null;
  }

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    }
  }

  const startRecord = pageSize ? (currentPage - 1) * pageSize + 1 : 1;
  const endRecord = pageSize && totalCount ? Math.min(currentPage * pageSize, totalCount) : totalCount;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800 text-xs text-slate-400 select-none ${className}`}
    >
      {totalCount !== undefined && (
        <div>
          نمایش <span className="font-semibold text-white">{startRecord}</span> تا{" "}
          <span className="font-semibold text-white">{endRecord}</span> از مجموع{" "}
          <span className="font-semibold text-white">{totalCount}</span> مورد
        </div>
      )}

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          aria-label="صفحه قبل"
        >
          <ChevronRight className="w-4 h-4" />
          <span className="hidden xs:inline">قبلی</span>
        </button>

        <div className="flex items-center gap-1">
          {pages.map((p, index) => {
            const prevPage = pages[index - 1];
            const showEllipsis = prevPage && p - prevPage > 1;

            return (
              <React.Fragment key={p}>
                {showEllipsis && <span className="px-1 text-slate-600">...</span>}
                <button
                  type="button"
                  onClick={() => onPageChange(p)}
                  className={`w-8 h-8 rounded-lg font-medium transition-colors cursor-pointer ${
                    p === currentPage
                      ? "bg-indigo-600 text-white font-bold"
                      : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                  }`}
                >
                  {p}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          aria-label="صفحه بعد"
        >
          <span className="hidden xs:inline">بعدی</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default EPagination;
