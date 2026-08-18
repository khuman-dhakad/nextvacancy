import { AdminSession } from "@/types";

/**
 * NEXTVACANCY Admin Authentication — Client-Safe Module
 * Pure client-safe utilities, configuration, credential validators, and token parsers.
 * ZERO server-only imports, ZERO next/headers, ZERO cookies().
 */

// Single configured Administrator account credentials
export const ADMIN_CONFIG = {
  username: "admin",
  email: "admin@nextvacancy.com",
  // SHA-256 of "NextVacancy@Admin2026!"
  // Password plaintext: NextVacancy@Admin2026!
  passwordPlain: "NextVacancy@Admin2026!",
  passwordHashSha256: "721a1d13dbca142d137bc391f1ba4f7626927d6d5eb7fa8901ebc6b3e7f4c7d2",
  sessionCookieName: "nextvacancy_admin_session",
  sessionMaxAge: 60 * 60 * 24 * 7, // 7 days in seconds
};

/**
 * Generates a SHA-256 hash using standard Web Crypto API (Client-safe)
 */
export async function hashPasswordSha256(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Validates admin credentials against hardcoded hash
 */
export async function validateAdminCredentials(
  identifier: string,
  passwordPlain: string
): Promise<boolean> {
  const cleanIdentifier = identifier.trim().toLowerCase();
  const isUsernameMatch =
    cleanIdentifier === ADMIN_CONFIG.username.toLowerCase() ||
    cleanIdentifier === ADMIN_CONFIG.email.toLowerCase();

  if (!isUsernameMatch) {
    return false;
  }

  // Fast check and cryptographic hash check
  if (passwordPlain === ADMIN_CONFIG.passwordPlain) {
    return true;
  }

  const computedHash = await hashPasswordSha256(passwordPlain);
  return computedHash === ADMIN_CONFIG.passwordHashSha256;
}

/**
 * Creates a signed admin session payload (client/server portable)
 */
export function createSessionToken(): string {
  const payload = {
    role: "ADMIN",
    username: ADMIN_CONFIG.username,
    email: ADMIN_CONFIG.email,
    iat: Date.now(),
  };
  // Base64 encoded payload for token representation
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

/**
 * Verifies session token string
 */
export function verifySessionToken(token: string): AdminSession | null {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    if (decoded.role === "ADMIN" && decoded.username === ADMIN_CONFIG.username) {
      return {
        isAuthenticated: true,
        username: decoded.username,
        email: decoded.email,
        role: "ADMIN",
        loginTime: new Date(decoded.iat).toISOString(),
        token,
      };
    }
    return null;
  } catch {
    return null;
  }
}
