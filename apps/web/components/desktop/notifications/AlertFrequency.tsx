"use client";

import React, { useState } from "react";
import {
  Clock,
  Zap,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui";
import { AlertFrequencyType } from "@/services/notifications/notification.service";

export interface AlertFrequencyProps {
  initialFrequency?: AlertFrequencyType;
  className?: string;
}

const FREQUENCY_OPTIONS: {
  id: AlertFrequencyType;
  title: string;
  desc: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "INSTANT",
    title: "Instant Push Dispatch",
    desc: "Real-time notifications sent the minute a new circular or admit card is verified.",
    badge: "Recommended",
    icon: Zap,
  },
  {
    id: "DAILY",
    title: "Daily Morning Digest",
    desc: "A single consolidated summary delivered every morning at 08:00 AM IST.",
    badge: "Briefing",
    icon: CalendarDays,
  },
  {
    id: "WEEKLY",
    title: "Weekly Career Roundup",
    desc: "Comprehensive digest of the week's top government and private opportunities every Sunday.",
    badge: "Summary",
    icon: CalendarRange,
  },
];

export const AlertFrequency: React.FC<AlertFrequencyProps> = ({
  initialFrequency = "INSTANT",
  className = "",
}) => {
  const [selected, setSelected] = useState<AlertFrequencyType>(initialFrequency);
  const [isSaved, setIsSaved] = useState(false);

  const handleSelect = (freq: AlertFrequencyType) => {
    setSelected(freq);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <section aria-label="Alert Delivery Frequency" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Clock className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Delivery Cadence
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Alert Delivery Schedule &amp; Cadence
            </h2>
          </div>

          {isSaved && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Cadence Updated
            </span>
          )}
        </div>

        {/* 3-Option Radio Card Group */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="radiogroup" aria-label="Select alert cadence">
          {FREQUENCY_OPTIONS.map((opt) => {
            const isSelected = selected === opt.id;
            const Icon = opt.icon;

            return (
              <div
                key={opt.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => handleSelect(opt.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(opt.id);
                  }
                }}
                className={[
                  "p-5 rounded-xl border transition-all duration-150 flex flex-col justify-between space-y-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                  isSelected
                    ? "bg-slate-50 border-slate-900 shadow-xs ring-1 ring-slate-900"
                    : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50",
                ].join(" ")}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={[
                        "w-9 h-9 rounded-xl flex items-center justify-center border",
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-100 text-slate-700 border-slate-200",
                      ].join(" ")}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>

                    <span
                      className={[
                        "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-100 text-slate-600 border-slate-200",
                      ].join(" ")}
                    >
                      {opt.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {opt.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {opt.desc}
                  </p>
                </div>

                {/* Radio selection indicator */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500">
                    {isSelected ? "Active Delivery Mode" : "Click to Select"}
                  </span>
                  <div
                    className={[
                      "w-4 h-4 rounded-full border flex items-center justify-center",
                      isSelected
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 bg-white",
                    ].join(" ")}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
};

AlertFrequency.displayName = "AlertFrequency";
