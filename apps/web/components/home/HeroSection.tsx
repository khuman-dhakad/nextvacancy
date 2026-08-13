import React from "react";
import Link from "next/link";
import { Container, Button } from "@/components/ui";
import { Search, ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";

export interface HeroSectionProps {
  className?: string;
}

const POPULAR_SEARCHES = [
  { label: "SSC CGL 2026", query: "SSC CGL" },
  { label: "UPSC Civil Services", query: "UPSC" },
  { label: "Railway NTPC", query: "RRB" },
  { label: "SBI & IBPS Bank PO", query: "Bank" },
  { label: "10th / 12th Pass Jobs", query: "12th" },
  { label: "Delhi Police Constable", query: "Police" },
  { label: "PM Internship Scheme", query: "Internship" },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  className = "",
}) => {
  return (
    <section
      aria-label="Homepage Search and Hero Banner"
      className={[
        "relative overflow-hidden bg-gradient-to-b from-[var(--primary)] via-[#132e4f] to-[var(--primary)] text-white pt-8 pb-10 sm:pt-12 sm:pb-14 border-b border-[var(--border-strong)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Subtle Background Glow Accent */}
      <div
        className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <Container size="lg" className="relative space-y-6 sm:space-y-8">
        {/* Title & Trust Badge */}
        <div className="max-w-3xl mx-auto text-center space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] sm:text-xs font-semibold text-slate-300 shadow-xs">
            <Zap className="h-3.5 w-3.5 text-[#F59E0B]" aria-hidden="true" />
            <span>Fast & Official Recruitment Portal 2026</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-snug text-white">
            Find Your Dream Career & <span className="text-[#F59E0B]">Sarkari Naukri</span> in India
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            100% verified notifications for UPSC, SSC, Railways, Banking, State PSCs, Corporate IT careers, Admit Cards, and Results with direct commission links.
          </p>
        </div>

        {/* Primary Search Input Card */}
        <div className="max-w-2xl mx-auto">
          <form
            action="/search"
            method="GET"
            role="search"
            className="flex flex-col sm:flex-row items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-white shadow-xl border border-slate-200"
          >
            <div className="relative flex-1 w-full flex items-center">
              <Search
                className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                name="q"
                placeholder="Search by exam, post name, qualification, or board (e.g. SSC, RRB, UPSC)..."
                aria-label="Search all recruitment opportunities"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none rounded-xl min-h-[44px]"
              />
            </div>
            <Button
              type="submit"
              variant="accent"
              size="md"
              className="w-full sm:w-auto px-6 font-bold shrink-0 min-h-[44px]"
              rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
            >
              Search
            </Button>
          </form>

          {/* Popular Search Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3.5 text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1 text-[11px] mr-1">
              <Sparkles className="h-3 w-3 text-[#F59E0B]" aria-hidden="true" />
              <span>Trending:</span>
            </span>
            {POPULAR_SEARCHES.map((item) => (
              <Link
                key={item.label}
                href={`/search?q=${encodeURIComponent(item.query)}`}
                className="px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors border border-slate-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Value Metrics */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-2 text-slate-300 text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <span>100% Free Public Alerts</span>
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <span>Zero Fake Notifications</span>
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <span>Direct Official Application Portals</span>
          </span>
        </div>
      </Container>
    </section>
  );
};

HeroSection.displayName = "HeroSection";
