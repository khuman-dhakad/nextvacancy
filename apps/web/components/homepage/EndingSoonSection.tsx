import React from "react";
import Link from "next/link";
import { JobPosting } from "@/types";
import { JobCard } from "./JobCard";
import { Button } from "@/components/ui";
import { Clock, ArrowRight } from "lucide-react";

export interface EndingSoonSectionProps {
  jobs: JobPosting[];
}

export const EndingSoonSection: React.FC<EndingSoonSectionProps> = ({ jobs }) => {
  if (!jobs || jobs.length === 0) return null;

  return (
    <section aria-labelledby="ending-soon-heading" className="space-y-4 pt-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-amber-200">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500 text-white">
              <Clock className="h-4 w-4" aria-hidden="true" />
            </div>
            <h2 id="ending-soon-heading" className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Closing Soon — Last Chance to Apply
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Vacancies expiring within the next few days. Submit before portal closure.
          </p>
        </div>

        <Link href="/search?status=ENDING_SOON">
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
            View All Closing Soon
          </Button>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
};

EndingSoonSection.displayName = "EndingSoonSection";
