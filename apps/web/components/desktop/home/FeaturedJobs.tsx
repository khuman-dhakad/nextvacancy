import React from "react";
import Link from "next/link";
import { Container, Button } from "@/components/ui";
import { ArrowRight, Sparkles } from "lucide-react";
import { JobCard, FeaturedJobItem } from "./JobCard";

const FEATURED_JOBS: FeaturedJobItem[] = [
  {
    id: "job-1",
    slug: "railway-rrb-ntpc-2026-graduate-undergraduate",
    title: "RRB NTPC 2026 Recruitment for 11,558 Graduate & Undergraduate Posts",
    organization: "Railway Recruitment Boards (RRB)",
    categoryTag: "Railway Jobs",
    categoryTagStyle: "bg-rose-50 text-rose-700 border-rose-200/80",
    totalPosts: "11,558 Posts",
    qualification: "12th Pass / Graduate",
    lastDate: "20 Oct 2026",
    borderTheme: "blue",
    emblemType: "rrb",
  },
  {
    id: "job-2",
    slug: "ssc-cgl-2026-recruitment",
    title: "SSC CGL 2026 Recruitment for 14,582 Group B & C Gazette Vacancies",
    organization: "Staff Selection Commission (SSC)",
    categoryTag: "Central Commission",
    categoryTagStyle: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    totalPosts: "14,582 Posts",
    qualification: "Bachelor's Degree",
    lastDate: "24 Jul 2026",
    borderTheme: "green",
    emblemType: "ssc",
  },
  {
    id: "job-3",
    slug: "upsc-civil-services-2026-prelims",
    title: "UPSC Civil Services (IAS / IPS / IFS) Examination 2026",
    organization: "Union Public Service Commission (UPSC)",
    categoryTag: "Civil Services",
    categoryTagStyle: "bg-blue-50 text-[var(--primary)] border-blue-200/80",
    totalPosts: "1,056 Posts",
    qualification: "Any Degree",
    lastDate: "15 Jul 2026",
    borderTheme: "navy",
    emblemType: "upsc",
  },
  {
    id: "job-4",
    slug: "indian-army-agniveer-rally-2026",
    title: "Indian Army Agniveer General Duty & Technical Rally Recruitment 2026",
    organization: "Join Indian Army (MoD)",
    categoryTag: "Defence Forces",
    categoryTagStyle: "bg-amber-50 text-amber-800 border-amber-200/80",
    totalPosts: "25,000+ Posts",
    qualification: "10th / 12th Pass",
    lastDate: "05 Aug 2026",
    borderTheme: "orange",
    emblemType: "army",
  },
];

export interface FeaturedJobsProps {
  className?: string;
}

export const FeaturedJobs: React.FC<FeaturedJobsProps> = ({ className = "" }) => {
  return (
    <section
      aria-label="Featured Government Jobs"
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
              <span>Gazette Verified Circulars</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Government Recruitments
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              High-priority active notifications with verified online application portals.
            </p>
          </div>

          <Link href="/government-jobs" className="shrink-0">
            <Button
              variant="outline"
              size="md"
              className="font-bold text-xs rounded-xl shadow-2xs hover:bg-[#0F2744] hover:text-white hover:border-[#0F2744] transition-all"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              View All Govt Jobs
            </Button>
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED_JOBS.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </Container>
    </section>
  );
};

FeaturedJobs.displayName = "FeaturedJobs";
