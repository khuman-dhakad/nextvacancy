import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSession } from "@/types";
import {
  ADMIN_CONFIG,
  verifySessionToken,
  validateAdminCredentials,
  createSessionToken,
} from "./admin-auth";

export { ADMIN_CONFIG, validateAdminCredentials, createSessionToken, verifySessionToken };

/**
 * Server-side helper to read and verify admin session from cookies
 * Exclusively for Server Components, Route Handlers, and Server Actions.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_CONFIG.sessionCookieName);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  return verifySessionToken(sessionCookie.value);
}

/**
 * Sets the HTTP-only admin session cookie on login
 */
export async function setAdminSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_CONFIG.sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_CONFIG.sessionMaxAge,
  });
}

/**
 * Clears the admin session cookie on logout
 */
export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_CONFIG.sessionCookieName);
}

/**
 * Server helper to enforce RBAC and redirect to /admin/login if unauthenticated
 */
export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
