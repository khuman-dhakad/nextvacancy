import React from "react";
import {
  History,
  PlusCircle,
  Edit3,
  Trash2,
  Globe,
  Copy,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { AdminActivityLog, AdminActionType } from "@/types";

export interface AdminRecentActivityProps {
  activities: AdminActivityLog[];
  className?: string;
}

const getActionMeta = (action: AdminActionType) => {
  switch (action) {
    case "CREATE":
      return { label: "Created", variant: "success" as const, icon: PlusCircle, bg: "text-emerald-600 bg-emerald-50" };
    case "UPDATE":
      return { label: "Updated", variant: "info" as const, icon: Edit3, bg: "text-blue-600 bg-blue-50" };
    case "DELETE":
      return { label: "Deleted", variant: "danger" as const, icon: Trash2, bg: "text-rose-600 bg-rose-50" };
    case "PUBLISH":
      return { label: "Published", variant: "accent" as const, icon: Globe, bg: "text-amber-600 bg-amber-50" };
    case "DUPLICATE":
      return { label: "Cloned", variant: "neutral" as const, icon: Copy, bg: "text-purple-600 bg-purple-50" };
    case "LOGIN":
      return { label: "Session", variant: "neutral" as const, icon: UserCheck, bg: "text-slate-600 bg-slate-100" };
    default:
      return { label: "Action", variant: "neutral" as const, icon: History, bg: "text-slate-600 bg-slate-100" };
  }
};

export const AdminRecentActivity: React.FC<AdminRecentActivityProps> = ({
  activities = [],
  className = "",
}) => {
  return (
    <section aria-label="System Governance & Activity Log" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <History className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Audit Trail
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Recent System &amp; Content Activity
            </h2>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            <span>Audit Trail Verified</span>
          </div>
        </div>

        {/* Activity Items Feed */}
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {activities.map((item) => {
            const meta = getActionMeta(item.action);
            const Icon = meta.icon;

            return (
              <div
                key={item.id}
                className="p-4 bg-white hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div className={["w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-slate-200", meta.bg].join(" ")}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {item.entityTitle}
                      </span>
                      <Badge variant={meta.variant} size="sm" className="font-bold text-[9px]">
                        {meta.label}
                      </Badge>
                    </div>
                    <p className="text-slate-500 text-[11px] font-medium truncate">
                      {item.details}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center text-[11px] text-slate-400">
                  <span>{item.adminUser}</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-600">{item.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
};

AdminRecentActivity.displayName = "AdminRecentActivity";
