import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { CheckCircle2, ListOrdered } from "lucide-react";

export interface SelectionTimelineProps {
  steps?: string[];
  className?: string;
}

export const SelectionTimeline: React.FC<SelectionTimelineProps> = ({
  steps = [],
  className = "",
}) => {
  if (!steps || steps.length === 0) return null;

  return (
    <Card className={["bg-white border-[var(--border)] overflow-hidden shadow-2xs", className].filter(Boolean).join(" ")}>
      <CardHeader className="p-4 sm:p-5 border-b border-[var(--border)] bg-slate-50/70">
        <CardTitle as="h2" className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
          <ListOrdered className="h-4 w-4 text-[var(--primary)] shrink-0" aria-hidden="true" />
          <span>Selection Process & Recruitment Stages</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              {/* Step indicator dot */}
              <div className="absolute -left-6 sm:-left-8 top-0 flex items-center justify-center h-5 w-5 sm:h-7 sm:w-7 rounded-full bg-[var(--primary)] text-white text-[10px] sm:text-xs font-black ring-4 ring-white shadow-2xs">
                {idx + 1}
              </div>

              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Stage {idx + 1}</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 inline" aria-hidden="true" />
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                  {step}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

SelectionTimeline.displayName = "SelectionTimeline";
