import React from "react";
import Link from "next/link";
import { JobPosting, JobStatus } from "@/types";
import { Badge, Card, CardContent } from "@/components/ui";
import {
  Building2,
  MapPin,
  Calendar,
  GraduationCap,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileCheck,
} from "lucide-react";

export interface JobCardProps {
  job: JobPosting;
  compact?: boolean;
  className?: string;
}

const statusBadgeConfig: Record<
  JobStatus,
  { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" | "accent"; icon: React.ComponentType<{ className?: string }> }
> = {
  OPEN: { label: "Active / Open", variant: "success", icon: CheckCircle2 },
  ENDING_SOON: { label: "Closing Soon", variant: "warning", icon: Clock },
  CLOSED: { label: "Application Closed", variant: "danger", icon: AlertCircle },
  ADMIT_CARD_OUT: { label: "Admit Card Out", variant: "info", icon: FileCheck },
  RESULT_OUT: { label: "Result Declared", variant: "accent", icon: Sparkles },
  ANSWER_KEY_OUT: { label: "Answer Key Out", variant: "info", icon: FileCheck },
};

export const JobCard: React.FC<JobCardProps> = ({
  job,
  compact = false,
  className = "",
}) => {
  const statusConfig = statusBadgeConfig[job.status] || statusBadgeConfig.OPEN;
  const StatusIcon = statusConfig.icon;

  const lastDate =
    job.importantDates.applicationEndDate ||
    job.importantDates.examDate ||
    job.importantDates.admitCardDate ||
    job.importantDates.resultDate;

  return (
    <Card hoverable className={["bg-white border-[var(--border)] overflow-hidden", className].filter(Boolean).join(" ")}>
      <CardContent className={compact ? "p-4 space-y-2.5" : "p-4 sm:p-5 space-y-3"}>
        {/* Header Row: Organization & Status Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="truncate max-w-[200px] sm:max-w-[280px]">
              {job.organization}
            </span>
          </div>

          <Badge
            variant={statusConfig.variant}
            size="sm"
            leftIcon={<StatusIcon className="h-3 w-3" />}
          >
            {statusConfig.label}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group">
          <Link
            href={`/jobs/${job.slug}`}
            className="hover:text-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:underline"
          >
            {job.title}
          </Link>
        </h3>

        {/* Quick Meta Info */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
          {job.totalVacancies && (
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-slate-400 font-medium">Posts:</span>
              <span className="font-semibold text-slate-800">
                {typeof job.totalVacancies === "number"
                  ? job.totalVacancies.toLocaleString("en-IN")
                  : job.totalVacancies}
              </span>
            </div>
          )}

          {job.location && (
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="h-3 w-3 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="truncate">{job.location}</span>
            </div>
          )}

          {job.qualificationSummary && (
            <div className="col-span-2 flex items-start gap-1.5 text-[11px] text-slate-500 pt-0.5">
              <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
              <span className="line-clamp-1">{job.qualificationSummary}</span>
            </div>
          )}
        </div>

        {/* Footer Row: Last Date & CTA */}
        <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Calendar className="h-3 w-3 text-slate-400 shrink-0" aria-hidden="true" />
            <span>
              {job.status === "RESULT_OUT"
                ? "Declared: "
                : job.status === "ADMIT_CARD_OUT"
                ? "Exam: "
                : "Last Date: "}
              <strong className="text-slate-800">{lastDate || "Check Notice"}</strong>
            </span>
          </div>

          <Link
            href={`/jobs/${job.slug}`}
            className="inline-flex items-center gap-1 font-bold text-xs text-[var(--primary)] hover:text-[var(--primary-hover)] hover:underline select-none shrink-0"
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

JobCard.displayName = "JobCard";
