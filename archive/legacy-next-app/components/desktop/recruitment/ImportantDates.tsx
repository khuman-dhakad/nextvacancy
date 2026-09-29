import React from "react";
import {
  Calendar,
  Clock,
  AlertCircle,
  FileText,
  CreditCard,
  Edit3,
  Award,
} from "lucide-react";
import { Card } from "@/components/ui";
import { ImportantDates as ImportantDatesType } from "@/types";


export interface ImportantDatesProps {
  dates: ImportantDatesType;
  className?: string;
}

interface TimelineItem {
  id: string;
  label: string;
  date?: string;
  icon: React.ComponentType<{ className?: string }>;
  isHighlighted?: boolean;
}

export const ImportantDates: React.FC<ImportantDatesProps> = ({
  dates,
  className = "",
}) => {
  const timeline: TimelineItem[] = [
    {
      id: "notif",
      label: "Official Notification Release",
      date: dates.notificationDate,
      icon: FileText,
    },
    {
      id: "start",
      label: "Online Application Starts",
      date: dates.applicationStartDate,
      icon: Calendar,
    },
    {
      id: "end",
      label: "Last Date to Apply Online",
      date: dates.applicationEndDate,
      icon: Clock,
      isHighlighted: true,
    },
    {
      id: "fee",
      label: "Last Date for Fee Payment",
      date: dates.lastDateFeePayment,
      icon: CreditCard,
    },
    {
      id: "correction",
      label: "Application Correction Window",
      date: dates.correctionWindowDate,
      icon: Edit3,
    },
    {
      id: "exam",
      label: "Tier-1 / CBT Examination Date",
      date: dates.examDate,
      icon: Calendar,
    },
    {
      id: "answer-key",
      label: "Answer Key Release",
      date: dates.answerKeyDate,
      icon: Award,
    },
    {
      id: "result",
      label: "Result Declaration",
      date: dates.resultDate,
      icon: Award,
    },
  ].filter((item) => Boolean(item.date));

  return (
    <section aria-label="Important Dates Timeline" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Calendar className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Application Schedule &amp; Deadlines
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Important Dates &amp; Examination Timeline
            </h2>
          </div>

          {dates.applicationEndDate && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold shrink-0">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Closing: {dates.applicationEndDate}</span>
            </div>
          )}
        </div>

        {/* Vertical Timeline Structure */}
        <div className="pt-6 relative">
          {/* Vertical Connecting Guide Line */}
          <div
            className="absolute left-[19px] top-9 bottom-6 w-0.5 bg-slate-200"
            aria-hidden="true"
          />

          {timeline.length === 0 ? (
            <p role="status" className="text-sm font-medium text-slate-500">
              No official dates have been published.
            </p>
          ) : (
            <div className="space-y-6">
            {timeline.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={[
                    "relative flex items-start gap-4 p-3.5 rounded-xl transition-colors",
                    item.isHighlighted
                      ? "bg-amber-50/70 border border-amber-200/90 shadow-2xs"
                      : "hover:bg-slate-50 border border-transparent",
                  ].join(" ")}
                >
                  {/* Step Node Circle */}
                  <div
                    className={[
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10 font-bold text-xs shadow-xs",
                      item.isHighlighted
                        ? "bg-[#D97706] text-white"
                        : "bg-[var(--primary)] text-white",
                    ].join(" ")}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>

                  {/* Content Row */}
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <h3
                        className={[
                          "text-sm font-bold leading-snug",
                          item.isHighlighted ? "text-[#92400E]" : "text-slate-900",
                        ].join(" ")}
                      >
                        {item.label}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2.5 sm:text-right shrink-0">
                      <span
                        className={[
                          "text-xs sm:text-sm font-bold",
                          item.isHighlighted
                            ? "text-[#DC2626] font-extrabold"
                            : "text-slate-800",
                        ].join(" ")}
                      >
                        {item.date}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
      </Card>
    </section>
  );
};

ImportantDates.displayName = "ImportantDates";
