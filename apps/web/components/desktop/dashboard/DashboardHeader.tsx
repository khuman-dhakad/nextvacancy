import React from "react";
import Link from "next/link";
import {
  Calendar,
  Search,
  Bell,
  User,
  ShieldCheck,
} from "lucide-react";
import { Container, Button, Badge } from "@/components/ui";
import { UserDashboardProfile } from "@/services/dashboard/dashboard.service";

export interface DashboardHeaderProps {
  profile: UserDashboardProfile;
  className?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  profile,
  className = "",
}) => {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <header aria-label="Dashboard Welcome Header" className={["bg-white border-b border-slate-200 py-6 sm:py-8", className].filter(Boolean).join(" ")}>
      <Container size="lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* User Profile & Welcome Greeting */}
          <div className="flex items-start sm:items-center gap-4">
            {/* User Avatar Circle */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F2744] to-[#183B66] text-white flex items-center justify-center font-black text-lg shadow-sm border border-slate-200 shrink-0">
              {initials || <User className="h-6 w-6" />}
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Welcome back, {profile.fullName}!
                </h1>
                <Badge variant="success" size="sm" className="font-bold">
                  Candidate Verified
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  <span>{currentDate}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-600 font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  <span>{profile.preferredState}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link href="/search">
              <Button
                variant="outline"
                size="md"
                className="font-bold text-xs shadow-xs"
                leftIcon={<Search className="h-3.5 w-3.5" />}
              >
                Search Vacancies
              </Button>
            </Link>

            <Link href="/admit-cards">
              <Button
                variant="primary"
                size="md"
                className="bg-[#0F2744] hover:bg-[#183B66] text-white font-bold text-xs shadow-xs"
                leftIcon={<Bell className="h-3.5 w-3.5" />}
              >
                Admit Cards &amp; Alerts
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
};

DashboardHeader.displayName = "DashboardHeader";
