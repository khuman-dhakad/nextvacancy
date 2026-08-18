import React from "react";
import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin-auth.server";
import { getAdminJobById } from "@/services/admin/admin-jobs.service";
import { AdminJobForm } from "@/components/desktop/admin";

interface AdminEditJobPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AdminEditJobPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getAdminJobById(id);
  return {
    title: job ? `Edit: ${job.title} | NEXTVACANCY Admin` : "Edit Job | NEXTVACANCY Admin",
    robots: { index: false, follow: false },
  };
}

export default async function AdminEditJobPage({ params }: AdminEditJobPageProps) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const job = await getAdminJobById(id);
  if (!job) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Edit Recruitment: {job.organization}
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Modify circular information, vacancy allocations, important dates, or update publication status.
        </p>
      </div>

      <AdminJobForm initialData={job} isEditing={true} />
    </div>
  );
}
