import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard, LoginForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Sign In | NEXTVACANCY",
  description:
    "Sign in to your NEXTVACANCY account to track applied government jobs, admit card notifications, and exam alerts.",
  alternates: {
    canonical: "/login",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-10 sm:py-16 px-4 bg-[#F1F5F9]">
      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to track recruitment deadlines and admit card alerts"
        footer={
          <p>
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="font-bold text-[var(--primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded px-1"
            >
              Create free account
            </Link>
          </p>
        }
      >
        <LoginForm />
      </AuthCard>
    </div>
  );
}
