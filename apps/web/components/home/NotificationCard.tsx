import React from "react";
import Link from "next/link";
import { JobPosting } from "@/types";
import { Card, Badge } from "@/components/ui";
import {
  Building2,
  Clock,
  ArrowRight,
  Users,
  CheckCircle2,
} from "lucide-react";

export interface NotificationCardProps {
  job: JobPosting;
  className?: string;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  job,
  className = "",
}) => {
  const isEndingSoon = job.status === "ENDING_SOON";

  return (
    <Card
      className={[
        "bg-white border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between space-y-3 group",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="space-y-2.5">
        {/* Top: Organization + Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 truncate">
            <Building2 className="h-3.5 w-3.5 text-[var(--primary)] shrink-0" aria-hidden="true" />
            <span className="truncate">{job.organization}</span>
            {job.isVerified && (
              <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" aria-hidden="true" />
            )}
          </div>
          <Badge
            variant={
              isEndingSoon
                ? "warning"
                : job.status === "OPEN"
                ? "success"
                : "accent"
            }
            size="sm"
          >
            {isEndingSoon ? "Ending Soon" : job.status === "OPEN" ? "Active" : job.status}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors leading-snug line-clamp-2">
          <Link href={`/jobs/${job.slug}`} className="focus-visible:outline-none">
            {job.title}
          </Link>
        </h3>

        {/* Department / Category */}
        {job.department && (
          <p className="text-[11px] text-slate-500 line-clamp-1">
            {job.department}
          </p>
        )}

        {/* Meta Stats Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border)] text-[11px] text-slate-600">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="truncate">
              <strong>{typeof job.totalVacancies === "number" ? job.totalVacancies.toLocaleString("en-IN") : job.totalVacancies}</strong> Posts
            </span>
          </div>
          <div className="flex items-center gap-1 text-right justify-end">
            <Clock className={`h-3 w-3 shrink-0 ${isEndingSoon ? "text-[#DC2626]" : "text-slate-400"}`} aria-hidden="true" />
            <span className={`truncate font-bold ${isEndingSoon ? "text-[#DC2626]" : "text-slate-700"}`}>
              {job.importantDates.applicationEndDate || "Check Notice"}
            </span>
          </div>
        </div>
      </div>

      {/* View Details Link Action */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">
          {job.location}
        </span>
        <Link
          href={`/jobs/${job.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)] group-hover:text-[var(--primary-hover)] transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
};

NotificationCard.displayName = "NotificationCard";
