import React from "react";
import Link from "next/link";
import {
  Bookmark,
  Calendar,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Card, Badge, Button } from "@/components/ui";

import { SavedJobItem } from "@/services/dashboard/dashboard.service";
import { EmptyState } from "./EmptyState";

export interface SavedJobsTableProps {
  savedJobs: SavedJobItem[];
  className?: string;
}

export const SavedJobsTable: React.FC<SavedJobsTableProps> = ({
  savedJobs = [],
  className = "",
}) => {
  if (savedJobs.length === 0) {
    return (
      <Card id="saved-jobs" className={["bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8", className].filter(Boolean).join(" ")}>
        <EmptyState
          title="No Saved Vacancies Yet"
          description="When you discover government or private recruitment circulars, bookmark them to track eligibility, deadlines, and direct application links in one place."
          actionLabel="Explore All Vacancies"
          actionHref="/search"
        />
      </Card>
    );
  }

  return (
    <section id="saved-jobs" aria-label="Saved Vacancies Table" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Bookmark className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Bookmarked Circulars
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Saved Jobs &amp; Application Watchlist
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
            <span>{savedJobs.length} Bookmarked</span>
          </div>
        </div>

        {/* Desktop Data Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th scope="col" className="py-3.5 px-4">Authority / Commission</th>
                <th scope="col" className="py-3.5 px-4">Job Title &amp; Category</th>
                <th scope="col" className="py-3.5 px-4">Last Date to Apply</th>
                <th scope="col" className="py-3.5 px-4 text-center">Status</th>
                <th scope="col" className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {savedJobs.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  {/* Organization Column */}
                  <td className="py-4 px-4 align-top w-56">
                    <span className="text-xs font-bold text-slate-900 block leading-snug">
                      {item.organization}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 border border-emerald-200/50">
                      <ShieldCheck className="h-2.5 w-2.5" />
                      Verified
                    </span>
                  </td>

                  {/* Title & Pay Scale Column */}
                  <td className="py-4 px-4 align-top">
                    <Link
                      href={`/jobs/${item.slug}`}
                      className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors leading-snug line-clamp-2 focus-visible:underline"
                    >
                      {item.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500 font-medium">
                      <span>{typeof item.totalVacancies === "number" ? item.totalVacancies.toLocaleString("en-IN") : item.totalVacancies} Posts</span>
                      <span>•</span>
                      <span className="text-slate-600 font-semibold">{item.salaryOrStipend}</span>
                    </div>
                  </td>

                  {/* Last Date Column */}
                  <td className="py-4 px-4 align-top whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                      <Calendar className="h-3.5 w-3.5 text-red-500 shrink-0" aria-hidden="true" />
                      <span>{item.lastDate}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                      Saved {item.savedAt}
                    </span>
                  </td>

                  {/* Status Badge Column */}
                  <td className="py-4 px-4 align-top text-center">
                    <Badge
                      variant={item.status === "OPEN" ? "success" : item.status === "ENDING_SOON" ? "danger" : "neutral"}
                      size="sm"
                      className="font-bold text-[10px]"
                    >
                      {item.status === "OPEN" ? "Active" : item.status === "ENDING_SOON" ? "Closing Soon" : item.status}
                    </Badge>
                  </td>

                  {/* Action Link Column */}
                  <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                    <Link href={`/jobs/${item.slug}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-bold text-xs shadow-2xs group-hover:border-[var(--primary)] group-hover:bg-[var(--primary-subtle)] group-hover:text-[var(--primary)] transition-colors"
                        rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                      >
                        View Details
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
};

SavedJobsTable.displayName = "SavedJobsTable";
