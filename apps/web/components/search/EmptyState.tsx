import React from "react";
import Link from "next/link";
import { Button, Card, CardContent } from "@/components/ui";
import { SearchX, RotateCcw, ArrowRight, Building2 } from "lucide-react";

export interface EmptyStateProps {
  query?: string;
  category?: string;
  hasFilters?: boolean;
  basePath?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  query,
  category,
  hasFilters = false,
  basePath = "/search",
  className = "",
}) => {
  const displayCategory = category ? `${category} ` : "";
  return (
    <Card className={["bg-white border-[var(--border)] text-center py-10 px-6 sm:py-14 sm:px-10", className].filter(Boolean).join(" ")}>
      <CardContent className="max-w-md mx-auto space-y-4 p-0">
        <div className="p-3.5 w-fit mx-auto rounded-2xl bg-amber-50 text-[#D97706] shadow-xs">
          <SearchX className="h-8 w-8" aria-hidden="true" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {query
              ? `No ${displayCategory}vacancies found for "${query}"`
              : `No matching ${displayCategory}recruitment records found`}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {hasFilters
              ? "We couldn't find any opportunities matching your specific combination of filters. Try clearing some filters or searching with broader keywords."
              : `There are currently no active listings in this ${displayCategory || ""}category. Check back soon or explore other opportunities.`}
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          {hasFilters && (
            <Link href={basePath}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
              >
                Clear All Filters
              </Button>
            </Link>
          )}

          <Link href="/government-jobs">
            <Button
              variant="accent"
              size="sm"
              leftIcon={<Building2 className="h-3.5 w-3.5" />}
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Explore Govt Jobs
            </Button>
          </Link>
        </div>

        {/* Popular Search Suggestions */}
        <div className="pt-4 border-t border-slate-100 text-left space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Popular Searches
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {[
              { label: "SSC CGL 2026", q: "SSC CGL" },
              { label: "RRB NTPC", q: "RRB" },
              { label: "Bank PO", q: "Bank" },
              { label: "UPSC CSE", q: "UPSC" },
              { label: "Police Constable", q: "Police" },
            ].map((s) => (
              <Link
                key={s.label}
                href={`/search?q=${encodeURIComponent(s.q)}`}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 hover:bg-[var(--primary-subtle)] hover:text-[var(--primary)] text-slate-700 transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

EmptyState.displayName = "EmptyState";
