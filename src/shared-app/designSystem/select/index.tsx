import React, { type ReactNode, type SelectHTMLAttributes, useId } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ESelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  value?: string;
  onValueChange?: (value: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  label?: ReactNode;
  placeholder?: string;
  error?: boolean;
  helperText?: ReactNode;
  required?: boolean;
  fullWidth?: boolean;
  className?: string;
  wrapperClassName?: string;
}

export const ESelect: React.FC<ESelectProps> = ({
  value = "",
  onValueChange,
  onChange,
  options = [],
  label,
  placeholder,
  error = false,
  helperText,
  required = false,
  fullWidth = true,
  className = "",
  wrapperClassName = "",
  id: customId,
  disabled = false,
  ...props
}) => {
  const generatedId = useId();
  const selectId = customId || `select-${generatedId}`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onValueChange) {
      onValueChange(e.target.value);
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`${fullWidth ? "w-full" : "inline-block"} ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-medium text-white/80 mb-1.5 cursor-pointer"
        >
          {label}
          {required && <span className="text-rose-400 ms-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`
            w-full bg-slate-900 border rounded-xl text-white placeholder-slate-400 
            transition-all duration-150 text-sm focus:outline-none focus:ring-2 
            appearance-none pe-9 ps-3.5 py-2.5 cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              error
                ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30"
                : "border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30"
            }
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="bg-slate-900 text-slate-500">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              className="bg-slate-900 text-white py-1"
            >
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {helperText && (
        <p
          className={`mt-1.5 text-xs ${
            error ? "text-rose-400 font-medium" : "text-slate-400"
          }`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default ESelect;
