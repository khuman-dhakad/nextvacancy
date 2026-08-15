import React from "react";
import type { Metadata } from "next";
import {
  Hero,
  StatsSection,
  FeaturedJobs,
  Notifications,
  CategoryGrid,
  WhyChooseUs,
  CommunityCTA,
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
      {/* 1. Premium Hero (Headline, Subtitle, Search, Location, Category, CTA, Trending Searches) */}
      <Hero />

      {/* 2. Live Statistics (Active Jobs, Admit Cards, Results, Internships) */}
      <StatsSection />

      {/* 3. Featured Government Jobs (4 Premium Cards) */}
      <FeaturedJobs />

      {/* 4. Latest Notifications (Editorial Style List) */}
      <Notifications />

      {/* 5. Popular Categories (Icon Grid) */}
      <CategoryGrid />

      {/* 6. Why NEXTVACANCY (3 Trust Cards) */}
      <WhyChooseUs />

      {/* 7. Community CTA (WhatsApp, Telegram) */}
      <CommunityCTA />
    </div>
  );
}
