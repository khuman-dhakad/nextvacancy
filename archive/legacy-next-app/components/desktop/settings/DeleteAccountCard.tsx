"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Trash2,
  ShieldAlert,
} from "lucide-react";
import { Card, Button } from "@/components/ui";

export interface DeleteAccountCardProps {
  className?: string;
}

export const DeleteAccountCard: React.FC<DeleteAccountCardProps> = ({
  className = "",
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <section aria-label="Danger Zone: Delete Account" className={className}>
      <Card className="bg-white border-2 border-rose-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-rose-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-rose-600">
              <ShieldAlert className="h-4 w-4" aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-widest">
                Irreversible Action
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-rose-950 tracking-tight">
              Danger Zone: Delete Account
            </h2>
          </div>

          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
            Permanent Data Erasure
          </span>
        </div>

        {/* Warning Text */}
        <div className="space-y-2 text-xs text-rose-900 font-medium leading-relaxed bg-rose-50/50 p-4 rounded-xl border border-rose-100">
          <p className="font-bold flex items-center gap-1.5 text-rose-800">
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" aria-hidden="true" />
            <span>Please exercise caution. This action cannot be undone.</span>
          </p>
          <p>
            Deleting your account will permanently wipe your application progress, saved circulars, admit card alerts, and email preferences from the NEXTVACANCY registry.
          </p>
        </div>

        {/* Action / Confirmation */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {!showConfirm ? (
            <Button
              type="button"
              variant="destructive"
              size="md"
              onClick={() => setShowConfirm(true)}
              className="font-bold text-xs shadow-xs"
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Delete My Account
            </Button>
          ) : (
            <div className="flex flex-wrap items-center gap-3 p-3 bg-rose-100/70 border border-rose-200 rounded-xl">
              <span className="text-xs font-bold text-rose-950">
                Are you absolutely sure?
              </span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="font-bold text-xs"
              >
                Confirm Deletion
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirm(false)}
                className="font-bold text-xs text-slate-700 hover:bg-white"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Card>
    </section>
  );
};

DeleteAccountCard.displayName = "DeleteAccountCard";
