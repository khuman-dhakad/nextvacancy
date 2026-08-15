"use client";

import React, { useState } from "react";
import {
  Bell,
  Mail,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui";

import { NotificationPreference } from "@/services/dashboard/dashboard.service";

export interface NotificationPreferencesProps {
  initialPreferences: NotificationPreference[];
  className?: string;
}

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  initialPreferences = [],
  className = "",
}) => {
  const [preferences, setPreferences] = useState<NotificationPreference[]>(initialPreferences);
  const [isSaved, setIsSaved] = useState(false);

  const toggleEmail = (id: string) => {
    setPreferences((prev) =>
      prev.map((p) => (p.id === id ? { ...p, emailEnabled: !p.emailEnabled } : p))
    );
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const toggleWhatsApp = (id: string) => {
    setPreferences((prev) =>
      prev.map((p) => (p.id === id ? { ...p, whatsappEnabled: !p.whatsappEnabled } : p))
    );
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <section id="notification-preferences" aria-label="Notification Preferences" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Bell className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Real-Time Circular Dispatches
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Notification &amp; Alert Channels
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {isSaved && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Preferences Saved
              </span>
            )}
          </div>
        </div>

        {/* List of Notification Category Toggles */}
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {preferences.map((pref) => (
            <div
              key={pref.id}
              className="p-4 sm:p-5 bg-white hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Category Description */}
              <div className="space-y-1 max-w-xl">
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {pref.label}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {pref.description}
                </p>
              </div>

              {/* Dual Toggle Switches: Email & WhatsApp */}
              <div className="flex items-center gap-4 shrink-0">
                {/* Email Channel Toggle */}
                <button
                  type="button"
                  onClick={() => toggleEmail(pref.id)}
                  aria-pressed={pref.emailEnabled}
                  className={[
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                    pref.emailEnabled
                      ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                      : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200",
                  ].join(" ")}
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Email</span>
                  <span
                    className={[
                      "w-2 h-2 rounded-full",
                      pref.emailEnabled ? "bg-emerald-400" : "bg-slate-400",
                    ].join(" ")}
                  />
                </button>

                {/* WhatsApp Channel Toggle */}
                <button
                  type="button"
                  onClick={() => toggleWhatsApp(pref.id)}
                  aria-pressed={pref.whatsappEnabled}
                  className={[
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600",
                    pref.whatsappEnabled
                      ? "bg-emerald-600 text-white border-emerald-700 shadow-2xs"
                      : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200",
                  ].join(" ")}
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>WhatsApp</span>
                  <span
                    className={[
                      "w-2 h-2 rounded-full",
                      pref.whatsappEnabled ? "bg-white" : "bg-slate-400",
                    ].join(" ")}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
};

NotificationPreferences.displayName = "NotificationPreferences";
