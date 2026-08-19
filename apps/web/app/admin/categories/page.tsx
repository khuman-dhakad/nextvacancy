import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin-auth.server";
import { getAdminCategories } from "@/services/admin/admin-master-data.service";
import { AdminCategoryManager } from "@/components/desktop/admin";

export const metadata: Metadata = {
  title: "Categories Master | NEXTVACANCY Admin",
  description: "Manage recruitment categories, slugs, portal navigation visibility, and featured hubs.",
  robots: { index: false, follow: false },
};

export default async function AdminCategoriesPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { items } = await getAdminCategories({ limit: 100 });

  return <AdminCategoryManager initialCategories={items} />;
}
