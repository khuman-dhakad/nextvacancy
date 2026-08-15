import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard, RegisterForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Create an Account | NEXTVACANCY",
  description:
    "Register for a free NEXTVACANCY candidate account to access customized exam alerts, eligibility filters, and instant notification digests.",
  alternates: {
    canonical: "/register",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-10 sm:py-16 px-4 bg-[#F1F5F9]">
      <AuthCard
        title="Create Free Candidate Account"
        subtitle="Get instant exam notifications, customized feeds, and job alerts"
        footer={
          <p>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[var(--primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded px-1"
            >
              Sign in
            </Link>
          </p>
        }
      >
        <RegisterForm />
      </AuthCard>
    </div>
  );
}
