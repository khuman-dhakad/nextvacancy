import React from "react";
import Link from "next/link";

export interface NavLinkItem {
  label: string;
  href: string;
  isHighlight?: boolean;
}

export const MAIN_NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Govt Jobs", href: "/category/government" },
  { label: "Private Jobs", href: "/category/private" },
  { label: "Admit Cards", href: "/category/admit-card" },
  { label: "Results", href: "/category/result" },
  { label: "Answer Keys", href: "/category/answer-key" },
  { label: "Scholarships", href: "/category/scholarship" },
  { label: "Internships", href: "/category/internship" },
];

export interface DesktopNavigationProps {
  className?: string;
  activePath?: string;
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  className = "",
  activePath,
}) => {
  return (
    <nav
      aria-label="Main Navigation"
      className={["hidden lg:flex items-center gap-1", className].filter(Boolean).join(" ")}
    >
      {MAIN_NAV_LINKS.map((item) => {
        const isActive = activePath === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={[
              "px-3 py-2 rounded-lg text-xs font-semibold select-none transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-1",
              isActive
                ? "bg-[var(--primary-subtle)] text-[var(--primary)] font-bold"
                : "text-slate-700 hover:text-[var(--primary)] hover:bg-slate-100",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

DesktopNavigation.displayName = "DesktopNavigation";
