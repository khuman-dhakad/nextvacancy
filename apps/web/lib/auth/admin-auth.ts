import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { AdminSession } from "@/types";
import { verifyPassword } from "./password.server";

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
 * Validates admin credentials against a server-side salted scrypt hash.
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

  const configuredHash = process.env.ADMIN_PASSWORD_HASH;
  if (!configuredHash) {
    return false;
  }

  return verifyPassword(passwordPlain, configuredHash);
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