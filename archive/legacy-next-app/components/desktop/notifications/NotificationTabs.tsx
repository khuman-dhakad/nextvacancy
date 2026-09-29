import React from "react";
import {
  Bell,
  Briefcase,
  Award,
  FileCheck,
  GraduationCap,
} from "lucide-react";
import { NotificationCategory } from "@/services/notifications/notification.service";

export interface NotificationTabsProps {
  activeTab: NotificationCategory;
  onTabChange: (tab: NotificationCategory) => void;
  counts: Record<NotificationCategory, number>;
  className?: string;
}

const TABS: { id: NotificationCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "ALL", label: "All Updates", icon: Bell },
  { id: "JOBS", label: "Recruitments", icon: Briefcase },
  { id: "RESULTS", label: "Results & Keys", icon: Award },
  { id: "ADMIT_CARDS", label: "Admit Cards", icon: FileCheck },
  { id: "SCHOLARSHIPS", label: "Scholarships", icon: GraduationCap },
];

export const NotificationTabs: React.FC<NotificationTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
  className = "",
}) => {
  return (
    <nav
      aria-label="Notification Category Tabs"
      className={["flex items-center gap-2 border-b border-slate-200 pb-px overflow-x-auto no-scrollbar", className].filter(Boolean).join(" ")}
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const count = counts[tab.id] || 0;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={[
              "flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
              isActive
                ? "border-[var(--primary)] text-[var(--primary)] bg-slate-50/80 rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300",
            ].join(" ")}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{tab.label}</span>
            <span
              className={[
                "text-[10px] font-black px-1.5 py-0.5 rounded-full",
                isActive
                  ? "bg-[var(--primary)] text-white"
                  : "bg-slate-200 text-slate-700",
              ].join(" ")}
            >
              {count}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

NotificationTabs.displayName = "NotificationTabs";
