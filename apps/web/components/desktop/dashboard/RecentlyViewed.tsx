import React from "react";
import Link from "next/link";
import {
  History,
  Users,
  Calendar,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { Card, Badge, Button } from "@/components/ui";
import { JobPosting } from "@/types";

export interface RecentlyViewedProps {
  jobs: JobPosting[];
  className?: string;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  jobs = [],
  className = "",
}) => {
  if (!jobs || jobs.length === 0) return null;

  return (
    <section aria-label="Recently Viewed Vacancies" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <History className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Browsing Activity
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Recently Viewed Recruitments
            </h2>
          </div>

          <Link href="/search">
            <Button
              variant="outline"
              size="sm"
              className="font-bold text-xs shadow-xs"
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Browse All Vacancies
            </Button>
          </Link>
        </div>

        {/* 4-Card Horizontal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {jobs.slice(0, 4).map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between space-y-3.5 group"
            >
              <div className="space-y-2.5">
                {/* Organization & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded truncate max-w-[130px]">
                    {job.organization}
                  </span>
                  <Badge
                    variant={job.status === "OPEN" ? "success" : job.status === "ENDING_SOON" ? "danger" : "neutral"}
                    size="sm"
                    className="text-[9px] px-1.5 py-0"
                  >
                    {job.status === "OPEN" ? "Active" : job.status === "ENDING_SOON" ? "Closing" : job.status}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                  <Link href={`/jobs/${job.slug}`} className="focus-visible:underline">
                    {job.title}
                  </Link>
                </h3>

                {/* Metadata Pills */}
                <div className="space-y-1 text-[11px] text-slate-600 font-medium pt-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                    <span>
                      {typeof job.totalVacancies === "number"
                        ? `${job.totalVacancies.toLocaleString("en-IN")} Posts`
                        : `${job.totalVacancies}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                    <span className="truncate">{job.qualificationSummary}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-red-600 font-bold">
                    <Calendar className="h-3.5 w-3.5 text-red-500 shrink-0" aria-hidden="true" />
                    <span>Last Date: {job.importantDates.applicationEndDate || "Check Notice"}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link href={`/jobs/${job.slug}`} className="block w-full pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  className="font-bold text-xs border-slate-200 group-hover:border-[var(--primary)] group-hover:bg-[var(--primary-subtle)] group-hover:text-[var(--primary)] transition-colors"
                >
                  View Details
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
};

RecentlyViewed.displayName = "RecentlyViewed";
