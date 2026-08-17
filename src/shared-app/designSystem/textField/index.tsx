import React, { type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes, useId } from "react";

export interface ETextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> {
  value?: string;
  onValueChange?: (value: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  label?: ReactNode;
  placeholder?: string;
  error?: boolean;
  helperText?: ReactNode;
  required?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  multiline?: boolean;
  rows?: number;
  className?: string;
  wrapperClassName?: string;
}

export const ETextField: React.FC<ETextFieldProps> = ({
  value = "",
  onValueChange,
  onChange,
  label,
  placeholder,
  error = false,
  helperText,
  required = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  multiline = false,
  rows = 3,
  className = "",
  wrapperClassName = "",
  type = "text",
  id: customId,
  disabled = false,
  ...props
}) => {
  const generatedId = useId();
  const inputId = customId || `textfield-${generatedId}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onValueChange) {
      onValueChange(e.target.value);
    }
    if (onChange) {
      onChange(e);
    }
  };

  const inputBaseClasses = `
    w-full bg-slate-900/60 border rounded-xl text-white placeholder-white/35 
    transition-all duration-200 text-sm focus:outline-none focus:ring-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30" : "border-white/12 hover:border-white/20 focus:border-indigo-500 focus:ring-indigo-500/30"}
    ${leftIcon ? "ps-10" : "ps-3.5"}
    ${rightIcon ? "pe-10" : "pe-3.5"}
    py-2.5
    ${className}
  `;

  return (
    <div className={`${fullWidth ? "w-full" : "inline-block"} ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-white/80 mb-1.5 cursor-pointer"
        >
          {label}
          {required && <span className="text-rose-400 ms-1">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute start-3 top-1/2 -translate-y-1/2 text-white/45 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}

        {multiline ? (
          <textarea
            id={inputId}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={inputBaseClasses}
            {...(props as unknown as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={inputBaseClasses}
            {...props}
          />
        )}

        {rightIcon && (
          <div className="absolute end-3 top-1/2 -translate-y-1/2 text-white/45 flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>

      {helperText && (
        <p
          className={`mt-1.5 text-xs transition-colors duration-150 ${
            error ? "text-rose-400 font-medium" : "text-white/50"
          }`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default ETextField;
