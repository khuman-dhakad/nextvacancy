import React from "react";
import { JobPosting } from "@/types";
import { Badge, Button } from "@/components/ui";
import {
  Building2,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  Users,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export interface JobHeroProps {
  job: JobPosting;
  className?: string;
}

export const JobHero: React.FC<JobHeroProps> = ({ job, className = "" }) => {
  const isEndingSoon = job.status === "ENDING_SOON";
  const applyLink = job.importantLinks.find((l) => l.linkType === "apply_online")?.url;
  const pdfLink = job.importantLinks.find(
    (l) => l.linkType === "official_notification_pdf" || l.linkType === "admit_card" || l.linkType === "result_merit_list"
  )?.url;

  return (
    <section
      aria-label="Job Header Summary"
      className={["bg-white border border-[var(--border)] rounded-2xl p-5 sm:p-7 shadow-xs", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Left Column: Organization, Title, Metadata */}
        <div className="space-y-3.5 flex-1 min-w-0">
          {/* Org + Department + Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-bold">
              <Building2 className="h-3.5 w-3.5 text-[var(--primary)] shrink-0" aria-hidden="true" />
              <span>{job.organization}</span>
            </div>

            {job.department && (
              <span className="text-xs text-slate-500 hidden sm:inline">
                • {job.department}
              </span>
            )}

            <Badge
              variant={
                isEndingSoon
                  ? "warning"
                  : job.status === "OPEN"
                  ? "success"
                  : job.status === "CLOSED"
                  ? "neutral"
                  : "accent"
              }
              size="sm"
            >
              {isEndingSoon
                ? "Closing Soon"
                : job.status === "OPEN"
                ? "Active Notification"
                : job.status === "ADMIT_CARD_OUT"
                ? "Admit Card Out"
                : job.status === "RESULT_OUT"
                ? "Result Declared"
                : "Recruitment Active"}
            </Badge>

            {job.isVerified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                Verified
              </span>
            )}
          </div>

          {/* Primary H1 */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug">
            {job.title}
          </h1>

          {/* Short Summary */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            {job.shortSummary}
          </p>

          {/* Meta Dates & Vacancies Strip */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs pt-1 text-slate-600">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span>
                Total Vacancies:{" "}
                <strong className="text-slate-900 font-bold">
                  {typeof job.totalVacancies === "number"
                    ? job.totalVacancies.toLocaleString("en-IN")
                    : job.totalVacancies}
                </strong>
              </span>
            </span>

            {job.importantDates.notificationDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                <span>
                  Published:{" "}
                  <strong className="text-slate-900 font-medium">
                    {job.importantDates.notificationDate}
                  </strong>
                </span>
              </span>
            )}

            {job.importantDates.applicationEndDate && (
              <span
                className={[
                  "flex items-center gap-1.5 px-2 py-0.5 rounded-md",
                  isEndingSoon
                    ? "bg-amber-50 text-[#D97706] font-bold border border-amber-200"
                    : "text-slate-700",
                ].join(" ")}
              >
                {isEndingSoon ? (
                  <AlertTriangle className="h-3.5 w-3.5 text-[#D97706] shrink-0" aria-hidden="true" />
                ) : (
                  <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                )}
                <span>
                  Last Date:{" "}
                  <strong className={isEndingSoon ? "text-[#DC2626]" : "text-slate-900"}>
                    {job.importantDates.applicationEndDate}
                  </strong>
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Direct Actions — hidden on mobile (covered by StickyMobileApplyBar) */}
        <div className="hidden lg:flex flex-col gap-2.5 shrink-0 w-56 pt-2">
          {applyLink && (
            <a
              href={applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button
                variant="accent"
                size="md"
                fullWidth
                className="font-bold shadow-xs min-h-[44px]"
                rightIcon={<ExternalLink className="h-4 w-4" aria-hidden="true" />}
              >
                Apply Online
              </Button>
            </a>
          )}

          {pdfLink && (
            <a
              href={pdfLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button
                variant="outline"
                size="md"
                fullWidth
                className="font-semibold text-slate-700 min-h-[44px]"
                leftIcon={<Download className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />}
              >
                Download Notice
              </Button>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

JobHero.displayName = "JobHero";
