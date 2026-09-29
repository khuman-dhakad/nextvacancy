import React from "react";
import Link from "next/link";
import { Container, Button } from "@/components/ui";
import { ArrowRight, Sparkles } from "lucide-react";
import { JobCard, FeaturedJobItem } from "./JobCard";
import { JobPosting } from "@/types";

function getEmblemType(org: string): FeaturedJobItem["emblemType"] {
  const o = org.toLowerCase();
  if (o.includes("rrb") || o.includes("railway")) return "rrb";
  if (o.includes("ssc")) return "ssc";
  if (o.includes("upsc")) return "upsc";
  if (o.includes("army")) return "army";
  return "generic";
}

export interface FeaturedJobsProps {
  jobs?: JobPosting[];
  className?: string;
}

export const FeaturedJobs: React.FC<FeaturedJobsProps> = ({ jobs = [], className = "" }) => {
  const displayItems: FeaturedJobItem[] = jobs.map((job) => ({
    id: job.id,
    slug: job.slug,
    title: job.title,
    organization: job.organization,
    categoryTag: job.category === "government" ? "Govt Gazette" : job.category,
    categoryTagStyle: "bg-blue-50 text-[var(--primary)] border-blue-200/80",
    totalPosts: `${job.totalVacancies} Posts`,
    qualification: job.qualificationSummary,
    lastDate: job.importantDates?.applicationEndDate,
    borderTheme: "navy",
    emblemType: getEmblemType(job.organization),
  }));

  return (
    <section
      aria-label="Featured job opportunities"
      className={["py-14 bg-white border-b border-slate-200", className]
        .filter(Boolean)
        .join(" ")}
    >
      <Container size="lg" className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-[var(--primary)] text-[11px] font-bold border border-blue-200/80">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              <span>Featured job listings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Opportunities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Selected records from the job catalog, with application details when provided.
            </p>
          </div>

          <Link href="/government-jobs" className="shrink-0">
            <Button
              variant="outline"
              size="md"
              className="font-bold text-xs rounded-xl shadow-2xs hover:bg-[#0F2744] hover:text-white hover:border-[#0F2744] transition-all"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              View All Jobs
            </Button>
          </Link>
        </div>

        {displayItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayItems.slice(0, 4).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <p role="status" className="text-sm font-medium text-slate-500">
            No featured government recruitments are currently available.
          </p>
        )}
      </Container>
    </section>
  );
};

FeaturedJobs.displayName = "FeaturedJobs";
