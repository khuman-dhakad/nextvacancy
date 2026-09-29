import React from "react";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
} from "lucide-react";
import { Card } from "@/components/ui";
import { SeoHealthReport } from "@/types";


export interface SeoHealthCardProps {
  report: SeoHealthReport;
  className?: string;
}

export const SeoHealthCard: React.FC<SeoHealthCardProps> = ({
  report,
  className = "",
}) => {
  return (
    <section aria-label="Search Engine Optimization Health Scorecard" className={className}>
      <Card className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-6">
        {/* Header & Overall Score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Search className="h-4 w-4 text-emerald-600" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Search Engine Engine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              SEO Health &amp; Indexing Audit
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Verified crawlability, metadata, schema markup, and sitemap health.
            </p>
          </div>

          {/* Score Badge */}
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Portal SEO Score
              </span>
              <span className="text-xs text-emerald-600 font-medium">
                {report.passedChecks} of {report.totalChecks} Checks Passing
              </span>
            </div>
            <div className="w-14 h-14 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-mono font-black text-2xl shadow-sm">
              {report.overallScore}
            </div>
          </div>
        </div>

        {/* SEO Checks List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.checks.map((check) => {
            const isPass = check.status === "PASS";
            const isWarn = check.status === "WARN";

            return (
              <div
                key={check.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/70 transition-colors flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {check.title}
                    </span>
                    <span className="inline-block px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono text-[9px] font-bold">
                      {check.category}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] font-medium leading-relaxed">
                    {check.details}
                  </p>
                </div>

                <div className="shrink-0 pt-0.5">
                  {isPass ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>PASS</span>
                    </span>
                  ) : isWarn ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <AlertCircle className="h-3 w-3 text-amber-600" />
                      <span>WARN</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      <XCircle className="h-3 w-3 text-rose-600" />
                      <span>FAIL</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
};

SeoHealthCard.displayName = "SeoHealthCard";
