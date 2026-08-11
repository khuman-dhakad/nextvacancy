import React from "react";
import Link from "next/link";
import { Container, Card, CardContent } from "@/components/ui";
import {
  Building2,
  Briefcase,
  FileCheck,
  Award,
  Key,
  GraduationCap,
  Sparkles,
  Users,
  ArrowRight,
} from "lucide-react";

interface CategoryCardItem {
  id: string;
  title: string;
  count: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  colorBg: string;
  colorText: string;
  tag?: string;
}

const CATEGORIES: CategoryCardItem[] = [
  {
    id: "govt",
    title: "Government Jobs",
    count: "14,500+ Posts",
    description: "UPSC, SSC, Railways, Banking, Defence, State PSCs",
    href: "/category/government",
    icon: Building2,
    colorBg: "bg-amber-50",
    colorText: "text-[#D97706]",
    tag: "High Demand",
  },
  {
    id: "private",
    title: "Private Careers",
    count: "5,200+ Openings",
    description: "Software, MNCs, Startups, Core Engineering & Finance",
    href: "/category/private",
    icon: Briefcase,
    colorBg: "bg-blue-50",
    colorText: "text-[#1D4ED8]",
  },
  {
    id: "admit-card",
    title: "Admit Cards",
    count: "18 Active Halls",
    description: "CBT Hall Tickets, City Slips & Roll Number Search",
    href: "/category/admit-card",
    icon: FileCheck,
    colorBg: "bg-emerald-50",
    colorText: "text-[#059669]",
    tag: "Updated",
  },
  {
    id: "results",
    title: "Results & Merit Lists",
    count: "24 Published",
    description: "Cut-off marks, scorecards, answer sheet verification",
    href: "/category/result",
    icon: Award,
    colorBg: "bg-red-50",
    colorText: "text-[#DC2626]",
  },
  {
    id: "answer-keys",
    title: "Answer Keys",
    count: "12 Released",
    description: "Official response sheets, question objection portals",
    href: "/category/answer-key",
    icon: Key,
    colorBg: "bg-purple-50",
    colorText: "text-purple-600",
  },
  {
    id: "scholarships",
    title: "Scholarships",
    count: "₹50 Cr+ Grants",
    description: "NSP Schemes, State fellowships & Higher education",
    href: "/category/scholarship",
    icon: GraduationCap,
    colorBg: "bg-indigo-50",
    colorText: "text-indigo-600",
  },
  {
    id: "internships",
    title: "Internship Schemes",
    count: "1.25 Lakh Slots",
    description: "PM Internship Scheme, corporate stipends & training",
    href: "/category/internship",
    icon: Sparkles,
    colorBg: "bg-pink-50",
    colorText: "text-pink-600",
    tag: "Govt Scheme",
  },
  {
    id: "apprenticeships",
    title: "Apprenticeships",
    count: "3,800+ Posts",
    description: "BHEL, Railways, IOCL, ONGC Trade & Diploma training",
    href: "/category/apprenticeship",
    icon: Users,
    colorBg: "bg-teal-50",
    colorText: "text-teal-600",
  },
];

export const CategoryGrid: React.FC = () => {
  return (
    <section aria-labelledby="quick-categories-heading" className="py-6 sm:py-8 bg-white border-b border-[var(--border)]">
      <Container size="lg" className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 id="quick-categories-heading" className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Quick access to live recruitments, exams, and financial schemes
            </p>
          </div>

          <Link
            href="/search"
            className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>All Categories</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;

            return (
              <Link key={cat.id} href={cat.href} className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-xl">
                <Card hoverable className="h-full bg-slate-50/60 border-[var(--border)] transition-all">
                  <CardContent className="p-4 sm:p-5 space-y-2.5 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl ${cat.colorBg} ${cat.colorText} shrink-0 shadow-2xs`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {cat.tag && (
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                          {cat.tag}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700">{cat.count}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                    </div>
                  </CardContent>
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
