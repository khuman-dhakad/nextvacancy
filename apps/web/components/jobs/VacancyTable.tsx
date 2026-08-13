import React from "react";
import { VacancyDetail } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { Users2 } from "lucide-react";

export interface VacancyTableProps {
  vacancies?: VacancyDetail[];
  totalVacancies?: number | string;
  className?: string;
}

export const VacancyTable: React.FC<VacancyTableProps> = ({
  vacancies = [],
  totalVacancies,
  className = "",
}) => {
  if (!vacancies || vacancies.length === 0) return null;

  // Auto calculate sum of numeric vacancies
  const calculatedTotal = vacancies.reduce((acc, curr) => {
    if (typeof curr.totalVacancies === "number") {
      return acc + curr.totalVacancies;
    }
    const parsed = parseInt(String(curr.totalVacancies).replace(/[^0-9]/g, ""), 10);
    return acc + (isNaN(parsed) ? 0 : parsed);
  }, 0);

  const displayTotal = totalVacancies || (calculatedTotal > 0 ? calculatedTotal.toLocaleString("en-IN") : "Multiple");

  return (
    <Card className={["bg-white border-[var(--border)] overflow-hidden shadow-2xs", className].filter(Boolean).join(" ")}>
      <CardHeader className="p-4 sm:p-5 border-b border-[var(--border)] bg-slate-50/70 flex flex-row items-center justify-between">
        <CardTitle as="h2" className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
          <Users2 className="h-4 w-4 text-[var(--primary)] shrink-0" aria-hidden="true" />
          <span>Post-wise Vacancy Breakdown</span>
        </CardTitle>
        <span className="text-xs font-bold text-[var(--primary)] bg-[var(--primary-subtle)] px-2.5 py-1 rounded-md">
          Total: {displayTotal}
        </span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <caption className="sr-only">Detailed Vacancy Distribution by Post Name</caption>
            <thead>
              <tr className="border-b border-[var(--border)] bg-slate-100/60 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th scope="col" className="py-2.5 px-4 sm:px-5">
                  Post Name / Cadre
                </th>
                <th scope="col" className="py-2.5 px-4 sm:px-5 hidden sm:table-cell">
                  Pay Scale
                </th>
                <th scope="col" className="py-2.5 px-4 sm:px-5 text-right sm:text-left">
                  Vacancies
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vacancies.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 sm:px-5">
                    <strong className="font-bold text-slate-900 block">
                      {item.postName}
                    </strong>
                    {item.qualification && (
                      <span className="text-[11px] text-slate-500 block sm:hidden pt-0.5">
                        {item.qualification}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 sm:px-5 hidden sm:table-cell text-slate-600 font-medium">
                    {item.payScale || "As per 7th CPC"}
                  </td>
                  <td className="py-3 px-4 sm:px-5 text-right sm:text-left font-black text-[var(--primary)]">
                    {typeof item.totalVacancies === "number"
                      ? item.totalVacancies.toLocaleString("en-IN")
                      : item.totalVacancies}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t-2 border-[var(--border-strong)] font-black text-slate-900">
                <td className="py-3 px-4 sm:px-5">Total Vacancies (All Posts Combined)</td>
                <td className="py-3 px-4 sm:px-5 hidden sm:table-cell">—</td>
                <td className="py-3 px-4 sm:px-5 text-right sm:text-left text-[var(--primary)] text-sm">
                  {displayTotal}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

VacancyTable.displayName = "VacancyTable";
