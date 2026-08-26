import "server-only";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserProfile } from "@/types";
import {
  createCandidateSession,
  validateCandidateSession,
  revokeCandidateSession,
  SESSION_MAX_AGE_SECONDS,
} from "./user-auth";

export const CANDIDATE_SESSION_COOKIE_NAME = "nextvacancy_user_session";

export function getSessionCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(CANDIDATE_SESSION_COOKIE_NAME);

    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    const validated = await validateCandidateSession(sessionCookie.value);
    return validated ? validated.user : null;
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      typeof (err as { digest: unknown }).digest === "string" &&
      ((err as { digest: string }).digest.startsWith("DYNAMIC_SERVER_USAGE") ||
        (err as { digest: string }).digest.startsWith("NEXT_REDIRECT"))
    ) {
      throw err;
    }
    // Return null on other session retrieval errors
    return null;
  }
}

export async function requireUser(redirectTo: string = "/login"): Promise<UserProfile> {
  const user = await getCurrentUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user;
}

export async function establishCandidateSession(userId: string): Promise<string> {
  const headerStore = await headers();
  const ipAddress =
    headerStore.get("x-forwarded-for")?.split(",")[0].trim() ||
    headerStore.get("x-real-ip") ||
    undefined;
  const userAgent = headerStore.get("user-agent") || undefined;

  const { token } = await createCandidateSession({
    userId,
    ipAddress,
    userAgent,
  });

  const cookieStore = await cookies();
  cookieStore.set(CANDIDATE_SESSION_COOKIE_NAME, token, getSessionCookieOptions());

  return token;
}

export async function clearCandidateSessionCookie(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(CANDIDATE_SESSION_COOKIE_NAME);

    if (sessionCookie?.value) {
      await revokeCandidateSession(sessionCookie.value);
    }

    cookieStore.delete(CANDIDATE_SESSION_COOKIE_NAME);
  } catch (err) {
    console.error("Error clearing candidate session:", err);
  }
}
