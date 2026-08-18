import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin-auth";
import { getAdminOrganizations } from "@/services/admin/admin-master-data.service";
import { AdminOrganizationManager } from "@/components/desktop/admin";

export const metadata: Metadata = {
  title: "Organizations Master | NEXTVACANCY Admin",
  description: "Manage recruiting authorities, commissions, state PSCs, and official portals.",
  robots: { index: false, follow: false },
};

export default async function AdminOrganizationsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { items } = await getAdminOrganizations({ limit: 100 });

  return <AdminOrganizationManager initialOrganizations={items} />;
}
