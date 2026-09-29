import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verify Email | NEXTVACANCY",
  robots: { index: false, follow: false },
};

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const verified = token
    ? await import("@/lib/auth/candidate-auth.server").then(({ verifyCandidateEmailToken }) =>
        verifyCandidateEmailToken(token)
      )
    : false;
  return (
    <main className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16">
      <section className="max-w-md text-center">
        <h1 className="text-2xl font-bold">{verified ? "Email verified" : "Verification link invalid"}</h1>
        <p className="mt-3 text-slate-600">{verified ? "Your account is ready. You can sign in now." : "This link may be expired or already used."}</p>
        <Link className="mt-6 inline-block font-semibold text-[var(--primary)]" href="/login">Continue to sign in</Link>
      </section>
    </main>
  );
}