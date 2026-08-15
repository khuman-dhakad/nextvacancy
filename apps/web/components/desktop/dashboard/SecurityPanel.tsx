import React from "react";
import {
  ShieldCheck,
  Lock,
  Smartphone,
  Laptop,
  Globe,
  Key,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";
import { LoginSessionItem } from "@/services/dashboard/dashboard.service";

export interface SecurityPanelProps {
  sessions: LoginSessionItem[];
  className?: string;
}

export const SecurityPanel: React.FC<SecurityPanelProps> = ({
  sessions = [],
  className = "",
}) => {
  return (
    <section aria-label="Security and Account Privacy" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Account Protection
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Security Settings &amp; Active Sessions
            </h2>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200/60">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* 3-Column Security Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Password & Credentials */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[var(--primary)]">
                <Lock className="h-4 w-4" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-900">
                  Password &amp; Credentials
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Last changed 3 months ago. Strong alphanumeric password recommended.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              fullWidth
              className="font-bold text-xs"
              leftIcon={<Key className="h-3.5 w-3.5" />}
            >
              Change Password
            </Button>
          </div>

          {/* Card 2: Two-Factor Authentication */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-700">
                <Shield className="h-4 w-4" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-900">
                  Two-Factor Verification
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Receive instant SMS OTP codes on your registered mobile number for logins.
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                SMS 2FA Active
              </span>
              <Button variant="ghost" size="sm" className="font-bold text-xs text-slate-600">
                Configure
              </Button>
            </div>
          </div>

          {/* Card 3: Privacy & Data Export */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sky-700">
                <Globe className="h-4 w-4" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-900">
                  Privacy &amp; Data Control
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Manage personal recruitment telemetry, circular logs, or export your saved application record.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              fullWidth
              className="font-bold text-xs"
            >
              Export Account Data
            </Button>
          </div>
        </div>

        {/* Active Login Sessions Table */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Recognized Devices &amp; Sessions
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
                            Current Session
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        {sess.location} • IP: {sess.ipAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-slate-500 font-medium">{sess.lastActive}</span>
                    {!sess.isCurrent && (
                      <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50 text-xs font-bold">
                        Revoke
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </section>
  );
};

SecurityPanel.displayName = "SecurityPanel";
