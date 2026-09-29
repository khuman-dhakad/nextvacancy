import React from "react";
import { Container, Card } from "@/components/ui";
import { ShieldCheck, Zap, Layers, CheckCircle2, Award } from "lucide-react";

const FEATURES = [
  {
    id: "catalog-search",
    title: "Browse the job catalog",
    tagline: "Search and filter",
    description:
      "Find available records by keyword, category, status, qualification, and location.",
    icon: ShieldCheck,
    iconColor: "text-emerald-700",
    iconBgColor: "bg-emerald-50 border-emerald-200/80",
    bullets: [
      "Database-backed job listings",
      "Server-side search and pagination",
      "Filters for common job attributes",
    ],
  },
  {
    id: "job-details",
    title: "Review job details",
    tagline: "Listing information",
    description:
      "Open a listing to review the recruitment information available for that record.",
    icon: Zap,
    iconColor: "text-amber-800",
    iconBgColor: "bg-amber-50 border-amber-200/80",
    bullets: [
      "Vacancy and qualification details when provided",
      "Important dates when available",
      "Application links when provided",
    ],
  },
  {
    id: "saved-jobs",
    title: "Save opportunities",
    tagline: "Candidate account",
    description:
      "Signed-in candidates can save job listings and return to them from their account.",
    icon: Layers,
    iconColor: "text-[var(--primary)]",
    iconBgColor: "bg-blue-50 border-blue-200/80",
    bullets: [
      "Candidate-authorized saved jobs",
      "Review saved records from your account",
      "Sign in to save or remove a listing",
    ],
  },
];

export interface WhyChooseUsProps {
  className?: string;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ className = "" }) => {
  return (
    <section
      aria-label="NEXTVACANCY catalog features"
      className={["py-16 bg-white border-b border-slate-200", className]
        .filter(Boolean)
        .join(" ")}
    >
      <Container size="lg" className="space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-[var(--primary)] text-xs font-bold border border-blue-200/80">
            <Award className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
            <span>Built for Indian Job Aspirants</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Explore NEXTVACANCY
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
            Search job listings, review available recruitment details, and save
            opportunities to a candidate account.
          </p>
        </div>

        {/* 3-Column Premium Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;

            return (
              <Card
                key={feat.id}
                className="bg-white border border-slate-200/90 p-7 lg:p-8 rounded-3xl shadow-2xs hover:shadow-lg hover:border-[var(--primary)] transition-all duration-200 flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={[
                        "w-12 h-12 rounded-2xl flex items-center justify-center border shadow-2xs transition-transform duration-200 group-hover:scale-105",
                        feat.iconBgColor,
                        feat.iconColor,
                      ].join(" ")}
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      {feat.tagline}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs font-semibold text-slate-700">
                  {feat.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2
                        className="h-4 w-4 text-emerald-600 shrink-0"
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
