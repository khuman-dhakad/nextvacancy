export interface AnalyticsOverviewKPIs {
  totalVisitors: number;
  totalVisitorsChange: string;
  pageViews: number;
  pageViewsChange: string;
  activeRecruitments: number;
  publishedJobs: number;
  whatsappClicks: number;
  whatsappClicksChange: string;
  applyClicks: number;
  applyClicksChange: string;
  avgSessionDuration: string;
  bounceRate: string;
}

export interface TrafficDataPoint {
  label: string;
  visitors: number;
  pageViews: number;
}

export interface TopLandingPage {
  path: string;
  title: string;
  views: number;
  percentage: number;
}

export interface RankedJobPerformance {
  id: string;
  slug: string;
  rank: number;
  title: string;
  organization: string;
  views: number;
  applyClicks: number;
  whatsappClicks: number;
  ctr: string;
}

export interface SeoCheckItem {
  id: string;
  title: string;
  category: "Meta" | "Schema" | "Indexing" | "Technical";
  status: "PASS" | "WARN" | "FAIL";
  score: number;
  details: string;
}

export interface SeoHealthReport {
  overallScore: number;
  passedChecks: number;
  totalChecks: number;
  checks: SeoCheckItem[];
}

export interface AiSearchReadinessMetric {
  id: string;
  label: string;
  status: "OPTIMIZED" | "GOOD" | "NEEDS_IMPROVEMENT";
  score: number;
  description: string;
}

export interface AiSearchReadinessReport {
  overallScore: number;
  summary: string;
  metrics: AiSearchReadinessMetric[];
}

export interface WhatsAppMetrics {
  totalSharedLinks: number;
  clickThroughRate: string;
  mostSharedJobTitle: string;
  mostSharedJobOrg: string;
  mostSharedJobCount: number;
  bestPerformingCategory: string;
  viralGrowthRate: string;
}

export interface ContentHealthIssue {
  jobId: string;
  jobTitle: string;
  organization: string;
  slug: string;
  missingSalary: boolean;
  missingLastDate: boolean;
  missingPdfUrl: boolean;
  missingFaqs: boolean;
  missingSeoDescription: boolean;
  healthScore: number;
}
