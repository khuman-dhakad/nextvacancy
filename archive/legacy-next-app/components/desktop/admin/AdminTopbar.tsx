"use client";

import React from "react";
import Link from "next/link";
import {
  PlusCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui";
import { logoutAdminAction } from "@/app/admin/actions";


export interface AdminTopbarProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({
  title = "Dashboard",
  subtitle = "Recruitment Content & System Governance",
  className = "",
}) => {
  return (
    <header
      aria-label="Admin Control Bar"
      className={[
        "h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Title & Context */}
      <div>
        <h1 className="text-base font-black text-slate-900 leading-tight">
          {title}
        </h1>
        <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
          {subtitle}
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* System Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>CMS Engine Active</span>
        </div>

        {/* Create Job Action */}
        <Link href="/admin/jobs/new">
          <Button
            variant="primary"
            size="sm"
            className="bg-[#0F2744] hover:bg-[#183B66] text-white font-bold text-xs shadow-xs"
            leftIcon={<PlusCircle className="h-3.5 w-3.5" />}
          >
            Create Job
          </Button>
        </Link>

        {/* Logout */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => logoutAdminAction()}
          className="font-bold text-xs text-slate-700 hover:text-rose-600 hover:border-rose-300"
          leftIcon={<LogOut className="h-3.5 w-3.5" />}
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

AdminTopbar.displayName = "AdminTopbar";
