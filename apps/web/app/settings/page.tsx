import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { getUserSettingsData } from "@/services/settings/settings.service";
import {
  SettingsHeader,
  ProfilePhoto,
  ProfileInformation,
  JobPreferences,
  AccountPreferences,
  PrivacySettings,
  ChangePassword,
  SecuritySettings,
  DeleteAccountCard,
  SaveBar,
} from "@/components/desktop/settings";

export const metadata: Metadata = {
  title: "Account Settings & Profile | NEXTVACANCY",
  description: "Manage your personal recruitment credentials, exam category preferences, notification channels, and two-factor security.",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const data = await getUserSettingsData();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Settings Header */}
      <SettingsHeader profile={data.profile} />

      {/* 2. Main Settings Grid */}
      <Container size="lg" className="py-8 space-y-8">
        <ProfilePhoto fullName={data.profile.fullName} avatarUrl={data.profile.avatarUrl} />
        <ProfileInformation initialProfile={data.profile} />
        <JobPreferences initialPreferences={data.jobPreferences} />
        <AccountPreferences initialPreferences={data.accountPreferences} />
        <PrivacySettings initialPrivacy={data.privacySettings} />
        <ChangePassword lastChanged={data.security.passwordLastChanged} />
        <SecuritySettings initialSecurity={data.security} />
        <DeleteAccountCard />
      </Container>

      {/* 3. Sticky Bottom Save Bar */}
      <SaveBar />
    </main>
  );
}
