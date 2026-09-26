import "server-only";

import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import { eq, and, gt } from "drizzle-orm";
import { db, users, sessions, User, Session } from "@/lib/db";
import { UserProfile } from "@/types";

const BCRYPT_ROUNDS = 12;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
export const SESSION_MAX_AGE_DAYS = 30;
export const SESSION_MAX_AGE_SECONDS = SESSION_MAX_AGE_DAYS * 24 * 60 * 60;

// Precomputed dummy bcrypt hash to execute in timing-safe manner if user not found
const DUMMY_HASH = "$2a$12$e8kPqZ9p4f8vFw7s7p6XKe5V0h6mY0b6u9k8e7w6q5v4u3t2s1r0q";

export function sha256(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface AuthenticateUserResult {
  success: boolean;
  user?: User;
  error?: string;
  isLocked?: boolean;
}

export async function authenticateCandidate(
  email: string,
  passwordPlain: string
): Promise<AuthenticateUserResult> {
  const cleanEmail = email.trim().toLowerCase();

  const user = await db.query.users.findFirst({
    where: eq(users.email, cleanEmail),
  });

  const now = new Date();

  // If user exists, check lockout status
  if (user) {
    if (user.lockedUntil && user.lockedUntil > now) {
      const remainingMinutes = Math.ceil(
        (user.lockedUntil.getTime() - now.getTime()) / (60 * 1000)
      );
      return {
        success: false,
        isLocked: true,
        error: `Account is temporarily locked due to multiple failed login attempts. Please try again in ${remainingMinutes} minute(s).`,
      };
    }
  }

  // Use real hash if user exists, dummy hash if not (timing-safe check against enumeration)
  const hashToCompare = user ? user.passwordHash : DUMMY_HASH;
  const isMatch = await verifyPassword(passwordPlain, hashToCompare);

  if (!user || !isMatch) {
    if (user) {
      const nextAttempts = user.failedLoginAttempts + 1;
      const willLock = nextAttempts >= MAX_FAILED_ATTEMPTS;

      await db
        .update(users)
        .set({
          failedLoginAttempts: nextAttempts,
          lockedUntil: willLock ? new Date(now.getTime() + LOCKOUT_DURATION_MS) : null,
          updatedAt: now,
        })
        .where(eq(users.id, user.id));

      if (willLock) {
        return {
          success: false,
          isLocked: true,
          error: "Too many failed login attempts. Your account has been temporarily locked for 15 minutes.",
        };
      }
    }

    return {
      success: false,
      error: "Invalid email or password. Please verify your credentials and try again.",
    };
  }

  // Successful login — reset failed attempts & lockout
  if (user.failedLoginAttempts > 0 || user.lockedUntil) {
    await db
      .update(users)
      .set({
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt: now,
      })
      .where(eq(users.id, user.id));
  }

  return {
    success: true,
    user,
  };
}

export interface CreateSessionOptions {
  userId: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface CreatedSession {
  token: string; // Opaque raw token for client cookie
  session: Session;
}

export async function createCandidateSession(
  options: CreateSessionOptions
): Promise<CreatedSession> {
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = sha256(rawToken);
  const sessionId = `sess_${randomBytes(16).toString("hex")}`;
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000);

  const [session] = await db
    .insert(sessions)
    .values({
      id: sessionId,
      userId: options.userId,
      tokenHash,
      ipAddress: options.ipAddress || null,
      userAgent: options.userAgent || null,
      expiresAt,
    })
    .returning();

  return {
    token: rawToken,
    session,
  };
}

export async function validateCandidateSession(
  rawToken: string
): Promise<{ user: UserProfile; session: Session } | null> {
  if (!rawToken || rawToken.length < 32) {
    return null;
  }

  const tokenHash = sha256(rawToken);
  const now = new Date();

  const sessionWithUser = await db.query.sessions.findFirst({
    where: and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, now)),
    with: {
      user: true,
    },
  });

  if (!sessionWithUser || !sessionWithUser.user) {
    return null;
  }

  const u = sessionWithUser.user;
  const userProfile: UserProfile = {
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    mobile: u.mobile || undefined,
    role: u.role as "CANDIDATE" | "ADMIN" | "MODERATOR",
    isEmailVerified: u.isEmailVerified,
    createdAt: u.createdAt.toISOString(),
  };

  return {
    user: userProfile,
    session: sessionWithUser,
  };
}

export async function revokeCandidateSession(rawToken: string): Promise<void> {
  if (!rawToken) return;
  const tokenHash = sha256(rawToken);
  await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
}

export async function revokeAllUserSessions(userId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

// --------------------------------------------------------------------------
// Email Verification & Password Reset
// --------------------------------------------------------------------------

export async function generateEmailVerificationToken(userId: string): Promise<string> {
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = sha256(rawToken);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await db
    .update(users)
    .set({
      emailVerificationTokenHash: tokenHash,
      emailVerificationTokenExpiresAt: expiresAt,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return rawToken;
}

export async function verifyCandidateEmailToken(
  rawToken: string
): Promise<{ success: boolean; error?: string }> {
  if (!rawToken) {
    return { success: false, error: "Invalid verification token." };
  }

  const tokenHash = sha256(rawToken);
  const now = new Date();

  const user = await db.query.users.findFirst({
    where: and(
      eq(users.emailVerificationTokenHash, tokenHash),
      gt(users.emailVerificationTokenExpiresAt, now)
    ),
  });

  if (!user) {
    return {
      success: false,
      error: "Verification link is invalid or has expired. Please request a new one.",
    };
  }

  await db
    .update(users)
    .set({
      isEmailVerified: true,
      emailVerificationTokenHash: null,
      emailVerificationTokenExpiresAt: null,
      updatedAt: now,
    })
    .where(eq(users.id, user.id));

  return { success: true };
}

export async function generatePasswordResetToken(
  email: string
): Promise<{ rawToken?: string; user?: User }> {
  const cleanEmail = email.trim().toLowerCase();
  const user = await db.query.users.findFirst({
    where: eq(users.email, cleanEmail),
  });

  if (!user) {
    return {};
  }

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = sha256(rawToken);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db
    .update(users)
    .set({
      passwordResetTokenHash: tokenHash,
      passwordResetTokenExpiresAt: expiresAt,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  return { rawToken, user };
}

export async function resetPasswordWithToken(
  rawToken: string,
  newPasswordPlain: string
): Promise<{ success: boolean; error?: string }> {
  if (!rawToken) {
    return { success: false, error: "Invalid password reset token." };
  }

  const tokenHash = sha256(rawToken);
  const now = new Date();

  const user = await db.query.users.findFirst({
    where: and(
      eq(users.passwordResetTokenHash, tokenHash),
      gt(users.passwordResetTokenExpiresAt, now)
    ),
  });

  if (!user) {
    return {
      success: false,
      error: "Password reset link is invalid or has expired. Please request a new reset link.",
    };
  }

  const newHash = await hashPassword(newPasswordPlain);

  await db
    .update(users)
    .set({
      passwordHash: newHash,
      passwordResetTokenHash: null,
      passwordResetTokenExpiresAt: null,
      failedLoginAttempts: 0,
      lockedUntil: null,
      updatedAt: now,
    })
    .where(eq(users.id, user.id));

  // Revoke all existing active sessions upon password reset for security
  await revokeAllUserSessions(user.id);

  return { success: true };
}
