import React from "react";
import { Users } from "lucide-react";
import { Card } from "@/components/ui";
import { VacancyDetail } from "@/types";

export interface VacancyTableProps {
  vacancies?: VacancyDetail[];
  totalVacancies: number | string;
  organization?: string;
  className?: string;
}

export const VacancyTable: React.FC<VacancyTableProps> = ({
  vacancies = [],
  totalVacancies,
  className = "",
}) => {

  const displayTotal =
    typeof totalVacancies === "number"
      ? totalVacancies.toLocaleString("en-IN")
      : totalVacancies;

  return (
    <section aria-label="Vacancy Breakdown and Seat Distribution" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Users className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Post-Wise Distribution
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Vacancy Details &amp; Post Allocation
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--primary-subtle)] text-[var(--primary)] font-bold text-sm">
            <span>Grand Total:</span>
            <span className="text-base font-black text-[var(--primary)]">{displayTotal} Posts</span>
          </div>
        </div>

        {/* Desktop Responsive Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th scope="col" className="py-3.5 px-4">#</th>
                <th scope="col" className="py-3.5 px-4">Designation / Post Name</th>
                <th scope="col" className="py-3.5 px-4">Pay Band / Scale</th>
                <th scope="col" className="py-3.5 px-4 text-center">Seats</th>
                <th scope="col" className="py-3.5 px-4">Educational Qualification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {vacancies && vacancies.length > 0 ? (
                vacancies.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-400 text-center w-12">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 text-xs sm:text-sm">
                        {item.postName}
                      </p>
                      {item.categoryBreakdown && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                          {item.categoryBreakdown.ur && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-semibold">
                              UR: {item.categoryBreakdown.ur}
                            </span>
                          )}
                          {item.categoryBreakdown.obc && (
                            <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono font-semibold">
                              OBC: {item.categoryBreakdown.obc}
                            </span>
                          )}
                          {item.categoryBreakdown.ews && (
                            <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-mono font-semibold">
                              EWS: {item.categoryBreakdown.ews}
                            </span>
                          )}
                          {item.categoryBreakdown.sc && (
                            <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-mono font-semibold">
                              SC: {item.categoryBreakdown.sc}
                            </span>
                          )}
                          {item.categoryBreakdown.st && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-semibold">
                              ST: {item.categoryBreakdown.st}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-semibold">
                      {item.payScale || "As per 7th CPC Matrix"}
                    </td>
                    <td className="py-3.5 px-4 text-center font-black text-sm text-[var(--primary)]">
                      {typeof item.totalVacancies === "number"
                        ? item.totalVacancies.toLocaleString("en-IN")
                        : item.totalVacancies}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 leading-relaxed max-w-xs">
                      {item.qualification}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    <p className="font-bold text-sm text-slate-700">
                      Total Openings: {displayTotal} Vacancies
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Check the official notification PDF below for detailed cadre-wise and reservation-wise quota breakdown.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-slate-50/90 font-bold border-t border-slate-200">
              <tr>
                <td colSpan={3} className="py-3.5 px-4 text-right text-slate-700 uppercase tracking-wider text-[11px]">
                  Total Notified Vacancies:
                </td>
                <td className="py-3.5 px-4 text-center text-sm font-black text-[var(--primary)]">
                  {displayTotal}
                </td>
                <td className="py-3.5 px-4 text-xs text-emerald-600 font-semibold">
                  Reservation as per Central / State Govt Norms
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </section>
  );
};

VacancyTable.displayName = "VacancyTable";
