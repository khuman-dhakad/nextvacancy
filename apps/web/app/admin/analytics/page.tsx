import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BarChart3, Activity } from "lucide-react";
import { getAdminSession } from "@/lib/auth/admin-auth.server";
import {
  getAnalyticsOverviewKPIs,
  getTrafficInsights,
  getTopPerformingJobs,
  getSeoHealthReport,
  getAiSearchReadinessReport,
  getWhatsAppPerformance,
  getContentHealthAudit,
} from "@/services/admin/admin-analytics.service";
import {
  AnalyticsKpiGrid,
  TrafficInsightsCard,
  TopPerformingJobsTable,
  SeoHealthCard,
  AiSearchReadinessCard,
  WhatsAppPerformanceCard,
  ContentHealthAuditTable,
} from "@/components/desktop/admin/analytics";

export const metadata: Metadata = {
  title: "Analytics & SEO Command Center | NEXTVACANCY Admin",
  description: "Enterprise analytics, conversion telemetry, SEO health scorecard, AI readiness, and content health sentinel.",
  robots: { index: false, follow: false },
};

export default async function AdminAnalyticsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [
    kpis,
    traffic7d,
    traffic30d,
    topJobs,
    seoReport,
    aiReport,
    whatsappMetrics,
    contentIssues,
  ] = await Promise.all([
    getAnalyticsOverviewKPIs(),
    getTrafficInsights("7d"),
    getTrafficInsights("30d"),
    getTopPerformingJobs(),
    getSeoHealthReport(),
    getAiSearchReadinessReport(),
    getWhatsAppPerformance(),
    getContentHealthAudit(),
  ]);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[var(--primary)]" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Analytics &amp; SEO Command Center
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time traffic telemetry, conversion attribution, LLM AI search discovery, and content quality auditing.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 self-start sm:self-auto">
          <Activity className="h-4 w-4 text-emerald-600 animate-pulse" />
          <span>Telemetry Live • GA4 &amp; Server-Side Sync</span>
        </div>
      </div>

      {/* 2. Overview KPIs */}
      <AnalyticsKpiGrid kpis={kpis} />

      {/* 3. Traffic & Audience Insights */}
      <TrafficInsightsCard
        initialData7d={traffic7d.chartData}
        initialData30d={traffic30d.chartData}
        landingPages={traffic7d.landingPages}
      />

      {/* 4. Conversion Leaderboard */}
      <TopPerformingJobsTable jobs={topJobs} />

      {/* 5. SEO Health Scorecard */}
      <SeoHealthCard report={seoReport} />

      {/* 6. AI Search Engine Optimization (GEO) Readiness */}
      <AiSearchReadinessCard report={aiReport} />

      {/* 7. WhatsApp Broadcast Virality */}
      <WhatsAppPerformanceCard metrics={whatsappMetrics} />

      {/* 8. Content Health & Missing Attributes Sentinel */}
      <ContentHealthAuditTable issues={contentIssues} />
    </div>
  );
}
