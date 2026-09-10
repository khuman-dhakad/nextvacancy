import React from "react";
import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session.server";
import { Container } from "@/components/ui";
import { getUserDashboardData } from "@/services/dashboard/dashboard.service";
import {
  DashboardHeader,
  OverviewCards,
  SavedJobsTable,
  ApplicationTracker,
  RecentlyViewed,
  NotificationPreferences,
  ProfileSummary,
  SecurityPanel,
} from "@/components/desktop/dashboard";

export const metadata: Metadata = {
  title: "Candidate Dashboard | NEXTVACANCY",
  description: "Track saved government and private job applications, admit card alerts, and circular notifications.",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const user = await requireUser();
  const data = await getUserDashboardData();

  // Populate dynamic authenticated candidate profile data
  const candidateProfile = {
    ...data.profile,
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    mobile: user.mobile || data.profile.mobile,
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* 1. Welcome & Greeting Header */}
      <DashboardHeader profile={candidateProfile} />

      {/* 2. Main Dashboard Content Grid */}
      <Container size="lg" className="py-8 space-y-8">
        {/* Metric Summary Cards */}
        <OverviewCards stats={data.stats} />

        {/* Application Progress Tracker */}
        <ApplicationTracker applications={data.applicationTracker} />

        {/* Bookmarked Vacancies Table */}
        <SavedJobsTable savedJobs={data.savedJobs} />

        {/* Recently Browsed Circulars */}
        <RecentlyViewed jobs={data.recentlyViewed} />

        {/* Candidate Profile & Preferences */}
        <div className="grid grid-cols-1 gap-8">
          <NotificationPreferences initialPreferences={data.notificationPreferences} />
          <ProfileSummary profile={candidateProfile} />
          <SecurityPanel sessions={data.securitySessions} />
        </div>
      </Container>
    </main>
  );
}
