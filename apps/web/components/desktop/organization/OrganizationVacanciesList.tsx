"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Calendar,
  Users,
  Banknote,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { Card, Button } from "@/components/ui";
import { JobPosting } from "@/types";

export interface OrganizationVacanciesListProps {
  organizationName: string;
  organizationShortName: string;
  jobs: JobPosting[];
  className?: string;
}

export const OrganizationVacanciesList: React.FC<OrganizationVacanciesListProps> = ({
  organizationName,
  organizationShortName,
  jobs = [],
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<"ALL" | "OPEN" | "ENDING_SOON">("ALL");

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === "OPEN") return job.status === "OPEN";
    if (activeTab === "ENDING_SOON") return job.status === "ENDING_SOON";
    return true;
  });

  return (
    <section aria-label={`${organizationName} Vacancies & Notifications`} className={className}>
      <Card className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-xs space-y-6">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="h-5 w-5 text-[var(--primary)]" />
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Latest Recruitment Circulars &amp; Vacancies
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Verified gazette notifications published by {organizationShortName}
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              className={[
                "px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer",
                activeTab === "ALL"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900",
              ].join(" ")}
            >
              All ({jobs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("OPEN")}
              className={[
                "px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer",
                activeTab === "OPEN"
                  ? "bg-white text-emerald-700 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900",
              ].join(" ")}
            >
              Active ({jobs.filter((j) => j.status === "OPEN").length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ENDING_SOON")}
              className={[
                "px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer",
                activeTab === "ENDING_SOON"
                  ? "bg-white text-rose-700 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900",
              ].join(" ")}
            >
              Ending Soon ({jobs.filter((j) => j.status === "ENDING_SOON").length})
            </button>
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
            <Briefcase className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">
              No circulars currently open for this filter
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              New vacancy announcements from {organizationShortName} will automatically be indexed and listed here upon gazette release.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const isEndingSoon = job.status === "ENDING_SOON";

              return (
                <div
                  key={job.id}
                  className="p-5 sm:p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-[var(--primary)] hover:shadow-md transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
                >
                  {/* Left Job Info */}
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-[var(--primary)] border border-blue-200">
                        <Users className="h-3 w-3" />
                        <span>{job.totalVacancies.toLocaleString("en-IN")} Posts</span>
                      </span>

                      {isEndingSoon ? (
                        <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 animate-pulse">
                          Ending Soon
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Applications Open
                        </span>
                      )}

                      {job.jobType && (
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          {job.jobType}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/jobs/${job.slug}`}
                      className="text-base sm:text-lg font-black text-slate-900 hover:text-[var(--primary)] transition-colors leading-snug block line-clamp-2"
                    >
                      {job.title}
                    </Link>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold text-slate-600">
                      {job.salaryOrStipend && (
                        <div className="flex items-center gap-1.5 truncate">
                          <Banknote className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{job.salaryOrStipend}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 truncate">
                        <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{job.qualificationSummary}</span>
                      </div>

                      <div className="flex items-center gap-1.5 truncate">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>Last Date: {job.importantDates.applicationEndDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Action Button */}
                  <div className="shrink-0 pt-2 lg:pt-0">
                    <Link href={`/jobs/${job.slug}`}>
                      <Button
                        variant="primary"
                        size="md"
                        className="w-full sm:w-auto bg-[#0F2744] hover:bg-[#183B66] text-white font-bold text-xs shadow-xs"
                        rightIcon={<ArrowRight className="h-4 w-4" />}
                      >
                        View Details &amp; Apply
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </section>
  );
};

OrganizationVacanciesList.displayName = "OrganizationVacanciesList";
