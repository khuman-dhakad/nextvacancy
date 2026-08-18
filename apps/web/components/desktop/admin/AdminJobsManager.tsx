"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { JobPosting, JobCategory, JobStatus } from "@/types";
import { AdminJobFilters } from "./AdminJobFilters";
import { AdminJobsTable } from "./AdminJobsTable";

export interface AdminJobsManagerProps {
  initialJobs: JobPosting[];
  className?: string;
}

export const AdminJobsManager: React.FC<AdminJobsManagerProps> = ({
  initialJobs = [],
  className = "",
}) => {
  const jobs = initialJobs;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<JobStatus | "all">("all");
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filtered & Sorted items
  const processedJobs = useMemo(() => {
    let filtered = [...jobs];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(q) ||
          job.organization.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q) ||
          job.qualificationSummary.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((job) => job.category === selectedCategory);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((job) => job.status === selectedStatus);
    }

    filtered.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "organization") return a.organization.localeCompare(b.organization);
      if (sortBy === "deadline") {
        const dA = a.importantDates.applicationEndDate || "9999-12-31";
        const dB = b.importantDates.applicationEndDate || "9999-12-31";
        return dA.localeCompare(dB);
      }
      if (sortBy === "views") return (b.viewsCount || 0) - (a.viewsCount || 0);
      // default: latest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return filtered;
  }, [jobs, searchQuery, selectedCategory, selectedStatus, sortBy]);

  const total = processedJobs.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const paginatedJobs = useMemo(() => {
    const offset = (page - 1) * pageSize;
    return processedJobs.slice(offset, offset + pageSize);
  }, [processedJobs, page, pageSize]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSortBy("latest");
    setPage(1);
  };

  return (
    <div className={["space-y-6", className].filter(Boolean).join(" ")}>
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Recruitment CMS &amp; Vacancy Inventory
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Search, filter, edit, duplicate, or bulk update all published and draft recruitment postings.
          </p>
        </div>

        <Link href="/admin/jobs/new">
          <Button
            variant="primary"
            size="md"
            className="bg-[#0F2744] hover:bg-[#183B66] text-white font-bold text-xs shadow-xs"
            leftIcon={<PlusCircle className="h-4 w-4" />}
          >
            Create New Job
          </Button>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <AdminJobFilters
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        selectedCategory={selectedCategory}
        onCategoryChange={(c) => {
          setSelectedCategory(c);
          setPage(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(s) => {
          setSelectedStatus(s);
          setPage(1);
        }}
        sortBy={sortBy}
        onSortChange={(sb) => {
          setSortBy(sb);
          setPage(1);
        }}
        onReset={handleReset}
      />

      {/* Data Table */}
      <AdminJobsTable
        jobs={paginatedJobs}
        total={total}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};

AdminJobsManager.displayName = "AdminJobsManager";
