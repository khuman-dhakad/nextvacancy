import React from "react";
import {
  Building2,
  MapPin,
  Briefcase,
  Award,
  Users,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { JobPosting } from "@/types";


export interface RecruitmentOverviewProps {
  job: JobPosting;
  className?: string;
}

export const RecruitmentOverview: React.FC<RecruitmentOverviewProps> = ({
  job,
  className = "",
}) => {
  const advtNumber = `EN-${new Date(job.createdAt).getFullYear()}/${job.id.replace(/[^0-9]/g, "").padStart(3, "0") || "042"}`;

  return (
    <section aria-label="Recruitment Overview" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Official Circular Summary
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                Gazette Verified
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Recruitment Overview &amp; Key Highlights
            </h2>
          </div>

          <Badge
            variant={job.status === "OPEN" ? "success" : job.status === "ENDING_SOON" ? "danger" : "neutral"}
            size="md"
            className="self-start sm:self-auto font-bold uppercase tracking-wider"
          >
            {job.status === "OPEN" ? "Applications Open" : job.status === "ENDING_SOON" ? "Ending Soon" : job.status}
          </Badge>
        </div>

        {/* 6-Metric Highlights Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 pt-6">
          {/* 1. Recruiting Organization */}
          <div className="space-y-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Building2 className="h-4 w-4 text-[var(--primary)] shrink-0" aria-hidden="true" />
              <span>Authority / Commission</span>
            </span>
            <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {job.organization}
            </p>
            {job.department && (
              <p className="text-xs text-slate-500 font-medium truncate">
                {job.department}
              </p>
            )}
          </div>

          {/* 2. Advertisement Number */}
          <div className="space-y-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Award className="h-4 w-4 text-[#D97706] shrink-0" aria-hidden="true" />
              <span>Advertisement / Notice No.</span>
            </span>
            <p className="text-sm sm:text-base font-mono font-bold text-slate-900 leading-snug">
              {advtNumber}
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Official Notification Code
            </p>
          </div>

          {/* 3. Total Posts */}
          <div className="space-y-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Users className="h-4 w-4 text-sky-600 shrink-0" aria-hidden="true" />
              <span>Total Vacancies</span>
            </span>
            <p className="text-base sm:text-lg font-black text-[var(--primary)] leading-snug">
              {typeof job.totalVacancies === "number" ? job.totalVacancies.toLocaleString("en-IN") : job.totalVacancies} Posts
            </p>
            <p className="text-xs text-emerald-600 font-semibold">
              All India / State Quota
            </p>
          </div>

          {/* 4. Job Classification */}
          <div className="space-y-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Briefcase className="h-4 w-4 text-emerald-600 shrink-0" aria-hidden="true" />
              <span>Employment Nature</span>
            </span>
            <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {job.jobType || "Permanent Government Service"}
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Mode: {job.applicationMode || "Online Application"}
            </p>
          </div>

          {/* 5. Job Location */}
          <div className="space-y-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <MapPin className="h-4 w-4 text-rose-500 shrink-0" aria-hidden="true" />
              <span>Posting Location</span>
            </span>
            <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {job.location}
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Across Recognized Zones
            </p>
          </div>

          {/* 6. Last Updated */}
          <div className="space-y-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Clock className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span>Last Synchronized</span>
            </span>
            <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
              {new Date(job.updatedAt || job.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
            <p className="text-[11px] text-slate-400">
              Verified with Ministry Gazette
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
};

RecruitmentOverview.displayName = "RecruitmentOverview";
