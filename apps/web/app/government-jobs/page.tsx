import React from "react";
import type { Metadata } from "next";
import { searchJobs } from "@/services";
import { JobStatus, JobSortOption } from "@/types";
import { CategoryPageTemplate } from "@/components/search";

interface GovernmentJobsPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    qualification?: string;
    location?: string;
    sort?: string;
    page?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Government Jobs (Sarkari Naukri) 2026 — Latest Central & State Vacancies | NEXTVACANCY",
  description:
    "Explore latest government job notifications (Sarkari Naukri) 2026 for UPSC, SSC, Railway (RRB), Banking (IBPS/SBI), Police, Defence, and State PSCs with eligibility, salary, and direct application links.",
  keywords: [
    "Government Jobs 2026",
    "Sarkari Naukri",
    "SSC CGL Recruitment",
    "UPSC Civil Services",
    "Railway RRB NTPC",
    "Bank PO Jobs",
    "Police Bharti",
  ],
  alternates: {
    canonical: "/government-jobs",
  },
  openGraph: {
    title: "Government Jobs 2026 — Latest Sarkari Naukri Alerts | NEXTVACANCY",
    description:
      "Find and apply for 50,000+ active central and state government vacancies across India.",
    url: "/government-jobs",
    type: "website",
    siteName: "NEXTVACANCY",
  },
  twitter: {
    card: "summary_large_image",
    title: "Government Jobs 2026 — Latest Sarkari Naukri Alerts",
    description: "Find and apply for active central and state government vacancies.",
  },
};

export default async function GovernmentJobsPage({
  searchParams,
}: GovernmentJobsPageProps) {
  const params = await searchParams;
  const pageNum = parseInt(params.page || "1", 10) || 1;

  const results = await searchJobs({
    query: params.q,
    category: "government",
    status: params.status as JobStatus | "all",
    qualification: params.qualification,
    location: params.location,
    sortBy: params.sort as JobSortOption,
    page: pageNum,
    limit: 8,
  });

  return (
    <CategoryPageTemplate
      title="Government Jobs (Sarkari Naukri) 2026"
      description="Authentic central & state government recruitment notifications, eligibility requirements, exam dates, and direct official application links."
      badgeText="Central & State Notifications"
      category="government"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Government Jobs", active: true },
      ]}
      basePath="/government-jobs"
      results={results}
      searchParams={params}
      seoText={
        <div className="space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            About Government Recruitment in India (Sarkari Naukri)
          </h2>
          <p>
            Government sector employment in India offers unmatched job security, prestige, and comprehensive allowances under the 7th Central Pay Commission. Major recruiting bodies include the Staff Selection Commission (SSC), Union Public Service Commission (UPSC), Railway Recruitment Boards (RRB), and Public Sector Banks through IBPS and SBI.
          </p>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900">
            Eligibility & Selection Stages
          </h3>
          <p>
            Most central and state examinations consist of multiple selection stages: Computer-Based Written Examination (CBT/Tier-1/Tier-2), Physical Efficiency Tests (where applicable for Defence and Police roles), Document Verification, and Medical Examination. Candidates are advised to review the official notification PDF before submitting online forms.
          </p>
        </div>
      }
    />
  );
}
