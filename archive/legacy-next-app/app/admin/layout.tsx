import React from "react";
import type { Metadata } from "next";
import { getAdminSession } from "@/lib/auth/admin-auth.server";
import { AdminSidebar, AdminTopbar } from "@/components/desktop/admin";

export const metadata: Metadata = {
  title: {
    default: "Admin Portal | NEXTVACANCY",
    template: "%s | NEXTVACANCY Admin",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // If not logged in, render child directly (e.g. admin login page handles its own centered card)
  if (!session) {
    return <div className="min-h-screen bg-[#F8FAFC]">{children}</div>;
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-slate-900 antialiased">
      {/* 1. Left Sticky Navigation Sidebar */}
      <AdminSidebar />

      {/* 2. Main Admin Work Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AdminTopbar />
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
