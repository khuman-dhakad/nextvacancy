import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { getNotificationCenterData } from "@/services/notifications/notification.service";
import {
  NotificationList,
  PreferencePanel,
  AlertFrequency,
} from "@/components/desktop/notifications";

export const metadata: Metadata = {
  title: "Notification Center & Career Alerts | NEXTVACANCY",
  description: "Real-time notifications for verified government recruitment circulars, admit card announcements, answer keys, and scholarships.",
  robots: { index: false, follow: false },
};

export default async function NotificationsPage() {
  const data = await getNotificationCenterData();

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* 1. Main Notification Feed & Interactive Filtering Container */}
      <NotificationList initialNotifications={data.notifications} />

      {/* 2. Topic Preference Subscription & Cadence Controls */}
      <Container size="lg" className="py-8 space-y-8">
        <PreferencePanel initialPreferences={data.preferences} />
        <AlertFrequency initialFrequency={data.alertFrequency} />
      </Container>
    </main>
  );
}
