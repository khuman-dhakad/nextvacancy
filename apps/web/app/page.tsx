import React from "react";
import type { Metadata } from "next";
import {
  Hero,
  StatsSection,
  VerificationStrip,
  FeaturedJobs,
  Notifications,
  CategoryGrid,
  WhyChooseUs,
  Newsletter,
} from "@/components/desktop/home";

export const metadata: Metadata = {
  title: "NEXTVACANCY — India's Most Trusted Government & Private Jobs Portal 2026",
  description:
    "Get authentic notifications, exam dates, admit cards, results, answer keys & scholarships – all in one place. SSC, UPSC, Railway, Banking, Defence, State PSCs.",
  keywords: [
    "Government Jobs 2026",
    "Sarkari Naukri",
    "SSC CGL 2026",
    "UPSC Civil Services",
    "Railway RRB NTPC",
    "Banking Jobs",
    "Admit Cards",
    "Exam Results",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NEXTVACANCY — India's Most Trusted Government & Private Jobs Portal",
    description:
      "Get authentic notifications, exam dates, admit cards, results, answer keys & scholarships – all in one place.",
    url: "/",
    siteName: "NEXTVACANCY",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXTVACANCY — India's Fastest Recruitment Portal",
    description:
      "Direct official links to apply for latest government jobs, admit cards, and exam results in India.",
  },
};

export default function HomePage() {
  return (
    <div className="w-full bg-[#F8FAFC]">
      {/* 1. Hero Section with SearchPanel & TrendingChips */}
      <Hero />

      {/* 2. Live Market Statistics (4 Luxury Metric Cards) */}
      <StatsSection />

      {/* 3. Platform Verification Strip (4 Trust Standards) */}
      <VerificationStrip />

      {/* 4. Featured Government Jobs (4-Column Recruitment Cards) */}
      <FeaturedJobs />

      {/* 5. Latest Notifications (Editorial Gazette Feed) */}
      <Notifications />

      {/* 6. Popular Exam Categories (8 Icon Cards Grid) */}
      <CategoryGrid />

      {/* 7. Why NEXTVACANCY (Trust Pillars with Highlights) */}
      <WhyChooseUs />

      {/* 8. Newsletter / Community CTA */}
      <Newsletter />
    </div>
  );
}
