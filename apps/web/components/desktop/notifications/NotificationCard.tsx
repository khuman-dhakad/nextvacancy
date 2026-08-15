import React from "react";
import Link from "next/link";
import {
  Bell,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Briefcase,
  Award,
} from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { NotificationItem } from "@/services/notifications/notification.service";

export interface NotificationCardProps {
  notification: NotificationItem;
  onMarkAsRead?: (id: string) => void;
  className?: string;
}

const getCategoryMeta = (category: NotificationItem["category"]) => {
  switch (category) {
    case "JOBS":
      return { icon: Briefcase, color: "text-[var(--primary)]", bg: "bg-blue-50", badgeVariant: "neutral" as const };
    case "RESULTS":
      return { icon: Award, color: "text-amber-700", bg: "bg-amber-50", badgeVariant: "accent" as const };
    case "ADMIT_CARDS":
      return { icon: FileCheck, color: "text-emerald-700", bg: "bg-emerald-50", badgeVariant: "success" as const };
    case "SCHOLARSHIPS":
      return { icon: Bell, color: "text-purple-700", bg: "bg-purple-50", badgeVariant: "info" as const };
    default:
      return { icon: Bell, color: "text-slate-700", bg: "bg-slate-50", badgeVariant: "neutral" as const };
  }
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  className = "",
}) => {
  const meta = getCategoryMeta(notification.category);
  const Icon = meta.icon;

  return (
    <article
      aria-label={notification.title}
      className={[
        "p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-start justify-between gap-4 group",
        notification.isRead
          ? "bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs"
          : "bg-blue-50/30 border-blue-200/80 hover:bg-blue-50/50 hover:border-blue-300 hover:shadow-xs",
        notification.urgency === "URGENT" ? "border-l-4 border-l-rose-500" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-start gap-4 min-w-0 flex-1">
        {/* Soft Icon Badge */}
        <div
          className={[
            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-slate-200/80 transition-transform group-hover:scale-105",
            meta.bg,
            meta.color,
          ].join(" ")}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>

        {/* Content Body */}
        <div className="space-y-1.5 min-w-0 flex-1">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
              {notification.organization}
            </span>

            <Badge variant={meta.badgeVariant} size="sm" className="text-[10px]">
              {notification.tag}
            </Badge>

            {notification.urgency === "URGENT" && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                <AlertTriangle className="h-2.5 w-2.5" />
                Urgent
              </span>
            )}

            {!notification.isRead && (
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" aria-label="Unread notification" />
            )}
          </div>

          {/* Title */}
          <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-[var(--primary)] transition-colors">
            <Link href={notification.actionUrl} className="focus-visible:underline">
              {notification.title}
            </Link>
          </h2>

          {/* Description */}
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {notification.description}
          </p>

          {/* Footer Timestamp & Verification */}
          <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-slate-400" aria-hidden="true" />
              <span>{notification.timestamp}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="h-3 w-3" />
              <span>Official Release</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 self-stretch sm:self-center justify-between sm:justify-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 w-full sm:w-auto">
        <Link href={notification.actionUrl} className="w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto font-bold text-xs shadow-2xs group-hover:border-[var(--primary)] group-hover:bg-[var(--primary-subtle)] group-hover:text-[var(--primary)] transition-colors"
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
          >
            {notification.actionLabel}
          </Button>
        </Link>

        {onMarkAsRead && !notification.isRead && (
          <button
            type="button"
            onClick={() => onMarkAsRead(notification.id)}
            className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 transition-colors focus-visible:outline-none focus-visible:underline cursor-pointer"
          >
            Mark read
          </button>
        )}
      </div>
    </article>
  );
};

NotificationCard.displayName = "NotificationCard";
