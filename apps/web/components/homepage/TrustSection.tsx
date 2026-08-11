import React from "react";
import { Container, Card, CardContent } from "@/components/ui";
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText } from "lucide-react";

export const TrustSection: React.FC = () => {
  return (
    <section aria-labelledby="trust-section-heading" className="py-8 sm:py-10 bg-slate-100/70 border-t border-[var(--border)]">
      <Container size="lg" className="space-y-6">
        <div className="max-w-2xl space-y-1.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            <h2 id="trust-section-heading" className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Our Trust & Information Integrity Commitment
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Dedicated to providing transparent, verified, and timely recruitment details across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white">
            <CardContent className="p-4 sm:p-5 space-y-2">
              <div className="p-2 w-fit rounded-lg bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Official Gazettes & Notices</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every vacancy listed on NEXTVACANCY is cross-verified with official employment news, gazette notifications, and commission websites.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4 sm:p-5 space-y-2">
              <div className="p-2 w-fit rounded-lg bg-blue-50 text-[#1D4ED8]">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Free Public Access</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All vacancy alerts, syllabus breakdowns, and exam dates are 100% free for all aspirants with zero paywalls or registration fees.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4 sm:p-5 space-y-2">
              <div className="p-2 w-fit rounded-lg bg-amber-50 text-[#D97706]">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Independent Platform</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                NEXTVACANCY is an independent educational portal. Candidates must always verify application eligibility and fee details on official department portals before final submission.
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
};

TrustSection.displayName = "TrustSection";
