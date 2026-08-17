/**
 * NEXTVACANCY Settings & Profile Service & Domain Models
 * Clean async service boundary designed to interface with future
 * Spring Boot 3.x User Settings & Profile API endpoints (`/api/v1/user/settings/*`).
 */

export interface UserProfileData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  avatarUrl?: string;
  accountStatus: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
  lastUpdated: string;
  memberSince: string;
}

export interface UserJobPreferences {
  preferredState: string;
  preferredCategory: string;
  experienceLevel: string;
  qualification: string;
  salaryExpectation: string;
}

export interface UserAccountPreferences {
  emailNotifications: boolean;
  whatsappAlerts: boolean;
  telegramAlerts: boolean;
  darkMode: boolean;
}

export interface UserPrivacySettings {
  publicProfile: boolean;
  personalizedRecommendations: boolean;
  analyticsConsent: boolean;
}

export interface UserLoginHistoryItem {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  timestamp: string;
  isCurrent: boolean;
}

export interface UserSecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod: "SMS_OTP" | "AUTHENTICATOR_APP" | "EMAIL_OTP";
  passwordLastChanged: string;
  activeSessions: UserLoginHistoryItem[];
  loginHistory: UserLoginHistoryItem[];
}

export interface UserSettingsData {
  profile: UserProfileData;
  jobPreferences: UserJobPreferences;
  accountPreferences: UserAccountPreferences;
  privacySettings: UserPrivacySettings;
  security: UserSecuritySettings;
}

const MOCK_SETTINGS_DATA: UserSettingsData = {
  profile: {
    id: "usr-789012",
    fullName: "Aman Sharma",
    email: "aman.sharma@example.com",
    phone: "+91 98765 43210",
    city: "New Delhi",
    state: "Delhi NCR",
    avatarUrl: "",
    accountStatus: "ACTIVE",
    lastUpdated: "August 16, 2026",
    memberSince: "January 2026",
  },
  jobPreferences: {
    preferredState: "Delhi NCR / All India",
    preferredCategory: "Staff Selection Commission (SSC) & UPSC",
    experienceLevel: "Fresher / Entry-Level (0-2 Years)",
    qualification: "Bachelor of Technology (Computer Science)",
    salaryExpectation: "₹50,000 - ₹1,00,000 / month (Pay Level 6-8)",
  },
  accountPreferences: {
    emailNotifications: true,
    whatsappAlerts: true,
    telegramAlerts: false,
    darkMode: false,
  },
  privacySettings: {
    publicProfile: false,
    personalizedRecommendations: true,
    analyticsConsent: true,
  },
  security: {
    twoFactorEnabled: true,
    twoFactorMethod: "SMS_OTP",
    passwordLastChanged: "3 months ago",
    activeSessions: [
      {
        id: "sess-1",
        device: "Windows Desktop PC",
        browser: "Chrome 127.0",
        ipAddress: "49.36.120.45",
        location: "New Delhi, India",
        timestamp: "Active Now",
        isCurrent: true,
      },
      {
        id: "sess-2",
        device: "Apple iPhone 15 Pro",
        browser: "Safari Mobile 17.5",
        ipAddress: "106.213.88.19",
        location: "New Delhi, India",
        timestamp: "Yesterday at 08:30 PM",
        isCurrent: false,
      },
    ],
    loginHistory: [
      {
        id: "log-1",
        device: "Windows Desktop PC",
        browser: "Chrome 127.0",
        ipAddress: "49.36.120.45",
        location: "New Delhi, India",
        timestamp: "16 Aug 2026, 09:15 AM",
        isCurrent: true,
      },
      {
        id: "log-2",
        device: "Apple iPhone 15 Pro",
        browser: "Safari Mobile 17.5",
        ipAddress: "106.213.88.19",
        location: "New Delhi, India",
        timestamp: "15 Aug 2026, 08:30 PM",
        isCurrent: false,
      },
      {
        id: "log-3",
        device: "MacBook Pro",
        browser: "Chrome 126.0",
        ipAddress: "182.72.15.22",
        location: "Gurugram, India",
        timestamp: "12 Aug 2026, 11:42 AM",
        isCurrent: false,
      },
    ],
  },
};

export async function getUserSettingsData(): Promise<UserSettingsData> {
  return MOCK_SETTINGS_DATA;
}
