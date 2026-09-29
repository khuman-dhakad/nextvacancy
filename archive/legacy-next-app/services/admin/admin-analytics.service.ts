import {
  AnalyticsOverviewKPIs,
  TrafficDataPoint,
  TopLandingPage,
  RankedJobPerformance,
  SeoHealthReport,
  AiSearchReadinessReport,
  WhatsAppMetrics,
  ContentHealthIssue,
} from "@/types";

/**
 * NEXTVACANCY Analytics & SEO Command Center Service Layer
 * Enterprise telemetry, conversion metrics, SEO health scorecards, and AI search readiness.
 * Designed for immediate plug-and-play with future backend APIs (Spring Boot / ClickHouse / Google Analytics 4).
 */

export async function getAnalyticsOverviewKPIs(): Promise<AnalyticsOverviewKPIs> {
  return {
    totalVisitors: 148920,
    totalVisitorsChange: "+18.4%",
    pageViews: 512400,
    pageViewsChange: "+24.6%",
    activeRecruitments: 30,
    publishedJobs: 26,
    whatsappClicks: 42680,
    whatsappClicksChange: "+32.8%",
    applyClicks: 61450,
    applyClicksChange: "+21.2%",
    avgSessionDuration: "3m 48s",
    bounceRate: "26.8%",
  };
}

export async function getTrafficInsights(timeframe: "7d" | "30d" | "90d" = "7d"): Promise<{
  chartData: TrafficDataPoint[];
  landingPages: TopLandingPage[];
}> {
  const chartData: TrafficDataPoint[] =
    timeframe === "7d"
      ? [
          { label: "Mon", visitors: 18200, pageViews: 64200 },
          { label: "Tue", visitors: 22400, pageViews: 78100 },
          { label: "Wed", visitors: 24600, pageViews: 86400 },
          { label: "Thu", visitors: 21900, pageViews: 74500 },
          { label: "Fri", visitors: 26800, pageViews: 92300 },
          { label: "Sat", visitors: 19400, pageViews: 66800 },
          { label: "Sun", visitors: 15620, pageViews: 50100 },
        ]
      : [
          { label: "Week 1", visitors: 112000, pageViews: 385000 },
          { label: "Week 2", visitors: 128400, pageViews: 442000 },
          { label: "Week 3", visitors: 145000, pageViews: 498000 },
          { label: "Week 4", visitors: 162000, pageViews: 554000 },
        ];

  const landingPages: TopLandingPage[] = [
    {
      path: "/government-jobs",
      title: "Government Jobs 2026 (Sarkari Naukri Hub)",
      views: 184500,
      percentage: 36,
    },
    {
      path: "/jobs/ssc-cgl-2026-recruitment",
      title: "SSC CGL 2026 Notification for 14,582 Posts",
      views: 112400,
      percentage: 22,
    },
    {
      path: "/admit-cards",
      title: "Admit Cards & Hall Ticket Download Portal",
      views: 74200,
      percentage: 14,
    },
    {
      path: "/jobs/rrb-ntpc-2026-cen-01-2026",
      title: "RRB NTPC 2026 Graduate & Undergraduate Posts",
      views: 68100,
      percentage: 13,
    },
    {
      path: "/results",
      title: "Exam Results & Merit Scorecards",
      views: 45600,
      percentage: 9,
    },
    {
      path: "/category/railway",
      title: "Railway Recruitment Boards Hub",
      views: 31200,
      percentage: 6,
    },
  ];

  return { chartData, landingPages };
}

export async function getTopPerformingJobs(): Promise<RankedJobPerformance[]> {
  return [
    {
      id: "job-1",
      slug: "ssc-cgl-2026-recruitment",
      rank: 1,
      title: "SSC CGL 2026 Recruitment for 14,582 Group B & C Vacancies",
      organization: "Staff Selection Commission (SSC)",
      views: 112400,
      applyClicks: 28450,
      whatsappClicks: 14200,
      ctr: "25.3%",
    },
    {
      id: "job-2",
      slug: "rrb-ntpc-2026-cen-01-2026",
      rank: 2,
      title: "RRB NTPC 2026 Centralized Notification for 11,558 Posts",
      organization: "Railway Recruitment Boards (RRB)",
      views: 68100,
      applyClicks: 16900,
      whatsappClicks: 9450,
      ctr: "24.8%",
    },
    {
      id: "job-3",
      slug: "ibps-po-mt-xv-2026",
      rank: 3,
      title: "IBPS PO / MT XV 2026 Recruitment for 4,455 Bank POs",
      organization: "Institute of Banking Personnel Selection",
      views: 42300,
      applyClicks: 9800,
      whatsappClicks: 5200,
      ctr: "23.1%",
    },
    {
      id: "job-4",
      slug: "upsc-civil-services-prelims-2026",
      rank: 4,
      title: "UPSC Civil Services (IAS / IPS) Examination 2026",
      organization: "Union Public Service Commission (UPSC)",
      views: 38900,
      applyClicks: 8200,
      whatsappClicks: 4600,
      ctr: "21.0%",
    },
    {
      id: "job-5",
      slug: "sbi-clerk-junior-associate-2026",
      rank: 5,
      title: "SBI Clerk (Junior Associate) 2026 for 8,773 Vacancies",
      organization: "State Bank of India (SBI)",
      views: 31400,
      applyClicks: 6900,
      whatsappClicks: 3800,
      ctr: "21.9%",
    },
    {
      id: "job-6",
      slug: "mppsc-state-service-exam-2026",
      rank: 6,
      title: "MPPSC State Service Examination (SSE) 2026",
      organization: "Madhya Pradesh PSC",
      views: 24500,
      applyClicks: 5100,
      whatsappClicks: 2900,
      ctr: "20.8%",
    },
  ];
}

export async function getSeoHealthReport(): Promise<SeoHealthReport> {
  return {
    overallScore: 98,
    passedChecks: 8,
    totalChecks: 8,
    checks: [
      {
        id: "meta-title",
        title: "Dynamic Meta Titles & Templates",
        category: "Meta",
        status: "PASS",
        score: 100,
        details: "Single <h1> with standardized title templates (%s | NEXTVACANCY).",
      },
      {
        id: "meta-desc",
        title: "Meta Descriptions & Editorial Snippets",
        category: "Meta",
        status: "PASS",
        score: 100,
        details: "155-160 character rich recruitment meta descriptions present on 100% of pages.",
      },
      {
        id: "canonical",
        title: "Self-Referencing Canonical URLs",
        category: "Indexing",
        status: "PASS",
        score: 100,
        details: "All routes emit absolute canonical URLs preventing duplicate content penalties.",
      },
      {
        id: "opengraph",
        title: "OpenGraph & Twitter Card Meta Tags",
        category: "Meta",
        status: "PASS",
        score: 100,
        details: "Full OpenGraph (og:title, og:image, og:locale en_IN) and Twitter Summary Card.",
      },
      {
        id: "schema-jsonld",
        title: "JSON-LD JobPosting & Breadcrumb Schema",
        category: "Schema",
        status: "PASS",
        score: 98,
        details: "Valid schema.org/JobPosting with hiringOrganization, datePosted, and validThrough.",
      },
      {
        id: "sitemap",
        title: "Auto-Generating XML Sitemap (/sitemap.xml)",
        category: "Indexing",
        status: "PASS",
        score: 100,
        details: "Dynamic sitemap indexing all jobs, categories, and editorial pages automatically.",
      },
      {
        id: "robots",
        title: "Robots.txt & Bot Crawler Directives",
        category: "Technical",
        status: "PASS",
        score: 100,
        details: "Allowing Googlebot, Bingbot, and Perplexity while disallowing private admin routes.",
      },
      {
        id: "broken-links",
        title: "Internal Link Integrity & 404 Sentinel",
        category: "Technical",
        status: "PASS",
        score: 100,
        details: "0 broken links detected across 30 application routes.",
      },
    ],
  };
}

export async function getAiSearchReadinessReport(): Promise<AiSearchReadinessReport> {
  return {
    overallScore: 96,
    summary:
      "NEXTVACANCY recruitment entities are fully structured for high-confidence ingestion by LLM search agents (Perplexity, SearchGPT, Google Gemini, and ChatGPT).",
    metrics: [
      {
        id: "ai-schema",
        label: "schema.org/JobPosting Schema",
        status: "OPTIMIZED",
        score: 98,
        description: "Full salary, hiringOrganization, qualifications, and date ranges parsed semantically.",
      },
      {
        id: "ai-faq",
        label: "Structured FAQPage & Q&A Schema",
        status: "OPTIMIZED",
        score: 95,
        description: "Direct question/answer pairs available on all recruitment circulars for LLM instant answers.",
      },
      {
        id: "ai-breadcrumbs",
        label: "BreadcrumbList Hierarchy",
        status: "OPTIMIZED",
        score: 100,
        description: "Clear categorization path (Home > Category > Recruitment) for knowledge graph traversal.",
      },
      {
        id: "ai-org",
        label: "Hiring Organization Knowledge Graph",
        status: "OPTIMIZED",
        score: 96,
        description: "Normalized authority links (UPSC, SSC, RRB) linked with official gazette source URLs.",
      },
      {
        id: "ai-headings",
        label: "Semantic Heading Hierarchy (H1 > H2 > H3)",
        status: "OPTIMIZED",
        score: 94,
        description: "Strict single H1, followed by section H2s with zero skipped heading levels.",
      },
      {
        id: "ai-linking",
        label: "Internal Semantic Entity Linking",
        status: "GOOD",
        score: 92,
        description: "Cross-references related vacancies and admit card alerts by commission and state.",
      },
    ],
  };
}

export async function getWhatsAppPerformance(): Promise<WhatsAppMetrics> {
  return {
    totalSharedLinks: 42680,
    clickThroughRate: "42.8%",
    mostSharedJobTitle: "SSC CGL 2026 Recruitment (14,582 Group B & C Vacancies)",
    mostSharedJobOrg: "Staff Selection Commission",
    mostSharedJobCount: 14200,
    bestPerformingCategory: "Government Jobs (Central SSC & Railways)",
    viralGrowthRate: "+34.2% MoM",
  };
}

export async function getContentHealthAudit(): Promise<ContentHealthIssue[]> {
  return [
    {
      jobId: "job-8",
      jobTitle: "NTA UGC NET June 2026 Assistant Professor & JRF",
      organization: "National Testing Agency (NTA)",
      slug: "nta-ugc-net-june-2026",
      missingSalary: true,
      missingLastDate: false,
      missingPdfUrl: false,
      missingFaqs: false,
      missingSeoDescription: false,
      healthScore: 85,
    },
    {
      jobId: "job-10",
      jobTitle: "State Bank of India Specialist Cadre Officers (SCO) 2026",
      organization: "State Bank of India",
      slug: "sbi-sco-2026",
      missingSalary: false,
      missingLastDate: false,
      missingPdfUrl: false,
      missingFaqs: true,
      missingSeoDescription: false,
      healthScore: 88,
    },
    {
      jobId: "job-12",
      jobTitle: "Indian Navy SSC Executive & Technical Branch Officers",
      organization: "Indian Navy",
      slug: "indian-navy-ssc-officers-2026",
      missingSalary: false,
      missingLastDate: false,
      missingPdfUrl: false,
      missingFaqs: false,
      missingSeoDescription: true,
      healthScore: 90,
    },
  ];
}
