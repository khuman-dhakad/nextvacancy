import React from "react";
import { ImportantDates } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { Calendar } from "lucide-react";

export interface DatesTableProps {
  dates: ImportantDates;
  className?: string;
}

export const DatesTable: React.FC<DatesTableProps> = ({
  dates,
  className = "",
}) => {
  const events = [
    {
      label: "Official Notification Released",
      date: dates.notificationDate || "To be announced",
      isHighlight: false,
    },
    {
      label: "Online Application Start Date",
      date: dates.applicationStartDate || "To be announced",
      isHighlight: false,
    },
    {
      label: "Application Last Date to Apply",
      date: dates.applicationEndDate || "To be announced",
      isHighlight: true,
    },
    {
      label: "Last Date for Fee Payment",
      date: dates.lastDateFeePayment || dates.applicationEndDate || "To be announced",
      isHighlight: false,
    },
    {
      label: "Correction Window Period",
      date: dates.correctionWindowDate || "To be announced",
      isHighlight: false,
    },
    {
      label: "Admit Card Download Release",
      date: dates.admitCardDate || "To be announced",
      isHighlight: false,
    },
    {
      label: "Examination Date (CBT / Stage-1)",
      date: dates.examDate || "To be announced",
      isHighlight: false,
    },
    {
      label: "Result Declaration Date",
      date: dates.resultDate || "To be announced",
      isHighlight: false,
    },
  ];

  return (
    <Card className={["bg-white border-[var(--border)] overflow-hidden shadow-2xs", className].filter(Boolean).join(" ")}>
      <CardHeader className="p-4 sm:p-5 border-b border-[var(--border)] bg-slate-50/70">
        <CardTitle as="h2" className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[var(--primary)] shrink-0" aria-hidden="true" />
          <span>Important Dates & Schedule</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <caption className="sr-only">
              Official Schedule and Important Dates for Examination
            </caption>
            <thead>
              <tr className="border-b border-[var(--border)] bg-slate-100/60 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th scope="col" className="py-2.5 px-4 sm:px-5">
                  Recruitment Event / Stage
                </th>
                <th scope="col" className="py-2.5 px-4 sm:px-5 text-right sm:text-left">
                  Important Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((item, idx) => (
                <tr
                  key={idx}
                  className={[
                    "transition-colors hover:bg-slate-50/80",
                    item.isHighlight ? "bg-amber-50/40" : "",
                  ].join(" ")}
                >
                  <td className="py-3 px-4 sm:px-5 font-semibold text-slate-700">
                    {item.label}
                  </td>
                  <td
                    className={[
                      "py-3 px-4 sm:px-5 text-right sm:text-left font-bold",
                      item.isHighlight ? "text-[#DC2626]" : "text-slate-900",
                    ].join(" ")}
                  >
                    {item.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

DatesTable.displayName = "DatesTable";
