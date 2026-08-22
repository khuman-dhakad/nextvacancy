import React from "react";
import Link from "next/link";
import { Container, Card, Badge, Button } from "@/components/ui";
import {
  BellRing,
  FileCheck,
  Award,
  KeyRound,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export interface NotificationItem {
  id: string;
  type: "admit-card" | "result" | "answer-key" | "scholarship";
  title: string;
  organization: string;
  date: string;
  href: string;
  badgeLabel: string;
  badgeVariant: "success" | "info" | "warning" | "accent";
  actionLabel: string;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "admit-card",
    title: "UPSC Civil Services (Preliminary) Examination 2026 e-Admit Card & Exam City Slip Released",
    organization: "Union Public Service Commission (UPSC)",
    date: "15 Aug 2026 • 2 hours ago",
    href: "/jobs/upsc-civil-services-2026-prelims",
    badgeLabel: "Admit Card Out",
    badgeVariant: "success",
    actionLabel: "Download Admit Card",
  },
  {
    id: "notif-2",
    type: "result",
    title: "SSC Combined Higher Secondary (10+2) Level Tier-II Final Merit List & Cut-off Marks Declared",
    organization: "Staff Selection Commission (SSC)",
    date: "14 Aug 2026 • Yesterday",
    href: "/results",
    badgeLabel: "Result Declared",
    badgeVariant: "accent",
    actionLabel: "Check Merit List",
  },
  {
    id: "notif-3",
    type: "answer-key",
    title: "RRB Assistant Loco Pilot (ALP) 2026 CBT Stage-I Official Answer Key & Objection Tracker Live",
    organization: "Railway Recruitment Control Board",
    date: "13 Aug 2026",
    href: "/jobs/railway-rrb-ntpc-2026-graduate-undergraduate",
    badgeLabel: "Answer Key Live",
    badgeVariant: "info",
    actionLabel: "View Answer Key",
  },
  {
    id: "notif-4",
    type: "scholarship",
    title: "National Scholarship Portal (NSP) Post-Matric & Higher Education Merit Schemes 2026-27 Open",
    organization: "Ministry of Electronics & IT / UGC",
    date: "12 Aug 2026",
    href: "/search?q=Scholarship",
    badgeLabel: "Scholarship Grant",
    badgeVariant: "warning",
    actionLabel: "Apply for Grant",
  },
];

const TYPE_ICONS = {
  "admit-card": FileCheck,
  result: Award,
  "answer-key": KeyRound,
  scholarship: GraduationCap,
};

export interface NotificationsProps {
  notifications?: NotificationItem[];
  className?: string;
}

export const Notifications: React.FC<NotificationsProps> = ({
  notifications = DEFAULT_NOTIFICATIONS,
  className = "",
}) => {
  return (
    <section
      aria-label="Latest Examination Notifications and Results"
      className={["py-8 bg-[#ECECEC] border-b border-slate-300", className]
        .filter(Boolean)
        .join(" ")}
    >
      <Container size="lg" className="space-y-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#850A42] text-white px-4 py-3 border border-[#630731]">
          <div className="space-y-1">
            <div className="hidden sm:inline-flex items-center gap-1.5 text-pink-100 text-[11px] font-bold">
              <BellRing className="h-3 w-3 text-amber-300 animate-pulse" aria-hidden="true" />
              <span>Real-Time Bulletin</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Latest Job Notifications
            </h2>
            <p className="text-xs sm:text-sm text-pink-100 font-medium">
              Immediate releases for admit cards, answer keys, results, and student grants.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/admit-cards">
              <Button
                variant="outline"
                size="sm"
                className="font-bold text-xs rounded-xl shadow-2xs hover:bg-[#0F2744] hover:text-white hover:border-[#0F2744] transition-all"
              >
                All Admit Cards
              </Button>
            </Link>
            <Link href="/results">
              <Button
                variant="outline"
                size="sm"
                className="font-bold text-xs rounded-xl shadow-2xs hover:bg-[#0F2744] hover:text-white hover:border-[#0F2744] transition-all"
              >
                All Results
              </Button>
            </Link>
          </div>
        </div>

        {/* Notifications Editorial List */}
        <div className="space-y-3.5">
          {notifications.map((item) => {
            const Icon = TYPE_ICONS[item.type] || Sparkles;

            return (
              <Card
                key={item.id}
                hoverable
                className="bg-white border border-[#8FAAB8] rounded-none p-4 sm:p-5 shadow-none hover:border-[#850A42] hover:shadow-sm transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
              >
                {/* Left Content */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded bg-[#F8E7EF] text-[#850A42] border border-pink-200 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>

                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <Badge variant={item.badgeVariant} size="sm" dot>
                        {item.badgeLabel}
                      </Badge>
                      <span className="text-xs font-bold text-slate-500 truncate">
                        {item.organization}
                      </span>
                      <span className="text-slate-300 hidden sm:inline">•</span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {item.date}
                      </span>
                    </div>

                    <Link
                      href={item.href}
                      className="block text-sm sm:text-base font-bold text-[#064D79] group-hover:text-[#850A42] transition-colors leading-snug line-clamp-2"
                    >
                      {item.title}
                    </Link>
                  </div>
                </div>

                {/* Right Action */}
                <div className="shrink-0 pt-2 lg:pt-0">
                  <Link href={item.href}>
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full sm:w-auto font-bold text-xs bg-[#0F2744] hover:bg-[#183B66] text-white rounded-xl shadow-xs"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      {item.actionLabel}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

Notifications.displayName = "Notifications";
