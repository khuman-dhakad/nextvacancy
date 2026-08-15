"use client";

import React, { useState } from "react";
import {
  Sliders,
  CheckCircle2,
  Bell,
  Briefcase,
  Award,
  FileCheck,
  GraduationCap,
  Building,
} from "lucide-react";
import { Card } from "@/components/ui";
import { NotificationPreferenceItem } from "@/services/notifications/notification.service";

export interface PreferencePanelProps {
  initialPreferences: NotificationPreferenceItem[];
  className?: string;
}

const getPreferenceIcon = (key: NotificationPreferenceItem["key"]) => {
  switch (key) {
    case "govtJobs":
      return Briefcase;
    case "privateJobs":
      return Building;
    case "results":
      return Award;
    case "admitCards":
      return FileCheck;
    case "scholarships":
      return GraduationCap;
    case "internships":
      return Bell;
    default:
      return Bell;
  }
};

export const PreferencePanel: React.FC<PreferencePanelProps> = ({
  initialPreferences = [],
  className = "",
}) => {
  const [preferences, setPreferences] = useState<NotificationPreferenceItem[]>(initialPreferences);
  const [isSaved, setIsSaved] = useState(false);

  const togglePreference = (id: string) => {
    setPreferences((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <section aria-label="Notification Topic Preferences" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sliders className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Alert Preferences
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Topic Subscription Controls
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {isSaved && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Updated Instantly
              </span>
            )}
          </div>
        </div>

        {/* 2-Column Toggle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {preferences.map((pref) => {
            const Icon = getPreferenceIcon(pref.key);

            return (
              <div
                key={pref.id}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-colors flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {pref.label}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      {pref.description}
                    </p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={pref.enabled}
                  onClick={() => togglePreference(pref.id)}
                  className={[
                    "w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                    pref.enabled ? "bg-emerald-600" : "bg-slate-300",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "w-4 h-4 rounded-full bg-white shadow-xs absolute top-1 transition-transform",
                      pref.enabled ? "left-6" : "left-1",
                    ].join(" ")}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
};

PreferencePanel.displayName = "PreferencePanel";
