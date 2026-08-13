import React from "react";
import type { Metadata } from "next";
import { searchJobs } from "@/services";
import { JobStatus, JobSortOption } from "@/types";
import { CategoryPageTemplate } from "@/components/search";

interface AdmitCardsPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    qualification?: string;
    location?: string;
    sort?: string;
    page?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Admit Cards 2026 — Download Hall Tickets & Exam City Slips | NEXTVACANCY",
  description:
    "Direct links to download exam admit cards, hall tickets, call letters, and exam city intimation slips for SSC CGL/CHSL, UPSC CSE, RRB NTPC, Banking exams, and National Entrance Tests.",
  keywords: [
    "Admit Cards 2026",
    "Download Hall Ticket",
    "SSC Admit Card",
    "UPSC e-Admit Card",
    "Railway Hall Ticket",
    "JEE Main Admit Card",
    "Exam City Slip",
  ],
  alternates: {
    canonical: "/admit-cards",
  },
  openGraph: {
    title: "Admit Cards & Hall Ticket Releases 2026 | NEXTVACANCY",
    description:
      "Instant notification and direct official download links for competitive examination hall tickets.",
    url: "/admit-cards",
    type: "website",
    siteName: "NEXTVACANCY",
  },
  twitter: {
    card: "summary_large_image",
    title: "Admit Cards & Hall Ticket Releases 2026",
    description: "Download verified exam admit cards and hall tickets.",
  },
};

export default async function AdmitCardsPage({
  searchParams,
}: AdmitCardsPageProps) {
  const params = await searchParams;
  const pageNum = parseInt(params.page || "1", 10) || 1;

  const results = await searchJobs({
    query: params.q,
    category: "admit-card",
    status: params.status as JobStatus | "all",
    qualification: params.qualification,
    location: params.location,
    sortBy: params.sort as JobSortOption,
    page: pageNum,
    limit: 8,
  });

  return (
    <CategoryPageTemplate
      title="Admit Cards & Exam Hall Tickets"
      description="Direct official download links, exam city slips, shift timings, and reporting instructions for central & state examinations."
      badgeText="Exam Hall Tickets & City Slips"
      category="admit-card"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Admit Cards", active: true },
      ]}
      basePath="/admit-cards"
      results={results}
      searchParams={params}
      seoText={
        <div className="space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            How to Download Your Examination Admit Card
          </h2>
          <p>
            Candidates can download their e-Admit Card by visiting the official commission website using their Registration ID / Roll Number and Date of Birth / Password. Ensure you print a clear copy of the hall ticket along with valid government photo identification (Aadhaar Card, Voter ID, Passport, or Driving License).
          </p>
        </div>
      }
    />
  );
}
