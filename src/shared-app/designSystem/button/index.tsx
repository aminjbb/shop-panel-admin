import React, { type ReactNode, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

export type EButtonVariant =
  | "primary"
  | "secondary"
  | "outlined"
  | "outlinedRounded"
  | "destructive"
  | "link";

export type EButtonSize = "sm" | "md" | "lg" | "icon";
export type EButtonIconPosition = "start" | "end";

export interface EButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  variant?: EButtonVariant;
  size?: EButtonSize;
  icon?: ReactNode;
  iconPosition?: EButtonIconPosition;
  isLoading?: boolean;
  children?: ReactNode;
  className?: string;
}

export const EButton: React.FC<EButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "start",
  isLoading = false,
  disabled = false,
  children,
  className = "",
  type = "button",
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer";

  const sizeStyles: Record<EButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-4 py-2 text-sm rounded-xl gap-2",
    lg: "px-6 py-3 text-base rounded-xl gap-2.5",
    icon: "p-2 rounded-lg text-sm w-9 h-9",
  };

  const variantStyles: Record<EButtonVariant, string> = {
    primary:
      "bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white focus:ring-indigo-500 border border-indigo-500/40",
    secondary:
      "bg-white/10 hover:bg-white/15 active:bg-white/20 text-white border border-white/10 focus:ring-slate-400",
    outlined:
      "bg-transparent hover:bg-white/5 active:bg-white/10 text-white border border-white/20 focus:ring-indigo-500",
    outlinedRounded:
      "bg-transparent hover:bg-white/5 active:bg-white/10 text-white border border-white/20 rounded-full focus:ring-indigo-500",
    destructive:
      "bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white focus:ring-rose-500 border border-rose-500/40",
    link: "bg-transparent text-indigo-400 hover:text-indigo-300 hover:underline p-0 focus:ring-0",
  };

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
          {children && <span>{children}</span>}
        </>
      ) : (
        <>
          {icon && iconPosition === "start" && (
            <span className="shrink-0 flex items-center">{icon}</span>
          )}
          {children && <span>{children}</span>}
          {icon && iconPosition === "end" && (
            <span className="shrink-0 flex items-center">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

export default EButton;
