import React from "react";
import { Container, Card } from "@/components/ui";

export interface LiveStatItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  badge: string;
  badgeStyle: string;
  value: string | number;
  title: string;
  subtitle: string;
}

export interface StatsSectionProps {
  stats?: LiveStatItem[];
  className?: string;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats = [], className = "" }) => {
  if (stats.length === 0) return null;

  return (
    <section
      aria-label="Live Statistics"
      className={["py-6 bg-[#ECECEC]", className].filter(Boolean).join(" ")}
    >
      <Container size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((item) => {
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
