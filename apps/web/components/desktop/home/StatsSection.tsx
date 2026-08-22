import React from "react";
import { Briefcase, FileCheck, Award, GraduationCap } from "lucide-react";
import { Container, Card } from "@/components/ui";

const STATS_DATA = [
  {
    id: "active-jobs",
    icon: Briefcase,
    iconBg: "bg-blue-50 text-[var(--primary)] border-blue-200/80",
    badge: "Live Circulars",
    badgeStyle: "bg-blue-50 text-[var(--primary)] border-blue-200/80",
    value: "54,280+",
    title: "Active Jobs",
    subtitle: "Central & State Vacancies",
  },
  {
    id: "admit-cards",
    icon: FileCheck,
    iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    badge: "Updated Today",
    badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    value: "460+",
    title: "Admit Cards",
    subtitle: "Hall Tickets & Exam City",
  },
  {
    id: "results",
    icon: Award,
    iconBg: "bg-purple-50 text-purple-700 border-purple-200/80",
    badge: "Verified",
    badgeStyle: "bg-purple-50 text-purple-700 border-purple-200/80",
    value: "1,240+",
    title: "Declared Results",
    subtitle: "Scorecards & Merit Lists",
  },
  {
    id: "internships",
    icon: GraduationCap,
    iconBg: "bg-amber-50 text-amber-800 border-amber-200/80",
    badge: "PM Scheme",
    badgeStyle: "bg-amber-50 text-amber-800 border-amber-200/80",
    value: "15,800+",
    title: "Internships",
    subtitle: "Corporate & PSU Schemes",
  },
];

export interface StatsSectionProps {
  className?: string;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ className = "" }) => {
  return (
    <section
      aria-label="Live Statistics"
      className={["py-6 bg-[#ECECEC]", className].filter(Boolean).join(" ")}
    >
      <Container size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {STATS_DATA.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.id}
                className="bg-white border border-[#B9C8D1] rounded-none p-4 sm:p-5 shadow-none hover:shadow-sm hover:border-[#850A42] transition-all duration-200 flex flex-col justify-between"
              >
                {/* Top Row: Icon + Badge */}
                <div className="flex items-center justify-between">
                  <div
                    className={[
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border",
                      item.iconBg,
                    ].join(" ")}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>

                  <span
                    className={[
                      "text-[11px] font-bold px-2.5 py-0.5 rounded-full border",
                      item.badgeStyle,
                    ].join(" ")}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="mt-5 space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono leading-none">
                    {item.value}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 pt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {item.subtitle}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

StatsSection.displayName = "StatsSection";
