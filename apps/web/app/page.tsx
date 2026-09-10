import React from "react";
import type { Metadata } from "next";
import {
  Hero,
  StatsSection,
  FeaturedJobs,
  Notifications,
  CategoryGrid,
  WhyChooseUs,
  Newsletter,
  CommunityCTA,
} from "@/components/desktop/home";
import { getFeaturedJobs, getLatestJobs } from "@/services/jobs/jobs.service";

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

export default async function HomePage() {
  const [featuredJobs, latestJobs] = await Promise.all([
    getFeaturedJobs(4),
    getLatestJobs(6),
  ]);

  return (
    <div className="w-full bg-[#ECECEC]">
      {/* 1. Premium Hero */}
      <Hero />

      {/* 2. Live Statistics */}
      <StatsSection />

      {/* 3. Featured Government Jobs (Database-backed) */}
      <FeaturedJobs jobs={featuredJobs} />

      {/* 4. Latest Notifications (Database-backed) */}
      <Notifications jobs={latestJobs} />

      {/* 5. Popular Categories */}
      <CategoryGrid />

      {/* 6. Why NEXTVACANCY */}
      <WhyChooseUs />

      {/* 7. Recruitment Digest */}
      <Newsletter />

      {/* 8. Community CTA */}
      <CommunityCTA />
    </div>
  );
}
