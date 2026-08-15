import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJobBySlug, getRelatedJobs } from "@/services";
import { Container, Breadcrumb } from "@/components/ui";
import { ContentWithSidebar } from "@/components/layout";
import {
  CommunitySidebarCard,
  SidebarImportantLinks,
  TrustSection,
} from "@/components/homepage";
import {
  JobHero,
  OverviewCards,
  DatesTable,
  FeeTable,
  AgeLimitCard,
  VacancyTable,
  QualificationSection,
  SelectionTimeline,
  HowToApply,
  ImportantLinks,
  FAQAccordion,
  RelatedJobs,
  StickyMobileApplyBar,
} from "@/components/jobs";

interface JobDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return {
      title: "Recruitment Notification | NEXTVACANCY",
      description: "Recruitment notification and exam details on NEXTVACANCY.",
    };
  }

  const categoryLabel =
    job.category === "government"
      ? "Sarkari Naukri"
      : job.category === "private"
      ? "Private Job"
      : job.category === "admit-card"
      ? "Admit Card"
      : job.category === "result"
      ? "Exam Result"
      : "Recruitment";

  return {
    title: `${job.title} — Notification, Eligibility, Fees & Apply Online | NEXTVACANCY`,
    description: `${job.shortSummary} Check eligibility criteria, total vacancies, age limit, application fee structure, and direct official application portal links.`,
    keywords: [
      job.organization,
      job.title,
      categoryLabel,
      "Recruitment 2026",
      "Apply Online",
      "Eligibility Criteria",
      "Notification PDF",
    ],
    alternates: {
      canonical: `/jobs/${job.slug}`,
    },
    openGraph: {
      title: `${job.title} | NEXTVACANCY`,
      description: job.shortSummary,
      url: `/jobs/${job.slug}`,
      type: "article",
      siteName: "NEXTVACANCY",
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.title} | NEXTVACANCY`,
      description: job.shortSummary,
    },
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const relatedJobs = await getRelatedJobs(job.category, job.slug, 4);

  const categoryName =
    job.category === "government"
      ? "Government Jobs"
      : job.category === "private"
      ? "Private Jobs"
      : job.category === "admit-card"
      ? "Admit Cards"
      : job.category === "result"
      ? "Exam Results"
      : job.category === "scholarship"
      ? "Scholarships"
      : job.category === "internship"
      ? "Internships"
      : "Recruitment";

  const categoryPath =
    job.category === "government"
      ? "/government-jobs"
      : job.category === "private"
      ? "/private-jobs"
      : job.category === "admit-card"
      ? "/admit-cards"
      : job.category === "result"
      ? "/results"
      : `/category/${job.category}`;

  const primaryApplyLink = job.importantLinks.find((l) => l.linkType === "apply_online")?.url;

  // Structured JSON-LD Schemas
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://nextvacancy.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: `https://nextvacancy.com${categoryPath}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: job.title,
        item: `https://nextvacancy.com/jobs/${job.slug}`,
      },
    ],
  };

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.shortSummary,
    datePosted: job.createdAt,
    validThrough: job.importantDates.applicationEndDate
      ? `${job.importantDates.applicationEndDate}T23:59:59Z`
      : undefined,
    employmentType: job.jobType === "Contractual" ? "CONTRACTOR" : "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: job.organization,
      sameAs: job.importantLinks.find((l) => l.linkType === "official_website")?.url,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "IN",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: {
        "@type": "QuantitativeValue",
        value: job.salaryOrStipend,
        unitText: "MONTH",
      },
    },
  };

  const faqSchema =
    job.faqs && job.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: job.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {/* Structured Data Scripts (SEO) */}
      <script
        type="application/ld+json"
        id="breadcrumb-jsonld"
      >
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script
        type="application/ld+json"
        id="jobposting-jsonld"
      >
        {JSON.stringify(jobPostingSchema)}
      </script>
      {faqSchema && (
        <script
          type="application/ld+json"
          id="faq-jsonld"
        >
          {JSON.stringify(faqSchema)}
        </script>
      )}

      <div className="bg-slate-50/50 min-h-screen pb-16 lg:pb-8">
        {/* 1. Breadcrumbs */}
        <div className="bg-white border-b border-[var(--border)] py-3">
          <Container size="lg">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: categoryName, href: categoryPath },
                { label: job.organization, active: true },
              ]}
            />
          </Container>
        </div>

        {/* Main Content Area */}
        <ContentWithSidebar
          sidebar={
            <div className="space-y-6">
              {/* Quick Links in Sidebar */}
              <ImportantLinks links={job.importantLinks} variant="compact" />
              <CommunitySidebarCard />
              <SidebarImportantLinks />
            </div>
          }
        >
          <div className="space-y-6">
            {/* 2. Job Hero */}
            <JobHero job={job} />

            {/* 3. Quick Overview Cards */}
            <OverviewCards job={job} />

            {/* 4. Important Dates */}
            <DatesTable dates={job.importantDates} />

            {/* 5. Application Fee */}
            <FeeTable fee={job.feeStructure} />

            {/* 6. Age Limit */}
            <AgeLimitCard ageLimit={job.ageLimit} />

            {/* 7. Vacancy Details */}
            <VacancyTable
              vacancies={job.vacancyBreakdown}
              totalVacancies={job.totalVacancies}
            />

            {/* 8. Educational Qualification */}
            <QualificationSection
              summary={job.qualificationSummary}
              qualificationsList={job.qualificationsList}
            />

            {/* 9. Selection Process Timeline */}
            <SelectionTimeline steps={job.selectionProcess} />

            {/* 10. How To Apply */}
            <HowToApply
              steps={job.howToApplySteps}
              organization={job.organization}
            />

            {/* 11. Important Links */}
            <ImportantLinks links={job.importantLinks} />

            {/* 12. FAQ Accordion */}
            <FAQAccordion faqs={job.faqs} jobTitle={job.organization} />

            {/* 13. Related Jobs */}
            <RelatedJobs
              jobs={relatedJobs}
              categoryTitle={`More ${categoryName}`}
            />
          </div>
        </ContentWithSidebar>

        {/* Official Trust Section */}
        <TrustSection />

        {/* 14. Sticky Mobile Apply Bar */}
        <StickyMobileApplyBar
          lastDate={job.importantDates.applicationEndDate}
          applyUrl={primaryApplyLink}
          isEndingSoon={job.status === "ENDING_SOON"}
        />
      </div>
    </>
  );
}
