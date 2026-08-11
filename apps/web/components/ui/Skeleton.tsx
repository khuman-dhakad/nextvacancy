import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  circle = false,
  ...props
}) => {
  return (
    <div
      aria-hidden="true"
      className={[
        "animate-pulse bg-[var(--surface-subtle)] border border-[var(--border)]",
        circle ? "rounded-full" : "rounded-md",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
};

Skeleton.displayName = "Skeleton";
