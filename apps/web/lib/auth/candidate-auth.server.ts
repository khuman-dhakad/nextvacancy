import "server-only";

import { createHmac, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { and, eq, isNull, lt, or } from "drizzle-orm";
import { db, users } from "@/lib/db";
import {
  validateEmail,
  validateFullName,
  validateMobile,
  validatePassword,
} from "@/lib/validations/auth";
import { hashPassword, verifyPassword } from "./password.server";
const SESSION_COOKIE = "nextvacancy_candidate_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function getSessionSecret(): string {
  const secret = process.env.CANDIDATE_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("CANDIDATE_SESSION_SECRET must be configured with at least 32 characters.");
  }
  return secret;
}

function signSession(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function createSessionToken(userId: string, email: string): string {
  const payload = Buffer.from(
    JSON.stringify({ userId, email, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE })
  ).toString("base64url");
  return `${payload}.${signSession(payload)}`;
}

export async function setCandidateSession(userId: string, email: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(userId, email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function registerCandidate(input: {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
}): Promise<{ success: true } | { success: false; error: string }> {
  const validation = [
    validateFullName(input.fullName),
    validateEmail(input.email),
    validateMobile(input.mobile),
    validatePassword(input.password),
  ].filter(Boolean);
  if (validation.length > 0) {
    return { success: false, error: validation[0] as string };
  }

  try {
    await db.insert(users).values({
      id: `user-${randomBytes(12).toString("hex")}`,
      fullName: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      mobile: input.mobile.replace(/\D/g, ""),
      passwordHash: await hashPassword(input.password),
      role: "CANDIDATE",
    });
    return { success: true };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "23505") {
      return { success: false, error: "An account with this email address already exists. Please sign in instead." };
    }
    throw error;
  }
}

export async function authenticateCandidate(
  email: string,
  password: string
): Promise<{ success: true; userId: string; email: string } | { success: false; error: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  if (validateEmail(normalizedEmail) || !password) {
    return { success: false, error: "Invalid email or password." };
  }

  const [user] = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.email, normalizedEmail),
        eq(users.role, "CANDIDATE"),
        or(isNull(users.lockedUntil), lt(users.lockedUntil, new Date()))
      )
    )
    .limit(1);

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { success: false, error: "Invalid email or password." };
  }

  return { success: true, userId: user.id, email: user.email };
}
