import React from "react";
import type { Metadata } from "next";
import { searchJobs } from "@/services";
import { JobStatus, JobSortOption } from "@/types";
import { CategoryPageTemplate } from "@/components/search";

interface ResultsPageProps {
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
  title: "Exam Results 2026 — Check Merit Lists, Scorecards & Cut-Off Marks | NEXTVACANCY",
  description:
    "Instant access to published exam results, cut-off marks, candidate scorecards, answer sheet verification, and roll-number wise merit lists across India.",
  keywords: [
    "Exam Results 2026",
    "Sarkari Result",
    "SSC CGL Result",
    "UPSC NDA Result",
    "RRB Scorecard",
    "Cut Off Marks",
    "Merit List PDF",
  ],
  alternates: {
    canonical: "/results",
  },
  openGraph: {
    title: "Exam Results & Merit Lists 2026 | NEXTVACANCY",
    description:
      "Check official exam results, scorecards, and qualifying cut-off marks.",
    url: "/results",
    type: "website",
    siteName: "NEXTVACANCY",
  },
  twitter: {
    card: "summary_large_image",
    title: "Exam Results & Merit Lists 2026",
    description: "Check published cut-off marks and qualified candidate merit lists.",
  },
};

export default async function ResultsPage({
  searchParams,
}: ResultsPageProps) {
  const params = await searchParams;
  const pageNum = parseInt(params.page || "1", 10) || 1;

  const results = await searchJobs({
    query: params.q,
    category: "result",
    status: params.status as JobStatus | "all",
    qualification: params.qualification,
    location: params.location,
    sortBy: params.sort as JobSortOption,
    page: pageNum,
    limit: 8,
  });

  return (
    <CategoryPageTemplate
      title="Exam Results, Merit Lists & Cut-Offs"
      description="Check published scorecards, qualifying cut-off marks, normalized scores, and roll-number wise shortlisted merit lists."
      badgeText="Official Result Declarations"
      category="result"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Exam Results", active: true },
      ]}
      basePath="/results"
      results={results}
      searchParams={params}
      seoText={
        <div className="space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            Checking Competitive Examination Results in India
          </h2>
          <p>
            When recruitment testing agencies announce results, they typically release a PDF merit list containing the roll numbers of qualified candidates along with a detailed category-wise cut-off breakdown (General, OBC, EWS, SC, ST, and PwD).
          </p>
        </div>
      }
    />
  );
}
