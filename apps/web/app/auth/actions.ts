"use server";

import {
  authenticateCandidate,
  registerCandidate,
  setCandidateSession,
} from "@/lib/auth/candidate-auth.server";

export async function loginCandidateAction(input: {
  email: string;
  password: string;
}): Promise<{ success: boolean; error?: string }> {
  const result = await authenticateCandidate(input.email, input.password);
  if (!result.success) return result;

  await setCandidateSession(result.userId, result.email);
  return { success: true };
}

export async function registerCandidateAction(input: {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
}): Promise<{ success: boolean; error?: string }> {
  const result = await registerCandidate(input);
  if (!result.success) return result;
  return { success: true };
}
