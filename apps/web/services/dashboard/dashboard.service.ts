import { JobPosting } from "@/types";
import { getLatestJobs } from "@/services/jobs/jobs.service";

/**
 * NEXTVACANCY Dashboard Service & Domain Models
 * Clean async service boundary designed to interface with future
 * Spring Boot 3.x REST API endpoints (`/api/v1/user/dashboard/*`).
 */

export interface DashboardStats {
  savedJobsCount: number;
  appliedJobsCount: number;
  admitCardsCount: number;
  unreadNotificationsCount: number;
}

export interface SavedJobItem {
  id: string;
  jobId: string;
  slug: string;
  organization: string;
  title: string;
  category: string;
  lastDate: string;
  status: "OPEN" | "ENDING_SOON" | "CLOSED" | "ADMIT_CARD_OUT" | "RESULT_OUT";
  savedAt: string;
  totalVacancies: number | string;
  salaryOrStipend: string;
}

export type ApplicationStage = "SAVED" | "APPLIED" | "EXAM" | "RESULT";

export interface ApplicationTrackItem {
  id: string;
  jobId: string;
  slug: string;
  organization: string;
  title: string;
  stage: ApplicationStage;
  appliedDate?: string;
  nextEventDate: string;
  nextEventTitle: string;
  status: "IN_PROGRESS" | "QUALIFIED" | "PENDING_RESULT" | "ACTION_REQUIRED";
}

export interface UserDashboardProfile {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  preferredState: string;
  preferredCategory: string;
  avatarUrl?: string;
  memberSince: string;
  qualification: string;
}

export interface NotificationPreference {
  id: string;
  key: "govtJobs" | "privateJobs" | "results" | "admitCards" | "scholarships";
  label: string;
  description: string;
  emailEnabled: boolean;
  whatsappEnabled: boolean;
}

export interface LoginSessionItem {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface UserDashboardData {
  profile: UserDashboardProfile;
  stats: DashboardStats;
  savedJobs: SavedJobItem[];
  recentlyViewed: JobPosting[];
  applicationTracker: ApplicationTrackItem[];
  notificationPreferences: NotificationPreference[];
  securitySessions: LoginSessionItem[];
}

const MOCK_DASHBOARD_PROFILE: UserDashboardProfile = {
  id: "usr-789012",
  fullName: "Aman Sharma",
  email: "aman.sharma@example.com",
  mobile: "+91 98765 43210",
  preferredState: "Delhi NCR / All India",
  preferredCategory: "Staff Selection (SSC) & Civil Services",
  avatarUrl: "",
  memberSince: "January 2026",
  qualification: "Bachelor of Technology (Computer Science)",
};

const MOCK_SAVED_JOBS: SavedJobItem[] = [
  {
    id: "sav-01",
    jobId: "job-1",
    slug: "ssc-cgl-2026-recruitment",
    organization: "Staff Selection Commission (SSC)",
    title: "SSC CGL 2026 Recruitment for 14,582 Group B & C Vacancies",
    category: "Government",
    lastDate: "2026-07-24",
    status: "OPEN",
    savedAt: "2 days ago",
    totalVacancies: 14582,
    salaryOrStipend: "Pay Level 4 to 8 (₹25,500 - ₹1,51,100)",
  },
  {
    id: "sav-02",
    jobId: "job-2",
    slug: "upsc-civil-services-2026-prelims",
    organization: "Union Public Service Commission (UPSC)",
    title: "UPSC Civil Services (Preliminary) Examination 2026 for IAS, IPS, IFS",
    category: "Government",
    lastDate: "2026-08-05",
    status: "OPEN",
    savedAt: "5 days ago",
    totalVacancies: 1056,
    salaryOrStipend: "Pay Level 10 (₹56,100 - ₹1,77,500)",
  },
  {
    id: "sav-03",
    jobId: "job-3",
    slug: "railway-rrb-ntpc-2026-graduate-undergraduate",
    organization: "Railway Recruitment Boards (RRB)",
    title: "RRB NTPC 2026 Centralized Employment Notification for 11,558 Posts",
    category: "Government",
    lastDate: "2026-07-30",
    status: "ENDING_SOON",
    savedAt: "1 week ago",
    totalVacancies: 11558,
    salaryOrStipend: "Pay Level 2 to 6 (₹19,900 - ₹92,300)",
  },
  {
    id: "sav-04",
    jobId: "job-4",
    slug: "ibps-po-cwe-xv-probationary-officer-2026",
    organization: "Institute of Banking Personnel Selection",
    title: "IBPS PO / MT XV 2026 Recruitment for 4,455 Bank PO Vacancies",
    category: "Banking",
    lastDate: "2026-08-21",
    status: "OPEN",
    savedAt: "3 days ago",
    totalVacancies: 4455,
    salaryOrStipend: "Basic Pay ₹36,000 + Allowances (₹52,000 In-Hand)",
  },
];

const MOCK_APPLICATION_TRACKER: ApplicationTrackItem[] = [
  {
    id: "app-01",
    jobId: "job-1",
    slug: "ssc-cgl-2026-recruitment",
    organization: "Staff Selection Commission (SSC)",
    title: "Combined Graduate Level (CGL) 2026",
    stage: "APPLIED",
    appliedDate: "18 Jun 2026",
    nextEventDate: "Sep - Oct 2026",
    nextEventTitle: "Tier-1 Computer Based Examination",
    status: "IN_PROGRESS",
  },
  {
    id: "app-02",
    jobId: "job-3",
    slug: "railway-rrb-ntpc-2026-graduate-undergraduate",
    organization: "Railway Recruitment Boards (RRB)",
    title: "RRB NTPC Graduate Level Posts (Pay Level 5 & 6)",
    stage: "SAVED",
    nextEventDate: "2026-07-30",
    nextEventTitle: "Application Deadline (14 Days Remaining)",
    status: "ACTION_REQUIRED",
  },
  {
    id: "app-03",
    jobId: "job-2",
    slug: "upsc-civil-services-2026-prelims",
    organization: "Union Public Service Commission (UPSC)",
    title: "Civil Services Preliminary Examination 2026",
    stage: "EXAM",
    appliedDate: "12 May 2026",
    nextEventDate: "2026-08-25",
    nextEventTitle: "e-Admit Card Release & City Intimation",
    status: "IN_PROGRESS",
  },
];

const MOCK_NOTIFICATION_PREFERENCES: NotificationPreference[] = [
  {
    id: "pref-1",
    key: "govtJobs",
    label: "Government Jobs (Central & State PSC)",
    description: "Daily gazette circulars from UPSC, SSC, Railways, Defence, and State Commissions.",
    emailEnabled: true,
    whatsappEnabled: true,
  },
  {
    id: "pref-2",
    key: "privateJobs",
    label: "Private & Corporate IT Careers",
    description: "Verified openings from leading multinational and tech enterprises.",
    emailEnabled: false,
    whatsappEnabled: false,
  },
  {
    id: "pref-3",
    key: "admitCards",
    label: "Admit Cards & Exam City Intimations",
    description: "Immediate alerts when hall tickets and city slips go live.",
    emailEnabled: true,
    whatsappEnabled: true,
  },
  {
    id: "pref-4",
    key: "results",
    label: "Results, Cut-Off Marks & Answer Keys",
    description: "Scorecard announcements and official objection trackers.",
    emailEnabled: true,
    whatsappEnabled: false,
  },
  {
    id: "pref-5",
    key: "scholarships",
    label: "National Scholarships & Fellowships",
    description: "Ministry grants, NSP post-matric, and higher education aid.",
    emailEnabled: false,
    whatsappEnabled: true,
  },
];

const MOCK_SECURITY_SESSIONS: LoginSessionItem[] = [
  {
    id: "sess-1",
    device: "Windows Desktop PC",
    browser: "Chrome 127.0",
    location: "New Delhi, India",
    ipAddress: "49.36.120.45",
    lastActive: "Active Now",
    isCurrent: true,
  },
  {
    id: "sess-2",
    device: "Apple iPhone 15 Pro",
    browser: "Safari Mobile 17.5",
    location: "New Delhi, India",
    ipAddress: "106.213.88.19",
    lastActive: "Yesterday at 08:30 PM",
    isCurrent: false,
  },
];

export async function getUserDashboardData(): Promise<UserDashboardData> {
  const recentlyViewed = await getLatestJobs(4);

  return {
    profile: MOCK_DASHBOARD_PROFILE,
    stats: {
      savedJobsCount: MOCK_SAVED_JOBS.length,
      appliedJobsCount: 2,
      admitCardsCount: 3,
      unreadNotificationsCount: 5,
    },
    savedJobs: MOCK_SAVED_JOBS,
    recentlyViewed,
    applicationTracker: MOCK_APPLICATION_TRACKER,
    notificationPreferences: MOCK_NOTIFICATION_PREFERENCES,
    securitySessions: MOCK_SECURITY_SESSIONS,
  };
}
