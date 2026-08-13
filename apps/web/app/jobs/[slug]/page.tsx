import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getJobBySlug, getLatestJobs } from "@/services";
import { Container, Breadcrumb, Button, Badge, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { ContentWithSidebar } from "@/components/layout";
import { CommunitySidebarCard, SidebarImportantLinks, TrustSection, JobCard } from "@/components/homepage";
import {
  Building2,
  Calendar,
  MapPin,
  GraduationCap,
  IndianRupee,
  ExternalLink,
  Clock,
  ShieldCheck,
  UserCheck,
  ArrowLeft,
} from "lucide-react";

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
      title: "Job Details | NEXTVACANCY",
    };
  }

  return {
    title: `${job.title} — Notification, Eligibility & Apply Online | NEXTVACANCY`,
    description: job.shortSummary,
    openGraph: {
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

  const relatedJobs = (await getLatestJobs(4)).filter((j) => j.id !== job.id).slice(0, 3);

  const categoryLabel =
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

  const categoryHref =
    job.category === "government"
      ? "/government-jobs"
      : job.category === "private"
      ? "/private-jobs"
      : job.category === "admit-card"
      ? "/admit-cards"
      : job.category === "result"
      ? "/results"
      : `/category/${job.category}`;

  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* Breadcrumb Strip */}
      <div className="bg-white border-b border-[var(--border)] py-3">
        <Container size="lg">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: categoryLabel, href: categoryHref },
              { label: job.organization, active: true },
            ]}
          />
        </Container>
      </div>

      {/* Main Content with Sidebar */}
      <ContentWithSidebar
        sidebar={
          <div className="space-y-6">
            {/* Direct Official Apply Card */}
            {job.importantLinks.length > 0 && (
              <Card className="bg-[var(--primary)] text-white border-none shadow-md">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <h3 className="text-sm font-bold">Official Application Links</h3>
                  </div>
                  <p className="text-xs text-slate-300">
                    Apply directly on the official commission portal without intermediaries.
                  </p>
                  <div className="space-y-2">
                    {job.importantLinks.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                      >
                        <Button
                          variant="accent"
                          size="md"
                          fullWidth
                          className="font-bold shadow-xs text-xs"
                          rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
                        >
                          {link.label}
                        </Button>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <CommunitySidebarCard />
            <SidebarImportantLinks />
          </div>
        }
      >
        <div className="space-y-6">
          {/* Back Navigation */}
          <Link
            href={categoryHref}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[var(--primary)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to {categoryLabel}</span>
          </Link>

          {/* Job Overview Card */}
          <Card className="bg-white border-[var(--border)]">
            <CardContent className="p-5 sm:p-7 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Building2 className="h-4 w-4 text-[var(--primary)]" />
                  <span>{job.organization}</span>
                  {job.department && <span>• {job.department}</span>}
                </div>

                <Badge variant={job.status === "ENDING_SOON" ? "warning" : "success"} size="sm">
                  {job.status === "ENDING_SOON" ? "Closing Soon" : "Active Notification"}
                </Badge>
              </div>

              <h1 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug">
                {job.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {job.shortSummary}
              </p>

              {/* Key Quick Facts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[var(--border)] text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <UserCheck className="h-3.5 w-3.5" /> Total Vacancies
                  </span>
                  <p className="font-bold text-slate-900 text-sm">
                    {typeof job.totalVacancies === "number"
                      ? job.totalVacancies.toLocaleString("en-IN")
                      : job.totalVacancies}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <IndianRupee className="h-3.5 w-3.5" /> Pay Scale / Salary
                  </span>
                  <p className="font-bold text-slate-900 text-xs truncate" title={job.salaryOrStipend}>
                    {job.salaryOrStipend}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> Location
                  </span>
                  <p className="font-bold text-slate-900 text-xs truncate">
                    {job.location}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Last Date
                  </span>
                  <p className="font-bold text-[#DC2626] text-xs">
                    {job.importantDates.applicationEndDate || "Check Notice"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Dates & Application Fee Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dates Card */}
            <Card className="bg-white">
              <CardHeader className="p-4 border-b border-[var(--border)] bg-slate-50/50">
                <CardTitle as="h2" className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[var(--primary)]" />
                  <span>Important Dates</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-xs space-y-2.5">
                {job.importantDates.notificationDate && (
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Notification Released:</span>
                    <strong className="text-slate-800">{job.importantDates.notificationDate}</strong>
                  </div>
                )}
                {job.importantDates.applicationStartDate && (
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Application Start:</span>
                    <strong className="text-slate-800">{job.importantDates.applicationStartDate}</strong>
                  </div>
                )}
                {job.importantDates.applicationEndDate && (
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Application Deadline:</span>
                    <strong className="text-red-600 font-bold">{job.importantDates.applicationEndDate}</strong>
                  </div>
                )}
                {job.importantDates.examDate && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Exam Date:</span>
                    <strong className="text-slate-800">{job.importantDates.examDate}</strong>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Fee Structure Card */}
            {job.feeStructure && (
              <Card className="bg-white">
                <CardHeader className="p-4 border-b border-[var(--border)] bg-slate-50/50">
                  <CardTitle as="h2" className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-[#059669]" />
                    <span>Application Fee Structure</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-xs space-y-2.5">
                  {job.feeStructure.general && (
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">General / OBC / EWS:</span>
                      <strong className="text-slate-800">{job.feeStructure.general}</strong>
                    </div>
                  )}
                  {job.feeStructure.scStPwd && (
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">SC / ST / PwD:</span>
                      <strong className="text-emerald-700">{job.feeStructure.scStPwd}</strong>
                    </div>
                  )}
                  {job.feeStructure.female && (
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Female Candidates:</span>
                      <strong className="text-emerald-700">{job.feeStructure.female}</strong>
                    </div>
                  )}
                  {job.feeStructure.paymentMode && (
                    <div className="text-[11px] text-slate-400 pt-1">
                      Payment Mode: {job.feeStructure.paymentMode}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Educational Qualification & Age Limit */}
          <Card className="bg-white">
            <CardHeader className="p-4 border-b border-[var(--border)] bg-slate-50/50">
              <CardTitle as="h2" className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-[#D97706]" />
                <span>Eligibility Criteria & Age Limit</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-xs">Educational Qualification:</h3>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/80 leading-relaxed">
                  {job.qualificationSummary}
                </p>
              </div>

              {job.ageLimit && (
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 text-xs">Age Limit Criteria:</h3>
                  <div className="flex flex-wrap gap-4 text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                    {job.ageLimit.minAge && <div>Minimum Age: <strong>{job.ageLimit.minAge} Years</strong></div>}
                    {job.ageLimit.maxAge && <div>Maximum Age: <strong>{job.ageLimit.maxAge} Years</strong></div>}
                    {job.ageLimit.asOnDate && <div>Calculated As On: <strong>{job.ageLimit.asOnDate}</strong></div>}
                  </div>
                  {job.ageLimit.relaxationNotes && (
                    <p className="text-[11px] text-slate-500 pt-1">
                      * {job.ageLimit.relaxationNotes}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related Opportunities */}
          {relatedJobs.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[var(--border)]">
              <h2 className="text-sm font-bold text-slate-900">
                Other Popular Opportunities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {relatedJobs.map((item) => (
                  <JobCard key={item.id} job={item} compact />
                ))}
              </div>
            </div>
          )}
        </div>
      </ContentWithSidebar>

      <TrustSection />
    </div>
  );
}
