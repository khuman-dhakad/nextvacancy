import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { verifyCandidateEmailToken } from "@/lib/auth/user-auth";
import { Container, Card, Button } from "@/components/ui";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Verify Email Address | NEXTVACANCY",
  description: "Confirm and verify your NEXTVACANCY candidate email address.",
  robots: { index: false, follow: false },
};

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { token } = await searchParams;

  let isVerified = false;
  let errorMessage: string | null = null;

  if (!token) {
    errorMessage = "Verification token is missing. Please check the link from your confirmation email.";
  } else {
    const result = await verifyCandidateEmailToken(token);
    if (result.success) {
      isVerified = true;
    } else {
      errorMessage = result.error || "This verification link is invalid or has expired.";
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 bg-[#F1F5F9]">
      <Container size="sm">
        <Card className="p-8 text-center space-y-6 max-w-md mx-auto shadow-lg rounded-2xl bg-white border border-slate-200">
          {isVerified ? (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-bold text-slate-900">Email Address Verified!</h1>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your candidate email has been verified. You will now receive instant recruitment circulars, admit card releases, and exam result updates.
                </p>
              </div>
              <div className="pt-2">
                <Link href="/dashboard">
                  <Button variant="primary" size="lg" fullWidth rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertCircle className="h-10 w-10" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-bold text-slate-900">Verification Link Failed</h1>
                <p className="text-xs text-rose-600 leading-relaxed font-medium">
                  {errorMessage}
                </p>
              </div>
              <div className="pt-2 space-y-2">
                <Link href="/login">
                  <Button variant="primary" size="md" fullWidth>
                    Sign In to Resend Link
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost" size="md" fullWidth>
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            </>
          )}
        </Card>
      </Container>
    </div>
  );
}
