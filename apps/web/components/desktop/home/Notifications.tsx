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
  ExternalLink,
  Calendar,
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
      className={["py-14 bg-white border-b border-slate-200", className]
        .filter(Boolean)
        .join(" ")}
    >
      <Container size="lg" className="space-y-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-200/80">
              <BellRing className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Gazette Daily Bulletin</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Latest Notifications &amp; Official Releases
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Real-time circulars for admit cards, answer keys, scorecards, and student scholarship
              grants across national and state examination boards.
            </p>
          </div>

          <Link href="/results" className="shrink-0">
            <Button
              variant="outline"
              size="md"
              className="font-bold text-xs sm:text-sm shadow-xs"
              rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
            >
              All Circulars &amp; Results
            </Button>
          </Link>
        </div>

        {/* Editorial Newspaper-Style Feed Card */}
        <Card className="bg-white border border-slate-200/90 rounded-2xl shadow-xs divide-y divide-slate-100 overflow-hidden">
          {notifications.map((item) => {
            const Icon = TYPE_ICONS[item.type];

            return (
              <div
                key={item.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/90 transition-colors group"
              >
                <div className="flex items-start gap-4 min-w-0">
                  {/* Category Icon Badge */}
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-[var(--primary-subtle)] text-[var(--primary)] flex items-center justify-center shrink-0 transition-colors mt-0.5 border border-slate-200/60">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  {/* Notification Details */}
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={item.badgeVariant} size="sm">
                        {item.badgeLabel}
                      </Badge>
                      <span className="text-xs font-bold text-slate-700 truncate">
                        {item.organization}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                        <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
                        Verified
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[var(--secondary)] transition-colors leading-snug">
                      <Link
                        href={item.href}
                        className="focus-visible:outline-none focus-visible:underline"
                      >
                        {item.title}
                      </Link>
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                      <time dateTime={item.date}>{item.date}</time>
                    </div>
                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="pt-2 sm:pt-0 shrink-0">
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-bold text-xs text-[var(--primary)] hover:bg-[var(--primary-subtle)] px-4 py-2 min-h-[38px] border border-slate-200/80"
                      rightIcon={<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />}
                    >
                      {item.actionLabel}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </Card>
      </Container>
    </section>
  );
};

Notifications.displayName = "Notifications";
