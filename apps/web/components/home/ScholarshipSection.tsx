import React from "react";
import Link from "next/link";
import { JobPosting } from "@/types";
import { Card, Badge, Button } from "@/components/ui";
import { SectionHeader } from "./SectionHeader";
import { GraduationCap, ArrowRight, IndianRupee, MapPin } from "lucide-react";

export interface ScholarshipSectionProps {
  opportunities: JobPosting[];
  className?: string;
}

export const ScholarshipSection: React.FC<ScholarshipSectionProps> = ({
  opportunities = [],
  className = "",
}) => {
  if (!opportunities || opportunities.length === 0) return null;

  return (
    <section className={["space-y-4", className].filter(Boolean).join(" ")}>
      <SectionHeader
        title="Scholarships & Paid Internships"
        description="Government financial assistance schemes, PM Internship programs, and student fellowships"
        badge="Financial Grants"
        icon={GraduationCap}
        viewAllHref="/category/scholarship"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opportunities.map((item) => (
          <Card
            key={item.id}
            className="bg-white border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700">
                  {item.organization}
                </span>
                <Badge variant={item.category === "internship" ? "accent" : "success"} size="sm">
                  {item.category === "internship" ? "Paid Internship" : "Scholarship Grant"}
                </Badge>
              </div>

              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors leading-snug">
                <Link href={`/jobs/${item.slug}`} className="focus-visible:outline-none">
                  {item.title}
                </Link>
              </h3>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {item.shortSummary}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border)] text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                  <IndianRupee className="h-3.5 w-3.5 text-[#059669] shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.salaryOrStipend}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 justify-end">
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                Eligibility: {item.qualificationSummary.split(",")[0]}
              </span>
              <Link href={`/jobs/${item.slug}`}>
                <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-3 w-3" />}>
                  View Details
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

ScholarshipSection.displayName = "ScholarshipSection";
