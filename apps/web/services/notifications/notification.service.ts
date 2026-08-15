/**
 * NEXTVACANCY Notification Center Service & Domain Models
 * Clean async service boundary designed to interface with future
 * Spring Boot 3.x notification streaming & WebSocket endpoints (`/api/v1/notifications/*`).
 */

export type NotificationCategory = "ALL" | "JOBS" | "RESULTS" | "ADMIT_CARDS" | "SCHOLARSHIPS";

export type NotificationTag =
  | "GOVERNMENT"
  | "PRIVATE"
  | "RAILWAY"
  | "BANKING"
  | "SSC"
  | "UPSC"
  | "DEFENCE"
  | "STATE_PSC";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  organization: string;
  category: "JOBS" | "RESULTS" | "ADMIT_CARDS" | "SCHOLARSHIPS";
  tag: NotificationTag;
  timestamp: string;
  isRead: boolean;
  actionUrl: string;
  actionLabel: string;
  urgency: "NORMAL" | "HIGH" | "URGENT";
}

export interface NotificationPreferenceItem {
  id: string;
  key: "govtJobs" | "privateJobs" | "results" | "admitCards" | "scholarships" | "internships";
  label: string;
  description: string;
  enabled: boolean;
}

export type AlertFrequencyType = "INSTANT" | "DAILY" | "WEEKLY";

export interface NotificationCenterData {
  notifications: NotificationItem[];
  preferences: NotificationPreferenceItem[];
  alertFrequency: AlertFrequencyType;
  unreadCount: number;
  totalCount: number;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-01",
    title: "SSC CGL 2026 Tier-1 City Intimation Slip Released",
    description: "Staff Selection Commission has uploaded examination city slips and schedule for 14,582 Group B & C posts.",
    organization: "Staff Selection Commission (SSC)",
    category: "ADMIT_CARDS",
    tag: "SSC",
    timestamp: "10 minutes ago",
    isRead: false,
    actionUrl: "/jobs/ssc-cgl-2026-recruitment",
    actionLabel: "View City Slip",
    urgency: "URGENT",
  },
  {
    id: "notif-02",
    title: "RRB NTPC 2026 Centralized Notification for 11,558 Posts Closing Soon",
    description: "Only 3 days remaining to complete online registration and SBI e-Challan fee verification.",
    organization: "Railway Recruitment Boards (RRB)",
    category: "JOBS",
    tag: "RAILWAY",
    timestamp: "1 hour ago",
    isRead: false,
    actionUrl: "/jobs/railway-rrb-ntpc-2026-graduate-undergraduate",
    actionLabel: "Apply Before Deadline",
    urgency: "HIGH",
  },
  {
    id: "notif-03",
    title: "UPSC Civil Services Prelims 2026 Official Answer Key Out",
    description: "Union Public Service Commission has published the Master Question Paper along with provisional answer keys for GS Paper 1 & CSAT.",
    organization: "Union Public Service Commission (UPSC)",
    category: "RESULTS",
    tag: "UPSC",
    timestamp: "3 hours ago",
    isRead: false,
    actionUrl: "/jobs/upsc-civil-services-2026-prelims",
    actionLabel: "Download Answer Key",
    urgency: "NORMAL",
  },
  {
    id: "notif-04",
    title: "IBPS PO / MT XV 2026 Online Application Window Live",
    description: "4,455 Probationary Officer vacancies across 11 participating public sector banks. Eligibility: Any Graduate.",
    organization: "Institute of Banking Personnel Selection",
    category: "JOBS",
    tag: "BANKING",
    timestamp: "5 hours ago",
    isRead: true,
    actionUrl: "/jobs/ibps-po-cwe-xv-probationary-officer-2026",
    actionLabel: "Check Pay Scale",
    urgency: "NORMAL",
  },
  {
    id: "notif-05",
    title: "National Scholarship Portal (NSP) 2026-27 Registrations Open",
    description: "Ministry of Social Justice & Empowerment invites online applications for Post-Matric & Merit-cum-Means schemes.",
    organization: "Ministry of Education & NSP",
    category: "SCHOLARSHIPS",
    tag: "GOVERNMENT",
    timestamp: "1 day ago",
    isRead: true,
    actionUrl: "/search",
    actionLabel: "Check Eligibility",
    urgency: "NORMAL",
  },
  {
    id: "notif-06",
    title: "SBI PO 2026 Final Interview Call Letters Dispatched",
    description: "State Bank of India has published Phase-III Psychometric Test & Interview admit cards on the official candidate portal.",
    organization: "State Bank of India (SBI)",
    category: "ADMIT_CARDS",
    tag: "BANKING",
    timestamp: "2 days ago",
    isRead: true,
    actionUrl: "/search",
    actionLabel: "Download Call Letter",
    urgency: "NORMAL",
  },
];

const MOCK_PREFERENCES: NotificationPreferenceItem[] = [
  {
    id: "pref-1",
    key: "govtJobs",
    label: "Government Jobs (Central & State PSC)",
    description: "Verified gazette circulars from UPSC, SSC, Railways, and Defence.",
    enabled: true,
  },
  {
    id: "pref-2",
    key: "privateJobs",
    label: "Private & Corporate IT Careers",
    description: "Recruitment drives from leading technology and financial enterprises.",
    enabled: false,
  },
  {
    id: "pref-3",
    key: "results",
    label: "Official Results & Cut-Off Marks",
    description: "Direct alerts when merit lists and scorecard links go live.",
    enabled: true,
  },
  {
    id: "pref-4",
    key: "admitCards",
    label: "Admit Cards & Exam City Intimations",
    description: "Never miss exam hall tickets and exam venue disclosures.",
    enabled: true,
  },
  {
    id: "pref-5",
    key: "scholarships",
    label: "National Scholarships & Grants",
    description: "Central ministry educational grants and fellowship announcements.",
    enabled: true,
  },
  {
    id: "pref-6",
    key: "internships",
    label: "Government & PSU Apprenticeships",
    description: "Ministry summer internships and paid technical apprenticeships.",
    enabled: false,
  },
];

export async function getNotificationCenterData(): Promise<NotificationCenterData> {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;

  return {
    notifications: MOCK_NOTIFICATIONS,
    preferences: MOCK_PREFERENCES,
    alertFrequency: "INSTANT",
    unreadCount,
    totalCount: MOCK_NOTIFICATIONS.length,
  };
}
