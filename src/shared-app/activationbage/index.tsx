import React from "react";

export type ActivationStatus = "active" | "inactive" | "info" | "archived";

export interface ActivationBageProps {
  label: string;
  status?: ActivationStatus;
  className?: string;
}

export const ActivationBage: React.FC<ActivationBageProps> = ({
  label,
  status = "active",
  className = "",
}) => {
  const statusStyles: Record<ActivationStatus, { bg: string; text: string; dot: string; border: string }> = {
    active: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-300",
      dot: "bg-emerald-400",
      border: "border-emerald-500/25",
    },
    inactive: {
      bg: "bg-rose-500/10",
      text: "text-rose-300",
      dot: "bg-rose-400",
      border: "border-rose-500/25",
    },
    info: {
      bg: "bg-indigo-500/10",
      text: "text-indigo-300",
      dot: "bg-indigo-400",
      border: "border-indigo-500/25",
    },
    archived: {
      bg: "bg-white/5",
      text: "text-white/60",
      dot: "bg-white/40",
      border: "border-white/10",
    },
  };

  const style = statusStyles[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm select-none ${style.bg} ${style.text} ${style.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot} animate-pulse`} />
      <span>{label}</span>
    </span>
  );
};

export default ActivationBage;
