"use server";

import { generatePasswordResetToken } from "@/lib/auth/candidate-auth.server";
import { sendTransactionalEmail } from "@/lib/email";

export async function requestPasswordResetAction(email: string): Promise<{ success: boolean; error?: string }> {
  const result = await generatePasswordResetToken(email);
  if (!result) return { success: true };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nextvacancy.com";
  try {
    await sendTransactionalEmail({
      to: result.user.email,
      subject: "Reset your NEXTVACANCY password",
      html: `<p>Use this secure link to reset your password:</p><p><a href="${siteUrl}/reset-password?token=${encodeURIComponent(result.token)}">Reset password</a></p>`,
    });
  } catch {
    return { success: false, error: "Unable to send reset instructions right now." };
  }
  return { success: true };
}
