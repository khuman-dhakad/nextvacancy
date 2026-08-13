import React from "react";
import { JobPosting } from "@/types";
import { JobCard } from "@/components/homepage";
import { SectionHeader } from "./SectionHeader";

export interface JobSectionProps {
  title: string;
  description?: string;
  badge?: string;
  icon?: React.ComponentType<{ className?: string }>;
  viewAllHref?: string;
  jobs: JobPosting[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export const JobSection: React.FC<JobSectionProps> = ({
  title,
  description,
  badge,
  icon,
  viewAllHref,
  jobs = [],
  columns = 2,
  className = "",
}) => {
  if (!jobs || jobs.length === 0) return null;

  const gridColsClass =
    columns === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : columns === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2";

  return (
    <section className={["space-y-4", className].filter(Boolean).join(" ")}>
      <SectionHeader
        title={title}
        description={description}
        badge={badge}
        icon={icon}
        viewAllHref={viewAllHref}
      />

      <div className={`grid ${gridColsClass} gap-3.5 sm:gap-4`}>
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
};

JobSection.displayName = "JobSection";
