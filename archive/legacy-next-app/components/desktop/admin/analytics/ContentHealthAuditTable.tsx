import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Edit3,
} from "lucide-react";
import { Card, Button } from "@/components/ui";
import { ContentHealthIssue } from "@/types";


export interface ContentHealthAuditTableProps {
  issues: ContentHealthIssue[];
  className?: string;
}

export const ContentHealthAuditTable: React.FC<ContentHealthAuditTableProps> = ({
  issues = [],
  className = "",
}) => {
  return (
    <section aria-label="Recruitment Content Health & Quality Sentinel" className={className}>
      <Card className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Editorial QA &amp; Data Completeness
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Recruitment Content Health Sentinel
            </h2>
          </div>

          <span className="text-xs text-slate-500 font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
            {issues.length} Circulars Require Editorial Review
          </span>
        </div>

        {/* Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th scope="col" className="py-3.5 px-4">Recruitment Title</th>
                  <th scope="col" className="py-3.5 px-4">Authority</th>
                  <th scope="col" className="py-3.5 px-4 text-center">Salary Scale</th>
                  <th scope="col" className="py-3.5 px-4 text-center">Last Date</th>
                  <th scope="col" className="py-3.5 px-4 text-center">PDF Circular</th>
                  <th scope="col" className="py-3.5 px-4 text-center">FAQ Schema</th>
                  <th scope="col" className="py-3.5 px-4 text-center">SEO Summary</th>
                  <th scope="col" className="py-3.5 px-4 text-center">Health</th>
                  <th scope="col" className="py-3.5 px-4 text-right">Fix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {issues.map((item) => (
                  <tr key={item.jobId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 align-middle max-w-xs sm:max-w-sm">
                      <span className="font-bold text-slate-900 leading-snug line-clamp-1 block">
                        {item.jobTitle}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        id: {item.jobId}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-middle whitespace-nowrap text-slate-600 font-semibold">
                      {item.organization}
                    </td>

                    {/* Missing Salary */}
                    <td className="py-3.5 px-4 align-middle text-center">
                      {item.missingSalary ? (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          Missing
                        </span>
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mx-auto" />
                      )}
                    </td>

                    {/* Missing Last Date */}
                    <td className="py-3.5 px-4 align-middle text-center">
                      {item.missingLastDate ? (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          Missing
                        </span>
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mx-auto" />
                      )}
                    </td>

                    {/* Missing PDF */}
                    <td className="py-3.5 px-4 align-middle text-center">
                      {item.missingPdfUrl ? (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          Missing
                        </span>
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mx-auto" />
                      )}
                    </td>

                    {/* Missing FAQ */}
                    <td className="py-3.5 px-4 align-middle text-center">
                      {item.missingFaqs ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Needs FAQ
                        </span>
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mx-auto" />
                      )}
                    </td>

                    {/* Missing SEO Description */}
                    <td className="py-3.5 px-4 align-middle text-center">
                      {item.missingSeoDescription ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Needs Meta
                        </span>
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mx-auto" />
                      )}
                    </td>

                    {/* Health score */}
                    <td className="py-3.5 px-4 align-middle text-center font-mono font-bold text-slate-700">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-[10px]">
                        {item.healthScore}%
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 align-middle text-right whitespace-nowrap">
                      <Link href={`/admin/jobs/${item.jobId}/edit`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="font-bold text-[11px] hover:text-[var(--primary)]"
                          leftIcon={<Edit3 className="h-3 w-3" />}
                        >
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </section>
  );
};

ContentHealthAuditTable.displayName = "ContentHealthAuditTable";
