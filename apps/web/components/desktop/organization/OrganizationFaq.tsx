"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui";
import { OrganizationFaqItem } from "@/types";

export interface OrganizationFaqProps {
  organizationName: string;
  organizationShortName: string;
  faqs: OrganizationFaqItem[];
  className?: string;
}

export const OrganizationFaq: React.FC<OrganizationFaqProps> = ({
  organizationName,
  organizationShortName,
  faqs = [],
  className = "",
}) => {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  if (!faqs || faqs.length === 0) return null;

  const toggleFaq = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section aria-label={`${organizationShortName} Frequently Asked Questions`} className={className}>
      <Card className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-xs space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <HelpCircle className="h-5 w-5 text-amber-500" />
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions about {organizationShortName}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Verified answers for eligibility, selection process, admit cards, and application guidelines for {organizationName}.
            </p>
          </div>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndices.includes(index);

            return (
              <div
                key={index}
                className="border border-slate-200/90 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 bg-slate-50/70 hover:bg-slate-100/80 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={[
                      "h-4 w-4 text-slate-500 shrink-0 transition-transform duration-200",
                      isOpen ? "rotate-180 text-[var(--primary)]" : "",
                    ].join(" ")}
                  />
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 bg-white border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
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

OrganizationFaq.displayName = "OrganizationFaq";
