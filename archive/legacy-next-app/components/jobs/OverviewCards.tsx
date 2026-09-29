import React from "react";
import { JobPosting } from "@/types";
import {
  Users,
  Briefcase,
  MapPin,
  Clock,
  IndianRupee,
  Globe,
} from "lucide-react";

export interface OverviewCardsProps {
  job: JobPosting;
  className?: string;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  job,
  className = "",
}) => {
  const cards = [
    {
      label: "Total Vacancies",
      value:
        typeof job.totalVacancies === "number"
          ? `${job.totalVacancies.toLocaleString("en-IN")} Posts`
          : job.totalVacancies,
      icon: Users,
      highlight: false,
    },
    {
      label: "Job Type / Nature",
      value: job.jobType || (job.category === "government" ? "Permanent / Regular" : "Full Time"),
      icon: Briefcase,
      highlight: false,
    },
    {
      label: "Job Location",
      value: job.location,
      icon: MapPin,
      highlight: false,
    },
    {
      label: "Application Last Date",
      value: job.importantDates.applicationEndDate || "Check Official Notification",
      icon: Clock,
      highlight: Boolean(job.status === "ENDING_SOON"),
    },
    {
      label: "Salary / Pay Scale",
      value: job.salaryOrStipend,
      icon: IndianRupee,
      highlight: false,
    },
    {
      label: "Application Mode",
      value: job.applicationMode || "Online Application",
      icon: Globe,
      highlight: false,
    },
  ];

  return (
    <section aria-label="Quick Highlights" className={className}>
      <h2 className="sr-only">Recruitment Quick Overview</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {cards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={[
                "p-3.5 rounded-xl border bg-white shadow-2xs transition-colors flex flex-col justify-between space-y-1.5",
                item.highlight
                  ? "border-red-200 bg-red-50/30"
                  : "border-[var(--border)]",
              ].join(" ")}
            >
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                <Icon
                  className={[
                    "h-3.5 w-3.5 shrink-0",
                    item.highlight ? "text-[#DC2626]" : "text-[var(--primary)]",
                  ].join(" ")}
                  aria-hidden="true"
                />
                <span className="truncate">{item.label}</span>
              </div>
              <p
                className={[
                  "text-xs sm:text-sm font-black leading-tight line-clamp-2",
                  item.highlight ? "text-[#DC2626]" : "text-slate-900",
                ].join(" ")}
                title={item.value}
              >
                {item.value}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

OverviewCards.displayName = "OverviewCards";
