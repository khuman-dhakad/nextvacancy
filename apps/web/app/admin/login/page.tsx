import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin-auth";
import { AdminLoginForm } from "@/components/desktop/admin";

export const metadata: Metadata = {
  title: "Admin Login | NEXTVACANCY",
  description: "Secure login for single administrator access to NEXTVACANCY Recruitment CMS.",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 bg-gradient-to-b from-slate-100 to-slate-200">
      <AdminLoginForm />
    </div>
  );
}
