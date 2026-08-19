import React from "react";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "accent";

export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, { bg: string; dot: string }> = {
  success: {
    bg: "bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold",
    dot: "bg-emerald-600",
  },
  warning: {
    bg: "bg-amber-50 text-amber-900 border border-amber-200/80 font-bold",
    dot: "bg-amber-500",
  },
  danger: {
    bg: "bg-rose-50 text-rose-800 border border-rose-200/80 font-bold",
    dot: "bg-rose-600",
  },
  info: {
    bg: "bg-blue-50 text-blue-800 border border-blue-200/80 font-bold",
    dot: "bg-blue-600",
  },
  neutral: {
    bg: "bg-slate-100 text-slate-700 border border-slate-200/80 font-semibold",
    dot: "bg-slate-500",
  },
  accent: {
    bg: "bg-amber-50 text-amber-900 border border-amber-300 font-bold",
    dot: "bg-amber-600",
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-[11px] px-2.5 py-0.5 gap-1 rounded-full",
  md: "text-xs px-3 py-1 gap-1.5 rounded-full",
};

export const Badge: React.FC<BadgeProps> = ({
  className = "",
  variant = "neutral",
  size = "md",
  dot = false,
  leftIcon,
  rightIcon,
  children,
  ...props
}) => {
  const currentVariant = variantStyles[variant];

  return (
    <span
      className={[
        "inline-flex items-center select-none shrink-0 tracking-tight leading-none",
        currentVariant.bg,
        sizeStyles[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${currentVariant.dot} shrink-0 animate-pulse`}
          aria-hidden="true"
        />
      )}
      {leftIcon && <span className="inline-flex shrink-0 items-center">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="inline-flex shrink-0 items-center">{rightIcon}</span>}
    </span>
  );
};

Badge.displayName = "Badge";
