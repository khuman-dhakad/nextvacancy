"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  UserCheck,
  HelpCircle,
  Globe,
  Plus,
  Trash2,
  MapPin,
  CreditCard,
} from "lucide-react";
import { Card, Input, Button } from "@/components/ui";
import { JobPosting, JobCategory, JobStatus, FAQItem } from "@/types";
import { createJobAction, updateJobAction } from "@/app/admin/actions";


export interface AdminJobFormProps {
  initialData?: Partial<JobPosting>;
  isEditing?: boolean;
  className?: string;
}

const CATEGORIES: { value: JobCategory; label: string }[] = [
  { value: "government", label: "Government Jobs" },
  { value: "private", label: "Private & IT Jobs" },
  { value: "admit-card", label: "Admit Cards & Hall Tickets" },
  { value: "result", label: "Results & Merit Lists" },
  { value: "answer-key", label: "Official Answer Keys" },
  { value: "scholarship", label: "National Scholarships" },
  { value: "internship", label: "Internships & Apprenticeships" },
];

const STATUSES: { value: JobStatus; label: string }[] = [
  { value: "OPEN", label: "Active & Published (OPEN)" },
  { value: "ENDING_SOON", label: "Ending Soon (Last Few Days)" },
  { value: "CLOSED", label: "Draft / Closed (CLOSED)" },
  { value: "ADMIT_CARD_OUT", label: "Admit Card Released" },
  { value: "RESULT_OUT", label: "Result Declared" },
];

export const AdminJobForm: React.FC<AdminJobFormProps> = ({
  initialData,
  isEditing = false,
  className = "",
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [organization, setOrganization] = useState(initialData?.organization || "");
  const [department, setDepartment] = useState(initialData?.department || "");
  const [category, setCategory] = useState<JobCategory>(initialData?.category || "government");
  const [status, setStatus] = useState<JobStatus>(initialData?.status || "OPEN");
  const [location, setLocation] = useState(initialData?.location || "All India");
  const [totalVacancies, setTotalVacancies] = useState<string>(
    initialData?.totalVacancies !== undefined ? String(initialData.totalVacancies) : "100"
  );
  const [salaryOrStipend, setSalaryOrStipend] = useState(initialData?.salaryOrStipend || "Pay Level 6 (₹35,400 - ₹1,12,400)");
  const [shortSummary, setShortSummary] = useState(initialData?.shortSummary || "");

  // Eligibility & Age
  const [qualificationSummary, setQualificationSummary] = useState(initialData?.qualificationSummary || "Bachelor's Degree in any discipline from recognized University");
  const [qualificationsListText, setQualificationsListText] = useState(
    initialData?.qualificationsList?.join("\n") || "Bachelor's Degree in any discipline\n12th Pass with Mathematics\nDiploma in Engineering"
  );
  const [minAge, setMinAge] = useState<number>(initialData?.ageLimit?.minAge || 18);
  const [maxAge, setMaxAge] = useState<number>(initialData?.ageLimit?.maxAge || 32);
  const [relaxationNotes, setRelaxationNotes] = useState(initialData?.ageLimit?.relaxationNotes || "OBC: 3 Years, SC/ST: 5 Years, PwBD: 10 Years as per Central Govt rules.");

  // Dates
  const [startDate, setStartDate] = useState(initialData?.importantDates?.applicationStartDate || "2026-06-01");
  const [endDate, setEndDate] = useState(initialData?.importantDates?.applicationEndDate || "2026-07-30");
  const [examDate, setExamDate] = useState(initialData?.importantDates?.examDate || "Sep - Oct 2026");
  const [admitCardDate, setAdmitCardDate] = useState(initialData?.importantDates?.admitCardDate || "10 Days before exam");

  // Fee
  const [feeGeneral, setFeeGeneral] = useState(initialData?.feeStructure?.general || "₹100");
  const [feeScSt, setFeeScSt] = useState(initialData?.feeStructure?.sc || "₹0 (Exempted)");
  const [feePaymentMode, setFeePaymentMode] = useState(initialData?.feeStructure?.paymentMode || "Online via Net Banking, UPI, Debit/Credit Cards");

  // Links
  const [applyUrl, setApplyUrl] = useState(
    initialData?.importantLinks?.find((l) => l.linkType === "apply_online")?.url || "https://ssc.gov.in"
  );
  const [pdfUrl, setPdfUrl] = useState(
    initialData?.importantLinks?.find((l) => l.linkType === "official_notification_pdf")?.url || "https://ssc.gov.in/notice"
  );
  const [websiteUrl, setWebsiteUrl] = useState(
    initialData?.importantLinks?.find((l) => l.linkType === "official_website")?.url || "https://ssc.gov.in"
  );

  // FAQs
  const [faqs, setFaqs] = useState<FAQItem[]>(
    initialData?.faqs || [
      { question: "What is the educational qualification required?", answer: "Candidates must hold a recognized Bachelor's Degree or equivalent." },
      { question: "What is the age limit for this recruitment?", answer: "Age limit is 18 to 32 years with category-wise relaxations as per gazette norms." },
    ]
  );

  const handleAddFaq = () => {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  };

  const handleFaqChange = (index: number, field: "question" | "answer", val: string) => {
    setFaqs((prev) => {
      const copy = [...prev];
      copy[index][field] = val;
      return copy;
    });
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim()) {
      setFeedback({ type: "error", text: "Please provide a valid Job Title and Organization." });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const payload: Partial<JobPosting> = {
      title,
      slug: slug.trim() || undefined,
      organization,
      department,
      category,
      status,
      location,
      totalVacancies: isNaN(Number(totalVacancies)) ? totalVacancies : Number(totalVacancies),
      salaryOrStipend,
      shortSummary: shortSummary || `${organization} has published recruitment for ${title}.`,
      qualificationSummary,
      qualificationsList: qualificationsListText.split("\n").map((s) => s.trim()).filter(Boolean),
      ageLimit: { minAge, maxAge, relaxationNotes },
      importantDates: {
        applicationStartDate: startDate,
        applicationEndDate: endDate,
        examDate,
        admitCardDate,
      },
      feeStructure: {
        general: feeGeneral,
        sc: feeScSt,
        female: "₹0 (Exempted)",
        paymentMode: feePaymentMode,
      },
      importantLinks: [
        { label: "Apply Online", url: applyUrl, linkType: "apply_online" },
        { label: "Official Notification PDF", url: pdfUrl, linkType: "official_notification_pdf" },
        { label: "Official Website", url: websiteUrl, linkType: "official_website" },
      ],
      faqs: faqs.filter((f) => f.question.trim()),
    };

    let result;
    if (isEditing && initialData?.id) {
      result = await updateJobAction(initialData.id, payload);
    } else {
      result = await createJobAction(payload);
    }

    setIsSubmitting(false);

    if (result.success) {
      setFeedback({ type: "success", text: result.message || "Job circular saved successfully." });
      setTimeout(() => {
        router.push("/admin/jobs");
      }, 1200);
    } else {
      setFeedback({ type: "error", text: result.error || "Failed to save job circular." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={["space-y-8 pb-12", className].filter(Boolean).join(" ")}>
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={[
            "p-4 rounded-xl text-xs font-bold flex items-center justify-between animate-in fade-in border",
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-rose-50 text-rose-900 border-rose-200",
          ].join(" ")}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600" />
            )}
            <span>{feedback.text}</span>
          </div>
        </div>
      )}

      {/* Top Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link href="/admin/jobs">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="font-bold text-xs"
            leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
          >
            Back to All Jobs
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          {isEditing && initialData?.slug && (
            <Link href={`/jobs/${initialData.slug}`} target="_blank">
              <Button type="button" variant="outline" size="sm" className="font-bold text-xs">
                View Live Page
              </Button>
            </Link>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            className="bg-[#0F2744] hover:bg-[#183B66] text-white font-bold text-xs shadow-xs"
            leftIcon={<Save className="h-3.5 w-3.5" />}
          >
            {isSubmitting ? "Saving..." : isEditing ? "Update Job Circular" : "Publish Job Circular"}
          </Button>
        </div>
      </div>

      {/* Section 1: Basic Information */}
      <Card className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <Building2 className="h-4 w-4 text-[var(--primary)]" />
          <h2 className="text-base font-bold text-slate-900">1. Basic Recruitment Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="title" className="text-xs font-bold text-slate-700 block">
              Job Title / Advertisement Headline *
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. SSC CGL 2026 Recruitment for 14,582 Group B & C Vacancies"
              fullWidth
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="organization" className="text-xs font-bold text-slate-700 block">
              Recruiting Authority / Commission *
            </label>
            <Input
              id="organization"
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="e.g. Staff Selection Commission (SSC)"
              fullWidth
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="department" className="text-xs font-bold text-slate-700 block">
              Ministry / Department
            </label>
            <Input
              id="department"
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Ministry of Personnel, Public Grievances"
              fullWidth
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="category" className="text-xs font-bold text-slate-700 block">
              Recruitment Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as JobCategory)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-[var(--primary)]"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="status" className="text-xs font-bold text-slate-700 block">
              Publication Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as JobStatus)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-[var(--primary)]"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="totalVacancies" className="text-xs font-bold text-slate-700 block">
              Total Number of Vacancies
            </label>
            <Input
              id="totalVacancies"
              type="text"
              value={totalVacancies}
              onChange={(e) => setTotalVacancies(e.target.value)}
              placeholder="e.g. 14582 or Various Posts"
              fullWidth
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="salaryOrStipend" className="text-xs font-bold text-slate-700 block">
              Pay Matrix / Monthly Salary
            </label>
            <Input
              id="salaryOrStipend"
              type="text"
              value={salaryOrStipend}
              onChange={(e) => setSalaryOrStipend(e.target.value)}
              placeholder="e.g. Pay Level 7 (₹44,900 - ₹1,42,400)"
              fullWidth
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="location" className="text-xs font-bold text-slate-700 block">
              Job Location / Posting State
            </label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. All India, New Delhi, Bihar"
              leftIcon={<MapPin className="h-4 w-4 text-slate-400" />}
              fullWidth
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="shortSummary" className="text-xs font-bold text-slate-700 block">
              Editorial Summary &amp; Overview
            </label>
            <textarea
              id="shortSummary"
              rows={3}
              value={shortSummary}
              onChange={(e) => setShortSummary(e.target.value)}
              placeholder="Comprehensive summary of notification, eligibility, and key dates..."
              className="w-full p-3 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
        </div>
      </Card>

      {/* Section 2: Eligibility & Age */}
      <Card className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <UserCheck className="h-4 w-4 text-[var(--primary)]" />
          <h2 className="text-base font-bold text-slate-900">2. Eligibility &amp; Age Criteria</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="qualificationSummary" className="text-xs font-bold text-slate-700 block">
              Qualification Headline
            </label>
            <Input
              id="qualificationSummary"
              type="text"
              value={qualificationSummary}
              onChange={(e) => setQualificationSummary(e.target.value)}
              placeholder="e.g. Bachelor's Degree in any discipline"
              fullWidth
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="qualificationsListText" className="text-xs font-bold text-slate-700 block">
              Qualifications Breakdown (One per line)
            </label>
            <textarea
              id="qualificationsListText"
              rows={3}
              value={qualificationsListText}
              onChange={(e) => setQualificationsListText(e.target.value)}
              className="w-full p-3 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="minAge" className="text-xs font-bold text-slate-700 block">
              Minimum Age (Years)
            </label>
            <Input
              id="minAge"
              type="number"
              value={minAge}
              onChange={(e) => setMinAge(Number(e.target.value))}
              fullWidth
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="maxAge" className="text-xs font-bold text-slate-700 block">
              Maximum Age (Years)
            </label>
            <Input
              id="maxAge"
              type="number"
              value={maxAge}
              onChange={(e) => setMaxAge(Number(e.target.value))}
              fullWidth
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="relaxationNotes" className="text-xs font-bold text-slate-700 block">
              Age Relaxation Rules
            </label>
            <Input
              id="relaxationNotes"
              type="text"
              value={relaxationNotes}
              onChange={(e) => setRelaxationNotes(e.target.value)}
              placeholder="e.g. OBC: 3 Years, SC/ST: 5 Years, PwBD: 10 Years"
              fullWidth
            />
          </div>
        </div>
      </Card>

      {/* Section 3: Important Dates & Fee */}
      <Card className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <Calendar className="h-4 w-4 text-[var(--primary)]" />
          <h2 className="text-base font-bold text-slate-900">3. Dates &amp; Fee Structure</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label htmlFor="startDate" className="text-xs font-bold text-slate-700 block">
              Application Start Date
            </label>
            <Input
              id="startDate"
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="YYYY-MM-DD"
              fullWidth
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="endDate" className="text-xs font-bold text-slate-700 block">
              Application End Date (Deadline)
            </label>
            <Input
              id="endDate"
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="YYYY-MM-DD"
              fullWidth
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="examDate" className="text-xs font-bold text-slate-700 block">
              Examination Date / Schedule
            </label>
            <Input
              id="examDate"
              type="text"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              placeholder="e.g. September 2026"
              fullWidth
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admitCardDate" className="text-xs font-bold text-slate-700 block">
              Admit Card Release Date
            </label>
            <Input
              id="admitCardDate"
              type="text"
              value={admitCardDate}
              onChange={(e) => setAdmitCardDate(e.target.value)}
              placeholder="e.g. 10 Days before exam"
              fullWidth
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="feeGeneral" className="text-xs font-bold text-slate-700 block">
              General / OBC / EWS Fee
            </label>
            <Input
              id="feeGeneral"
              type="text"
              value={feeGeneral}
              onChange={(e) => setFeeGeneral(e.target.value)}
              placeholder="e.g. ₹100"
              fullWidth
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="feeScSt" className="text-xs font-bold text-slate-700 block">
              SC / ST / PwD / Female Fee
            </label>
            <Input
              id="feeScSt"
              type="text"
              value={feeScSt}
              onChange={(e) => setFeeScSt(e.target.value)}
              placeholder="e.g. ₹0 (Exempted)"
              fullWidth
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="feePaymentMode" className="text-xs font-bold text-slate-700 block">
              Application Fee Payment Method
            </label>
            <Input
              id="feePaymentMode"
              type="text"
              value={feePaymentMode}
              onChange={(e) => setFeePaymentMode(e.target.value)}
              placeholder="e.g. Online via Net Banking, UPI, Debit/Credit Cards"
              leftIcon={<CreditCard className="h-4 w-4 text-slate-400" />}
              fullWidth
            />
          </div>
        </div>
      </Card>

      {/* Section 4: Official Portals & SEO */}
      <Card className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <Globe className="h-4 w-4 text-[var(--primary)]" />
          <h2 className="text-base font-bold text-slate-900">4. Official Links &amp; SEO Slug</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="slug" className="text-xs font-bold text-slate-700 block">
              Custom URL Slug (Leave blank for auto-generation)
            </label>
            <Input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. ssc-cgl-2026-recruitment"
              fullWidth
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="applyUrl" className="text-xs font-bold text-slate-700 block">
              Direct Apply Online URL
            </label>
            <Input
              id="applyUrl"
              type="url"
              value={applyUrl}
              onChange={(e) => setApplyUrl(e.target.value)}
              placeholder="https://ssc.gov.in"
              fullWidth
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="pdfUrl" className="text-xs font-bold text-slate-700 block">
              Official Notification PDF URL
            </label>
            <Input
              id="pdfUrl"
              type="url"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              placeholder="https://ssc.gov.in/notice.pdf"
              fullWidth
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="websiteUrl" className="text-xs font-bold text-slate-700 block">
              Commission Website URL
            </label>
            <Input
              id="websiteUrl"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://ssc.gov.in"
              fullWidth
            />
          </div>
        </div>
      </Card>

      {/* Section 5: FAQs */}
      <Card className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-[var(--primary)]" />
            <h2 className="text-base font-bold text-slate-900">5. Frequently Asked Questions</h2>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddFaq}
            className="font-bold text-xs"
            leftIcon={<Plus className="h-3 w-3" />}
          >
            Add FAQ
          </Button>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">FAQ Item #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFaq(idx)}
                  className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </button>
              </div>

              <Input
                type="text"
                placeholder="Question (e.g. Who can apply?)"
                value={faq.question}
                onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                fullWidth
              />

              <textarea
                rows={2}
                placeholder="Answer detailing criteria and gazette rules..."
                value={faq.answer}
                onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                className="w-full p-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Sticky Bottom Save Actions */}
      <div className="sticky bottom-4 z-40 p-4 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-elevated flex items-center justify-between gap-4">
        <Link href="/admin/jobs">
          <Button type="button" variant="outline" size="sm" className="font-bold text-xs">
            Discard &amp; Return
          </Button>
        </Link>

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isSubmitting}
          className="bg-[#0F2744] hover:bg-[#183B66] text-white font-bold text-xs shadow-xs"
          leftIcon={<Save className="h-3.5 w-3.5" />}
        >
          {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create & Publish Job"}
        </Button>
      </div>
    </form>
  );
};

AdminJobForm.displayName = "AdminJobForm";
