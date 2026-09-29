import React from "react";
import {
  FileCheck,
  Laptop,
  Activity,
  UserCheck,
  Award,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Card, Badge } from "@/components/ui";

export interface SelectionStepperProps {
  steps?: string[];
  className?: string;
}

const DEFAULT_STAGES = [
  {
    step: 1,
    title: "Application & OTR",
    desc: "Online form submission & scrutiny of eligibility",
    icon: FileCheck,
  },
  {
    step: 2,
    title: "Written Examination",
    desc: "Computer Based Test (CBT / Tier-1 & Tier-2)",
    icon: Laptop,
  },
  {
    step: 3,
    title: "Skill / Physical Test",
    desc: "Typing, Steno, Physical Efficiency Test (PET)",
    icon: Activity,
  },
  {
    step: 4,
    title: "Document Verification",
    desc: "Original certificate verification & biometric validation",
    icon: UserCheck,
  },
  {
    step: 5,
    title: "Final Merit List",
    desc: "Departmental cadre allocation & appointment",
    icon: Award,
  },
];

export const SelectionStepper: React.FC<SelectionStepperProps> = ({
  steps = [],
  className = "",
}) => {
  return (
    <section aria-label="Selection Process Stages" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Activity className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Stage-Wise Recruitment Plan
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Selection Process &amp; Evaluation Stages
            </h2>
          </div>

          <Badge variant="info" size="md" className="font-bold uppercase tracking-wider">
            5-Stage Evaluation
          </Badge>
        </div>

        {/* Horizontal Visual Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {DEFAULT_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isLast = idx === DEFAULT_STAGES.length - 1;

            return (
              <div
                key={stage.step}
                className="relative flex flex-col p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-[var(--primary-subtle)] hover:border-slate-300 transition-all duration-150 group"
              >
                {/* Stage Header: Number + Icon */}
                <div className="flex items-center justify-between mb-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs font-black flex items-center justify-center shadow-xs">
                    {stage.step}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 group-hover:text-[var(--primary)] flex items-center justify-center">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>

                {/* Stage Text */}
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-[var(--primary)] transition-colors">
                  {stage.title}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                  {stage.desc}
                </p>

                {/* Right Arrow for Desktop */}
                {!isLast && (
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300 pointer-events-none">
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Custom Circular Steps if provided in notification */}
        {steps.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 space-y-2">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
              <span>Gazette Mandated Evaluation Notes</span>
            </span>
            <ul className="space-y-1.5 text-xs text-amber-950 list-none p-0 m-0 font-medium">
              {steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-amber-800 shrink-0">Stage {idx + 1}:</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </section>
  );
};

SelectionStepper.displayName = "SelectionStepper";
