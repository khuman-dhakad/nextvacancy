import React from "react";

export type ContainerSize = "sm" | "md" | "lg" | "full";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "main" | "section" | "article" | "header" | "footer";
  size?: ContainerSize;
}

const sizeStyles: Record<ContainerSize, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  full: "max-w-full",
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className = "",
      as: Component = "div",
      size = "lg",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={[
          "w-full mx-auto px-4 sm:px-6 lg:px-8",
          sizeStyles[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = "Container";
