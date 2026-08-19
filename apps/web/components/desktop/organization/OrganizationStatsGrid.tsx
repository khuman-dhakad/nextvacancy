import React from "react";
import { Briefcase, Users, FileText, Award } from "lucide-react";
import { Card } from "@/components/ui";
import { OrganizationStats } from "@/types";

export interface OrganizationStatsGridProps {
  stats: OrganizationStats;
  className?: string;
}

export const OrganizationStatsGrid: React.FC<OrganizationStatsGridProps> = ({
  stats,
  className = "",
}) => {
  const cards = [
    {
      id: "active-jobs",
      label: "Active Recruitment Drives",
      value: `${stats.activeVacanciesCount} Active`,
      icon: Briefcase,
      theme: "bg-blue-50 text-[var(--primary)] border-blue-200",
      textColor: "text-[var(--primary)]",
    },
    {
      id: "total-vacancies",
      label: "Total Open Vacancies",
      value: stats.totalPostsCount.toLocaleString("en-IN"),
      icon: Users,
      theme: "bg-emerald-50 text-emerald-700 border-emerald-200",
      textColor: "text-emerald-700",
    },
    {
      id: "admit-cards",
      label: "Admit Cards & Hall Tickets",
      value: `${stats.admitCardsCount} Available`,
      icon: FileText,
      theme: "bg-indigo-50 text-indigo-700 border-indigo-200",
      textColor: "text-indigo-700",
    },
    {
      id: "results",
      label: "Declared Results & Scorecards",
      value: `${stats.resultsCount} Released`,
      icon: Award,
      theme: "bg-amber-50 text-amber-800 border-amber-200",
      textColor: "text-amber-800",
    },
  ];

  return (
    <section aria-label="Organization Key Statistics" className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.id}
              className="p-5 bg-white border border-slate-200/90 rounded-2xl flex items-center gap-4 shadow-2xs hover:border-slate-300 transition-colors"
            >
              <div
                className={[
                  "w-12 h-12 rounded-xl flex items-center justify-center border shrink-0",
                  card.theme,
                ].join(" ")}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span
                  className={[
                    "text-xl sm:text-2xl font-black font-mono tracking-tight block leading-tight truncate",
                    card.textColor,
                  ].join(" ")}
                >
                  {card.value}
                </span>
                <span className="text-xs font-bold text-slate-500 block truncate">
                  {card.label}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

OrganizationStatsGrid.displayName = "OrganizationStatsGrid";
