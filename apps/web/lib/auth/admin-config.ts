/**
 * NEXTVACANCY Admin Configuration & Constants
 * Shared between client and server components safely.
 */

export const ADMIN_CONFIG = {
  username: "admin",
  email: "admin@nextvacancy.com",
  // Single administrator credentials
  passwordPlain: "NextVacancy@Admin2026!",
  passwordHashSha256: "721a1d13dbca142d137bc391f1ba4f7626927d6d5eb7fa8901ebc6b3e7f4c7d2",
  sessionCookieName: "nextvacancy_admin_session",
  sessionMaxAge: 60 * 60 * 24 * 7, // 7 days in seconds
};
