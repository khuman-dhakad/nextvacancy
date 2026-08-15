import React from "react";
import Link from "next/link";
import { Users, GraduationCap } from "lucide-react";
import { Card, Button } from "@/components/ui";

export interface FeaturedJobItem {
  id: string;
  slug: string;
  title: string;
  organization: string;
  categoryTag: string;
  categoryTagStyle: string;
  totalPosts: string;
  qualification: string;
  lastDate: string;
  borderTheme: "blue" | "green" | "navy" | "orange";
  emblemType: "rrb" | "ssc" | "upsc" | "army";
}

export interface JobCardProps {
  job: FeaturedJobItem;
  className?: string;
}

// Crisp, lightweight SVGs for official commission emblems
const CommissionEmblem: React.FC<{ type: FeaturedJobItem["emblemType"] }> = ({ type }) => {
  if (type === "rrb") {
    // Railway Red Circle Emblem
    return (
      <div className="w-12 h-12 rounded-full bg-rose-50 border-2 border-rose-500/80 flex items-center justify-center p-1 shrink-0 text-rose-700 shadow-2xs">
        <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" stroke="currentColor">
          <circle cx="20" cy="20" r="17" strokeWidth="2" strokeDasharray="3 2" />
          <circle cx="20" cy="20" r="11" strokeWidth="1.5" />
          <rect x="14" y="12" width="12" height="13" rx="2" strokeWidth="1.5" />
          <circle cx="16.5" cy="22" r="1.2" fill="currentColor" />
          <circle cx="23.5" cy="22" r="1.2" fill="currentColor" />
          <line x1="14" y1="27" x2="26" y2="27" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  if (type === "ssc") {
    // SSC Green Circle Emblem
    return (
      <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-600/80 flex items-center justify-center p-1 shrink-0 text-emerald-800 shadow-2xs">
        <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" stroke="currentColor">
          <circle cx="20" cy="20" r="17" strokeWidth="2" />
          <path d="M12 15 Q20 8 28 15 Q20 22 12 15" strokeWidth="1.5" />
          <text x="20" y="27" fontSize="8" fontWeight="bold" textAnchor="middle" fill="currentColor" stroke="none">
            SSC
          </text>
        </svg>
      </div>
    );
  }

  if (type === "upsc") {
    // UPSC Navy Ashoka Lion Emblem
    return (
      <div className="w-12 h-12 rounded-full bg-slate-50 border-2 border-[#0F2744]/80 flex items-center justify-center p-1 shrink-0 text-[#0F2744] shadow-2xs">
        <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" stroke="currentColor">
          <circle cx="20" cy="20" r="17" strokeWidth="2" />
          <path d="M16 12 L20 8 L24 12 L20 16 Z" strokeWidth="1.5" fill="currentColor" />
          <line x1="15" y1="20" x2="25" y2="20" strokeWidth="2" />
          <text x="20" y="29" fontSize="7" fontWeight="bold" textAnchor="middle" fill="currentColor" stroke="none">
            UPSC
          </text>
        </svg>
      </div>
    );
  }

  // Indian Army Gold Crossed Swords Emblem
  return (
    <div className="w-12 h-12 rounded-full bg-amber-50 border-2 border-amber-500/80 flex items-center justify-center p-1 shrink-0 text-amber-800 shadow-2xs">
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" stroke="currentColor">
        <circle cx="20" cy="20" r="17" strokeWidth="2" />
        <line x1="13" y1="13" x2="27" y2="27" strokeWidth="2" strokeLinecap="round" />
        <line x1="27" y1="13" x2="13" y2="27" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="20" r="3" fill="currentColor" />
      </svg>
    </div>
  );
};

const buttonThemeStyles = {
  blue: "border-blue-200 text-[#1D4ED8] hover:bg-blue-50 hover:border-blue-300",
  green: "border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300",
  navy: "border-slate-300 text-[#0F2744] hover:bg-slate-50 hover:border-slate-400",
  orange: "border-amber-300 text-[#D97706] hover:bg-amber-50 hover:border-amber-400",
};

const cardThemeStyles = {
  blue: "hover:border-blue-300",
  green: "hover:border-emerald-300",
  navy: "hover:border-slate-400",
  orange: "hover:border-amber-300",
};

export const JobCard: React.FC<JobCardProps> = ({ job, className = "" }) => {
  return (
    <Card
      hoverable
      className={[
        "bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-5 group",
        cardThemeStyles[job.borderTheme],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="space-y-4">
        {/* Top Header: Emblem + Category Tag */}
        <div className="flex items-start justify-between gap-3">
          <CommissionEmblem type={job.emblemType} />

          <span
            className={[
              "text-xs font-bold px-3 py-1 rounded-full border shrink-0",
              job.categoryTagStyle,
            ].join(" ")}
          >
            {job.categoryTag}
          </span>
        </div>

        {/* Job Title */}
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors leading-snug line-clamp-2">
            <Link
              href={`/jobs/${job.slug}`}
              className="focus-visible:outline-none focus-visible:underline"
            >
              {job.title}
            </Link>
          </h3>
        </div>

        {/* Meta Stats: Posts count + Qualification */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-1">
          <span className="flex items-center gap-1.5 truncate">
            <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span>{job.totalPosts}</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5 truncate">
            <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span>{job.qualification}</span>
          </span>
        </div>

        {/* Red Last Date Highlight */}
        <div className="text-xs font-bold text-[#DC2626] pt-1">
          Last Date: {job.lastDate}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <Link href={`/jobs/${job.slug}`} className="block w-full">
          <Button
            variant="outline"
            size="md"
            fullWidth
            className={[
              "font-bold text-xs rounded-xl min-h-[42px] transition-colors border shadow-2xs",
              buttonThemeStyles[job.borderTheme],
            ].join(" ")}
          >
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};

JobCard.displayName = "JobCard";
