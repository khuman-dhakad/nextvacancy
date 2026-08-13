import React from "react";
import { JobPosting } from "@/types";
import { JobCard } from "@/components/homepage";
import { Sparkles } from "lucide-react";

export interface RelatedJobsProps {
  jobs: JobPosting[];
  categoryTitle?: string;
  className?: string;
}

export const RelatedJobs: React.FC<RelatedJobsProps> = ({
  jobs,
  categoryTitle = "Related Opportunities",
  className = "",
}) => {
  if (!jobs || jobs.length === 0) return null;

  return (
    <section aria-label="Related Vacancies" className={["space-y-4 pt-2", className].filter(Boolean).join(" ")}>
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#D97706]" aria-hidden="true" />
          <span>{categoryTitle}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {jobs.slice(0, 4).map((job) => (
          <JobCard key={job.id} job={job} compact />
        ))}
      </div>
    </section>
  );
};

RelatedJobs.displayName = "RelatedJobs";
