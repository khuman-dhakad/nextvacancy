import React from "react";
import type { Metadata } from "next";
import { searchJobs } from "@/services";
import { JobStatus, JobSortOption } from "@/types";
import { CategoryPageTemplate } from "@/components/search";

interface PrivateJobsPageProps {
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
  title: "Private Jobs & Corporate IT Careers 2026 — Fresher & Experienced Hiring | NEXTVACANCY",
  description:
    "Discover latest private sector employment openings, IT software engineer roles, MNC fresher drives (TCS, Infosys, Google, Wipro), private bank jobs, and corporate vacancies in India.",
  keywords: [
    "Private Jobs 2026",
    "IT Jobs India",
    "Software Engineer Freshers",
    "TCS NQT Hiring",
    "Infosys Careers",
    "Private Bank Jobs",
    "Engineering Vacancies",
  ],
  alternates: {
    canonical: "/private-jobs",
  },
  openGraph: {
    title: "Private Sector Careers & Tech Openings 2026 | NEXTVACANCY",
    description:
      "Find high-growth careers in IT, banking, core engineering, and corporate sectors.",
    url: "/private-jobs",
    type: "website",
    siteName: "NEXTVACANCY",
  },
  twitter: {
    card: "summary_large_image",
    title: "Private Sector Careers & Tech Openings 2026",
    description: "Discover verified private sector job openings and campus hiring drives.",
  },
};

export default async function PrivateJobsPage({
  searchParams,
}: PrivateJobsPageProps) {
  const params = await searchParams;
  const pageNum = parseInt(params.page || "1", 10) || 1;

  const results = await searchJobs({
    query: params.q,
    category: "private",
    status: params.status as JobStatus | "all",
    qualification: params.qualification,
    location: params.location,
    sortBy: params.sort as JobSortOption,
    page: pageNum,
    limit: 8,
  });

  return (
    <CategoryPageTemplate
      title="Private Sector Jobs & Tech Careers"
      description="Off-campus fresher recruitment drives, software engineering roles, private banking careers, and corporate openings with verified application portals."
      badgeText="Corporate & MNC Hiring"
      category="private"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Private Jobs", active: true },
      ]}
      basePath="/private-jobs"
      results={results}
      searchParams={params}
      seoText={
        <div className="space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            Private Employment & Campus Off-Campus Drives in India
          </h2>
          <p>
            India&apos;s private sector presents diverse opportunities for engineering, management, and commerce graduates. Leading information technology firms conduct nationwide assessment programs such as TCS NQT, Infosys Launchpad, and Cognizant GenC to recruit top talent.
          </p>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900">
            Application Best Practices
          </h3>
          <p>
            Candidates should ensure their resume accurately highlights technical skills, project portfolios, and relevant internships. Always apply through official company career pages without paying any recruitment charges.
          </p>
        </div>
      }
    />
  );
}
