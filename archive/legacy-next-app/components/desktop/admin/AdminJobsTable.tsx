"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Edit3,
  Copy,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Eye,
  CheckSquare,
  Square,
  AlertCircle,
} from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { JobPosting, JobStatus } from "@/types";
import {
  toggleJobStatusAction,
  duplicateJobAction,
  deleteJobAction,
  bulkUpdateStatusAction,
  bulkDeleteAction,
} from "@/app/admin/actions";
import { AdminDeleteModal } from "./AdminDeleteModal";

export interface AdminJobsTableProps {
  jobs: JobPosting[];
  total: number;
  page: number;
  pageSize?: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  className?: string;
}

export const AdminJobsTable: React.FC<AdminJobsTableProps> = ({
  jobs,
  total,
  page,
  totalPages,
  onPageChange,
  className = "",
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    jobId?: string;
    jobTitle?: string;
    isBulk?: boolean;
  }>({ isOpen: false });
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === jobs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(jobs.map((j) => j.id));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleStatus = async (id: string, currentStatus: JobStatus) => {
    const newStatus = currentStatus === "OPEN" ? "CLOSED" : "OPEN";
    setIsProcessing(true);
    const res = await toggleJobStatusAction(id, newStatus);
    setIsProcessing(false);
    if (res.success) {
      showFeedback(`Status updated to ${newStatus}`);
    }
  };

  const handleDuplicate = async (id: string) => {
    setIsProcessing(true);
    const res = await duplicateJobAction(id);
    setIsProcessing(false);
    if (res.success) {
      showFeedback("Job cloned as draft.");
    }
  };

  const handleDeleteConfirm = async () => {
    setIsProcessing(true);
    if (deleteModalState.isBulk) {
      const res = await bulkDeleteAction(selectedIds);
      if (res.success) {
        setSelectedIds([]);
        showFeedback(res.message || "Bulk deletion completed.");
      }
    } else if (deleteModalState.jobId) {
      const res = await deleteJobAction(deleteModalState.jobId);
      if (res.success) {
        showFeedback("Job posting deleted.");
      }
    }
    setIsProcessing(false);
    setDeleteModalState({ isOpen: false });
  };

  const handleBulkStatus = async (status: JobStatus) => {
    if (selectedIds.length === 0) return;
    setIsProcessing(true);
    const res = await bulkUpdateStatusAction(selectedIds, status);
    setIsProcessing(false);
    if (res.success) {
      showFeedback(res.message || "Bulk status updated.");
    }
  };

  const isAllSelected = jobs.length > 0 && selectedIds.length === jobs.length;

  return (
    <div className={["space-y-4", className].filter(Boolean).join(" ")}>
      {/* Toast Feedback */}
      {actionFeedback && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{actionFeedback}</span>
          </div>
        </div>
      )}

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-slate-900 text-white rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-md animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold pl-2">
            <CheckSquare className="h-4 w-4 text-amber-400" />
            <span>{selectedIds.length} of {jobs.length} jobs selected</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatus("OPEN")}
              disabled={isProcessing}
              className="text-xs font-bold text-slate-900 bg-white hover:bg-slate-100"
            >
              Publish Selected
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatus("CLOSED")}
              disabled={isProcessing}
              className="text-xs font-bold text-slate-900 bg-white hover:bg-slate-100"
            >
              Draft Selected
            </Button>

            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() =>
                setDeleteModalState({
                  isOpen: true,
                  isBulk: true,
                  jobTitle: `${selectedIds.length} selected jobs`,
                })
              }
              disabled={isProcessing}
              className="text-xs font-bold shadow-xs"
              leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th scope="col" className="py-3.5 px-4 w-10">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    aria-label={isAllSelected ? "Deselect all rows" : "Select all rows"}
                    className="text-slate-400 hover:text-slate-900 focus-visible:outline-none"
                  >
                    {isAllSelected ? (
                      <CheckSquare className="h-4 w-4 text-[var(--primary)]" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th scope="col" className="py-3.5 px-4">Authority &amp; Status</th>
                <th scope="col" className="py-3.5 px-4">Recruitment Title</th>
                <th scope="col" className="py-3.5 px-4">Category</th>
                <th scope="col" className="py-3.5 px-4">Vacancies</th>
                <th scope="col" className="py-3.5 px-4">Deadline</th>
                <th scope="col" className="py-3.5 px-4 text-center">Views</th>
                <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {jobs.length > 0 ? (
                jobs.map((job) => {
                  const isSelected = selectedIds.includes(job.id);
                  const isPublished = job.status === "OPEN";

                  return (
                    <tr
                      key={job.id}
                      className={[
                        "hover:bg-slate-50/80 transition-colors group",
                        isSelected ? "bg-blue-50/40" : "",
                      ].join(" ")}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 align-middle">
                        <button
                          type="button"
                          onClick={() => handleSelectOne(job.id)}
                          aria-label={`Select job ${job.title}`}
                          className="text-slate-400 hover:text-slate-900 focus-visible:outline-none"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-[var(--primary)]" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </td>

                      {/* Authority & Status Pill */}
                      <td className="py-3.5 px-4 align-top w-48">
                        <span className="text-xs font-bold text-slate-900 block leading-tight truncate">
                          {job.organization}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(job.id, job.status)}
                            title={isPublished ? "Click to set as Draft" : "Click to Publish"}
                            className="inline-flex items-center gap-1 focus-visible:outline-none"
                          >
                            <Badge
                              variant={isPublished ? "success" : job.status === "ENDING_SOON" ? "danger" : "neutral"}
                              size="sm"
                              className="text-[9px] font-bold cursor-pointer hover:opacity-80 transition-opacity"
                            >
                              {job.status === "OPEN" ? "Published" : job.status === "ENDING_SOON" ? "Ending Soon" : "Draft"}
                            </Badge>
                          </button>
                        </div>
                      </td>

                      {/* Title & Location */}
                      <td className="py-3.5 px-4 align-top max-w-xs sm:max-w-md">
                        <Link
                          href={`/admin/jobs/${job.id}/edit`}
                          className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors leading-snug line-clamp-2 focus-visible:underline"
                        >
                          {job.title}
                        </Link>
                        <span className="text-[11px] text-slate-400 font-normal block mt-0.5 truncate">
                          Slug: /jobs/{job.slug}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                          {job.category}
                        </span>
                      </td>

                      {/* Vacancies & Salary */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <span className="font-bold text-slate-900 block">
                          {typeof job.totalVacancies === "number"
                            ? job.totalVacancies.toLocaleString("en-IN")
                            : job.totalVacancies}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium block truncate max-w-[120px]">
                          {job.salaryOrStipend}
                        </span>
                      </td>

                      {/* Deadline */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap text-slate-600">
                        <div className="flex items-center gap-1 text-[11px] font-semibold">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>{job.importantDates.applicationEndDate || "Not specified"}</span>
                        </div>
                      </td>

                      {/* Views */}
                      <td className="py-3.5 px-4 align-top text-center font-mono text-slate-600">
                        <span className="inline-flex items-center gap-1 text-[11px]">
                          <Eye className="h-3 w-3 text-slate-400" />
                          <span>{job.viewsCount || 0}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Live Preview */}
                          <Link
                            href={`/jobs/${job.slug}`}
                            target="_blank"
                            title="View Live Page"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>

                          {/* Clone */}
                          <button
                            type="button"
                            onClick={() => handleDuplicate(job.id)}
                            title="Duplicate as Draft"
                            className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>

                          {/* Edit */}
                          <Link
                            href={`/admin/jobs/${job.id}/edit`}
                            title="Edit Job Circular"
                            className="p-1.5 text-slate-400 hover:text-[var(--primary)] hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </Link>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteModalState({
                                isOpen: true,
                                jobId: job.id,
                                jobTitle: job.title,
                                isBulk: false,
                              })
                            }
                            title="Delete Job"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-medium">
                    <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No recruitment jobs found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or create a new job circular.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing <strong className="text-slate-900">{jobs.length}</strong> of{" "}
            <strong className="text-slate-900">{total}</strong> total jobs (Page {page} of {totalPages})
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="font-bold text-xs"
            >
              Previous
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="font-bold text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AdminDeleteModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false })}
        onConfirm={handleDeleteConfirm}
        title={deleteModalState.jobTitle || ""}
        itemCount={deleteModalState.isBulk ? selectedIds.length : 1}
        isDeleting={isProcessing}
      />
    </div>
  );
};

AdminJobsTable.displayName = "AdminJobsTable";
