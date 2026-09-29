import React from "react";
import { NotificationTag } from "@/services/notifications/notification.service";

export interface NotificationFiltersProps {
  selectedTag: NotificationTag | "ALL";
  onTagSelect: (tag: NotificationTag | "ALL") => void;
  className?: string;
}

const FILTER_TAGS: { id: NotificationTag | "ALL"; label: string }[] = [
  { id: "ALL", label: "All Sectors" },
  { id: "GOVERNMENT", label: "Central Govt" },
  { id: "SSC", label: "SSC" },
  { id: "UPSC", label: "UPSC" },
  { id: "RAILWAY", label: "Railways" },
  { id: "BANKING", label: "Banking & IBPS" },
  { id: "PRIVATE", label: "Corporate & IT" },
];

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  selectedTag,
  onTagSelect,
  className = "",
}) => {
  return (
    <div
      aria-label="Notification Sector Filters"
      className={["flex items-center gap-2 overflow-x-auto no-scrollbar py-1", className].filter(Boolean).join(" ")}
    >
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
        Filter by:
      </span>

      {FILTER_TAGS.map((tag) => {
        const isSelected = selectedTag === tag.id;

        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => onTagSelect(tag.id)}
            aria-pressed={isSelected}
            className={[
              "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
              isSelected
                ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50",
            ].join(" ")}
          >
            {tag.label}
          </button>
        );
      })}
    </div>
  );
};

NotificationFilters.displayName = "NotificationFilters";
