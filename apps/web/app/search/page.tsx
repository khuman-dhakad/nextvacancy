import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { searchJobs } from "@/services";
import { JobCategory, JobStatus } from "@/types";
import { Container, Breadcrumb, Button } from "@/components/ui";
import { JobCard } from "@/components/homepage";
import { Search, ArrowLeft, Filter } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    status?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const queryText = q ? `"${q}"` : "All Vacancies";
  return {
    title: `Search: ${queryText} | NEXTVACANCY`,
    description: `Search results for ${queryText} across government jobs, admit cards, and results.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, category, status } = await searchParams;

  const results = await searchJobs({
    query: q,
    category: category as JobCategory | "all",
    status: status as JobStatus,
    limit: 20,
  });

  return (
    <div className="py-6 sm:py-8 bg-slate-50/50 min-h-[60vh]">
      <Container size="lg" className="space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Search Vacancies", active: true },
          ]}
        />

        {/* Search Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Search className="h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
                <span>{q ? `Search Results for "${q}"` : "Search All Vacancies"}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 pt-1">
                Showing {results.total} matching recruitment notifications
              </p>
            </div>

            <Link href="/">
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Search Form */}
          <form
            action="/search"
            method="GET"
            role="search"
            className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-xl bg-white shadow-xs border border-slate-200"
          >
            <div className="relative flex-1 w-full flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" aria-hidden="true" />
              <input
                type="search"
                name="q"
                defaultValue={q || ""}
                placeholder="Search by post, exam, or organization..."
                aria-label="Search vacancies"
                className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none rounded-lg"
              />
            </div>
            <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto px-6">
              Search
            </Button>
          </form>
        </div>

        {/* Results Grid */}
        {results.items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.items.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 rounded-2xl bg-white border border-[var(--border)] space-y-3">
            <div className="p-3 w-fit mx-auto rounded-full bg-slate-100 text-slate-400">
              <Filter className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No matching vacancies found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try searching with broader terms like &quot;SSC&quot;, &quot;UPSC&quot;, &quot;Railway&quot;, or &quot;Bank&quot;.
            </p>
            <Link href="/" className="inline-block pt-2">
              <Button variant="accent" size="sm">
                Explore All Opportunities
              </Button>
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
