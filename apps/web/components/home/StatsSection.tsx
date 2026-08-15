import React from "react";
import { Briefcase, FileCheck, Award, GraduationCap } from "lucide-react";
import { Container, Card } from "@/components/ui";

const STATS_DATA = [
  {
    id: "vacancies",
    icon: Briefcase,
    iconBg: "bg-blue-50 text-[var(--secondary)]",
    badge: "Live",
    badgeStyle: "bg-blue-50 text-[var(--secondary)] border-blue-200/80",
    value: "54,280+",
    title: "Active Vacancies",
    subtitle: "Central & State Govt Jobs",
  },
  {
    id: "admit-cards",
    icon: FileCheck,
    iconBg: "bg-emerald-50 text-emerald-700",
    badge: "Updated Today",
    badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    value: "460+",
    title: "Admit Cards",
    subtitle: "Hall Ticket / Call Letters",
  },
  {
    id: "results",
    icon: Award,
    iconBg: "bg-purple-50 text-purple-700",
    badge: "Verified",
    badgeStyle: "bg-purple-50 text-purple-700 border-purple-200/80",
    value: "1,240+",
    title: "Results Declared",
    subtitle: "Scorecards & Merit Lists",
  },
  {
    id: "scholarships",
    icon: GraduationCap,
    iconBg: "bg-orange-50 text-[#EA580C]",
    badge: "New",
    badgeStyle: "bg-orange-50 text-[#EA580C] border-orange-200/80",
    value: "15,800+",
    title: "Scholarships & Grants",
    subtitle: "PM Schemes & Opportunities",
  },
];

export interface StatsSectionProps {
  className?: string;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ className = "" }) => {
  return (
    <section
      aria-label="Live Market Statistics"
      className={["py-6 bg-[#F8FAFC]", className].filter(Boolean).join(" ")}
    >
      <Container size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS_DATA.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.id}
                className="bg-white border border-slate-200/90 rounded-[20px] p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                {/* Top Row: Icon + Badge */}
                <div className="flex items-center justify-between">
                  <div
                    className={[
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100",
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
                  <div className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                    {item.value}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 pt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
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
