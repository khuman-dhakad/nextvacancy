"use client";

import React from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input, Button } from "@/components/ui";

import { JobCategory, JobStatus } from "@/types";

export interface AdminJobFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: JobCategory | "all";
  onCategoryChange: (cat: JobCategory | "all") => void;
  selectedStatus: JobStatus | "all";
  onStatusChange: (status: JobStatus | "all") => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onReset: () => void;
  className?: string;
}

const CATEGORIES: { value: JobCategory | "all"; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "government", label: "Government Jobs" },
  { value: "private", label: "Private Jobs" },
  { value: "admit-card", label: "Admit Cards" },
  { value: "result", label: "Results" },
  { value: "answer-key", label: "Answer Keys" },
  { value: "scholarship", label: "Scholarships" },
  { value: "internship", label: "Internships" },
];

const STATUSES: { value: JobStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "OPEN", label: "Active (OPEN)" },
  { value: "ENDING_SOON", label: "Ending Soon" },
  { value: "CLOSED", label: "Closed / Draft" },
  { value: "ADMIT_CARD_OUT", label: "Admit Card Out" },
  { value: "RESULT_OUT", label: "Result Out" },
];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest Created" },
  { value: "title", label: "Job Title (A-Z)" },
  { value: "organization", label: "Organization (A-Z)" },
  { value: "deadline", label: "Application Deadline" },
  { value: "views", label: "Most Viewed" },
];

export const AdminJobFilters: React.FC<AdminJobFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  onReset,
  className = "",
}) => {
  return (
    <div
      aria-label="CMS Job Filters"
      className={["p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3", className].filter(Boolean).join(" ")}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="lg:col-span-5">
          <Input
            type="text"
            placeholder="Search by title, commission, location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-slate-400" />}
            fullWidth
          />
        </div>

        {/* Category Dropdown */}
        <div className="lg:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as JobCategory | "all")}
            aria-label="Filter by recruitment category"
            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="lg:col-span-2">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as JobStatus | "all")}
            aria-label="Filter by publication status"
            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="lg:col-span-2 flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort recruitment records"
            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            title="Reset Filters"
            aria-label="Reset all search filters"
            className="p-2 text-slate-400 hover:text-slate-700 shrink-0"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

AdminJobFilters.displayName = "AdminJobFilters";
