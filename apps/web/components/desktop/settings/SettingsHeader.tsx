import React from "react";
import {
  User,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { Container, Badge } from "@/components/ui";

import { UserProfileData } from "@/services/settings/settings.service";

export interface SettingsHeaderProps {
  profile: UserProfileData;
  className?: string;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  profile,
  className = "",
}) => {
  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <header aria-label="Account Settings Header" className={["bg-white border-b border-slate-200 py-6 sm:py-8", className].filter(Boolean).join(" ")}>
      <Container size="lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* User Profile Avatar & Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F2744] to-[#183B66] text-white flex items-center justify-center font-black text-lg shadow-sm border border-slate-200 shrink-0">
              {initials || <User className="h-6 w-6" />}
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Account Settings &amp; Profile
                </h1>
                <Badge variant="success" size="sm" className="font-bold">
                  {profile.accountStatus === "ACTIVE" ? "Verified Candidate" : profile.accountStatus}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="text-slate-700 font-semibold">{profile.fullName}</span>
                <span>•</span>
                <span className="text-slate-600 font-medium">{profile.email}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  <span>Last synced: {profile.lastUpdated}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Verification Seal */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/70 shrink-0">
            <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <span>Profile 100% Complete</span>
          </div>
        </div>
      </Container>
    </header>
  );
};

SettingsHeader.displayName = "SettingsHeader";
