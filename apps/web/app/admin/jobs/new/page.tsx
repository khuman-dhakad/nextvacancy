import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin-auth.server";
import { AdminJobForm } from "@/components/desktop/admin";

export const metadata: Metadata = {
  title: "Create Recruitment Posting | NEXTVACANCY Admin",
  description: "Create and publish a verified government or private recruitment job circular.",
  robots: { index: false, follow: false },
};

export default async function AdminNewJobPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Create New Recruitment Job Circular
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Fill out all essential gazette circular details, eligibility matrix, fee breakdown, and official links.
        </p>
      </div>

      <AdminJobForm isEditing={false} />
    </div>
  );
}
