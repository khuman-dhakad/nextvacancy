import React from "react";
import Link from "next/link";
import { Container, Button, Badge } from "@/components/ui";
import { Search, ArrowRight, Sparkles } from "lucide-react";

export interface SearchHeroHeaderProps {
  title: string;
  description: string;
  badgeText?: string;
  defaultQuery?: string;
  basePath?: string;
  trendingTags?: { label: string; query: string }[];
}

const DEFAULT_TAGS = [
  { label: "SSC CGL", query: "SSC CGL" },
  { label: "UPSC CSE", query: "UPSC" },
  { label: "RRB NTPC", query: "RRB" },
  { label: "Bank PO", query: "Bank" },
  { label: "10th / 12th Pass", query: "12th" },
  { label: "Police", query: "Police" },
];

export const SearchHeroHeader: React.FC<SearchHeroHeaderProps> = ({
  title,
  description,
  badgeText = "Recruitment Directory",
  defaultQuery = "",
  basePath = "/search",
  trendingTags = DEFAULT_TAGS,
}) => {
  return (
    <section
      aria-label="Search and Category Header"
      className="bg-[var(--primary)] text-white pt-7 pb-9 sm:pt-10 sm:pb-12 border-b border-[var(--border-strong)]"
    >
      <Container size="lg" className="space-y-4 sm:space-y-6">
        {/* Title & Description */}
        <div className="max-w-3xl space-y-2">
          {badgeText && (
            <Badge variant="accent" size="sm">
              {badgeText}
            </Badge>
          )}
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="max-w-2xl">
          <form
            action={basePath}
            method="GET"
            role="search"
            className="flex flex-col sm:flex-row items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-white shadow-lg border border-slate-200"
          >
            <div className="relative flex-1 w-full flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" aria-hidden="true" />
              <input
                type="search"
                name="q"
                defaultValue={defaultQuery}
                placeholder="Search by post, exam, qualification, or department..."
                aria-label="Search recruitment opportunities"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none rounded-xl min-h-[42px]"
              />
            </div>
            <Button
              type="submit"
              variant="accent"
              size="md"
              className="w-full sm:w-auto px-5 font-bold shrink-0 min-h-[42px]"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Search
            </Button>
          </form>

          {/* Quick Trending Tags */}
          {trendingTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2.5 text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1 text-[11px] mr-1">
                <Sparkles className="h-3 w-3 text-[#F59E0B]" aria-hidden="true" />
                <span>Popular:</span>
              </span>
              {trendingTags.map((tag) => (
                <Link
                  key={tag.label}
                  href={`${basePath}?q=${encodeURIComponent(tag.query)}`}
                  className="px-2.5 py-0.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors border border-slate-700"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

SearchHeroHeader.displayName = "SearchHeroHeader";
