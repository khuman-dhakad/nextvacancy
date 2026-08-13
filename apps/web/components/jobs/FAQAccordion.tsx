"use client";

import React, { useState } from "react";
import { FAQItem } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { HelpCircle, ChevronDown } from "lucide-react";

export interface FAQAccordionProps {
  faqs?: FAQItem[];
  jobTitle?: string;
  className?: string;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  faqs = [],
  jobTitle = "this recruitment",
  className = "",
}) => {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  if (!faqs || faqs.length === 0) return null;

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <Card className={["bg-white border-[var(--border)] overflow-hidden shadow-2xs", className].filter(Boolean).join(" ")}>
      <CardHeader className="p-4 sm:p-5 border-b border-[var(--border)] bg-slate-50/70">
        <CardTitle as="h2" className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-[var(--primary)] shrink-0" aria-hidden="true" />
          <span>Frequently Asked Questions ({jobTitle})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 divide-y divide-slate-100">
        {faqs.map((faq, index) => {
          const isOpen = openIndices.includes(index);
          const buttonId = `faq-button-${index}`;
          const panelId = `faq-panel-${index}`;

          return (
            <div key={index} className="transition-colors">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleIndex(index)}
                className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-slate-800 hover:text-[var(--primary)] hover:bg-slate-50/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-inset cursor-pointer min-h-[44px]"
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
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/30"
                >
                  <p className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

FAQAccordion.displayName = "FAQAccordion";
