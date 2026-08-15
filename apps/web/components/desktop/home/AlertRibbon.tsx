import React from "react";
import Link from "next/link";
import { Megaphone, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui";

export interface AlertRibbonItem {
  id: string;
  title: string;
  href: string;
  isNew?: boolean;
}

const DEFAULT_ALERTS: AlertRibbonItem[] = [
  {
    id: "1",
    title: "SSC CGL 2026 Detailed Notification & Syllabus Released – Apply Online",
    href: "/jobs/ssc-cgl-2026-recruitment",
    isNew: true,
  },
  {
    id: "2",
    title: "RRB NTPC Graduate & Non-Graduate Tier-I CBT Exam Schedule Published",
    href: "/jobs/railway-rrb-ntpc-2026-graduate-undergraduate",
    isNew: true,
  },
  {
    id: "3",
    title: "UPSC Civil Services (Preliminary) 2026 e-Admit Cards Active for Download",
    href: "/jobs/upsc-civil-services-2026-prelims",
    isNew: true,
  },
  {
    id: "4",
    title: "State Bank of India (SBI) Junior Associates 2026 Prelims Result Declared",
    href: "/results",
    isNew: false,
  },
];

export interface AlertRibbonProps {
  items?: AlertRibbonItem[];
  className?: string;
}

export const AlertRibbon: React.FC<AlertRibbonProps> = ({
  items = DEFAULT_ALERTS,
  className = "",
}) => {
  return (
    <section
      aria-label="Breaking Recruitment Notices"
      className={[
        "bg-white border-b border-slate-200 text-slate-800 text-xs py-2.5 overflow-hidden select-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Container size="lg" className="flex items-center justify-between gap-4">
        {/* Left Badge & Alert Stream */}
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* Breaking Ribbon Badge */}
          <div className="inline-flex items-center gap-1.5 font-black bg-[#0F2744] text-white px-3 py-1.5 rounded-lg text-[11px] tracking-wider uppercase shrink-0 shadow-xs">
            <Megaphone className="h-3.5 w-3.5 text-[#F59E0B] animate-pulse" aria-hidden="true" />
            <span>BREAKING NOTICES</span>
          </div>

          {/* Stepper buttons (UI controls) */}
          <div className="hidden sm:flex items-center gap-1 shrink-0">
            <button
              type="button"
              aria-label="Previous alert"
              className="h-7 w-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors border border-slate-200 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next alert"
              className="h-7 w-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors border border-slate-200 cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* Flowing Alerts Content */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar whitespace-nowrap text-xs font-semibold text-slate-800 pl-1">
            {items.map((item, idx) => (
              <React.Fragment key={item.id}>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 hover:text-[#1D4ED8] transition-colors shrink-0 group"
                >
                  {item.isNew && (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-black bg-[#EA580C] text-white uppercase tracking-wider shadow-2xs">
                      NEW
                    </span>
                  )}
                  <span className="text-slate-800 group-hover:text-[#1D4ED8]">{item.title}</span>
                </Link>
                {idx < items.length - 1 && (
                  <span className="text-slate-300 font-bold" aria-hidden="true">
                    •
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right Action: All Bulletins */}
        <Link
          href="/results"
          className="text-xs font-bold text-[#1D4ED8] hover:underline shrink-0 inline-flex items-center gap-1 group whitespace-nowrap pl-2"
        >
          <span>All Circulars</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </Link>
      </Container>
    </section>
  );
};

AlertRibbon.displayName = "AlertRibbon";
