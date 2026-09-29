import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { db, sessions, users, type User } from "@/lib/db";
import { validateEmail, validateFullName, validateMobile, validatePassword } from "@/lib/validations/auth";
import { hashPassword, verifyPassword } from "./password.server";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function tokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function registerCandidate(input: {
  fullName: string; email: string; mobile: string; password: string;
}): Promise<{ success: true; userId: string } | { success: false; error: string }> {
  const error = [validateFullName(input.fullName), validateEmail(input.email), validateMobile(input.mobile), validatePassword(input.password)].find(Boolean);
  if (error) return { success: false, error };

  const email = input.email.trim().toLowerCase();
  try {
    const [user] = await db.insert(users).values({
      id: `user-${randomBytes(12).toString("hex")}`,
      fullName: input.fullName.trim(),
      email,
      mobile: input.mobile.replace(/\D/g, ""),
      passwordHash: await hashPassword(input.password),
      role: "CANDIDATE",
    }).returning({ id: users.id });
    return { success: true, userId: user.id };
  } catch (caught) {
    if (caught && typeof caught === "object" && "code" in caught && caught.code === "23505") {
      return { success: false, error: "An account with this email address already exists." };
    }
    throw caught;
  }
}

export async function authenticateCandidate(emailInput: string, password: string): Promise<{ success: true; user: User } | { success: false; error: string }> {
  const email = emailInput.trim().toLowerCase();
  if (validateEmail(email) || !password) return { success: false, error: "Invalid email or password." };
  const [user] = await db.select().from(users).where(and(eq(users.email, email), eq(users.role, "CANDIDATE"))).limit(1);
  const now = new Date();
  if (user?.lockedUntil && user.lockedUntil > now) return { success: false, error: "Account temporarily locked. Please try again later." };
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;
  if (!user || !valid) {
    if (user) {
      const failedLoginAttempts = user.failedLoginAttempts + 1;
      await db.update(users).set({
        failedLoginAttempts,
        lockedUntil: failedLoginAttempts >= MAX_FAILED_ATTEMPTS ? new Date(now.getTime() + LOCKOUT_MS) : null,
        updatedAt: now,
      }).where(eq(users.id, user.id));
    }
    return { success: false, error: "Invalid email or password." };
  }
  await db.update(users).set({ failedLoginAttempts: 0, lockedUntil: null, updatedAt: now }).where(eq(users.id, user.id));
  return { success: true, user };
}

export async function createCandidateSession(userId: string, ipAddress?: string, userAgent?: string): Promise<string> {
  const rawToken = randomBytes(32).toString("hex");
  await db.insert(sessions).values({
    id: `sess-${randomBytes(12).toString("hex")}`,
    userId,
    tokenHash: tokenHash(rawToken),
    expiresAt: new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000),
    ipAddress: ipAddress?.slice(0, 64),
    userAgent: userAgent?.slice(0, 500),
  });
  return rawToken;
}

export async function getUserBySessionToken(rawToken: string): Promise<User | null> {
  if (!rawToken) return null;
  const [session] = await db.select().from(sessions).where(and(eq(sessions.tokenHash, tokenHash(rawToken)), gt(sessions.expiresAt, new Date()))).limit(1);
  if (!session) return null;
  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  return user || null;
}

export async function revokeCandidateSession(rawToken: string): Promise<void> {
  if (rawToken) await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash(rawToken)));
}

export async function generateEmailVerificationToken(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  await db.update(users).set({ emailVerificationTokenHash: tokenHash(token), emailVerificationTokenExpiresAt: new Date(Date.now() + 86_400_000), updatedAt: new Date() }).where(eq(users.id, userId));
  return token;
}

export async function verifyCandidateEmailToken(token: string): Promise<boolean> {
  const [user] = await db.select().from(users).where(and(eq(users.emailVerificationTokenHash, tokenHash(token)), gt(users.emailVerificationTokenExpiresAt, new Date()))).limit(1);
  if (!user) return false;
  await db.update(users).set({ isEmailVerified: true, emailVerificationTokenHash: null, emailVerificationTokenExpiresAt: null, updatedAt: new Date() }).where(eq(users.id, user.id));
  return true;
}

export async function generatePasswordResetToken(emailInput: string): Promise<{ token: string; user: User } | null> {
  const [user] = await db.select().from(users).where(eq(users.email, emailInput.trim().toLowerCase())).limit(1);
  if (!user) return null;
  const token = randomBytes(32).toString("hex");
  await db.update(users).set({ passwordResetTokenHash: tokenHash(token), passwordResetTokenExpiresAt: new Date(Date.now() + 3_600_000), updatedAt: new Date() }).where(eq(users.id, user.id));
  return { token, user };
}

export async function resetPasswordWithToken(token: string, password: string): Promise<boolean> {
  const [user] = await db.select().from(users).where(and(eq(users.passwordResetTokenHash, tokenHash(token)), gt(users.passwordResetTokenExpiresAt, new Date()))).limit(1);
  if (!user || validatePassword(password)) return false;
  await db.update(users).set({ passwordHash: await hashPassword(password), passwordResetTokenHash: null, passwordResetTokenExpiresAt: null, failedLoginAttempts: 0, lockedUntil: null, updatedAt: new Date() }).where(eq(users.id, user.id));
  await db.delete(sessions).where(eq(sessions.userId, user.id));
  return true;
}
