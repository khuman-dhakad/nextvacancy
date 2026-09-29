import React from "react";
import { CreditCard, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { FeeStructure } from "@/types";


export interface FeeTableProps {
  fee?: FeeStructure;
  className?: string;
}

export const FeeTable: React.FC<FeeTableProps> = ({
  fee,
  className = "",
}) => {
  const feeRows = [
    {
      category: "General / Unreserved (UR)",
      amount: fee?.general || "₹100",
      isExempted: fee?.general === "₹0" || fee?.general?.includes("Nil") || fee?.general?.includes("Exempted"),
    },
    {
      category: "Other Backward Classes (OBC - Non Creamy Layer)",
      amount: fee?.obc || fee?.obcEws || "₹100",
      isExempted: fee?.obc === "₹0" || fee?.obc?.includes("Nil"),
    },
    {
      category: "Economically Weaker Sections (EWS)",
      amount: fee?.ews || fee?.obcEws || "₹100",
      isExempted: fee?.ews === "₹0" || fee?.ews?.includes("Nil"),
    },
    {
      category: "Scheduled Caste (SC) / Scheduled Tribe (ST)",
      amount: fee?.sc || fee?.st || fee?.scStPwd || "₹0 (Exempted)",
      isExempted: true,
    },
    {
      category: "Female Candidates (All Categories)",
      amount: fee?.female || "₹0 (Exempted)",
      isExempted: true,
    },
    {
      category: "Persons with Benchmark Disabilities (PwBD) / ESM",
      amount: fee?.ph || "₹0 (Exempted)",
      isExempted: true,
    },
  ];

  return (
    <section aria-label="Application Fee Structure" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <CreditCard className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Category-Wise Charges
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Application Fee &amp; Payment Guidelines
            </h2>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200/60">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Zero Processing Surcharge</span>
          </div>
        </div>

        {/* Table Structure */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th scope="col" className="py-3.5 px-4">Category / Group</th>
                <th scope="col" className="py-3.5 px-4 text-center">Application Fee</th>
                <th scope="col" className="py-3.5 px-4 text-right">Fee Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {feeRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 text-xs sm:text-sm">
                    {row.category}
                  </td>
                  <td className="py-3.5 px-4 text-center font-black text-sm text-[var(--primary)]">
                    {row.amount}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Badge
                      variant={row.isExempted ? "success" : "warning"}
                      size="sm"
                      className="font-bold text-[10px]"
                    >
                      {row.isExempted ? "Fee Exempted" : "Payable Online"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment Modes & Exemption Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-[var(--primary)]" aria-hidden="true" />
              <span>Accepted Modes of Payment</span>
            </span>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {fee?.paymentMode || "Online payment via Net Banking, UPI (GPay, PhonePe, Paytm), Debit/Credit Cards, or SBI e-Challan cash deposit."}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
            <span className="text-[11px] font-bold text-amber-900 uppercase flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
              <span>Exemption &amp; Refund Terms</span>
            </span>
            <p className="text-xs text-amber-950 leading-relaxed font-medium">
              {fee?.exemptionNotes || "Application fee once paid is non-refundable under any circumstances. Candidates claiming fee concession must upload valid caste/PwD certificate."}
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
};

FeeTable.displayName = "FeeTable";
