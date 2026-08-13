import React from "react";
import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { SectionHeader } from "./SectionHeader";
import { BookOpen, ArrowRight, Clock, User } from "lucide-react";

export interface ArticlePlaceholderProps {
  className?: string;
}

const ARTICLES = [
  {
    id: "art-1",
    title: "How to Prepare for SSC CGL 2026: Complete Subject-wise Strategy & Booklist",
    summary:
      "A comprehensive preparation roadmap for Quantitative Aptitude, English Comprehension, Reasoning, and General Awareness for Tier-1 & Tier-2 examinations.",
    category: "Exam Strategy",
    readTime: "6 min read",
    author: "Editorial Team",
    href: "/search?q=ssc+cgl+preparation",
  },
  {
    id: "art-2",
    title: "Top 7 Highest Paying Government Jobs in India for Engineers (B.Tech / B.E)",
    summary:
      "Explore lucrative PSU and central government vacancies including ISRO, DRDO, IOCL, ONGC, and Engineering Services Examination (ESE) pay scales.",
    category: "Career Guidance",
    readTime: "5 min read",
    author: "Career Desk",
    href: "/search?q=engineering+jobs",
  },
  {
    id: "art-3",
    title: "UPSC CSE Prelims CSAT Paper-2: Smart Hacks to Clear 33% Cut-off",
    summary:
      "Master Reading Comprehension, Logical Reasoning, and Basic Numeracy with high-accuracy question selection tips.",
    category: "Preparation Guide",
    readTime: "4 min read",
    author: "NEXTVACANCY Experts",
    href: "/search?q=upsc+csat",
  },
];

export const ArticlePlaceholder: React.FC<ArticlePlaceholderProps> = ({
  className = "",
}) => {
  return (
    <section className={["space-y-4", className].filter(Boolean).join(" ")}>
      <SectionHeader
        title="Exam Preparation Guides & Career Insights"
        description="Expert tips, syllabus breakdowns, previous year analysis, and preparation strategies"
        badge="Resource Library"
        icon={BookOpen}
        viewAllHref="/search"
        viewAllText="Explore Guides"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ARTICLES.map((article) => (
          <Link
            key={article.id}
            href={article.href}
            className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-2xl"
          >
            <Card className="h-full bg-white border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="accent" size="sm">
                    {article.category}
                  </Badge>
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {article.author}
                </span>

                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--primary)] group-hover:underline">
                  <span>Read Guide</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

ArticlePlaceholder.displayName = "ArticlePlaceholder";
