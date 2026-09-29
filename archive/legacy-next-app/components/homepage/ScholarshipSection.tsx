import React from "react";
import Link from "next/link";
import { JobPosting } from "@/types";
import { JobCard } from "./JobCard";
import { GraduationCap, ArrowRight } from "lucide-react";

export interface ScholarshipSectionProps {
  opportunities: JobPosting[];
}

export const ScholarshipSection: React.FC<ScholarshipSectionProps> = ({
  opportunities,
}) => {
  if (!opportunities || opportunities.length === 0) return null;

  return (
    <section aria-labelledby="scholarships-internships-heading" className="space-y-4 pt-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-indigo-200">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
            </div>
            <h2 id="scholarships-internships-heading" className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Scholarships & Paid Internship Schemes
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Higher education grants, national fellowship portals, and PM youth internship programs
          </p>
        </div>

        <Link
          href="/category/scholarship"
          className="text-xs font-bold text-indigo-700 hover:underline inline-flex items-center gap-1"
        >
          <span>View All Schemes</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {opportunities.map((item) => (
          <JobCard key={item.id} job={item} />
        ))}
      </div>
    </section>
  );
};

ScholarshipSection.displayName = "ScholarshipSection";
