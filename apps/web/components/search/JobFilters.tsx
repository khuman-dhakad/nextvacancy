"use client";

import React, { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui";
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

export interface JobFiltersProps {
  totalResults: number;
  basePath?: string;
  hideCategoryFilter?: boolean;
  className?: string;
}

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "government", label: "Government Jobs" },
  { value: "private", label: "Private Careers" },
  { value: "admit-card", label: "Admit Cards" },
  { value: "result", label: "Exam Results" },
  { value: "answer-key", label: "Answer Keys" },
  { value: "scholarship", label: "Scholarships" },
  { value: "internship", label: "Internships" },
  { value: "apprenticeship", label: "Apprenticeships" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "OPEN", label: "Active / Open" },
  { value: "ENDING_SOON", label: "Closing Soon" },
  { value: "ADMIT_CARD_OUT", label: "Admit Card Out" },
  { value: "RESULT_OUT", label: "Result Declared" },
  { value: "ANSWER_KEY_OUT", label: "Answer Key Out" },
];

const QUALIFICATION_OPTIONS = [
  { value: "all", label: "All Qualifications" },
  { value: "10th", label: "10th / Matric Pass" },
  { value: "12th", label: "12th / Intermediate (10+2)" },
  { value: "graduate", label: "Graduate / Bachelor's Degree" },
  { value: "diploma", label: "Polytechnic / Diploma" },
  { value: "iti", label: "ITI Pass" },
  { value: "post-graduate", label: "Post Graduate / Master's" },
];

const LOCATION_OPTIONS = [
  { value: "all", label: "All Locations" },
  { value: "All India", label: "All India" },
  { value: "Delhi", label: "Delhi NCR" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Madhya Pradesh", label: "Madhya Pradesh" },
];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest / Newly Added" },
  { value: "deadline", label: "Application Deadline" },
  { value: "views", label: "Most Viewed / Popular" },
  { value: "alphabetical", label: "Alphabetical (A-Z)" },
];

export const JobFilters: React.FC<JobFiltersProps> = ({
  totalResults,
  basePath,
  hideCategoryFilter = false,
  className = "",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const activePath = basePath || pathname;

  const currentQuery = searchParams.get("q") || "";
  const currentCategory = searchParams.get("category") || "all";
  const currentStatus = searchParams.get("status") || "all";
  const currentQualification = searchParams.get("qualification") || "all";
  const currentLocation = searchParams.get("location") || "all";
  const currentSort = searchParams.get("sort") || "latest";

  // Count active non-default filters
  let activeFilterCount = 0;
  if (currentQuery) activeFilterCount++;
  if (currentCategory !== "all" && !hideCategoryFilter) activeFilterCount++;
  if (currentStatus !== "all") activeFilterCount++;
  if (currentQualification !== "all") activeFilterCount++;
  if (currentLocation !== "all") activeFilterCount++;

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page"); // Reset pagination on filter change

    const queryString = params.toString();
    startTransition(() => {
      router.push(queryString ? `${activePath}?${queryString}` : activePath, {
        scroll: false,
      });
    });
  };

  const removeFilter = (key: string) => {
    updateParam(key, "all");
  };

  const clearAllFilters = () => {
    startTransition(() => {
      router.push(activePath, { scroll: false });
    });
  };

  return (
    <div className={["space-y-3.5", className].filter(Boolean).join(" ")}>
      {/* Top Bar: Result Count + Mobile Filter Trigger + Sort Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-white border border-[var(--border)] shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-slate-800">
            {isPending ? "Filtering..." : `${totalResults} Opportunities`}
          </span>
          {activeFilterCount > 0 && (
            <Badge variant="accent" size="sm">
              {activeFilterCount} active
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Mobile Filters Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 min-h-[38px] cursor-pointer"
            aria-expanded={isMobileOpen}
            aria-controls="filter-controls-panel"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
            <span>Filters</span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${isMobileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <label htmlFor="sort-select" className="text-slate-500 hidden sm:inline font-medium">
              Sort by:
            </label>
            <select
              id="sort-select"
              aria-label="Sort jobs by"
              value={currentSort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-white text-xs font-semibold text-slate-700 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] min-h-[38px] cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filter Select Controls Grid (Always visible on desktop, toggleable on mobile) */}
      <div
        id="filter-controls-panel"
        className={[
          "grid gap-2.5 p-3 sm:p-4 rounded-xl bg-white border border-[var(--border)] shadow-2xs transition-all",
          isMobileOpen ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "hidden md:grid md:grid-cols-2 lg:grid-cols-4",
        ].join(" ")}
      >
        {/* 1. Category Filter */}
        {!hideCategoryFilter && (
          <div className="space-y-1">
            <label htmlFor="filter-category" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Category
            </label>
            <select
              id="filter-category"
              value={currentCategory}
              onChange={(e) => updateParam("category", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-slate-50 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] min-h-[40px] cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 2. Status Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-status" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Status
          </label>
          <select
            id="filter-status"
            value={currentStatus}
            onChange={(e) => updateParam("status", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-slate-50 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] min-h-[40px] cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Qualification Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-qualification" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Qualification
          </label>
          <select
            id="filter-qualification"
            value={currentQualification}
            onChange={(e) => updateParam("qualification", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-slate-50 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] min-h-[40px] cursor-pointer"
          >
            {QUALIFICATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Location Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-location" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Location
          </label>
          <select
            id="filter-location"
            value={currentLocation}
            onChange={(e) => updateParam("location", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-slate-50 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] min-h-[40px] cursor-pointer"
          >
            {LOCATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Active filters:</span>

          {currentQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 font-medium">
              <span>&ldquo;{currentQuery}&rdquo;</span>
              <button
                type="button"
                onClick={() => updateParam("q", "")}
                aria-label="Remove search query filter"
                className="hover:text-red-600 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {currentCategory !== "all" && !hideCategoryFilter && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-medium">
              <span>{CATEGORY_OPTIONS.find((c) => c.value === currentCategory)?.label}</span>
              <button
                type="button"
                onClick={() => removeFilter("category")}
                aria-label="Remove category filter"
                className="hover:text-red-600 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {currentStatus !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium">
              <span>{STATUS_OPTIONS.find((s) => s.value === currentStatus)?.label}</span>
              <button
                type="button"
                onClick={() => removeFilter("status")}
                aria-label="Remove status filter"
                className="hover:text-red-600 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {currentQualification !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 font-medium">
              <span>{QUALIFICATION_OPTIONS.find((q) => q.value === currentQualification)?.label}</span>
              <button
                type="button"
                onClick={() => removeFilter("qualification")}
                aria-label="Remove qualification filter"
                className="hover:text-red-600 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {currentLocation !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 font-medium">
              <span>{currentLocation}</span>
              <button
                type="button"
                onClick={() => removeFilter("location")}
                aria-label="Remove location filter"
                className="hover:text-red-600 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-800 hover:underline ml-1 cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear all</span>
          </button>
        </div>
      )}
    </div>
  );
};

JobFilters.displayName = "JobFilters";
