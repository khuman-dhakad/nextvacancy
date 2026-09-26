import "server-only";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserBySessionToken, createCandidateSession, revokeCandidateSession, SESSION_MAX_AGE_SECONDS } from "./candidate-auth.server";

export const CANDIDATE_SESSION_COOKIE_NAME = "nextvacancy_candidate_session";

export async function getCurrentCandidate() {
  const token = (await cookies()).get(CANDIDATE_SESSION_COOKIE_NAME)?.value;
  return token ? getUserBySessionToken(token) : null;
}

export async function requireCandidate(redirectTo = "/login") {
  const user = await getCurrentCandidate();
  if (!user) redirect(redirectTo);
  return user;
}

export async function setCandidateSession(userId: string): Promise<void> {
  const headerStore = await headers();
  const token = await createCandidateSession(userId, headerStore.get("x-forwarded-for")?.split(",")[0].trim(), headerStore.get("user-agent") || undefined);
  (await cookies()).set(CANDIDATE_SESSION_COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_MAX_AGE_SECONDS });
}

export async function clearCandidateSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CANDIDATE_SESSION_COOKIE_NAME)?.value;
  if (token) await revokeCandidateSession(token);
  cookieStore.delete(CANDIDATE_SESSION_COOKIE_NAME);
}
