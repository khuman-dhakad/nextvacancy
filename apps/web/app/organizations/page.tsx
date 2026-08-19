import React from "react";
import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

import { Container } from "@/components/ui";
import { getAllOrganizationProfiles } from "@/services/organization/organization-profile.service";
import { OrganizationDirectoryGrid } from "@/components/desktop/organization";

export const metadata: Metadata = {
  title: "Recruiting Organizations & Commissions Directory | NEXTVACANCY",
  description:
    "Browse official career portals, latest recruitment circulars, exam calendars, and selection patterns across all major Central Commissions, Banking, Railways, Defence, and State PSCs in India.",
  alternates: {
    canonical: "https://nextvacancy.com/organizations",
  },
  openGraph: {
    title: "Recruiting Organizations & Commissions Directory | NEXTVACANCY",
    description:
      "Explore verified recruitment authorities in India. Access latest vacancies, admit cards, and results by organization.",
    url: "https://nextvacancy.com/organizations",
    siteName: "NEXTVACANCY",
    type: "website",
    locale: "en_IN",
  },
};

export default async function OrganizationsDirectoryPage() {
  const organizations = await getAllOrganizationProfiles();

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12">
      <Container className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero Section */}
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0F2744] to-[#183B66] text-white border border-slate-200 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-400 text-xs font-bold border border-white/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>National &amp; State Recruitment Directory</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Recruitment Authorities &amp; Commissions
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
            Direct access to official recruitment boards, commissions, public sector banks, defence agencies, and state PSCs. Browse active vacancy notifications, examination calendars, and merit lists.
          </p>
        </div>

        {/* Searchable Directory Grid */}
        <OrganizationDirectoryGrid organizations={organizations} />
      </Container>
    </div>
  );
}
