import React from "react";
import Link from "next/link";
import { JobPosting } from "@/types";
import { Flame, ChevronRight } from "lucide-react";

export interface LiveTickerProps {
  updates: JobPosting[];
  className?: string;
}

export const LiveTicker: React.FC<LiveTickerProps> = ({
  updates = [],
  className = "",
}) => {
  if (!updates || updates.length === 0) return null;

  // Duplicate items to make an endless seamless marquee loop
  const tickerItems = [...updates, ...updates];

  return (
    <aside
      aria-label="Live Recruitment Notifications Ticker"
      className={[
        "bg-slate-900 border-b border-slate-800 text-white overflow-hidden py-2 text-xs select-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center">
        {/* Ticker Header Badge (Static on the left) */}
        <div className="px-3 sm:px-4 py-1 bg-[#D97706] text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shrink-0 z-10 shadow-md">
          <Flame className="h-3.5 w-3.5 animate-pulse" aria-hidden="true" />
          <span>Live Alerts</span>
        </div>

        {/* Marquee Track */}
        <div className="overflow-hidden flex-1 relative">
          <div className="animate-ticker flex items-center gap-6 whitespace-nowrap pl-4">
            {tickerItems.map((job, idx) => (
              <Link
                key={`${job.id}-${idx}`}
                href={`/jobs/${job.slug}`}
                className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors group text-xs font-medium"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" aria-hidden="true" />
                <span className="font-bold text-white group-hover:underline">
                  {job.organization}:
                </span>
                <span className="text-slate-300 truncate max-w-xs sm:max-w-md">
                  {job.title}
                </span>
                {job.status === "ENDING_SOON" && (
                  <span className="px-1.5 py-0.2 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold">
                    Ending Soon
                  </span>
                )}
                <ChevronRight className="h-3 w-3 text-slate-500 opacity-60 group-hover:opacity-100" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

LiveTicker.displayName = "LiveTicker";
