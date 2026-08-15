import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui";
import { ArrowRight } from "lucide-react";
import { JobCard, FeaturedJobItem } from "./JobCard";

const FEATURED_JOBS_DATA: FeaturedJobItem[] = [
  {
    id: "rrb-ntpc",
    slug: "railway-rrb-ntpc-2026-graduate-undergraduate",
    title: "RRB NTPC Graduate Recruitment 2025",
    organization: "Railway Recruitment Control Board",
    categoryTag: "Railway",
    categoryTagStyle: "bg-blue-50 text-[var(--secondary)] border-blue-200/80",
    totalPosts: "8113 Posts",
    qualification: "Graduate",
    lastDate: "20-11-2025",
    borderTheme: "blue",
    emblemType: "rrb",
  },
  {
    id: "ssc-cgl",
    slug: "ssc-cgl-2026-recruitment",
    title: "SSC CGL 2026 Combined Graduate Level",
    organization: "Staff Selection Commission (SSC)",
    categoryTag: "SSC",
    categoryTagStyle: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    totalPosts: "14582 Posts",
    qualification: "Any Graduate",
    lastDate: "04-07-2026",
    borderTheme: "green",
    emblemType: "ssc",
  },
  {
    id: "upsc-cse",
    slug: "upsc-civil-services-2026-prelims",
    title: "UPSC Civil Services (IAS/IPS/IFS) 2026",
    organization: "Union Public Service Commission",
    categoryTag: "UPSC",
    categoryTagStyle: "bg-blue-50 text-[#0F2744] border-blue-200/80",
    totalPosts: "979 Posts",
    qualification: "Graduate",
    lastDate: "18-02-2026",
    borderTheme: "navy",
    emblemType: "upsc",
  },
  {
    id: "army-agniveer",
    slug: "indian-army-agniveer-recruitment-2025",
    title: "Indian Army Agniveer Recruitment 2025",
    organization: "Indian Army Recruitment Directorate",
    categoryTag: "Defence",
    categoryTagStyle: "bg-amber-50 text-[#D97706] border-amber-200/80",
    totalPosts: "25000+ Posts",
    qualification: "10th/12th",
    lastDate: "10-08-2025",
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
      className={["py-10 bg-[#F8FAFC]", className].filter(Boolean).join(" ")}
    >
      <Container size="lg" className="space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-center sm:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured <span className="text-[#F59E0B]">Government Jobs</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Handpicked latest opportunities from verified sources
            </p>
          </div>

          <Link
            href="/government-jobs"
            className="text-xs sm:text-sm font-bold text-[#1D4ED8] hover:underline inline-flex items-center justify-center gap-1 group whitespace-nowrap"
          >
            <span>View All Jobs</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
        </div>

        {/* 4-Column Grid matching reference image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED_JOBS_DATA.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </Container>
    </section>
  );
};

FeaturedJobs.displayName = "FeaturedJobs";
