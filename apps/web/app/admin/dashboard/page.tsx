import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusCircle, Briefcase, Sparkles } from "lucide-react";
import { getAdminSession } from "@/lib/auth/admin-auth";
import {
  getAdminDashboardStats,
  getAdminActivityLogs,
} from "@/services/admin/admin-jobs.service";
import {
  AdminStatsGrid,
  AdminRecentActivity,
} from "@/components/desktop/admin";
import { Button } from "@/components/ui";


export const metadata: Metadata = {
  title: "Dashboard Overview | NEXTVACANCY Admin",
  description: "Analytics and governance overview for recruitment content.",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [stats, activities] = await Promise.all([
    getAdminDashboardStats(),
    getAdminActivityLogs(8),
  ]);

  return (
    <div className="space-y-8">
      {/* 1. Welcome Quick Actions Banner */}
      <div className="p-6 rounded-2xl bg-[#0F2744] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md border border-[#183B66]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Single Administrator CMS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Welcome, Administrator!
          </h2>
          <p className="text-xs text-slate-300 font-medium">
            Manage live recruitment notices, admit cards, answer keys, and scholarships with full audit logging.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/admin/jobs/new">
            <Button
              variant="accent"
              size="md"
              className="font-bold text-xs shadow-xs"
              leftIcon={<PlusCircle className="h-4 w-4" />}
            >
              Post New Job
            </Button>
          </Link>
          <Link href="/admin/jobs">
            <Button
              variant="outline"
              size="md"
              className="font-bold text-xs bg-white/10 text-white border-white/20 hover:bg-white/20"
              leftIcon={<Briefcase className="h-4 w-4" />}
            >
              Manage CMS Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. 8-Metric Analytics Grid */}
      <AdminStatsGrid stats={stats} />

      {/* 3. System Governance & Activity Feed */}
      <AdminRecentActivity activities={activities} />
    </div>
  );
}
