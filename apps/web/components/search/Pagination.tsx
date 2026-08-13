import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") {
        params.set(key, value);
      }
    });
    if (page > 1) {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (typeof i === "number") {
        if (l !== undefined) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push("...");
          }
        }
        rangeWithDots.push(i);
        l = i;
      }
    }

    return rangeWithDots;
  };

  const pages = getPageNumbers();
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Pagination Navigation"
      className={["flex items-center justify-center gap-1.5 py-6", className]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Previous Button */}
      {hasPrevious ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          aria-label="Go to previous page"
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-xs font-medium text-slate-400 cursor-not-allowed min-h-[40px]"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`dots-${index}`}
                aria-hidden="true"
                className="px-2 py-1 text-xs font-bold text-slate-400 select-none"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isCurrent = pageNum === currentPage;

          return (
            <Link
              key={pageNum}
              href={createPageUrl(pageNum)}
              aria-label={`Page ${pageNum}`}
              aria-current={isCurrent ? "page" : undefined}
              className={[
                "inline-flex items-center justify-center h-10 w-10 rounded-lg text-xs font-bold transition-colors select-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                isCurrent
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "border border-[var(--border)] bg-white text-slate-700 hover:bg-slate-50 hover:text-[var(--primary)] hover:border-[var(--primary)]",
              ].join(" ")}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {hasNext ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          aria-label="Go to next page"
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-xs font-medium text-slate-400 cursor-not-allowed min-h-[40px]"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </span>
      )}
    </nav>
  );
};

Pagination.displayName = "Pagination";
