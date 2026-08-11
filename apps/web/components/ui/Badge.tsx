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
    bg: "bg-[var(--success-subtle)] text-[#065f46] border border-[#a7f3d0]",
    dot: "bg-[var(--success)]",
  },
  warning: {
    bg: "bg-[var(--warning-subtle)] text-[#92400e] border border-[#fde68a]",
    dot: "bg-[var(--warning)]",
  },
  danger: {
    bg: "bg-[var(--danger-subtle)] text-[#991b1b] border border-[#fecaca]",
    dot: "bg-[var(--danger)]",
  },
  info: {
    bg: "bg-[var(--info-subtle)] text-[#075985] border border-[#bae6fd]",
    dot: "bg-[var(--info)]",
  },
  neutral: {
    bg: "bg-[var(--surface-subtle)] text-[var(--foreground)] border border-[var(--border)]",
    dot: "bg-[var(--muted)]",
  },
  accent: {
    bg: "bg-[var(--accent-subtle)] text-[#92400e] border border-[#fde68a]",
    dot: "bg-[var(--accent)]",
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-[11px] font-semibold px-2 py-0.5 gap-1 rounded",
  md: "text-xs font-semibold px-2.5 py-1 gap-1.5 rounded-md",
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
        "inline-flex items-center font-medium select-none shrink-0 tracking-wide",
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
          className={`h-1.5 w-1.5 rounded-full ${currentVariant.dot} shrink-0`}
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
