"use server";

import { headers } from "next/headers";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { RegisterSchema } from "@/lib/validations/auth";
import { db, users } from "@/lib/db";
import {
  hashPassword,
  generateEmailVerificationToken,
} from "@/lib/auth/user-auth";
import { establishCandidateSession } from "@/lib/auth/session.server";
import { sendEmailVerificationEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { RegisterFormData } from "@/types";

export interface RegisterActionResult {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function registerAction(
  formData: FormData | RegisterFormData | Record<string, unknown>
): Promise<RegisterActionResult> {
  const headerStore = await headers();
  const clientIp =
    headerStore.get("x-forwarded-for")?.split(",")[0].trim() ||
    headerStore.get("x-real-ip") ||
    "127.0.0.1";

  // Rate limit: max 5 registration attempts per 5 minutes per IP
  const rateLimit = checkRateLimit(`register_${clientIp}`, 5, 5 * 60 * 1000);
  if (!rateLimit.success) {
    return {
      success: false,
      error: "Too many registration attempts. Please wait a few minutes before trying again.",
    };
  }

  const rawData: Record<string, unknown> = {};
  if (formData instanceof FormData) {
    formData.forEach((value, key) => {
      rawData[key] = value;
    });
  } else {
    Object.assign(rawData, formData);
  }

  const parseResult = RegisterSchema.safeParse({
    fullName: rawData.fullName,
    email: rawData.email,
    mobile: rawData.mobile,
    password: rawData.password,
    confirmPassword: rawData.confirmPassword,
    acceptTerms:
      rawData.acceptTerms === true ||
      rawData.acceptTerms === "true" ||
      rawData.acceptTerms === "on",
  });

  if (!parseResult.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parseResult.error.issues) {
      if (issue.path[0]) {
        fieldErrors[issue.path[0].toString()] = issue.message;
      }
    }
    return {
      success: false,
      error: "Please correct the errors in the form.",
      fieldErrors,
    };
  }

  const { fullName, email, mobile, password } = parseResult.data;
  const cleanEmail = email.toLowerCase().trim();

  try {
    // Check if email already registered
    const existing = await db.query.users.findFirst({
      where: eq(users.email, cleanEmail),
    });

    if (existing) {
      return {
        success: false,
        error: "An account with this email address already exists. Please sign in instead.",
        fieldErrors: {
          email: "This email address is already registered.",
        },
      };
    }

    const passwordHash = await hashPassword(password);
    const userId = `usr_${randomBytes(16).toString("hex")}`;
    const now = new Date();

    const [newUser] = await db
      .insert(users)
      .values({
        id: userId,
        fullName: fullName.trim(),
        email: cleanEmail,
        mobile: mobile ? mobile.trim() : null,
        passwordHash,
        role: "CANDIDATE",
        isEmailVerified: false,
        failedLoginAttempts: 0,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // Generate email verification token
    const token = await generateEmailVerificationToken(newUser.id);
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationUrl = `${siteUrl}/verify-email?token=${token}`;

    // Send verification email asynchronously
    sendEmailVerificationEmail(cleanEmail, verificationUrl).catch((err) =>
      console.error("Failed to dispatch registration verification email:", err)
    );

    // Automatically establish session for seamless UX
    await establishCandidateSession(newUser.id);

    return {
      success: true,
      message: "Registration successful. Welcome to NEXTVACANCY!",
    };
  } catch (err) {
    console.error("Registration action failure:", err);
    return {
      success: false,
      error: "An unexpected error occurred during registration. Please try again.",
    };
  }
}
