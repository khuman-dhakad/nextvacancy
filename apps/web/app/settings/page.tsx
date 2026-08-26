import React from "react";
import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session.server";
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
  const user = await requireUser();
  const data = await getUserSettingsData();

  const userProfile = {
    ...data.profile,
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.mobile || data.profile.phone,
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Settings Header */}
      <SettingsHeader profile={userProfile} />

      {/* 2. Main Settings Grid */}
      <Container size="lg" className="py-8 space-y-8">
        <ProfilePhoto fullName={userProfile.fullName} avatarUrl={userProfile.avatarUrl} />
        <ProfileInformation initialProfile={userProfile} />
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
