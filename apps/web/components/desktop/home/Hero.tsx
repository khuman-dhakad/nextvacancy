import React from "react";
import { Container } from "@/components/ui";
import { SearchPanel } from "./SearchPanel";
import { TrendingChips } from "./TrendingChips";
import { ShieldCheck, Sparkles, Building2, CheckCircle2 } from "lucide-react";

export const Hero: React.FC = () => {
  return (
    <section
      aria-label="Hero and Smart Search Experience"
      className="relative overflow-hidden text-white pt-8 pb-10 select-none bg-[#850A42] border-b border-[#630731]"
    >
      <Container size="lg" className="relative space-y-8">
        {/* Top Hero Row */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Text Block */}
          <div className="w-full lg:w-8/12 space-y-4 text-left">
            {/* Live Gazette Verified Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-pink-50 text-xs font-bold border border-white/25">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Gazette Verified Circulars &amp; Direct Official Links</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight max-w-3xl">
              Latest Government &amp; Private Job Notifications
              <span className="block text-amber-300 mt-1">
                Admit Cards, Results, Answer Keys &amp; More
              </span>
            </h1>

            <p className="text-sm text-pink-100 leading-relaxed max-w-2xl font-medium">
              Find verified recruitment updates, official application links, exam schedules, and career opportunities across India.
            </p>

            {/* Quick Metrics Line */}
            <div className="flex items-center gap-5 pt-1 text-xs font-semibold text-pink-100 flex-wrap">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>54,000+ Active Vacancies</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                <span>100% Zero Clickbait</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-amber-400" />
                <span>Central &amp; All 28 States</span>
              </span>
            </div>
          </div>

          {/* Right SVG Architecture Emblem */}
          <div className="w-full lg:w-4/12 hidden lg:flex justify-end items-center pointer-events-none select-none relative">
            <div className="p-5 rounded-md bg-white text-slate-900 border border-pink-200 shadow-xl space-y-4 w-full max-w-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#850A42]">
                  Live Dispatch
                </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  Updated Today
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-[#064D79] truncate">SSC CGL 2026</span>
                  <span className="text-[11px] font-mono text-slate-500 font-bold">14,582 Posts</span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-[#064D79] truncate">RRB NTPC 2026</span>
                  <span className="text-[11px] font-mono text-slate-500 font-bold">11,558 Posts</span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-[#064D79] truncate">SBI PO 2026</span>
                  <span className="text-[11px] font-mono text-slate-500 font-bold">2,000 Posts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Filter Search Panel */}
        <SearchPanel />

        {/* Trending Searches Row */}
        <TrendingChips />
      </Container>
    </section>
  );
};

Hero.displayName = "Hero";
