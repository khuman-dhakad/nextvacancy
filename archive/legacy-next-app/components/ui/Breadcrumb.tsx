import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItemData {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItemData[];
  showHomeIcon?: boolean;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  showHomeIcon = true,
  className = "",
  ...props
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={["flex items-center text-xs text-[var(--muted-foreground)]", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <ol className="flex flex-wrap items-center gap-1.5 list-none p-0 m-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={index} className="inline-flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  className="h-3.5 w-3.5 text-[var(--muted)] shrink-0"
                  aria-hidden="true"
                />
              )}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="font-semibold text-[var(--foreground)] truncate max-w-[200px] sm:max-w-[320px]"
                >
                  {isFirst && showHomeIcon && (
                    <Home className="h-3.5 w-3.5 inline mr-1 -mt-0.5" aria-hidden="true" />
                  )}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[var(--primary)] hover:underline transition-colors truncate max-w-[150px] sm:max-w-[240px]"
                >
                  {isFirst && showHomeIcon && (
                    <Home className="h-3.5 w-3.5 inline mr-1 -mt-0.5" aria-hidden="true" />
                  )}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumb.displayName = "Breadcrumb";
