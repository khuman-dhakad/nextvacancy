"use client";

import React, { useState } from "react";
import { TrendingUp, Globe } from "lucide-react";
import { Card } from "@/components/ui";
import { TrafficDataPoint, TopLandingPage } from "@/types";


export interface TrafficInsightsCardProps {
  initialData7d: TrafficDataPoint[];
  initialData30d: TrafficDataPoint[];
  landingPages: TopLandingPage[];
  className?: string;
}

export const TrafficInsightsCard: React.FC<TrafficInsightsCardProps> = ({
  initialData7d,
  initialData30d,
  landingPages,
  className = "",
}) => {
  const [timeframe, setTimeframe] = useState<"7d" | "30d">("7d");
  const currentChart = timeframe === "7d" ? initialData7d : initialData30d;

  // Max value calculation for proportional bar heights
  const maxViews = Math.max(...currentChart.map((d) => d.pageViews), 1000);

  return (
    <section aria-label="Traffic & Landing Page Insights" className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Traffic Visualizer Chart (7 cols) */}
        <Card className="lg:col-span-7 p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-[var(--primary)]" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Audience Velocity
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Traffic &amp; Page View Growth
              </h2>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setTimeframe("7d")}
                className={[
                  "px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer",
                  timeframe === "7d"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900",
                ].join(" ")}
              >
                Past 7 Days
              </button>
              <button
                type="button"
                onClick={() => setTimeframe("30d")}
                className={[
                  "px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer",
                  timeframe === "30d"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900",
                ].join(" ")}
              >
                Monthly Trend
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-4 pb-2">
            <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 px-2">
              {currentChart.map((point, index) => {
                const heightPercent = Math.round((point.pageViews / maxViews) * 100);
                const visitorHeight = Math.round((point.visitors / maxViews) * 100);

                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xs">
                      {(point.pageViews / 1000).toFixed(1)}k
                    </div>

                    {/* Stacked Bar container */}
                    <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end relative h-40">
                      {/* Total Page Views bar */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-[var(--primary)] to-[#1E3A8A] rounded-t-xl transition-all duration-500 relative flex items-end justify-center"
                      >
                        {/* Unique Visitors sub-fill */}
                        <div
                          style={{ height: `${visitorHeight}%` }}
                          className="w-full bg-amber-400/80 absolute bottom-0 rounded-t-lg"
                        />
                      </div>
                    </div>

                    {/* Label */}
                    <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                      {point.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[var(--primary)]" />
                <span>Total Page Views</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-400" />
                <span>Unique Visitors</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Column: Top Landing Pages (5 cols) */}
        <Card className="lg:col-span-5 p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-700" />
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Top Landing Pages
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-400 font-mono">
              Share %
            </span>
          </div>

          <div className="space-y-4">
            {landingPages.map((page, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold gap-2">
                  <span className="text-slate-800 truncate" title={page.title}>
                    {page.title}
                  </span>
                  <span className="text-slate-900 font-mono font-black shrink-0">
                    {page.views.toLocaleString("en-IN")} ({page.percentage}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${page.percentage * 2.5}%` }}
                    className="h-full bg-gradient-to-r from-blue-600 to-[var(--primary)] rounded-full transition-all duration-500"
                  />
                </div>

                <div className="text-[10px] text-slate-400 font-mono truncate">
                  {page.path}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center text-xs text-slate-500 font-medium border-t border-slate-100">
            Analytics synchronized across all active organic search channels
          </div>
        </Card>
      </div>
    </section>
  );
};

TrafficInsightsCard.displayName = "TrafficInsightsCard";
