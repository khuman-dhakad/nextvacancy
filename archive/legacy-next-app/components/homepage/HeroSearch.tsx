import React from "react";
import Link from "next/link";
import { Search, Sparkles, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { Container, Button, Badge } from "@/components/ui";

const POPULAR_SEARCHES = [
  { label: "SSC CGL 2026", q: "SSC CGL" },
  { label: "UPSC Civil Services", q: "UPSC" },
  { label: "RRB NTPC", q: "RRB" },
  { label: "IBPS PO / Clerk", q: "IBPS" },
  { label: "Police Constable", q: "Police" },
  { label: "PM Internship", q: "PM Internship" },
  { label: "Teaching / CTET", q: "Teaching" },
];

export const HeroSearch: React.FC = () => {
  return (
    <section
      aria-label="Job Search & Portal Introduction"
      className="bg-[var(--primary)] text-white pt-8 pb-10 sm:pt-12 sm:pb-14 relative overflow-hidden"
    >
      <Container size="lg" className="space-y-6 sm:space-y-8">
        {/* Headline & Badges */}
        <div className="max-w-3xl mx-auto text-center space-y-3.5">
          <div className="inline-flex items-center gap-2">
            <Badge variant="accent" size="md" dot>
              Authentic Indian Career & Exam Portal
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Find Your Next <span className="text-[#F59E0B]">Opportunity</span>
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Direct access to latest government jobs, private careers, admit cards, answer keys,
            and exam results across all central & state departments.
          </p>
        </div>

        {/* Primary Search Form */}
        <div className="max-w-2xl mx-auto">
          <form
            action="/search"
            method="GET"
            role="search"
            className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl bg-white shadow-xl border border-slate-200"
          >
            <div className="relative flex-1 w-full flex items-center">
              <Search className="absolute left-3.5 h-5 w-5 text-slate-400 pointer-events-none" aria-hidden="true" />
              <input
                type="search"
                name="q"
                placeholder="Search jobs, exams, organizations (e.g. SSC, UPSC, Railway, Bank)..."
                aria-label="Search jobs, exams, organizations"
                className="w-full pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none rounded-xl min-h-[44px]"
              />
            </div>
            <Button
              type="submit"
              variant="accent"
              size="md"
              className="w-full sm:w-auto px-6 font-bold shrink-0 min-h-[44px]"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Search
            </Button>
          </form>

          {/* Popular Search Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
              <Sparkles className="h-3.5 w-3.5 text-[#F59E0B]" aria-hidden="true" />
              <span>Trending:</span>
            </span>
            {POPULAR_SEARCHES.map((item) => (
              <Link
                key={item.q}
                href={`/search?q=${encodeURIComponent(item.q)}`}
                className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors border border-slate-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Value Props Strip */}
        <div className="pt-4 border-t border-[#183B66] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center max-w-4xl mx-auto text-xs text-slate-300">
          <div className="flex items-center justify-center gap-2 p-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>100% Verified Official Notifications</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2">
            <Zap className="h-4 w-4 text-[#F59E0B] shrink-0" aria-hidden="true" />
            <span>Instant Admit Card & Result Updates</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2">
            <Sparkles className="h-4 w-4 text-sky-400 shrink-0" aria-hidden="true" />
            <span>Direct Official Application Links</span>
          </div>
        </div>
      </Container>
    </section>
  );
};

HeroSearch.displayName = "HeroSearch";
