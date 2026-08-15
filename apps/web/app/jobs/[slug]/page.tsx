import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJobBySlug, getRelatedJobs } from "@/services";
import { Container, Breadcrumb } from "@/components/ui";
import { ContentWithSidebar } from "@/components/layout";
import { CommunitySidebarCard, SidebarImportantLinks, TrustSection } from "@/components/homepage";
import { JobHero, ImportantLinks, StickyMobileApplyBar } from "@/components/jobs";
import {
  RecruitmentOverview,
  ImportantDates,
  VacancyTable,
  EligibilityCard,
  SalaryCard,
  SelectionStepper,
  FeeTable,
  DocumentsChecklist,
  OfficialLinks,
  FAQSection,
  RelatedJobs,
} from "@/components/desktop/recruitment";

interface JobDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return { title: "Recruitment Notification | NEXTVACANCY" };

  return {
    title: `${job.title} — Notification, Eligibility & Apply Online | NEXTVACANCY`,
    description: `${job.shortSummary} View detailed vacancy breakdown, age criteria, salary structure, and official application portals.`,
    keywords: [job.organization, job.title, "Recruitment 2026", "Sarkari Naukri", "Apply Online", "Eligibility Criteria"],
    alternates: { canonical: `/jobs/${job.slug}` },
    openGraph: { title: `${job.title} | NEXTVACANCY`, description: job.shortSummary, url: `/jobs/${job.slug}`, type: "article" },
    twitter: { card: "summary_large_image", title: `${job.title} | NEXTVACANCY`, description: job.shortSummary },
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const relatedJobs = await getRelatedJobs(job.category, job.slug, 4);
  const primaryApplyLink = job.importantLinks.find((l) => l.linkType === "apply_online")?.url;

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://nextvacancy.com" },
          { "@type": "ListItem", position: 2, name: job.organization, item: `https://nextvacancy.com/jobs/${job.slug}` },
        ],
      },
      {
        "@type": "JobPosting",
        title: job.title,
        description: job.shortSummary,
        datePosted: job.createdAt,
        validThrough: job.importantDates.applicationEndDate ? `${job.importantDates.applicationEndDate}T23:59:59Z` : undefined,
        employmentType: job.jobType === "Contractual" ? "CONTRACTOR" : "FULL_TIME",
        hiringOrganization: { "@type": "Organization", name: job.organization },
        jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "IN" } },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" id="job-schema" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-slate-50/50 min-h-screen pb-16 lg:pb-8">
        <div className="bg-white border-b border-[var(--border)] py-3">
          <Container size="lg">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Jobs", href: "/government-jobs" }, { label: job.organization, active: true }]} />
          </Container>
        </div>

        <ContentWithSidebar sidebar={<div className="space-y-6"><ImportantLinks links={job.importantLinks} variant="compact" /><CommunitySidebarCard /><SidebarImportantLinks /></div>}>
          <article className="space-y-6">
            <JobHero job={job} />
            <RecruitmentOverview job={job} />
            <ImportantDates dates={job.importantDates} />
            <VacancyTable vacancies={job.vacancyBreakdown} totalVacancies={job.totalVacancies} organization={job.organization} />
            <EligibilityCard qualificationSummary={job.qualificationSummary} qualificationsList={job.qualificationsList} ageLimit={job.ageLimit} />
            <SalaryCard salaryOrStipend={job.salaryOrStipend} />
            <SelectionStepper steps={job.selectionProcess} />
            <FeeTable fee={job.feeStructure} />
            <DocumentsChecklist documents={job.requiredDocuments} />
            <OfficialLinks links={job.importantLinks} />
            <FAQSection job={job} faqs={job.faqs} />
            <RelatedJobs jobs={relatedJobs} />
          </article>
        </ContentWithSidebar>

        <TrustSection />
        <StickyMobileApplyBar lastDate={job.importantDates.applicationEndDate} applyUrl={primaryApplyLink} isEndingSoon={job.status === "ENDING_SOON"} />
      </div>
    </>
  );
}
