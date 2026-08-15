import React from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Card, Badge, Button } from "@/components/ui";

import { ApplicationTrackItem, ApplicationStage } from "@/services/dashboard/dashboard.service";
import { EmptyState } from "./EmptyState";

export interface ApplicationTrackerProps {
  applications: ApplicationTrackItem[];
  className?: string;
}

const STAGES: { key: ApplicationStage; label: string; stepNumber: number }[] = [
  { key: "SAVED", label: "Saved Notice", stepNumber: 1 },
  { key: "APPLIED", label: "Form Submitted", stepNumber: 2 },
  { key: "EXAM", label: "CBT / Exam", stepNumber: 3 },
  { key: "RESULT", label: "Final Result", stepNumber: 4 },
];

const getStageIndex = (stage: ApplicationStage): number => {
  switch (stage) {
    case "SAVED":
      return 0;
    case "APPLIED":
      return 1;
    case "EXAM":
      return 2;
    case "RESULT":
      return 3;
    default:
      return 0;
  }
};

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications = [],
  className = "",
}) => {
  if (applications.length === 0) {
    return (
      <Card id="application-tracker" className={["bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8", className].filter(Boolean).join(" ")}>
        <EmptyState
          title="No Active Applications"
          description="Track your application progress from submission to admit card release, exam date, and final merit list results."
          actionLabel="Find Open Opportunities"
          actionHref="/government-jobs"
        />
      </Card>
    );
  }

  return (
    <section id="application-tracker" aria-label="Application Progress Tracker" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <FileText className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Milestone Tracking
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Application Lifecycle &amp; Exam Tracker
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>{applications.length} Tracked Applications</span>
          </div>
        </div>

        {/* List of Applications with Steppers */}
        <div className="space-y-6">
          {applications.map((app) => {
            const currentStageIdx = getStageIndex(app.stage);

            return (
              <div
                key={app.id}
                className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 space-y-5"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                      {app.organization}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1 leading-snug">
                      <Link href={`/jobs/${app.slug}`} className="hover:text-[var(--primary)] transition-colors">
                        {app.title}
                      </Link>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={app.status === "QUALIFIED" ? "success" : app.status === "ACTION_REQUIRED" ? "danger" : "info"}
                      size="sm"
                      className="font-bold"
                    >
                      {app.status === "IN_PROGRESS" ? "In Progress" : app.status === "ACTION_REQUIRED" ? "Action Required" : app.status}
                    </Badge>

                    <Link href={`/jobs/${app.slug}`}>
                      <Button variant="outline" size="sm" className="font-bold text-xs" rightIcon={<ArrowRight className="h-3 w-3" />}>
                        Notice Details
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* 4-Step Stepper Progress Bar */}
                <div className="pt-2">
                  <div className="grid grid-cols-4 gap-2 relative">
                    {/* Background track line */}
                    <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" aria-hidden="true" />

                    {STAGES.map((s, idx) => {
                      const isCompleted = idx <= currentStageIdx;
                      const isCurrent = idx === currentStageIdx;

                      return (
                        <div key={s.key} className="flex flex-col items-center text-center space-y-1.5 z-10">
                          <div
                            className={[
                              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-colors",
                              isCurrent
                                ? "bg-[#D97706] text-white ring-4 ring-amber-100"
                                : isCompleted
                                ? "bg-[var(--primary)] text-white"
                                : "bg-white border-2 border-slate-300 text-slate-400",
                            ].join(" ")}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <span>{s.stepNumber}</span>
                            )}
                          </div>
                          <span
                            className={[
                              "text-[11px] font-bold leading-tight",
                              isCurrent
                                ? "text-[#92400E] font-black"
                                : isCompleted
                                ? "text-slate-900"
                                : "text-slate-400",
                            ].join(" ")}
                          >
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Next Milestone Callout */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <Clock className="h-4 w-4 text-[var(--primary)] shrink-0" aria-hidden="true" />
                    <span>Next Milestone: <strong className="text-slate-900 font-bold">{app.nextEventTitle}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-[11px]">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Target Date: {app.nextEventDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
};

ApplicationTracker.displayName = "ApplicationTracker";
