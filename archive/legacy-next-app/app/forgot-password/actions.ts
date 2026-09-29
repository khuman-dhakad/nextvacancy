"use server";

import { headers } from "next/headers";
import { ForgotPasswordSchema, ResetPasswordSchema } from "@/lib/validations/auth";
import {
  generatePasswordResetToken,
  resetPasswordWithToken,
} from "@/lib/auth/user-auth";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { ForgotPasswordFormData } from "@/types";

export interface PasswordResetActionResult {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function forgotPasswordAction(
  formData: FormData | ForgotPasswordFormData | Record<string, unknown>
): Promise<PasswordResetActionResult> {
  const headerStore = await headers();
  const clientIp =
    headerStore.get("x-forwarded-for")?.split(",")[0].trim() ||
    headerStore.get("x-real-ip") ||
    "127.0.0.1";

  // Rate limit: max 5 requests per 10 minutes per IP
  const rateLimit = checkRateLimit(`forgot_${clientIp}`, 5, 10 * 60 * 1000);
  if (!rateLimit.success) {
    return {
      success: false,
      error: "Too many password recovery requests. Please wait a few minutes before trying again.",
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

  const parseResult = ForgotPasswordSchema.safeParse({
    email: rawData.email,
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
      error: "Please enter a valid email address.",
      fieldErrors,
    };
  }

  const { email } = parseResult.data;

  try {
    const { rawToken } = await generatePasswordResetToken(email);

    if (rawToken) {
      const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const resetUrl = `${siteUrl}/forgot-password?token=${rawToken}`;

      await sendPasswordResetEmail(email, resetUrl);
    }

    // Always return success to prevent email enumeration
    return {
      success: true,
      message: "If an account exists with this email address, password reset instructions have been sent.",
    };
  } catch (err) {
    console.error("Forgot password action error:", err);
    return {
      success: false,
      error: "Unable to process password reset request. Please try again later.",
    };
  }
}

export async function resetPasswordAction(
  formData: FormData | { token?: string; password?: string; confirmPassword?: string } | Record<string, unknown>
): Promise<PasswordResetActionResult> {
  const rawData: Record<string, unknown> = {};
  if (formData instanceof FormData) {
    formData.forEach((value, key) => {
      rawData[key] = value;
    });
  } else {
    Object.assign(rawData, formData);
  }

  const parseResult = ResetPasswordSchema.safeParse({
    token: rawData.token,
    password: rawData.password,
    confirmPassword: rawData.confirmPassword,
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

  const { token, password } = parseResult.data;

  try {
    const result = await resetPasswordWithToken(token, password);
    if (!result.success) {
      return {
        success: false,
        error: result.error || "Password reset link is invalid or has expired.",
      };
    }

    return {
      success: true,
      message: "Your password has been successfully reset. You may now sign in with your new password.",
    };
  } catch (err) {
    console.error("Reset password action error:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
