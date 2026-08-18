"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Globe,
  LogOut,
} from "lucide-react";
import { logoutAdminAction } from "@/app/admin/actions";


export interface AdminSidebarProps {
  className?: string;
}

const NAV_ITEMS = [
  {
    label: "Overview Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Recruitment CMS",
    href: "/admin/jobs",
    icon: Briefcase,
  },
  {
    label: "Post New Job",
    href: "/admin/jobs/new",
    icon: PlusCircle,
  },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ className = "" }) => {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Admin Navigation Sidebar"
      className={[
        "w-64 bg-[#0F2744] text-white flex flex-col justify-between shrink-0 min-h-screen border-r border-[#183B66] select-none sticky top-0 h-screen",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Brand Header */}
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-black text-xl shadow-xs">
            N
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-white block leading-none">
              NEXTVACANCY
            </span>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mt-1">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5 pt-2" aria-label="Admin Main Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin/dashboard"
                ? pathname === "/admin/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
                  isActive
                    ? "bg-[#183B66] text-white shadow-xs border border-white/10"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                <Icon
                  className={[
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-amber-400" : "text-slate-400 group-hover:text-white",
                  ].join(" ")}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation & Admin Profile Pill */}
      <div className="p-6 border-t border-white/10 space-y-4">
        {/* Live Site Shortcut */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            <span>View Public Portal</span>
          </div>
          <span className="text-[10px] text-slate-400">Live ↗</span>
        </Link>

        {/* Admin Profile Details & Logout */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
              AD
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate leading-tight">
                Administrator
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                admin@nextvacancy.com
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => logoutAdminAction()}
            title="Log Out of Admin Console"
            aria-label="Log Out of Admin Console"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 cursor-pointer"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
};

AdminSidebar.displayName = "AdminSidebar";
