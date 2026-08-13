import React from "react";
import type { Metadata } from "next";
import { searchJobs } from "@/services";
import { JobCategory, JobStatus, JobSortOption } from "@/types";
import { CategoryPageTemplate } from "@/components/search";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    status?: string;
    qualification?: string;
    location?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q, category } = await searchParams;
  const queryLabel = q ? `"${q}"` : category ? `${category} vacancies` : "All Opportunities";

  return {
    title: `Search: ${queryLabel} | NEXTVACANCY`,
    description: `Search results for ${queryLabel} across government recruitments, private jobs, admit cards, and exam results in India.`,
    alternates: {
      canonical: "/search",
    },
    openGraph: {
      title: `Search: ${queryLabel} | NEXTVACANCY`,
      description: `Browse latest recruitment notifications matching ${queryLabel}.`,
      url: "/search",
      type: "website",
      siteName: "NEXTVACANCY",
    },
    twitter: {
      card: "summary_large_image",
      title: `Search: ${queryLabel}`,
      description: `Browse latest recruitment notifications matching ${queryLabel}.`,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const pageNum = parseInt(params.page || "1", 10) || 1;

  const results = await searchJobs({
    query: params.q,
    category: params.category as JobCategory | "all",
    status: params.status as JobStatus | "all",
    qualification: params.qualification,
    location: params.location,
    sortBy: params.sort as JobSortOption,
    page: pageNum,
    limit: 8,
  });

  const queryTitle = params.q
    ? `Search Results for "${params.q}"`
    : params.category && params.category !== "all"
    ? `${params.category.toUpperCase()} Vacancies`
    : "Search All Vacancies & Exams";

  return (
    <CategoryPageTemplate
      title={queryTitle}
      description="Filter and search through real-time notifications, eligibility criteria, and application deadlines across central & state departments."
      badgeText="Live Search Directory"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Search Vacancies", active: true },
      ]}
      basePath="/search"
      results={results}
      searchParams={params}
      seoText={
        <div className="space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            How to Search and Apply for Latest Vacancies
          </h2>
          <p>
            Use our interactive filter system to refine vacancies by minimum educational qualification (10th, 12th, Graduate, Diploma, ITI), state or central location, application status, and category. Click on any job card to view full notification details, age criteria, salary pay scales, and official direct application portals.
          </p>
        </div>
      }
    />
  );
}
