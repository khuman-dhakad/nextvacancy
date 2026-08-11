import React from "react";
import Link from "next/link";
import { JobPosting } from "@/types";
import { JobCard } from "./JobCard";
import { Button } from "@/components/ui";
import { Bell, ArrowRight } from "lucide-react";

export interface LatestJobsSectionProps {
  jobs: JobPosting[];
}

export const LatestJobsSection: React.FC<LatestJobsSectionProps> = ({ jobs }) => {
  return (
    <section aria-labelledby="latest-notifications-heading" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--border)]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[var(--primary)] text-white">
              <Bell className="h-4 w-4" aria-hidden="true" />
            </div>
            <h2 id="latest-notifications-heading" className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Latest Recruitment Notifications
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Freshly released government and private employment vacancies
          </p>
        </div>

        <Link href="/category/government">
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
            View All Jobs
          </Button>
        </Link>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
};

LatestJobsSection.displayName = "LatestJobsSection";
