import React from "react";
import { Container, Card } from "@/components/ui";
import { ShieldCheck, Zap, Layers, CheckCircle2, Award } from "lucide-react";

const FEATURES = [
  {
    id: "verified-notifications",
    title: "100% Gazette Verified Circulars",
    tagline: "Authenticity First",
    description:
      "Every vacancy, syllabus PDF, and exam schedule is cross-verified directly against official Government Gazettes and commission websites before publishing.",
    icon: ShieldCheck,
    iconColor: "text-emerald-700",
    iconBgColor: "bg-emerald-50",
    bullets: [
      "Zero clickbait or unverified circulars",
      "Direct links to official commission portals",
      "Exact qualification, fee & age relaxation breakdown",
    ],
  },
  {
    id: "fast-updates",
    title: "Instant Real-Time Alert Engine",
    tagline: "Speed & Accuracy",
    description:
      "Be the first to know when admit cards, exam city slips, answer keys, or final merit results are published across central and state boards.",
    icon: Zap,
    iconColor: "text-[#D97706]",
    iconBgColor: "bg-amber-50",
    bullets: [
      "Real-time breaking recruitment bulletin",
      "1-click PDF admit card and hall ticket access",
      "Daily morning recruitment digest for candidates",
    ],
  },
  {
    id: "one-platform",
    title: "One Unified Candidate Platform",
    tagline: "Complete Career Hub",
    description:
      "Everything an aspirant needs in one clean, distraction-free portal — Central jobs, State PSCs, Banking, Defence, PM Schemes, and Scholarships.",
    icon: Layers,
    iconColor: "text-[var(--primary)]",
    iconBgColor: "bg-blue-50",
    bullets: [
      "Categorized by qualification (10th, 12th, Graduate)",
      "Smart search with status and location filters",
      "100% free with zero paywalls for aspirants",
    ],
  },
];

export interface WhyChooseUsProps {
  className?: string;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ className = "" }) => {
  return (
    <section
      aria-label="Why Millions Trust NEXTVACANCY"
      className={["py-16 bg-white border-b border-slate-200", className]
        .filter(Boolean)
        .join(" ")}
    >
      <Container size="lg" className="space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-[var(--primary)] text-xs font-bold border border-blue-200/80">
            <Award className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Built for Indian Job Aspirants</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Why Millions of Aspirants Trust NEXTVACANCY
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            We eliminate clickbait and provide accurate, verified, and timely recruitment
            information for candidates across India.
          </p>
        </div>

        {/* 3-Column Premium Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;

            return (
              <Card
                key={feat.id}
                className="bg-white border border-slate-200/90 p-7 lg:p-8 rounded-2xl shadow-xs hover:shadow-lg hover:border-[var(--primary)] transition-all duration-200 flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={[
                        "w-12 h-12 rounded-xl flex items-center justify-center shadow-xs border border-slate-100 transition-transform duration-200 group-hover:scale-105",
                        feat.iconBgColor,
                        feat.iconColor,
                      ].join(" ")}
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {feat.tagline}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 leading-snug">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs font-medium text-slate-700">
                  {feat.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2
                        className="h-4 w-4 text-emerald-700 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

WhyChooseUs.displayName = "WhyChooseUs";
