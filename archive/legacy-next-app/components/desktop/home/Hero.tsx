import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui";
import { SearchPanel } from "./SearchPanel";
import { TrendingChips } from "./TrendingChips";
import { Sparkles } from "lucide-react";
import type { JobPosting } from "@/types";

export interface HeroProps {
  jobs?: JobPosting[];
}

export const Hero: React.FC<HeroProps> = ({ jobs = [] }) => {
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
              <span>Recruitment listings and application information</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight max-w-3xl">
              Latest Government &amp; Private Job Notifications
              <span className="block text-amber-300 mt-1">
                Admit Cards, Results, Answer Keys &amp; More
              </span>
            </h1>

            <p className="text-sm text-pink-100 leading-relaxed max-w-2xl font-medium">
              Explore recruitment opportunities, application details, exam schedules, and career information across India.
            </p>

          </div>

          {jobs.length > 0 && (
          <div className="w-full lg:w-4/12 hidden lg:flex justify-end items-center relative">
            <div className="p-5 rounded-md bg-white text-slate-900 border border-pink-200 shadow-xl space-y-4 w-full max-w-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#850A42]">
                  Featured vacancies
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {jobs.slice(0, 3).map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.slug}`}
                    className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                  >
                    <span className="font-bold text-[#064D79] truncate">{job.title}</span>
                    <span className="text-[11px] font-mono text-slate-500 font-bold shrink-0">
                      {job.totalVacancies} Posts
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          )}
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
