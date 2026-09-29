import React from "react";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  FileCheck,
  Award,
  GraduationCap,
  Sparkles,
  FileEdit,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui";
import { AdminAnalyticsStats } from "@/types";

export interface AdminStatsGridProps {
  stats: AdminAnalyticsStats;
  className?: string;
}

export const AdminStatsGrid: React.FC<AdminStatsGridProps> = ({
  stats,
  className = "",
}) => {
  const cards = [
    {
      id: "total",
      label: "Total Published Jobs",
      count: stats.totalJobs,
      desc: "Live recruitments in database",
      href: "/admin/jobs",
      icon: Briefcase,
      theme: "bg-blue-50 text-[var(--primary)] border-blue-200",
      color: "text-[var(--primary)]",
    },
    {
      id: "govt",
      label: "Government Jobs",
      count: stats.govtJobs,
      desc: "UPSC, SSC, Railways, Defence",
      href: "/admin/jobs?category=government",
      icon: Building2,
      theme: "bg-emerald-50 text-emerald-700 border-emerald-200",
      color: "text-emerald-700",
    },
    {
      id: "private",
      label: "Private & Corporate IT",
      count: stats.privateJobs,
      desc: "Tech, banking & MNC drives",
      href: "/admin/jobs?category=private",
      icon: TrendingUp,
      theme: "bg-indigo-50 text-indigo-700 border-indigo-200",
      color: "text-indigo-700",
    },
    {
      id: "admit-cards",
      label: "Admit Cards & Hall Tickets",
      count: stats.admitCards,
      desc: "Active city slips & call letters",
      href: "/admin/jobs?category=admit-card",
      icon: FileCheck,
      theme: "bg-amber-50 text-[#D97706] border-amber-200",
      color: "text-[#D97706]",
    },
    {
      id: "results",
      label: "Results & Merit Lists",
      count: stats.results,
      desc: "Scorecards & answer keys",
      href: "/admin/jobs?category=result",
      icon: Award,
      theme: "bg-rose-50 text-rose-700 border-rose-200",
      color: "text-rose-700",
    },
    {
      id: "scholarships",
      label: "National Scholarships",
      count: stats.scholarships,
      desc: "Ministry fellowships & grants",
      href: "/admin/jobs?category=scholarship",
      icon: GraduationCap,
      theme: "bg-purple-50 text-purple-700 border-purple-200",
      color: "text-purple-700",
    },
    {
      id: "internships",
      label: "Internships & Apprenticeships",
      count: stats.internships,
      desc: "PM scheme & PSU apprenticeships",
      href: "/admin/jobs?category=internship",
      icon: Sparkles,
      theme: "bg-cyan-50 text-cyan-700 border-cyan-200",
      color: "text-cyan-700",
    },
    {
      id: "drafts",
      label: "Unpublished Drafts",
      count: stats.draftsCount,
      desc: "Pending review or revision",
      href: "/admin/jobs?status=CLOSED",
      icon: FileEdit,
      theme: "bg-slate-100 text-slate-700 border-slate-300",
      color: "text-slate-700",
    },
  ];

  return (
    <section aria-label="Recruitment Analytics Metrics" className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.id}
              href={card.href}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-2xl"
            >
              <Card className="p-5 bg-white border border-slate-200/90 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className={["w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105", card.theme].join(" ")}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="p-1 rounded-lg text-slate-300 group-hover:text-slate-600 transition-colors">
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className={["text-2xl sm:text-3xl font-black tracking-tight leading-none block font-mono", card.color].join(" ")}>
                    {card.count}
                  </span>
                  <h2 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[var(--primary)] transition-colors">
                    {card.label}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {card.desc}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

AdminStatsGrid.displayName = "AdminStatsGrid";
