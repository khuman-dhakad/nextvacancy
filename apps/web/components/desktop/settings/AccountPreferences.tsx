"use client";

import React, { useState } from "react";
import {
  Bell,
  Mail,
  MessageCircle,
  Send,
  Moon,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui";
import { UserAccountPreferences } from "@/services/settings/settings.service";

export interface AccountPreferencesProps {
  initialPreferences: UserAccountPreferences;
  className?: string;
}

export const AccountPreferences: React.FC<AccountPreferencesProps> = ({
  initialPreferences,
  className = "",
}) => {
  const [prefs, setPrefs] = useState<UserAccountPreferences>(initialPreferences);
  const [isSaved, setIsSaved] = useState(false);

  const toggle = (key: keyof UserAccountPreferences) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const options = [
    {
      key: "emailNotifications" as const,
      title: "Email Notification Digests",
      desc: "Receive daily or instant verified gazette circular updates in your inbox.",
      icon: Mail,
      enabled: prefs.emailNotifications,
    },
    {
      key: "whatsappAlerts" as const,
      title: "WhatsApp Real-Time Alerts",
      desc: "Instant candidate alerts for admit card releases and closing date reminders.",
      icon: MessageCircle,
      enabled: prefs.whatsappAlerts,
    },
    {
      key: "telegramAlerts" as const,
      title: "Telegram Career Channel Push",
      desc: "Broadcast notifications via the official NEXTVACANCY verified Telegram channel.",
      icon: Send,
      enabled: prefs.telegramAlerts,
    },
    {
      key: "darkMode" as const,
      title: "Dark Theme Interface",
      desc: "High-contrast dark mode palette optimized for prolonged night reading sessions.",
      icon: Moon,
      enabled: prefs.darkMode,
    },
  ];

  return (
    <section aria-label="Account Channel and Theme Preferences" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Bell className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Notification &amp; Display Channels
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Account Preferences
            </h2>
          </div>

          {isSaved && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Updated
            </span>
          )}
        </div>

        {/* 2-Column Toggle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((opt) => {
            const Icon = opt.icon;

            return (
              <div
                key={opt.key}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-colors flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {opt.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={opt.enabled}
                  onClick={() => toggle(opt.key)}
                  className={[
                    "w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                    opt.enabled ? "bg-emerald-600" : "bg-slate-300",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "w-4 h-4 rounded-full bg-white shadow-xs absolute top-1 transition-transform",
                      opt.enabled ? "left-6" : "left-1",
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

AccountPreferences.displayName = "AccountPreferences";
