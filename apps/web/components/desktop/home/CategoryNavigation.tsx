import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui";
import {
  LayoutGrid,
  Landmark,
  Briefcase,
  FileText,
  BarChart2,
  Key,
  GraduationCap,
  UserCheck,
  Users,
} from "lucide-react";

export interface CategoryNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORY_ITEMS: CategoryNavItem[] = [
  { label: "All Vacancies", href: "/search", icon: LayoutGrid },
  { label: "Govt Jobs", href: "/category/government", icon: Landmark },
  { label: "Private Jobs", href: "/category/private", icon: Briefcase },
  { label: "Admit Cards", href: "/category/admit-card", icon: FileText },
  { label: "Results", href: "/category/result", icon: BarChart2 },
  { label: "Answer Keys", href: "/category/answer-key", icon: Key },
  { label: "Scholarships", href: "/category/scholarship", icon: GraduationCap },
  { label: "Internships", href: "/category/internship", icon: UserCheck },
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
      aria-label="Category Pills Navigation"
      className={[
        "bg-[#F8FAFC] border-b border-slate-200 py-3 overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Container size="lg">
        <div className="flex items-center justify-between gap-2.5 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORY_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeHref === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 whitespace-nowrap select-none",
                  "transition-all duration-150 ease-in-out border",
                  isActive
                    ? "bg-[#0F2744] text-white border-[#0F2744] shadow-xs"
                    : "bg-white text-slate-800 hover:bg-slate-50 hover:text-[var(--primary)] hover:border-slate-300 border-slate-200/90 shadow-2xs",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <Icon className="h-4 w-4 shrink-0 text-slate-700 opacity-90" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </Container>
    </nav>
  );
};

CategoryNavigation.displayName = "CategoryNavigation";
