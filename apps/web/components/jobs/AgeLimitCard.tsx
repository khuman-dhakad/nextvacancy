import React from "react";
import { AgeLimit } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { UserCheck, ShieldAlert } from "lucide-react";

export interface AgeLimitCardProps {
  ageLimit?: AgeLimit;
  className?: string;
}

export const AgeLimitCard: React.FC<AgeLimitCardProps> = ({
  ageLimit,
  className = "",
}) => {
  if (!ageLimit) return null;

  return (
    <Card className={["bg-white border-[var(--border)] overflow-hidden shadow-2xs", className].filter(Boolean).join(" ")}>
      <CardHeader className="p-4 sm:p-5 border-b border-[var(--border)] bg-slate-50/70">
        <CardTitle as="h2" className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-[#D97706] shrink-0" aria-hidden="true" />
          <span>Age Limit Criteria</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 space-y-4 text-xs">
        {/* Quick Age Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] text-slate-400 font-medium block">
              Minimum Age
            </span>
            <span className="text-sm font-black text-slate-900">
              {ageLimit.minAge ? `${ageLimit.minAge} Years` : "18 Years"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] text-slate-400 font-medium block">
              Maximum Age
            </span>
            <span className="text-sm font-black text-slate-900">
              {ageLimit.maxAge ? `${ageLimit.maxAge} Years` : "32 Years"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] text-slate-400 font-medium block">
              Calculated As On Date
            </span>
            <span className="text-sm font-bold text-slate-900">
              {ageLimit.asOnDate || "Crucial Cut-off Date"}
            </span>
          </div>
        </div>

        {/* Age Relaxation Notes */}
        {ageLimit.relaxationNotes && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900">
            <ShieldAlert className="h-4 w-4 text-[#D97706] mt-0.5 shrink-0" aria-hidden="true" />
            <div className="space-y-1">
              <strong className="font-bold block text-xs">
                Category-wise Upper Age Relaxation:
              </strong>
              <p className="text-slate-700 leading-relaxed">
                {ageLimit.relaxationNotes}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

AgeLimitCard.displayName = "AgeLimitCard";
