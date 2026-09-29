import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, Button, Card, CardContent } from "@/components/ui";
import { WifiOff, Home, RefreshCw, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Offline | NEXTVACANCY",
  description: "You are currently offline. Please check your internet connection.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflinePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-slate-50/50">
      <Container size="sm">
        <Card className="bg-white border-[var(--border)] shadow-md rounded-3xl p-6 sm:p-10 text-center space-y-6">
          <CardContent className="p-0 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-[#D97706] flex items-center justify-center shadow-xs">
              <WifiOff className="h-8 w-8" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                You&apos;re Currently Offline
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                It looks like your internet connection was interrupted. Check your network or Wi-Fi settings and try again.
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/">
                <Button
                  variant="accent"
                  size="md"
                  className="w-full sm:w-auto font-bold min-h-[44px]"
                  leftIcon={<Home className="h-4 w-4" />}
                >
                  Return to Home
                </Button>
              </Link>

              <Link href="/search">
                <Button
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto font-semibold min-h-[44px]"
                  leftIcon={<RefreshCw className="h-4 w-4" />}
                >
                  Explore Search
                </Button>
              </Link>
            </div>

            <div className="pt-4 border-t border-[var(--border)] text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>NEXTVACANCY — Fast & Resilient Offline PWA</span>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
