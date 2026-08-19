import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import {
  getOrganizationProfileBySlug,
  getOrganizationJobs,
  getRelatedOrganizations,
  getAllOrganizationSlugs,
} from "@/services/organization/organization-profile.service";
import {
  OrganizationBreadcrumbs,
  OrganizationHero,
  OrganizationStatsGrid,
  OrganizationAbout,
  OrganizationVacanciesList,
  OrganizationFaq,
  OrganizationRelated,
} from "@/components/desktop/organization";

interface OrganizationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllOrganizationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: OrganizationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getOrganizationProfileBySlug(slug);

  if (!profile) {
    return {
      title: "Organization Not Found | NEXTVACANCY",
      description: "The requested recruitment organization could not be found.",
    };
  }

  const title = `${profile.name} (${profile.shortName}) Recruitment 2026, Vacancies & Results`;
  const description = `Explore official ${profile.name} (${profile.shortName}) career updates, latest vacancy notifications, admit cards, selection process, and syllabus on NEXTVACANCY.`;
  const pageUrl = `https://nextvacancy.com/organizations/${profile.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "NEXTVACANCY",
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function OrganizationProfilePage({ params }: OrganizationPageProps) {
  const { slug } = await params;
  const profile = await getOrganizationProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  const [jobs, relatedOrgs] = await Promise.all([
    getOrganizationJobs(profile.slug),
    getRelatedOrganizations(profile.slug, profile.categoryType, 3),
  ]);

  // Structured Data Schemas
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: profile.name,
    alternateName: profile.shortName,
    url: profile.website,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.headquarters,
      addressCountry: "IN",
    },
    description: profile.description,
  };

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
        name: "Organizations",
        item: "https://nextvacancy.com/organizations",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: profile.name,
        item: `https://nextvacancy.com/organizations/${profile.slug}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: profile.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const jobItemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Latest Recruitment Postings by ${profile.name}`,
    itemListElement: jobs.map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: job.title,
      url: `https://nextvacancy.com/jobs/${job.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12">
      {/* JSON-LD Structured Data for AI Search & Google Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {profile.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {jobs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobItemListSchema) }}
        />
      )}

      <Container className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Semantic Breadcrumbs */}
        <OrganizationBreadcrumbs organizationName={profile.shortName} />

        {/* Hero Branding Header */}
        <OrganizationHero profile={profile} />

        {/* Stats Grid */}
        <OrganizationStatsGrid stats={profile.stats} />

        {/* About Organization & Selection Process */}
        <OrganizationAbout profile={profile} />

        {/* Active Vacancies & Circulars */}
        <OrganizationVacanciesList
          organizationName={profile.name}
          organizationShortName={profile.shortName}
          jobs={jobs}
        />

        {/* Frequently Asked Questions */}
        <OrganizationFaq
          organizationName={profile.name}
          organizationShortName={profile.shortName}
          faqs={profile.faqs}
        />

        {/* Related Recruiting Authorities */}
        <OrganizationRelated relatedOrganizations={relatedOrgs} />
      </Container>
    </div>
  );
}
