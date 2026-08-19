import React from "react";
import Link from "next/link";
import { ChevronRight, Home, Building2 } from "lucide-react";

export interface OrganizationBreadcrumbsProps {
  organizationName: string;
  className?: string;
}

export const OrganizationBreadcrumbs: React.FC<OrganizationBreadcrumbsProps> = ({
  organizationName,
  className = "",
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={["flex items-center text-xs font-semibold text-slate-500 py-3", className].join(" ")}
    >
      <ol className="flex items-center space-x-2 flex-wrap">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[var(--primary)] text-slate-500 transition-colors"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Home</span>
          </Link>
        </li>

        <li className="flex items-center">
          <ChevronRight className="h-3 w-3 text-slate-400 mx-1 shrink-0" aria-hidden="true" />
          <Link
            href="/organizations"
            className="flex items-center gap-1 hover:text-[var(--primary)] text-slate-500 transition-colors"
          >
            <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Organizations</span>
          </Link>
        </li>

        <li className="flex items-center">
          <ChevronRight className="h-3 w-3 text-slate-400 mx-1 shrink-0" aria-hidden="true" />
          <span className="text-slate-900 font-bold truncate max-w-xs sm:max-w-md" aria-current="page">
            {organizationName}
          </span>
        </li>
      </ol>
    </nav>
  );
};

OrganizationBreadcrumbs.displayName = "OrganizationBreadcrumbs";
