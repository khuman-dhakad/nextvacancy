"use client";

import React, { useEffect } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Card, Button } from "@/components/ui";

export interface AdminDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemCount?: number;
  isDeleting?: boolean;
}

export const AdminDeleteModal: React.FC<AdminDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemCount = 1,
  isDeleting = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <Card className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="delete-modal-title" className="text-base font-bold text-slate-900 leading-snug">
                Confirm Deletion
              </h2>
              <span className="text-xs text-rose-600 font-semibold">
                Permanent CMS Record Removal
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2 text-xs text-slate-600 font-medium leading-relaxed">
          <p>
            Are you sure you want to delete{" "}
            <strong className="text-slate-900 font-bold">
              {itemCount > 1 ? `${itemCount} selected jobs` : `"${title}"`}
            </strong>
            ?
          </p>
          <p className="text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-100">
            This action cannot be undone. Public visitors will no longer be able to view or apply through this recruitment posting.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="font-bold text-xs"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isDeleting}
            className="font-bold text-xs"
            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
          >
            {isDeleting ? "Deleting..." : "Delete Permanently"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

AdminDeleteModal.displayName = "AdminDeleteModal";
