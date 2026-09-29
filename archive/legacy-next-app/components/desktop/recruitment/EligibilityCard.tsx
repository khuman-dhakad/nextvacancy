import React from "react";
import {
  GraduationCap,
  UserCheck,
  Globe2,
  Briefcase,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Card } from "@/components/ui";
import { AgeLimit } from "@/types";


export interface EligibilityCardProps {
  qualificationSummary: string;
  qualificationsList?: string[];
  ageLimit?: AgeLimit;
  nationality?: string;
  experience?: string;
  className?: string;
}

export const EligibilityCard: React.FC<EligibilityCardProps> = ({
  qualificationSummary,
  qualificationsList = [],
  ageLimit,
  nationality = "Citizen of India / Subject of Nepal, Bhutan (as per Govt guidelines)",
  experience = "Freshers eligible for all direct posts unless specified in official circular",
  className = "",
}) => {
  return (
    <section aria-label="Eligibility Criteria" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <UserCheck className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Candidate Prerequisites
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Eligibility Criteria &amp; Age Limit
            </h2>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200/60">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Eligibility Verified</span>
          </div>
        </div>

        {/* 4-Box Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Educational Qualification */}
          <div className="p-5 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary-subtle)] text-[var(--primary)] flex items-center justify-center font-bold">
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                1. Educational Qualification
              </h3>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
              {qualificationSummary}
            </p>
            {qualificationsList.length > 0 && (
              <ul className="space-y-1.5 pt-1 text-xs text-slate-600 list-none p-0 m-0">
                {qualificationsList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Card 2: Age Limit & Relaxation */}
          <div className="p-5 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#D97706] flex items-center justify-center font-bold">
                <Calendar className="h-4 w-4" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                2. Age Criteria &amp; Cut-Off Date
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800">
                Minimum: <span className="text-[var(--primary)] font-black">{ageLimit?.minAge || 18} Years</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800">
                Maximum: <span className="text-[var(--primary)] font-black">{ageLimit?.maxAge || 32} Years</span>
              </div>
            </div>

            {ageLimit?.asOnDate && (
              <p className="text-xs text-slate-500 font-medium">
                Reference Date: <strong className="text-slate-700 font-bold">{ageLimit.asOnDate}</strong>
              </p>
            )}

            {ageLimit?.relaxationNotes && (
              <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/60 text-[11px] text-amber-900 leading-relaxed font-medium">
                <strong>Age Relaxation:</strong> {ageLimit.relaxationNotes}
              </div>
            )}
          </div>

          {/* Card 3: Nationality & Citizenship */}
          <div className="p-5 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Globe2 className="h-4 w-4" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                3. Nationality &amp; Domicile
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {nationality}
            </p>
            <p className="text-[11px] text-slate-400">
              Valid proof of identity (Aadhaar/Voter ID) mandatory during verification.
            </p>
          </div>

          {/* Card 4: Experience & Skills */}
          <div className="p-5 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Briefcase className="h-4 w-4" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                4. Experience &amp; Skill Mandates
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {experience}
            </p>
            <p className="text-[11px] text-slate-400">
              Proficiency in official working language preferred for state cadre postings.
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
};

EligibilityCard.displayName = "EligibilityCard";
