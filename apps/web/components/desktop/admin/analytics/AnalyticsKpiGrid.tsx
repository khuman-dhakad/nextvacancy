import React from "react";
import {
  Users,
  Eye,
  Briefcase,
  FileCheck,
  Share2,
  MousePointerClick,
  Clock,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui";
import { AnalyticsOverviewKPIs } from "@/types";

export interface AnalyticsKpiGridProps {
  kpis: AnalyticsOverviewKPIs;
  className?: string;
}

export const AnalyticsKpiGrid: React.FC<AnalyticsKpiGridProps> = ({
  kpis,
  className = "",
}) => {
  const cards = [
    {
      id: "visitors",
      label: "Total Monthly Visitors",
      value: kpis.totalVisitors.toLocaleString("en-IN"),
      change: kpis.totalVisitorsChange,
      icon: Users,
      theme: "bg-blue-50 text-[var(--primary)] border-blue-200",
      color: "text-[var(--primary)]",
    },
    {
      id: "pageviews",
      label: "Total Page Views",
      value: kpis.pageViews.toLocaleString("en-IN"),
      change: kpis.pageViewsChange,
      icon: Eye,
      theme: "bg-indigo-50 text-indigo-700 border-indigo-200",
      color: "text-indigo-700",
    },
    {
      id: "active-recruitment",
      label: "Active Recruitments",
      value: kpis.activeRecruitments.toString(),
      change: "Live in Portal",
      icon: Briefcase,
      theme: "bg-emerald-50 text-emerald-700 border-emerald-200",
      color: "text-emerald-700",
    },
    {
      id: "published-jobs",
      label: "Published Jobs (CMS)",
      value: kpis.publishedJobs.toString(),
      change: "Indexed Gazette",
      icon: FileCheck,
      theme: "bg-teal-50 text-teal-700 border-teal-200",
      color: "text-teal-700",
    },
    {
      id: "whatsapp-clicks",
      label: "WhatsApp Share Clicks",
      value: kpis.whatsappClicks.toLocaleString("en-IN"),
      change: kpis.whatsappClicksChange,
      icon: Share2,
      theme: "bg-green-50 text-green-700 border-green-200",
      color: "text-green-700",
    },
    {
      id: "apply-clicks",
      label: "Apply Button Clicks",
      value: kpis.applyClicks.toLocaleString("en-IN"),
      change: kpis.applyClicksChange,
      icon: MousePointerClick,
      theme: "bg-amber-50 text-[#D97706] border-amber-200",
      color: "text-[#D97706]",
    },
    {
      id: "session-duration",
      label: "Avg Session Duration",
      value: kpis.avgSessionDuration,
      change: "High Engagement",
      icon: Clock,
      theme: "bg-purple-50 text-purple-700 border-purple-200",
      color: "text-purple-700",
    },
    {
      id: "bounce-rate",
      label: "Portal Bounce Rate",
      value: kpis.bounceRate,
      change: "-4.2% Lower",
      icon: Activity,
      theme: "bg-rose-50 text-rose-700 border-rose-200",
      color: "text-rose-700",
    },
  ];

  return (
    <section aria-label="Analytics KPI Overview" className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              key={card.id}
              className="p-5 bg-white border border-slate-200/90 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={[
                    "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0",
                    card.theme,
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                {card.change.startsWith("+") ? (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ArrowUpRight className="h-3 w-3" />
                    {card.change}
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {card.change}
                  </span>
                )}
              </div>

              <div className="space-y-0.5">
                <span
                  className={[
                    "text-2xl sm:text-3xl font-black tracking-tight leading-none block font-mono",
                    card.color,
                  ].join(" ")}
                >
                  {card.value}
                </span>
                <h2 className="text-xs font-bold text-slate-700 leading-snug">
                  {card.label}
                </h2>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

AnalyticsKpiGrid.displayName = "AnalyticsKpiGrid";
