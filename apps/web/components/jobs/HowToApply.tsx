import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { FileText, ArrowRightCircle } from "lucide-react";

export interface HowToApplyProps {
  steps?: string[];
  organization?: string;
  className?: string;
}

export const HowToApply: React.FC<HowToApplyProps> = ({
  steps = [],
  organization = "the official commission",
  className = "",
}) => {
  const defaultSteps = [
    `Visit the official recruitment portal of ${organization}.`,
    "Complete the One Time Registration (OTR) / candidate profile creation if not already registered.",
    "Log in using your registered credentials (Registration ID & Password).",
    "Navigate to 'Active Notifications' and locate the respective recruitment link.",
    "Fill in personal details, educational qualifications, post preferences, and examination center choices.",
    "Upload recent passport-sized color photograph and clear scanned signature in the prescribed file format.",
    "Preview the filled application form thoroughly to verify all details before final submission.",
    "Pay the requisite application fee online via UPI, Net Banking, or Credit/Debit Card (if applicable).",
    "Submit the application and download/print the final confirmation receipt for future reference.",
  ];

  const applySteps = steps && steps.length > 0 ? steps : defaultSteps;

  return (
    <Card className={["bg-white border-[var(--border)] overflow-hidden shadow-2xs", className].filter(Boolean).join(" ")}>
      <CardHeader className="p-4 sm:p-5 border-b border-[var(--border)] bg-slate-50/70">
        <CardTitle as="h2" className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
          <FileText className="h-4 w-4 text-[var(--primary)] shrink-0" aria-hidden="true" />
          <span>Step-by-Step Guide on How to Apply Online</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        <ol className="space-y-3">
          {applySteps.map((step, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs text-slate-700 leading-relaxed hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-[var(--primary)] text-white text-xs font-black shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 pt-0.5">
                <span className="font-medium">{step}</span>
              </div>
              <ArrowRightCircle className="h-3.5 w-3.5 text-slate-400 mt-1 shrink-0 hidden sm:inline" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
};

HowToApply.displayName = "HowToApply";
