"use server";

import { authenticateCandidate, generateEmailVerificationToken, registerCandidate } from "@/lib/auth/candidate-auth.server";
import { setCandidateSession } from "@/lib/auth/session.server";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { sendTransactionalEmail } from "@/lib/email";

export async function loginCandidateAction(input: { email: string; password: string }) {
  const rateLimitKey = `candidate-login:${input.email.trim().toLowerCase()}`;
  if (!checkRateLimit(rateLimitKey)) return { success: false as const, error: "Too many login attempts. Please try again later." };
  const result = await authenticateCandidate(input.email, input.password);
  if (!result.success) return result;
  resetRateLimit(rateLimitKey);
  await setCandidateSession(result.user.id);
  return { success: true as const };
}

export async function registerCandidateAction(input: { fullName: string; email: string; mobile: string; password: string }) {
  const result = await registerCandidate(input);
  if (!result.success) return result;
  const verificationToken = await generateEmailVerificationToken(result.userId);
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nextvacancy.com";
    await sendTransactionalEmail({
      to: input.email.trim().toLowerCase(),
      subject: "Verify your NEXTVACANCY email",
      html: `<p>Confirm your email address:</p><p><a href="${siteUrl}/verify-email?token=${encodeURIComponent(verificationToken)}">Verify email</a></p>`,
    });
  } catch {
    return { success: false as const, error: "Registration is temporarily unavailable." };
  }
  return { success: true as const };
}
