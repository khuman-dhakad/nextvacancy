import React from "react";
import {
  Bell,
  Calendar,
  CheckCheck,
  ShieldCheck,
} from "lucide-react";
import { Container, Button, Badge } from "@/components/ui";

export interface NotificationHeaderProps {
  totalCount: number;
  unreadCount: number;
  onMarkAllRead?: () => void;
  className?: string;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  totalCount,
  unreadCount,
  onMarkAllRead,
  className = "",
}) => {

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header aria-label="Notification Center Header" className={["bg-white border-b border-slate-200 py-6 sm:py-8", className].filter(Boolean).join(" ")}>
      <Container size="lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Title & Badge */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F2744] to-[#183B66] text-white flex items-center justify-center font-black text-lg shadow-sm border border-slate-200 shrink-0 relative">
              <Bell className="h-6 w-6" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Notification Center
                </h1>
                <Badge variant={unreadCount > 0 ? "danger" : "success"} size="sm" className="font-bold">
                  {unreadCount > 0 ? `${unreadCount} Unread Alerts` : "All Caught Up"}
                </Badge>
                <span className="text-xs font-semibold text-slate-500">({totalCount} Total Alerts)</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  <span>{currentDate}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-600 font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Gazette Verified Circular Feeds</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Mark All Read Action */}
          <div className="flex items-center gap-3 shrink-0">
            {onMarkAllRead && unreadCount > 0 && (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onMarkAllRead}
                className="font-bold text-xs shadow-xs hover:bg-slate-50"
                leftIcon={<CheckCheck className="h-4 w-4 text-[var(--primary)]" />}
              >
                Mark All as Read
              </Button>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

NotificationHeader.displayName = "NotificationHeader";
