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
    "bg-[#850A42] text-white hover:bg-[#6E0837] active:bg-[#56052B] shadow-xs border border-transparent font-bold",
  secondary:
    "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-xs border border-transparent font-bold",
  outline:
    "border border-[#8FAAB8] bg-white text-[#064D79] hover:bg-[#F8E7EF] hover:border-[#850A42] active:bg-slate-100 shadow-2xs font-bold",
  ghost:
    "text-[#064D79] hover:bg-[#F8E7EF] active:bg-slate-200/80 border border-transparent font-semibold",
  destructive:
    "bg-[#DC2626] text-white hover:bg-[#B91C1C] active:bg-[#991B1B] shadow-xs border border-transparent font-bold",
  accent:
    "bg-[#078F3D] text-white hover:bg-[#056F2F] active:bg-[#045A26] shadow-xs border border-transparent font-bold",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-[36px] px-3 py-1.5 text-xs gap-1.5 rounded-lg",
  md: "min-h-[42px] px-4.5 py-2 text-xs sm:text-sm gap-2 rounded-lg",
  lg: "min-h-[48px] px-6 py-2.5 text-sm sm:text-base gap-2.5 rounded-xl",
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
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#850A42] focus-visible:ring-offset-2",
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
