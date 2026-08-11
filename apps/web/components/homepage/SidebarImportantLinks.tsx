import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { ExternalLink, BookmarkCheck, FileText } from "lucide-react";

const OFFICIAL_COMMISSIONS = [
  { name: "Staff Selection Commission (SSC)", url: "https://ssc.gov.in" },
  { name: "Union Public Service Commission (UPSC)", url: "https://upsc.gov.in" },
  { name: "Railway Recruitment Control Board (RRB)", url: "https://www.rrbapply.gov.in" },
  { name: "National Testing Agency (NTA)", url: "https://nta.ac.in" },
  { name: "Institute of Banking Personnel Selection (IBPS)", url: "https://ibps.in" },
  { name: "State Bank of India Careers", url: "https://sbi.co.in/careers" },
];

const CANDIDATE_RESOURCES = [
  { title: "Annual Exam Calendar 2026", href: "/search?q=Calendar" },
  { title: "Previous Year Question Papers", href: "/search?q=Previous+Papers" },
  { title: "Exam Syllabus & Pattern Guide", href: "/search?q=Syllabus" },
  { title: "Standard Cut-Off Marks Analysis", href: "/category/result" },
  { title: "10th & 12th Pass Govt Jobs", href: "/search?q=10th+Pass" },
  { title: "Graduate & Diploma Vacancies", href: "/search?q=Graduate" },
];

export const SidebarImportantLinks: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 1. Official Portals */}
      <Card className="bg-white">
        <CardHeader className="p-4 border-b border-[var(--border)] bg-slate-50/50">
          <CardTitle as="h3" className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookmarkCheck className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
            <span>Official Recruitment Portals</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ul className="space-y-2 list-none p-0 m-0 text-xs">
            {OFFICIAL_COMMISSIONS.map((item) => (
              <li key={item.name}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-1 text-slate-700 hover:text-[var(--primary)] hover:underline group"
                >
                  <span className="truncate pr-2 font-medium">{item.name}</span>
                  <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-[var(--primary)] shrink-0" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 2. Candidate Resources */}
      <Card className="bg-white">
        <CardHeader className="p-4 border-b border-[var(--border)] bg-slate-50/50">
          <CardTitle as="h3" className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#D97706]" aria-hidden="true" />
            <span>Aspirants Quick Links</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ul className="space-y-2 list-none p-0 m-0 text-xs">
            {CANDIDATE_RESOURCES.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between py-1 text-slate-700 hover:text-[var(--primary)] hover:underline group font-medium"
                >
                  <span>{item.title}</span>
                  <span className="text-[10px] text-slate-400 group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

SidebarImportantLinks.displayName = "SidebarImportantLinks";
