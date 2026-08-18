import { AdminSession } from "@/types";
import { ADMIN_CONFIG } from "./admin-config";

/**
 * Generates a SHA-256 hash using standard Web Crypto API (Client-safe)
 */
export async function hashPasswordSha256(
  password: string
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Validates admin credentials against configured admin account
 */
export async function validateAdminCredentials(
  identifier: string,
  passwordPlain: string
): Promise<boolean> {
  const cleanIdentifier = identifier.trim().toLowerCase();

  const isIdentifierMatch =
    cleanIdentifier === ADMIN_CONFIG.username.toLowerCase() ||
    cleanIdentifier === ADMIN_CONFIG.email.toLowerCase();

  if (!isIdentifierMatch) return false;

  // Fast path
  if (passwordPlain === ADMIN_CONFIG.passwordPlain) return true;

  const computedHash = await hashPasswordSha256(passwordPlain);
  return computedHash === ADMIN_CONFIG.passwordHashSha256;
}

/**
 * Creates portable admin session token
 */
export function createSessionToken(): string {
  const payload = {
    role: "ADMIN",
    username: ADMIN_CONFIG.username,
    email: ADMIN_CONFIG.email,
    iat: Date.now(),
  };

  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

/**
 * Verifies admin session token
 */
export function verifySessionToken(
  token: string
): AdminSession | null {
  try {
    const decoded = JSON.parse(
      Buffer.from(token, "base64").toString("utf-8")
    );

    if (
      decoded.role === "ADMIN" &&
      decoded.username === ADMIN_CONFIG.username
    ) {
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