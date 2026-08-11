import type { Metadata } from "next";
import {
  getLatestJobs,
  getEndingSoonJobs,
  getJobsByCategory,
} from "@/services";
import { ContentWithSidebar } from "@/components/layout";
import {
  HeroSearch,
  CategoryGrid,
  LatestJobsSection,
  EndingSoonSection,
  GovtAndPrivateSplitSection,
  ExamCornerSection,
  ScholarshipSection,
  CommunitySidebarCard,
  SidebarImportantLinks,
  TrustSection,
  SeoContentSection,
} from "@/components/homepage";

export const metadata: Metadata = {
  title: "NEXTVACANCY — Latest Government Jobs, Private Jobs, Results & Admit Cards",
  description:
    "Fast, reliable, and verified recruitment alerts, government jobs (Sarkari Naukri), private vacancies, admit cards, exam dates, answer keys, and results across India.",
  keywords: [
    "Government Jobs",
    "Sarkari Naukri",
    "SSC CGL 2026",
    "UPSC Civil Services",
    "Railway RRB NTPC",
    "Admit Cards",
    "Exam Results",
    "Scholarships in India",
    "PM Internship Scheme",
  ],
  openGraph: {
    title: "NEXTVACANCY — Latest Government Jobs, Private Jobs, Results & Admit Cards",
    description:
      "Authentic recruitment notifications, sarkari naukri alerts, private vacancies, admit cards, answer keys, exam dates, and results across India.",
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

export default async function Home() {
  // Fetch real-time / mock recruitment records via clean service boundary
  const [
    latestJobs,
    endingSoonJobs,
    govtJobs,
    privateJobs,
    admitCards,
    results,
    scholarships,
    internships,
  ] = await Promise.all([
    getLatestJobs(6),
    getEndingSoonJobs(4),
    getJobsByCategory("government", 4),
    getJobsByCategory("private", 4),
    getJobsByCategory("admit-card", 4),
    getJobsByCategory("result", 4),
    getJobsByCategory("scholarship", 2),
    getJobsByCategory("internship", 2),
  ]);

  const scholarshipAndInternships = [...scholarships, ...internships];

  return (
    <div className="bg-slate-50/50">
      {/* 1. Hero & Primary Search */}
      <HeroSearch />

      {/* 2. Quick Category Grid */}
      <CategoryGrid />

      {/* 3. Main 2-Column Content Shell */}
      <ContentWithSidebar
        sidebar={
          <div className="space-y-6">
            <CommunitySidebarCard />
            <SidebarImportantLinks />
          </div>
        }
      >
        {/* Main Content Column */}
        <div className="space-y-8">
          {/* Latest Notifications Section */}
          <LatestJobsSection jobs={latestJobs} />

          {/* Ending Soon Urgent Section */}
          <EndingSoonSection jobs={endingSoonJobs} />

          {/* Govt & Private Comparative Split */}
          <GovtAndPrivateSplitSection
            govtJobs={govtJobs}
            privateJobs={privateJobs}
          />

          {/* Exam Corner (Admit Cards & Results) */}
          <ExamCornerSection admitCards={admitCards} results={results} />

          {/* Scholarships & Internships */}
          <ScholarshipSection opportunities={scholarshipAndInternships} />
        </div>
      </ContentWithSidebar>

      {/* 4. Trust & Official Source Verification Section */}
      <TrustSection />

      {/* 5. Semantic SEO Content Overview */}
      <SeoContentSection />
    </div>
  );
}
