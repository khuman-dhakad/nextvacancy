import React from "react";
import Link from "next/link";
import { JobPosting } from "@/types";
import { JobCard } from "./JobCard";
import { Button } from "@/components/ui";
import { Building2, Briefcase, ArrowRight } from "lucide-react";

export interface GovtAndPrivateSplitSectionProps {
  govtJobs: JobPosting[];
  privateJobs: JobPosting[];
}

export const GovtAndPrivateSplitSection: React.FC<GovtAndPrivateSplitSectionProps> = ({
  govtJobs,
  privateJobs,
}) => {
  return (
    <section aria-labelledby="sector-split-heading" className="space-y-6 pt-4">
      <h2 id="sector-split-heading" className="sr-only">
        Government and Private Sector Jobs
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Government Jobs Column */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-amber-100 text-[#D97706]">
                <Building2 className="h-4 w-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Government Jobs
              </h3>
            </div>
            <Link href="/category/government">
              <Button variant="ghost" size="sm" className="text-xs text-[var(--primary)] p-0 h-auto font-bold hover:underline">
                View All <ArrowRight className="h-3 w-3 inline ml-0.5" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {govtJobs.slice(0, 3).map((job) => (
              <JobCard key={job.id} job={job} compact />
            ))}
          </div>
        </div>

        {/* Private Jobs Column */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-blue-200">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-blue-100 text-[#1D4ED8]">
                <Briefcase className="h-4 w-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Private & Tech Careers
              </h3>
            </div>
            <Link href="/category/private">
              <Button variant="ghost" size="sm" className="text-xs text-[#1D4ED8] p-0 h-auto font-bold hover:underline">
                View All <ArrowRight className="h-3 w-3 inline ml-0.5" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {privateJobs.slice(0, 3).map((job) => (
              <JobCard key={job.id} job={job} compact />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

GovtAndPrivateSplitSection.displayName = "GovtAndPrivateSplitSection";
