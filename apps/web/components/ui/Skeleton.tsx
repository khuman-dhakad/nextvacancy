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
        "animate-pulse bg-gradient-to-r from-slate-100 via-slate-200/70 to-slate-100 border border-slate-200/60",
        circle ? "rounded-full" : "rounded-xl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
};

Skeleton.displayName = "Skeleton";
