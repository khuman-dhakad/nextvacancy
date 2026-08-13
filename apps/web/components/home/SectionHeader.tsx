import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui";
import { ArrowRight } from "lucide-react";

export interface SectionHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  icon?: React.ComponentType<{ className?: string }>;
  viewAllHref?: string;
  viewAllText?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  badge,
  icon: Icon,
  viewAllHref,
  viewAllText = "View All",
  className = "",
}) => {
  return (
    <div
      className={[
        "flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-[var(--border)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-[var(--primary)] shrink-0" aria-hidden="true" />}
          <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          {badge && (
            <Badge variant="accent" size="sm">
              {badge}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] hover:text-[var(--primary-hover)] hover:underline shrink-0 group"
        >
          <span>{viewAllText}</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
};

SectionHeader.displayName = "SectionHeader";
