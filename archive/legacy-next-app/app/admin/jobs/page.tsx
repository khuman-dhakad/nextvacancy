import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin-auth.server";
import { AdminJobsManager } from "@/components/desktop/admin";

export const metadata: Metadata = {
  title: "Job Inventory & CMS | NEXTVACANCY Admin",
  description: "Manage, search, publish, edit, duplicate, and delete recruitment circulars.",
  robots: { index: false, follow: false },
};

export default async function AdminJobsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { getAdminJobs } = await import("@/services/admin/admin-jobs.service");
  const { items } = await getAdminJobs({ limit: 100 });

  return <AdminJobsManager initialJobs={items} />;
}
