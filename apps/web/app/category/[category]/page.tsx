import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { searchJobs } from "@/services";
import { JobCategory, JobStatus, JobSortOption } from "@/types";
import { CategoryPageTemplate } from "@/components/search";

interface CategoryDynamicPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    q?: string;
    status?: string;
    qualification?: string;
    location?: string;
    sort?: string;
    page?: string;
  }>;
}

const CATEGORY_META_CONFIG: Record<
  string,
  { title: string; description: string; badge: string; canonicalCategory: JobCategory }
> = {
  government: {
    title: "Government Jobs (Sarkari Naukri) 2026",
    description: "Central and State government recruitment notifications, SSC, UPSC, Railway, Banking and State PSC vacancies.",
    badge: "Central & State Vacancies",
    canonicalCategory: "government",
  },
  private: {
    title: "Private Careers & IT Jobs 2026",
    description: "Software engineer vacancies, MNC hiring, corporate roles, and private banking careers in India.",
    badge: "Corporate & Tech Hiring",
    canonicalCategory: "private",
  },
  "admit-card": {
    title: "Admit Cards & Exam Hall Tickets 2026",
    description: "Direct official download links for CBT admit cards, roll numbers, and examination city intimation slips.",
    badge: "Hall Tickets & Exam Dates",
    canonicalCategory: "admit-card",
  },
  result: {
    title: "Exam Results & Merit Lists 2026",
    description: "Published cut-off marks, scorecards, merit lists, and answer sheet links across national testing agencies.",
    badge: "Declared Results & Cut-Offs",
    canonicalCategory: "result",
  },
  "answer-key": {
    title: "Official Exam Answer Keys 2026",
    description: "Official tentative and final response sheets, objection challenge windows, and answer keys.",
    badge: "Official Answer Sheets",
    canonicalCategory: "answer-key",
  },
  scholarship: {
    title: "National & State Scholarships 2026",
    description: "NSP schemes, higher education financial grants, fee reimbursement, and merit fellowships in India.",
    badge: "Scholarships & Grants",
    canonicalCategory: "scholarship",
  },
  internship: {
    title: "Paid Internships & PM Internship Scheme 2026",
    description: "Prime Minister's internship programs, corporate trainee stipends, and youth apprenticeship initiatives.",
    badge: "Youth Training & Stipends",
    canonicalCategory: "internship",
  },
  apprenticeship: {
    title: "Apprenticeship Openings 2026",
    description: "Trade, Graduate, and Technician apprenticeship training in PSUs including BHEL, Railways, and IOCL.",
    badge: "PSU & Trade Apprenticeships",
    canonicalCategory: "apprenticeship",
  },
};

export async function generateMetadata({
  params,
}: CategoryDynamicPageProps): Promise<Metadata> {
  const { category } = await params;
  const config = CATEGORY_META_CONFIG[category];

  if (!config) {
    return {
      title: "Category | NEXTVACANCY",
    };
  }

  return {
    title: `${config.title} | NEXTVACANCY`,
    description: config.description,
    alternates: {
      canonical: `/category/${category}`,
    },
    openGraph: {
      title: `${config.title} | NEXTVACANCY`,
      description: config.description,
      url: `/category/${category}`,
      type: "website",
      siteName: "NEXTVACANCY",
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
    },
  };
}

export default async function DynamicCategoryPage({
  params,
  searchParams,
}: CategoryDynamicPageProps) {
  const { category } = await params;
  const config = CATEGORY_META_CONFIG[category];

  if (!config) {
    notFound();
  }

  const sParams = await searchParams;
  const pageNum = parseInt(sParams.page || "1", 10) || 1;

  const results = await searchJobs({
    query: sParams.q,
    category: config.canonicalCategory,
    status: sParams.status as JobStatus | "all",
    qualification: sParams.qualification,
    location: sParams.location,
    sortBy: sParams.sort as JobSortOption,
    page: pageNum,
    limit: 8,
  });

  return (
    <CategoryPageTemplate
      title={config.title}
      description={config.description}
      badgeText={config.badge}
      category={config.canonicalCategory}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: config.title, active: true },
      ]}
      basePath={`/category/${category}`}
      results={results}
      searchParams={sParams}
    />
  );
}
