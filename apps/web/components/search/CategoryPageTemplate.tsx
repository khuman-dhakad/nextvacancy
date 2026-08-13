import React from "react";
import { PaginatedResponse, JobPosting, JobCategory } from "@/types";
import { Container, Breadcrumb } from "@/components/ui";
import { ContentWithSidebar } from "@/components/layout";
import {
  CommunitySidebarCard,
  SidebarImportantLinks,
  TrustSection,
  JobCard,
} from "@/components/homepage";
import { SearchHeroHeader } from "./SearchHeroHeader";
import { JobFilters } from "./JobFilters";
import { Pagination } from "./Pagination";
import { EmptyState } from "./EmptyState";

export interface BreadcrumbLink {
  label: string;
  href?: string;
  active?: boolean;
}

export interface CategoryPageTemplateProps {
  title: string;
  description: string;
  badgeText?: string;
  category?: JobCategory;
  breadcrumbs: BreadcrumbLink[];
  basePath: string;
  results: PaginatedResponse<JobPosting>;
  searchParams: Record<string, string | undefined>;
  seoText?: React.ReactNode;
}

export const CategoryPageTemplate: React.FC<CategoryPageTemplateProps> = ({
  title,
  description,
  badgeText,
  category,
  breadcrumbs,
  basePath,
  results,
  searchParams,
  seoText,
}) => {
  const hasFilters = Boolean(
    searchParams.q ||
      searchParams.category ||
      searchParams.status ||
      searchParams.qualification ||
      searchParams.location
  );

  return (
    <div className="bg-slate-50/50 min-h-screen flex flex-col">
      {/* 1. Hero Search Header */}
      <SearchHeroHeader
        title={title}
        description={description}
        badgeText={badgeText}
        defaultQuery={searchParams.q || ""}
        basePath={basePath}
      />

      {/* 2. Breadcrumb Navigation Bar */}
      <div className="border-b border-[var(--border)] bg-white py-3">
        <Container size="lg">
          <Breadcrumb items={breadcrumbs} />
        </Container>
      </div>

      {/* 3. Main Content Area with Sidebar */}
      <div className="flex-1">
        <ContentWithSidebar
          sidebar={
            <div className="space-y-6">
              <CommunitySidebarCard />
              <SidebarImportantLinks />
            </div>
          }
        >
          <div className="space-y-5">
            {/* Filter Bar Controls */}
            <JobFilters
              totalResults={results.total}
              basePath={basePath}
              hideCategoryFilter={Boolean(category)}
            />

            {/* Results Grid / List */}
            {results.items.length > 0 ? (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                  {results.items.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={results.page}
                  totalPages={results.totalPages}
                  basePath={basePath}
                  searchParams={searchParams}
                />
              </div>
            ) : (
              <EmptyState
                query={searchParams.q}
                category={category}
                hasFilters={hasFilters}
                basePath={basePath}
              />
            )}
          </div>
        </ContentWithSidebar>
      </div>

      {/* 4. Trust & Official Source Verification */}
      <TrustSection />

      {/* 5. Optional SEO Context text */}
      {seoText && (
        <section
          aria-label="Category Overview & Examination Guide"
          className="py-8 bg-white border-t border-[var(--border)] text-slate-700 text-xs sm:text-sm leading-relaxed"
        >
          <Container size="lg" className="max-w-5xl space-y-4">
            {seoText}
          </Container>
        </section>
      )}
    </div>
  );
};

CategoryPageTemplate.displayName = "CategoryPageTemplate";
