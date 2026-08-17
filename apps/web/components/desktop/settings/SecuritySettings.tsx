"use client";

import React, { useState } from "react";
import {
  Shield,
  Smartphone,
  Laptop,
  CheckCircle2,
  History,
} from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";
import { UserSecuritySettings, UserLoginHistoryItem } from "@/services/settings/settings.service";

export interface SecuritySettingsProps {
  initialSecurity: UserSecuritySettings;
  className?: string;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  initialSecurity,
  className = "",
}) => {
  const [security, setSecurity] = useState<UserSecuritySettings>(initialSecurity);
  const [sessions, setSessions] = useState<UserLoginHistoryItem[]>(initialSecurity.activeSessions);

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const toggle2FA = () => {
    setSecurity((prev) => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled,
    }));
  };

  return (
    <section aria-label="Account Security and Session Audit" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Shield className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Access Audit
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Two-Factor Authentication &amp; Sessions
            </h2>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200/60">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>2FA Enhanced Security</span>
          </div>
        </div>

        {/* Two-Factor Authentication Card */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Two-Factor Authentication (2FA via SMS)
              </h3>
              <Badge variant={security.twoFactorEnabled ? "success" : "neutral"} size="sm">
                {security.twoFactorEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Require a high-security OTP sent to your registered mobile number upon every login attempt.
            </p>
          </div>

          <Button
            type="button"
            variant={security.twoFactorEnabled ? "outline" : "primary"}
            size="sm"
            onClick={toggle2FA}
            className="font-bold text-xs shrink-0"
          >
            {security.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
          </Button>
        </div>

        {/* Active Recognized Sessions */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Recognized Sessions ({sessions.length})
          </h3>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {sessions.map((sess) => {
              const isMobile = sess.device.toLowerCase().includes("iphone") || sess.device.toLowerCase().includes("android");
              const Icon = isMobile ? Smartphone : Laptop;

              return (
                <div
                  key={sess.id}
                  className="p-4 bg-white hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{sess.device}</span>
                        <span>•</span>
                        <span className="text-slate-500">{sess.browser}</span>
                        {sess.isCurrent && (
                          <Badge variant="success" size="sm" className="font-bold text-[9px] py-0">
                            Current Device
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        {sess.location} • IP: {sess.ipAddress} • {sess.timestamp}
                      </p>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeSession(sess.id)}
                      className="text-rose-600 hover:bg-rose-50 text-xs font-bold self-end sm:self-center"
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Historical Login Log */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <History className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Recent Login History
            </h3>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th scope="col" className="py-3 px-4">Device &amp; Browser</th>
                  <th scope="col" className="py-3 px-4">IP Address</th>
                  <th scope="col" className="py-3 px-4">Location</th>
                  <th scope="col" className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {security.loginHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {item.device} ({item.browser})
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {item.ipAddress}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.location}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 text-[11px]">
                      {item.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </section>
  );
};

SecuritySettings.displayName = "SecuritySettings";
