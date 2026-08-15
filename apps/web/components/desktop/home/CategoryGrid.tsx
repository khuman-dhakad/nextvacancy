import React from "react";
import Link from "next/link";
import { Container, Card } from "@/components/ui";
import {
  Building2,
  Briefcase,
  FileCheck,
  Award,
  Key,
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export interface CategoryGridProps {
  className?: string;
}

const CATEGORIES = [
  {
    id: "govt",
    title: "Government Jobs",
    subtitle: "UPSC, SSC, Railways, Banking & Police",
    href: "/government-jobs",
    icon: Building2,
    badge: "50,000+ Posts",
    color: "text-[var(--primary)] bg-slate-100",
  },
  {
    id: "private",
    title: "Private & IT Careers",
    subtitle: "TCS, Infosys, Google & MNC Hiring",
    href: "/private-jobs",
    icon: Briefcase,
    badge: "Tech & Corporate",
    color: "text-blue-700 bg-blue-50",
  },
  {
    id: "admit-card",
    title: "Admit Cards",
    subtitle: "Hall Tickets & Exam City Slips",
    href: "/admit-cards",
    icon: FileCheck,
    badge: "Live Downloads",
    color: "text-indigo-700 bg-indigo-50",
  },
  {
    id: "result",
    title: "Exam Results",
    subtitle: "Merit Lists & Qualifying Cut-offs",
    href: "/results",
    icon: Award,
    badge: "Declared",
    color: "text-emerald-700 bg-emerald-50",
  },
  {
    id: "answer-key",
    title: "Answer Keys",
    subtitle: "Official Response Sheets & Keys",
    href: "/category/answer-key",
    icon: Key,
    badge: "Objection Windows",
    color: "text-amber-700 bg-amber-50",
  },
  {
    id: "scholarship",
    title: "Scholarships",
    subtitle: "NSP Schemes & Financial Grants",
    href: "/category/scholarship",
    icon: GraduationCap,
    badge: "Student Aid",
    color: "text-purple-700 bg-purple-50",
  },
  {
    id: "internship",
    title: "Internships & PM Scheme",
    subtitle: "Paid Corporate & PSU Internships",
    href: "/category/internship",
    icon: Sparkles,
    badge: "Stipend ₹5K+",
    color: "text-rose-700 bg-rose-50",
  },
  {
    id: "syllabus",
    title: "Syllabus & Exam Pattern",
    subtitle: "Official Exam Syllabus PDFs & Guides",
    href: "/search?q=syllabus",
    icon: BookOpen,
    badge: "Free Resources",
    color: "text-teal-700 bg-teal-50",
  },
];

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  className = "",
}) => {
  return (
    <section
      aria-label="Popular Categories"
      className={["py-10 bg-slate-50 border-b border-slate-200", className]
        .filter(Boolean)
        .join(" ")}
    >
      <Container size="lg" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Popular Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select a category to view active notifications and application links
            </p>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)] hover:underline"
          >
            <span>View All Categories</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* 8 Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-2xl"
              >
                <Card className="h-full bg-white border border-slate-200/90 hover:border-[var(--primary)] hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between space-y-3 rounded-2xl">
                  <div className="flex items-start justify-between gap-2">
                    <div className={`p-2.5 rounded-xl ${item.color} shrink-0 group-hover:scale-105 transition-transform`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md truncate">
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

CategoryGrid.displayName = "CategoryGrid";
