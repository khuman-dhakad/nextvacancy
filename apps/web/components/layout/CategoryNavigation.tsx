import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui";
import {
  Building2,
  Briefcase,
  FileCheck,
  Award,
  GraduationCap,
  Sparkles,
  Key,
  Users,
  Compass,
} from "lucide-react";

export interface CategoryNavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  isHot?: boolean;
}

const CATEGORY_ITEMS: CategoryNavItem[] = [
  { label: "All Vacancies", href: "/search", icon: Compass },
  { label: "Govt Jobs", href: "/category/government", icon: Building2, isHot: true },
  { label: "Private Jobs", href: "/category/private", icon: Briefcase },
  { label: "Admit Cards", href: "/category/admit-card", icon: FileCheck, isHot: true },
  { label: "Results", href: "/category/result", icon: Award },
  { label: "Answer Keys", href: "/category/answer-key", icon: Key },
  { label: "Scholarships", href: "/category/scholarship", icon: GraduationCap },
  { label: "Internships", href: "/category/internship", icon: Sparkles },
  { label: "Apprenticeships", href: "/category/apprenticeship", icon: Users },
];

export interface CategoryNavigationProps {
  className?: string;
  activeHref?: string;
}

export const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  className = "",
  activeHref,
}) => {
  return (
    <nav
      aria-label="Category Navigation"
      className={[
        "bg-[var(--surface-subtle)] border-b border-[var(--border)] py-1.5 overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Container size="lg">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
          {CATEGORY_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeHref === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 whitespace-nowrap select-none",
                  "transition-all duration-150 ease-in-out min-h-[32px]",
                  isActive
                    ? "bg-[var(--primary)] text-white shadow-2xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-[var(--border)]",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {Icon && <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" />}
                <span>{item.label}</span>
                {item.isHot && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D97706] animate-pulse" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </div>
      </Container>
    </nav>
  );
};

CategoryNavigation.displayName = "CategoryNavigation";
