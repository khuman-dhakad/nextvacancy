import React from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "accent";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#0F2744] text-white hover:bg-[#183B66] active:bg-[#0A1E38] shadow-xs border border-transparent font-bold",
  secondary:
    "bg-[#1D4ED8] text-white hover:bg-[#1E40AF] active:bg-[#1E3A8A] shadow-xs border border-transparent font-bold",
  outline:
    "border border-slate-200/90 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 shadow-2xs font-bold",
  ghost:
    "text-slate-700 hover:bg-slate-100/80 active:bg-slate-200/80 border border-transparent font-semibold",
  destructive:
    "bg-[#DC2626] text-white hover:bg-[#B91C1C] active:bg-[#991B1B] shadow-xs border border-transparent font-bold",
  accent:
    "bg-[#D97706] text-white hover:bg-[#B45309] active:bg-[#92400E] shadow-xs border border-transparent font-bold",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-[36px] px-3 py-1.5 text-xs gap-1.5 rounded-xl",
  md: "min-h-[42px] px-4.5 py-2 text-xs sm:text-sm gap-2 rounded-xl",
  lg: "min-h-[48px] px-6 py-2.5 text-sm sm:text-base gap-2.5 rounded-2xl",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={[
          "inline-flex items-center justify-center select-none cursor-pointer",
          "transition-all duration-150 ease-out active:scale-[0.99]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2744] focus-visible:ring-offset-2",
          "disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" aria-hidden="true" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0 items-center">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0 items-center">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
