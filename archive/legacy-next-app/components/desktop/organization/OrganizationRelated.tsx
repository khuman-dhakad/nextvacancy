import React from "react";
import Link from "next/link";
import { Building2, ArrowRight, Briefcase } from "lucide-react";

import { Card } from "@/components/ui";
import { OrganizationProfile } from "@/types";

export interface OrganizationRelatedProps {
  relatedOrganizations: OrganizationProfile[];
  className?: string;
}

export const OrganizationRelated: React.FC<OrganizationRelatedProps> = ({
  relatedOrganizations = [],
  className = "",
}) => {
  if (!relatedOrganizations || relatedOrganizations.length === 0) return null;

  return (
    <section aria-label="Related Recruiting Authorities" className={className}>
      <Card className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-xs space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-5 w-5 text-indigo-600" />
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Related Recruiting Bodies &amp; Commissions
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Explore career portals and vacancy circulars from other national and state recruitment authorities.
            </p>
          </div>

          <Link
            href="/organizations"
            className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>View All Authorities</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 3 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {relatedOrganizations.map((org) => (
            <Link
              key={org.id}
              href={`/organizations/${org.slug}`}
              className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-[var(--primary)] hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[var(--primary)] font-mono font-bold text-[11px] border border-blue-200">
                    {org.shortName}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                    {org.categoryType}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm group-hover:text-[var(--primary)] transition-colors leading-snug line-clamp-1">
                  {org.name}
                </h3>

                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed font-medium">
                  {org.tagline}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-600">
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>{org.stats.activeVacanciesCount} Active Drives</span>
                </span>

                <span className="inline-flex items-center gap-1 text-[var(--primary)] group-hover:translate-x-0.5 transition-transform text-xs">
                  <span>Explore</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </section>
  );
};

OrganizationRelated.displayName = "OrganizationRelated";
