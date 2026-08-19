import React from "react";
import { Container } from "@/components/ui";
import { SearchPanel } from "./SearchPanel";
import { TrendingChips } from "./TrendingChips";
import { ShieldCheck, Sparkles, Building2, CheckCircle2 } from "lucide-react";

export const Hero: React.FC = () => {
  return (
    <section
      aria-label="Hero and Smart Search Experience"
      className="relative overflow-hidden text-white pt-12 pb-14 select-none"
      style={{
        background: "linear-gradient(135deg, #07172B 0%, #0F2744 50%, #153860 100%)",
      }}
    >
      {/* Ambient Lighting Background Accents */}
      <div
        className="absolute top-0 right-1/4 w-[550px] h-[380px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -left-20 w-[420px] h-[420px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <Container size="lg" className="relative space-y-8">
        {/* Top Hero Row */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Text Block */}
          <div className="w-full lg:w-8/12 space-y-4 text-left">
            {/* Live Gazette Verified Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/15 backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Gazette Verified Circulars &amp; Direct Official Links</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight text-white leading-[1.18]">
              India&apos;s Most Trusted
              <span className="block text-[#F59E0B] mt-1">
                Government &amp; Private Careers Portal
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-medium">
              Real-time authentic notifications, exam dates, admit cards, results,
              answer keys &amp; scholarships — directly verified from official gazettes.
            </p>

            {/* Quick Metrics Line */}
            <div className="flex items-center gap-5 pt-1 text-xs font-semibold text-slate-300 flex-wrap">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>54,000+ Active Vacancies</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-sky-400" />
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
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl space-y-4 w-full max-w-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Live Dispatch
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Updated Today
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="font-bold text-white truncate">SSC CGL 2026</span>
                  <span className="text-[11px] font-mono text-slate-300 font-bold">14,582 Posts</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="font-bold text-white truncate">RRB NTPC 2026</span>
                  <span className="text-[11px] font-mono text-slate-300 font-bold">11,558 Posts</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="font-bold text-white truncate">SBI PO 2026</span>
                  <span className="text-[11px] font-mono text-slate-300 font-bold">2,000 Posts</span>
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
