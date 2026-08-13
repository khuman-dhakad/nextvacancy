import React from "react";
import type { Metadata } from "next";
import {
  getLatestJobs,
  getEndingSoonJobs,
  getTrendingJobs,
  getJobsByCategory,
} from "@/services";
import { ContentWithSidebar } from "@/components/layout";
import {
  CommunitySidebarCard,
  SidebarImportantLinks,
  TrustSection,
  SeoContentSection,
} from "@/components/homepage";
import {
  HeroSection,
  LiveTicker,
  CategoryGrid,
  JobSection,
  ScholarshipSection,
  TrendingSection,
  CommunityCTA,
  ArticlePlaceholder,
} from "@/components/home";
import { Building2, Briefcase, FileCheck, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "NEXTVACANCY — Latest Government Jobs, Private Jobs, Results & Admit Cards 2026",
  description:
    "Fast, reliable, and verified recruitment alerts, government jobs (Sarkari Naukri), private vacancies, admit cards, exam dates, answer keys, and results across India.",
  keywords: [
    "Government Jobs 2026",
    "Sarkari Naukri",
    "SSC CGL 2026",
    "UPSC Civil Services",
    "Railway RRB NTPC",
    "Bank PO Vacancies",
    "Admit Cards Download",
    "Exam Results 2026",
    "Scholarships in India",
    "PM Internship Scheme",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NEXTVACANCY — Latest Government Jobs, Private Jobs, Results & Admit Cards",
    description:
      "Authentic recruitment notifications, sarkari naukri alerts, private vacancies, admit cards, answer keys, exam dates, and results across India.",
    url: "/",
    siteName: "NEXTVACANCY",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXTVACANCY — Latest Government & Private Jobs Portal",
    description:
      "Direct official links to apply for latest government jobs, admit cards, and exam results in India.",
  },
};

export default async function HomePage() {
  // Fetch dynamic recruitment datasets via async service boundary
  const [
    latestJobs,
    endingSoonJobs,
    trendingJobs,
    govtJobs,
    privateJobs,
    admitCards,
    results,
    scholarships,
    internships,
  ] = await Promise.all([
    getLatestJobs(8),
    getEndingSoonJobs(4),
    getTrendingJobs(6),
    getJobsByCategory("government", 6),
    getJobsByCategory("private", 6),
    getJobsByCategory("admit-card", 4),
    getJobsByCategory("result", 4),
    getJobsByCategory("scholarship", 2),
    getJobsByCategory("internship", 2),
  ]);

  const scholarshipOpportunities = [...scholarships, ...internships];
  const tickerUpdates = [...latestJobs, ...endingSoonJobs];

  // Structured Data Schemas
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NEXTVACANCY",
    url: "https://nextvacancy.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://nextvacancy.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NEXTVACANCY",
    url: "https://nextvacancy.com",
    logo: "https://nextvacancy.com/favicon.ico",
    sameAs: [
      "https://whatsapp.com",
      "https://t.me",
    ],
  };

  return (
    <>
      {/* Structured Data Scripts (SEO) */}
      <script
        type="application/ld+json"
        id="website-jsonld"
      >
        {JSON.stringify(websiteSchema)}
      </script>
      <script
        type="application/ld+json"
        id="org-jsonld"
      >
        {JSON.stringify(organizationSchema)}
      </script>

      <div className="bg-slate-50/50">
        {/* 1. Hero Search Section */}
        <HeroSection />

        {/* 2. Live Notification Ticker */}
        <LiveTicker updates={tickerUpdates} />

        {/* 3. Quick Category Grid */}
        <CategoryGrid />

        {/* 4-11. Main Content Layout with Responsive Sidebar */}
        <ContentWithSidebar
          sidebar={
            <div className="space-y-6">
              <CommunitySidebarCard />
              <SidebarImportantLinks />
            </div>
          }
        >
          <div className="space-y-10">
            {/* 4. Latest Government Jobs */}
            <JobSection
              title="Latest Government Jobs (Sarkari Naukri)"
              description="Freshly announced central and state government recruitments with official application deadlines"
              badge="Central & State"
              icon={Building2}
              viewAllHref="/government-jobs"
              jobs={govtJobs}
            />

            {/* 5. Latest Private Jobs */}
            <JobSection
              title="Latest Private & IT Careers"
              description="Top off-campus drives, MNC software engineering roles, and corporate banking vacancies"
              badge="Tech & MNCs"
              icon={Briefcase}
              viewAllHref="/private-jobs"
              jobs={privateJobs}
            />

            {/* 6. Admit Cards */}
            <JobSection
              title="Admit Cards & Exam Hall Tickets"
              description="Direct download links for competitive exam hall tickets, call letters, and exam city slips"
              badge="Live Downloads"
              icon={FileCheck}
              viewAllHref="/admit-cards"
              jobs={admitCards}
            />

            {/* 7. Results */}
            <JobSection
              title="Exam Results & Merit Lists"
              description="Published exam scorecards, category-wise qualifying cut-offs, and final selection lists"
              badge="Declared"
              icon={Award}
              viewAllHref="/results"
              jobs={results}
            />

            {/* 8. Scholarships & Internships */}
            <ScholarshipSection opportunities={scholarshipOpportunities} />

            {/* 9. Trending Notifications */}
            <TrendingSection trendingJobs={trendingJobs} />

            {/* 10. WhatsApp Community CTA */}
            <CommunityCTA />

            {/* 11. Latest Articles Placeholder */}
            <ArticlePlaceholder />
          </div>
        </ContentWithSidebar>

        {/* 12. Footer Trust Section & SEO Context */}
        <TrustSection />
        <SeoContentSection />
      </div>
    </>
  );
}
