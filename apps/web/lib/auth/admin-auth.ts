import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { AdminSession } from "@/types";

/**
 * Admin authentication primitives. This module must only be imported by server code.
 */

export const ADMIN_CONFIG = {
  username: process.env.ADMIN_USERNAME || "",
  email: process.env.ADMIN_EMAIL || "",
  sessionCookieName: "nextvacancy_admin_session",
  sessionMaxAge: 60 * 60 * 24 * 7, // 7 days in seconds
};

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!ADMIN_CONFIG.username || !ADMIN_CONFIG.email) {
    throw new Error("ADMIN_USERNAME and ADMIN_EMAIL must be configured.");
  }
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be configured with at least 32 characters.");
  }
  return secret;
}

/**
 * Generates a SHA-256 hash using the server runtime's Web Crypto API.
 */
export async function hashPasswordSha256(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Validates admin credentials against a server-side SHA-256 hash.
 */
export async function validateAdminCredentials(
  identifier: string,
  passwordPlain: string
): Promise<boolean> {
  const cleanIdentifier = identifier.trim().toLowerCase();
  const isUsernameMatch =
    cleanIdentifier === ADMIN_CONFIG.username.toLowerCase() ||
    (ADMIN_CONFIG.email && cleanIdentifier === ADMIN_CONFIG.email.toLowerCase());

  if (!isUsernameMatch) {
    return false;
  }

  const configuredHash = process.env.ADMIN_PASSWORD_HASH?.toLowerCase();
  if (!configuredHash || !/^[a-f0-9]{64}$/.test(configuredHash)) {
    return false;
  }

  const computedHash = await hashPasswordSha256(passwordPlain);
  if (computedHash.length !== configuredHash.length) {
    return false;
  }

  if (timingSafeEqual(Buffer.from(computedHash), Buffer.from(configuredHash))) {
    return true;
  }
  return false;
}

export function createSessionToken(): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = {
    role: "ADMIN",
    username: ADMIN_CONFIG.username,
    email: ADMIN_CONFIG.email,
    iat: issuedAt,
    exp: issuedAt + ADMIN_CONFIG.sessionMaxAge,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", getSessionSecret())
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): AdminSession | null {
  try {
    const [encodedPayload, providedSignature] = token.split(".");
    if (!encodedPayload || !providedSignature) return null;

    const expectedSignature = createHmac("sha256", getSessionSecret())
      .update(encodedPayload)
      .digest("base64url");
    if (
      providedSignature.length !== expectedSignature.length ||
      !timingSafeEqual(Buffer.from(providedSignature), Buffer.from(expectedSignature))
    ) {
      return null;
    }

    const decoded = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf-8"));
    const now = Math.floor(Date.now() / 1000);
    if (
      decoded.role !== "ADMIN" ||
      decoded.username !== ADMIN_CONFIG.username ||
      typeof decoded.iat !== "number" ||
      typeof decoded.exp !== "number" ||
      decoded.exp <= now ||
      decoded.iat > now
    ) return null;

    return {
      isAuthenticated: true,
      username: decoded.username,
      email: decoded.email,
      role: "ADMIN",
      loginTime: new Date(decoded.iat * 1000).toISOString(),
      token,
    };
  } catch {
    return null;
  }
}