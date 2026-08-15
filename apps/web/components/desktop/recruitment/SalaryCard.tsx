import React from "react";
import { Banknote } from "lucide-react";
import { Card, Badge } from "@/components/ui";


export interface SalaryCardProps {
  salaryOrStipend: string;
  payLevel?: string;
  basicPay?: string;
  gradePay?: string;
  approxInHand?: string;
  className?: string;
}

export const SalaryCard: React.FC<SalaryCardProps> = ({
  salaryOrStipend,
  payLevel = "Pay Level 4 to 8 (7th Central Pay Commission)",
  basicPay = "₹25,500 - ₹1,51,100",
  gradePay = "₹2,400 to ₹4,800 Grade Pay",
  approxInHand = "₹38,000 - ₹95,000 / month (varies by city classification X, Y, Z)",
  className = "",
}) => {
  return (
    <section aria-label="Salary Structure & Pay Matrix" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Banknote className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                7th CPC Pay Scale &amp; Allowances
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Salary Structure &amp; Monthly In-Hand Pay
            </h2>
          </div>

          <Badge variant="success" size="md" className="font-bold uppercase tracking-wider">
            Official Pay Matrix
          </Badge>
        </div>

        {/* Featured Pay Scale Display Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0F2744] via-[#133054] to-[#0A1D33] text-white space-y-4 shadow-sm relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">
                Notified Remuneration / Scale
              </span>
              <p className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {salaryOrStipend}
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Inclusive of Basic Pay, DA, HRA, and Transport Allowances
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-left sm:text-right shrink-0">
              <span className="text-[11px] font-bold text-slate-300 block uppercase">
                Approx. Starting In-Hand
              </span>
              <span className="text-lg font-black text-emerald-300 block">
                ₹38,500+ / mo
              </span>
              <span className="text-[10px] text-slate-400">Class X Cities</span>
            </div>
          </div>
        </div>

        {/* 4-Item Breakdown Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              Pay Matrix Level
            </span>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              {payLevel}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              Basic Pay Band
            </span>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              {basicPay}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              Grade Pay / Cadre
            </span>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              {gradePay}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
            <span className="text-[11px] font-bold text-emerald-700 uppercase">
              In-Hand Monthly Range
            </span>
            <p className="text-sm font-black text-emerald-900 leading-snug">
              {approxInHand}
            </p>
          </div>
        </div>

        {/* Perks & Benefits Tags */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="text-slate-400 text-[11px] font-bold uppercase mr-1">
            Government Benefits Included:
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            Dearness Allowance (DA 50%+)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            House Rent Allowance (HRA 9% to 27%)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            Transport Allowance (TA)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            NPS &amp; Medical Facilities (CGHS/ECHS)
          </span>
        </div>
      </Card>
    </section>
  );
};

SalaryCard.displayName = "SalaryCard";
