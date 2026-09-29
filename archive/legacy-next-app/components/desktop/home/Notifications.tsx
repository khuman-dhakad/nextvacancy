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
  BriefcaseBusiness,
} from "lucide-react";
import type { JobPosting } from "@/types";

export interface NotificationItem {
  id: string;
  type: "job" | "admit-card" | "result" | "answer-key" | "scholarship";
  title: string;
  organization: string;
  date?: string;
  href: string;
  badgeLabel: string;
  badgeVariant: "success" | "info" | "warning" | "accent";
  actionLabel: string;
}

const TYPE_ICONS = {
  job: BriefcaseBusiness,
  "admit-card": FileCheck,
  result: Award,
  "answer-key": KeyRound,
  scholarship: GraduationCap,
};

export interface NotificationsProps {
  notifications?: NotificationItem[];
  jobs?: JobPosting[];
  className?: string;
}

export const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  jobs = [],
  className = "",
}) => {
  const displayList = notifications?.length ? notifications : jobs.map((j) => {
    let type: NotificationItem["type"] = "job";
    let badgeLabel = "Job listing";
    let badgeVariant: NotificationItem["badgeVariant"] = "info";
    let actionLabel = "View Details";

    if (j.status === "ADMIT_CARD_OUT" || j.category === "admit-card") {
      type = "admit-card";
      badgeLabel = "Admit Card Out";
      badgeVariant = "success";
      actionLabel = "View Details";
    } else if (j.status === "RESULT_OUT" || j.category === "result") {
      type = "result";
      badgeLabel = "Result Declared";
      badgeVariant = "accent";
      actionLabel = "View Details";
    } else if (j.status === "ANSWER_KEY_OUT" || j.category === "answer-key") {
      type = "answer-key";
      badgeLabel = "Answer Key";
      badgeVariant = "info";
      actionLabel = "View Details";
    } else if (j.category === "scholarship") {
      type = "scholarship";
      badgeLabel = "Scholarship";
      badgeVariant = "warning";
      actionLabel = "View Details";
    }

    return {
      id: j.id,
      type,
      title: j.title,
      organization: j.organization,
      date: j.importantDates?.notificationDate,
      href: `/jobs/${j.slug}`,
      badgeLabel,
      badgeVariant,
      actionLabel,
    };
  });

  return (
    <section
      aria-label="Latest Job Notifications and Updates"
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
              <span>Recent catalog updates</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Latest Job Notifications
            </h2>
            <p className="text-xs sm:text-sm text-pink-100 font-medium">
              Recently published job and examination updates from the catalog.
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
          {displayList.length > 0 ? displayList.slice(0, 6).map((item) => {
            const Icon = TYPE_ICONS[item.type];

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
                      {item.date && (
                        <span className="text-[11px] font-semibold text-slate-400">
                          {item.date}
                        </span>
                      )}
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
          }) : (
            <p role="status" className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-slate-500">
              No recent job notifications are available.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
};

Notifications.displayName = "Notifications";
