import React from "react";
import Link from "next/link";
import { JobPosting } from "@/types";
import { Card, Badge } from "@/components/ui";
import { SectionHeader } from "./SectionHeader";
import { Flame, ArrowRight, Eye, Building2 } from "lucide-react";

export interface TrendingSectionProps {
  trendingJobs: JobPosting[];
  className?: string;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  trendingJobs = [],
  className = "",
}) => {
  if (!trendingJobs || trendingJobs.length === 0) return null;

  return (
    <section className={["space-y-4", className].filter(Boolean).join(" ")}>
      <SectionHeader
        title="Trending Recruitment Drives"
        description="High-demand vacancies with highest applicant volume and active application windows"
        badge="Most Popular"
        icon={Flame}
        viewAllHref="/search?sort=views"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {trendingJobs.map((job, idx) => (
          <Link
            key={job.id}
            href={`/jobs/${job.slug}`}
            className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-2xl"
          >
            <Card className="h-full bg-white border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-[var(--primary)]" />
                    <span className="truncate">{job.organization}</span>
                  </span>
                  <Badge variant={idx === 0 ? "warning" : "accent"} size="sm">
                    {idx === 0 ? "🔥 Hot Pick" : "⚡ Trending"}
                  </Badge>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors leading-snug line-clamp-2">
                  {job.title}
                </h3>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                  <Eye className="h-3 w-3 text-slate-400" />
                  <strong>{job.viewsCount.toLocaleString("en-IN")}</strong> views
                </span>

                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--primary)] group-hover:underline">
                  <span>View Details</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

TrendingSection.displayName = "TrendingSection";
