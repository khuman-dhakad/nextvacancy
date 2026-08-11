import React from "react";
import Link from "next/link";
import { JobPosting } from "@/types";
import { Badge, Card, CardContent } from "@/components/ui";
import { FileCheck, Award, ArrowRight, Download, Eye } from "lucide-react";

export interface ExamCornerSectionProps {
  admitCards: JobPosting[];
  results: JobPosting[];
}

export const ExamCornerSection: React.FC<ExamCornerSectionProps> = ({
  admitCards,
  results,
}) => {
  return (
    <section aria-labelledby="exam-corner-heading" className="space-y-6 pt-4">
      <h2 id="exam-corner-heading" className="sr-only">
        Exam Updates: Admit Cards and Results
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admit Cards Column */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-emerald-100 text-[#059669]">
                <FileCheck className="h-4 w-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Latest Admit Cards
              </h3>
            </div>
            <Link href="/category/admit-card" className="text-xs font-bold text-[#059669] hover:underline">
              View All <ArrowRight className="h-3 w-3 inline ml-0.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {admitCards.map((item) => (
              <Card key={item.id} hoverable className="bg-white">
                <CardContent className="p-3.5 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-500">{item.organization}</span>
                      <Badge variant="success" size="sm">
                        Available
                      </Badge>
                    </div>
                    <Link
                      href={`/jobs/${item.slug}`}
                      className="text-xs sm:text-sm font-bold text-slate-900 hover:text-[var(--primary)] line-clamp-1"
                    >
                      {item.title}
                    </Link>
                  </div>
                  <Link
                    href={`/jobs/${item.slug}`}
                    className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 shrink-0 transition-colors"
                    aria-label={`Download admit card for ${item.title}`}
                  >
                    <Download className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Results & Merit Lists Column */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-red-200">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-red-100 text-[#DC2626]">
                <Award className="h-4 w-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Exam Results & Merit Lists
              </h3>
            </div>
            <Link href="/category/result" className="text-xs font-bold text-[#DC2626] hover:underline">
              View All <ArrowRight className="h-3 w-3 inline ml-0.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {results.map((item) => (
              <Card key={item.id} hoverable className="bg-white">
                <CardContent className="p-3.5 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-500">{item.organization}</span>
                      <Badge variant="accent" size="sm">
                        Declared
                      </Badge>
                    </div>
                    <Link
                      href={`/jobs/${item.slug}`}
                      className="text-xs sm:text-sm font-bold text-slate-900 hover:text-[var(--primary)] line-clamp-1"
                    >
                      {item.title}
                    </Link>
                  </div>
                  <Link
                    href={`/jobs/${item.slug}`}
                    className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 shrink-0 transition-colors"
                    aria-label={`View result for ${item.title}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

ExamCornerSection.displayName = "ExamCornerSection";
