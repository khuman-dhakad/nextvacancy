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
import { Card, Badge } from "@/components/ui";
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
  statusText?: string;
  statusVariant?: "success" | "warning" | "danger" | "neutral" | "info" | "accent";
}

export const ImportantDates: React.FC<ImportantDatesProps> = ({
  dates,
  className = "",
}) => {
  const timeline: TimelineItem[] = [
    {
      id: "notif",
      label: "Official Notification Release",
      date: dates.notificationDate || "Announced",
      icon: FileText,
      statusText: "Published",
      statusVariant: "info",
    },
    {
      id: "start",
      label: "Online Application Starts",
      date: dates.applicationStartDate || "Active",
      icon: Calendar,
      statusText: "Live Portal",
      statusVariant: "success",
    },
    {
      id: "end",
      label: "Last Date to Apply Online",
      date: dates.applicationEndDate || "Check Circular",
      icon: Clock,
      isHighlighted: true,
      statusText: "Deadline",
      statusVariant: "danger",
    },
    {
      id: "fee",
      label: "Last Date for Fee Payment",
      date: dates.lastDateFeePayment || dates.applicationEndDate || "Same as Last Date",
      icon: CreditCard,
      statusText: "Online Mode",
      statusVariant: "warning",
    },
    {
      id: "correction",
      label: "Application Correction Window",
      date: dates.correctionWindowDate || "To be notified",
      icon: Edit3,
      statusText: "OTR / Edit",
      statusVariant: "neutral",
    },
    {
      id: "exam",
      label: "Tier-1 / CBT Examination Date",
      date: dates.examDate || "To be scheduled",
      icon: Calendar,
      statusText: "Admit Card Soon",
      statusVariant: "info",
    },
    {
      id: "result",
      label: "Answer Key & Result Declaration",
      date: dates.resultDate || dates.answerKeyDate || "Post-Exam",
      icon: Award,
      statusText: "Scorecard",
      statusVariant: "accent",
    },
  ];

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

          <div className="space-y-6">
            {timeline.map((item, idx) => {
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
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Stage {idx + 1} of official recruitment schedule
                      </p>
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
                      {item.statusText && (
                        <Badge
                          variant={item.statusVariant || "neutral"}
                          size="sm"
                          className="font-bold text-[10px]"
                        >
                          {item.statusText}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </section>
  );
};

ImportantDates.displayName = "ImportantDates";
