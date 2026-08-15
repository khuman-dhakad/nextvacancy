import React from "react";
import Link from "next/link";
import {
  Bookmark,
  FileCheck,
  Award,
  BellRing,
  ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui";
import { DashboardStats } from "@/services/dashboard/dashboard.service";

export interface OverviewCardsProps {
  stats: DashboardStats;
  className?: string;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  stats,
  className = "",
}) => {
  const cards = [
    {
      id: "saved",
      title: "Saved Vacancies",
      count: stats.savedJobsCount,
      desc: "Bookmarked recruitment circulars",
      href: "#saved-jobs",
      icon: Bookmark,
      theme: "bg-blue-50 text-[var(--primary)] border-blue-200",
      countColor: "text-[var(--primary)]",
    },
    {
      id: "applied",
      title: "Applications Tracked",
      count: stats.appliedJobsCount,
      desc: "Active candidature in progress",
      href: "#application-tracker",
      icon: FileCheck,
      theme: "bg-emerald-50 text-emerald-700 border-emerald-200",
      countColor: "text-emerald-700",
    },
    {
      id: "admit-cards",
      title: "Admit Cards Live",
      count: stats.admitCardsCount,
      desc: "Hall tickets & exam city slips",
      href: "/admit-cards",
      icon: Award,
      theme: "bg-amber-50 text-[#D97706] border-amber-200",
      countColor: "text-[#D97706]",
    },
    {
      id: "notifications",
      title: "Gazette Bulletins",
      count: stats.unreadNotificationsCount,
      desc: "Official release updates today",
      href: "#notification-preferences",
      icon: BellRing,
      theme: "bg-rose-50 text-rose-700 border-rose-200",
      countColor: "text-rose-700",
    },
  ];

  return (
    <section aria-label="Dashboard Overview Metrics" className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.id} href={card.href} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-2xl">
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
                  <span className="text-2xl sm:text-3xl font-black tracking-tight leading-none block font-mono" style={{ color: "var(--foreground)" }}>
                    <span className={card.countColor}>{card.count}</span>
                  </span>
                  <h2 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[var(--primary)] transition-colors">
                    {card.title}
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

OverviewCards.displayName = "OverviewCards";
