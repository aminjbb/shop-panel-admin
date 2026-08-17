import React, { type ReactNode } from "react";

export interface HeaderPagesProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

export const HeaderPages: React.FC<HeaderPagesProps> = ({
  title,
  subtitle,
  children,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 ${className}`}
    >
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-xs sm:text-sm text-white/60">
            {subtitle}
          </p>
        )}
      </div>

      {children && (
        <div className="flex items-center gap-3 flex-wrap">{children}</div>
      )}
    </div>
  );
};

export default HeaderPages;
