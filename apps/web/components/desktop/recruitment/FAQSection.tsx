"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui";
import { FAQItem, JobPosting } from "@/types";


export interface FAQSectionProps {
  job?: JobPosting;
  faqs?: FAQItem[];
  className?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  job,
  faqs,
  className = "",
}) => {
  const defaultFaqs: FAQItem[] = [
    {
      question: `Who can apply for ${job?.title || "this recruitment"}?`,
      answer: `Candidates meeting the minimum educational qualification (${job?.qualificationSummary || "Bachelor's Degree / 12th Pass from recognized board"}) and age criteria (${job?.ageLimit?.minAge || 18} to ${job?.ageLimit?.maxAge || 32} years as on cutoff date) are eligible to apply.`,
    },
    {
      question: `What is the last date to apply online for ${job?.organization || "this post"}?`,
      answer: `The closing date for submission of online applications is ${job?.importantDates?.applicationEndDate || "notified in circular"}. Online fee payment must be completed before the specified deadline.`,
    },
    {
      question: `What is the selection process for ${job?.title || "these vacancies"}?`,
      answer: `The recruitment selection process comprises: 1. Computer Based Test (CBT / Written Examination), 2. Skill / Typing / Physical Test (where applicable), 3. Document Verification (DV), and 4. Final Merit List based on aggregate marks.`,
    },
    {
      question: `What is the pay scale and monthly salary?`,
      answer: `The selected candidates will receive remuneration under ${job?.salaryOrStipend || "7th Central Pay Commission Pay Matrix"} along with Dearness Allowance (DA), House Rent Allowance (HRA), Transport Allowance, and central medical facilities.`,
    },
    {
      question: `What is the official website to submit the application?`,
      answer: `Candidates must apply exclusively through the official recruiting authority website (${job?.importantLinks?.find((l) => l.linkType === "official_website")?.url || "https://ssc.gov.in"}). No offline applications are entertained.`,
    },
  ];

  const activeFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs;
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIdx((prev) => (prev === index ? null : index));
  };

  return (
    <section aria-label="Frequently Asked Questions" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <HelpCircle className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Candidate Helpdesk
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions (FAQs)
            </h2>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            <span>Schema.org FAQPage Ready</span>
          </div>
        </div>

        {/* Accordion Item List */}
        <div className="space-y-3">
          {activeFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className={[
                  "rounded-xl border transition-all duration-150 overflow-hidden",
                  isOpen
                    ? "bg-slate-50/90 border-slate-300 shadow-2xs"
                    : "bg-white border-slate-200/80 hover:border-slate-300",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  aria-expanded={isOpen}
                  className="w-full py-4 px-5 flex items-center justify-between gap-4 text-left font-bold text-slate-900 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] cursor-pointer"
                >
                  <span className="leading-snug">{faq.question}</span>
                  <ChevronDown
                    className={[
                      "h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200",
                      isOpen ? "rotate-180 text-[var(--primary)]" : "",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 font-medium">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
};

FAQSection.displayName = "FAQSection";
