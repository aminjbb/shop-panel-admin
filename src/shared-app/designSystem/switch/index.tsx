import React, { type ReactNode, useId } from "react";

export interface ESwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  activeLabel?: ReactNode;
  inActiveLabel?: ReactNode;
  label?: ReactNode;
  labelPosition?: "left" | "right";
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const ESwitch: React.FC<ESwitchProps> = ({
  checked,
  onCheckedChange,
  activeLabel,
  inActiveLabel,
  label,
  labelPosition = "left",
  disabled = false,
  className = "",
  id: customId,
}) => {
  const generatedId = useId();
  const switchId = customId || `switch-${generatedId}`;

  const currentLabel = label || (checked ? activeLabel : inActiveLabel);

  return (
    <label
      htmlFor={switchId}
      className={`inline-flex items-center gap-3 select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      {currentLabel && labelPosition === "left" && (
        <span className="text-xs text-white/80 font-medium">{currentLabel}</span>
      )}

      <button
        id={switchId}
        type="button"
        role="switch"
        dir="ltr"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onCheckedChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
          checked ? "bg-indigo-600" : "bg-white/20"
        }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>

      {currentLabel && labelPosition === "right" && (
        <span className="text-xs text-white/80 font-medium">{currentLabel}</span>
      )}
    </label>
  );
};

export default ESwitch;
