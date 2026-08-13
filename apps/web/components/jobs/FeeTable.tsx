import React from "react";
import { FeeStructure } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { IndianRupee, CreditCard, Info } from "lucide-react";

export interface FeeTableProps {
  fee?: FeeStructure;
  className?: string;
}

export const FeeTable: React.FC<FeeTableProps> = ({ fee, className = "" }) => {
  if (!fee) return null;

  const feeItems = [
    { category: "General (UR)", amount: fee.general || "₹100" },
    { category: "Other Backward Classes (OBC)", amount: fee.obc || fee.obcEws || fee.general || "₹100" },
    { category: "Economically Weaker Section (EWS)", amount: fee.ews || fee.obcEws || fee.general || "₹100" },
    { category: "Scheduled Caste (SC)", amount: fee.sc || fee.scStPwd || "Nil (₹0)" },
    { category: "Scheduled Tribe (ST)", amount: fee.st || fee.scStPwd || "Nil (₹0)" },
    { category: "Female Candidates (All Categories)", amount: fee.female || "Nil (₹0)" },
    { category: "Persons with Benchmark Disabilities (PwD / PH)", amount: fee.ph || fee.scStPwd || "Nil (₹0)" },
  ];

  return (
    <Card className={["bg-white border-[var(--border)] overflow-hidden shadow-2xs", className].filter(Boolean).join(" ")}>
      <CardHeader className="p-4 sm:p-5 border-b border-[var(--border)] bg-slate-50/70">
        <CardTitle as="h2" className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-[#059669] shrink-0" aria-hidden="true" />
          <span>Application Fee Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <caption className="sr-only">Category-wise Application Fee Breakdown</caption>
            <thead>
              <tr className="border-b border-[var(--border)] bg-slate-100/60 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th scope="col" className="py-2.5 px-4 sm:px-5">
                  Candidate Category
                </th>
                <th scope="col" className="py-2.5 px-4 sm:px-5 text-right sm:text-left">
                  Application Fee
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {feeItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 sm:px-5 font-semibold text-slate-700">
                    {item.category}
                  </td>
                  <td className="py-3 px-4 sm:px-5 text-right sm:text-left font-black text-slate-900">
                    {item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Notes for Payment Mode & Exemptions */}
        <div className="p-4 bg-slate-50/70 border-t border-[var(--border)] space-y-2 text-xs text-slate-600">
          {fee.paymentMode && (
            <div className="flex items-start gap-2">
              <CreditCard className="h-3.5 w-3.5 text-slate-500 mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                <strong>Payment Mode:</strong> {fee.paymentMode}
              </span>
            </div>
          )}
          {fee.exemptionNotes && (
            <div className="flex items-start gap-2 text-emerald-800 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200/70">
              <Info className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                <strong>Fee Exemption:</strong> {fee.exemptionNotes}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

FeeTable.displayName = "FeeTable";
