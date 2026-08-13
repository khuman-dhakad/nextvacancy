import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { GraduationCap, CheckCircle } from "lucide-react";

export interface QualificationSectionProps {
  summary: string;
  qualificationsList?: string[];
  className?: string;
}

export const QualificationSection: React.FC<QualificationSectionProps> = ({
  summary,
  qualificationsList = [],
  className = "",
}) => {
  const items =
    qualificationsList.length > 0
      ? qualificationsList
      : [summary];

  return (
    <Card className={["bg-white border-[var(--border)] overflow-hidden shadow-2xs", className].filter(Boolean).join(" ")}>
      <CardHeader className="p-4 sm:p-5 border-b border-[var(--border)] bg-slate-50/70">
        <CardTitle as="h2" className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-[var(--primary)] shrink-0" aria-hidden="true" />
          <span>Educational Qualification Requirements</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 space-y-3.5 text-xs">
        <p className="text-slate-700 bg-slate-50/90 p-3.5 rounded-xl border border-slate-200/80 font-medium leading-relaxed">
          {summary}
        </p>

        {items.length > 1 && (
          <div className="space-y-2 pt-1">
            <h3 className="text-xs font-bold text-slate-900">
              Detailed Post-wise Academic Criteria:
            </h3>
            <ul className="space-y-2">
              {items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                  <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

QualificationSection.displayName = "QualificationSection";
