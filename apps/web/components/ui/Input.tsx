"use client";

import React, { useId } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      id: customId,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      fullWidth = true,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    const describedBy = error ? errorId : helperText ? helperId : undefined;

    return (
      <div className={fullWidth ? "w-full" : "inline-block"}>
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-semibold text-[var(--foreground)] mb-1.5"
          >
            {label}
            {required && <span className="text-[var(--danger)] ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 pointer-events-none text-[var(--muted)] flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={[
              "w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-[var(--foreground)]",
              "placeholder:text-[var(--muted)] placeholder:text-xs",
              "transition-colors duration-150 ease-in-out min-h-[44px]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
              error
                ? "border-[var(--danger)] focus-visible:ring-[var(--danger)] text-[var(--danger)]"
                : "border-[var(--border-strong)] focus-visible:ring-[var(--primary)] focus-visible:border-[var(--primary)]",
              disabled
                ? "bg-[var(--surface-subtle)] text-[var(--muted)] cursor-not-allowed opacity-75"
                : "hover:border-[var(--foreground)]",
              leftIcon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 pointer-events-none text-[var(--muted)] flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p id={errorId} className="mt-1.5 text-xs font-medium text-[var(--danger)]" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="mt-1.5 text-xs text-[var(--muted)]">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
