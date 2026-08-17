import React, { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  closeOnBackdrop?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "lg",
  className = "",
  closeOnBackdrop = true,
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses: Record<string, string> = {
    sm: "sm:max-w-md",
    md: "sm:max-w-lg",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-4xl",
    full: "sm:max-w-5xl",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => {
          if (closeOnBackdrop) onClose();
        }}
      />

      {/* Content Sheet / Modal Panel */}
      <div
        className={`
          relative z-10 w-full bg-slate-900 border border-slate-800 
          rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col 
          max-h-[92vh] sm:max-h-[85vh] overflow-hidden 
          animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200
          ${sizeClasses[size] || sizeClasses.lg}
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 shrink-0">
          <div>
            {title && (
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {children}
        </div>

        {/* Optional Sticky Footer */}
        {footer && (
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomSheet;
