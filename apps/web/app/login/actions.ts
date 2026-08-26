"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { LoginSchema } from "@/lib/validations/auth";
import { authenticateCandidate } from "@/lib/auth/user-auth";
import {
  establishCandidateSession,
  clearCandidateSessionCookie,
} from "@/lib/auth/session.server";
import { checkRateLimit } from "@/lib/rate-limit";
import { LoginFormData } from "@/types";

export interface CandidateAuthResult {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function loginAction(
  formData: FormData | LoginFormData | Record<string, unknown>
): Promise<CandidateAuthResult> {
  const headerStore = await headers();
  const clientIp =
    headerStore.get("x-forwarded-for")?.split(",")[0].trim() ||
    headerStore.get("x-real-ip") ||
    "127.0.0.1";

  // Rate limit: max 10 login attempts per minute per IP
  const rateLimit = checkRateLimit(`login_${clientIp}`, 10, 60 * 1000);
  if (!rateLimit.success) {
    return {
      success: false,
      error: "Too many login attempts. Please slow down and try again in a minute.",
    };
  }

  // Parse raw form data or JSON object
  const rawData: Record<string, unknown> = {};
  if (formData instanceof FormData) {
    formData.forEach((value, key) => {
      rawData[key] = value;
    });
  } else {
    Object.assign(rawData, formData);
  }

  const parseResult = LoginSchema.safeParse({
    email: rawData.email,
    password: rawData.password,
    rememberMe: rawData.rememberMe === true || rawData.rememberMe === "true" || rawData.rememberMe === "on",
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

  const { email, password } = parseResult.data;

  try {
    const authResult = await authenticateCandidate(email, password);

    if (!authResult.success || !authResult.user) {
      return {
        success: false,
        error: authResult.error || "Invalid email or password.",
      };
    }

    await establishCandidateSession(authResult.user.id);

    return {
      success: true,
      message: "Signed in successfully.",
    };
  } catch (err) {
    console.error("Login action failure:", err);
    return {
      success: false,
      error: "An unexpected error occurred while signing in. Please try again.",
    };
  }
}

export async function logoutAction(): Promise<void> {
  await clearCandidateSessionCookie();
  redirect("/");
}
