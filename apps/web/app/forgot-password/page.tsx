import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard, ForgotPasswordForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Reset Password | NEXTVACANCY",
  description:
    "Reset your NEXTVACANCY account password using your registered email address.",
  alternates: {
    canonical: "/forgot-password",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-10 sm:py-16 px-4 bg-slate-50/50">
      <AuthCard
        title="Recover Your Password"
        subtitle="We will help you regain secure access to your account"
        footer={
          <p>
            Remembered your password?{" "}
            <Link
              href="/login"
              className="font-bold text-[var(--primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded px-1"
            >
              Sign in here
            </Link>
          </p>
        }
      >
        <ForgotPasswordForm />
      </AuthCard>
    </div>
  );
}
