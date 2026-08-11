import React from "react";
import Link from "next/link";
import { Bell, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui";

export interface UpdateTickerItem {
  id: string;
  title: string;
  tag?: string;
  href: string;
  isNew?: boolean;
}

const DEFAULT_UPDATES: UpdateTickerItem[] = [
  {
    id: "1",
    title: "SSC CGL 2026 Detailed Notification & Syllabus Released — Apply Online",
    tag: "SSC",
    href: "/jobs/ssc-cgl-2026",
    isNew: true,
  },
  {
    id: "2",
    title: "RRB NTPC Graduate & Non-Graduate Tier-1 Exam Dates Announced",
    tag: "Railway",
    href: "/jobs/rrb-ntpc-2026",
    isNew: true,
  },
  {
    id: "3",
    title: "UPSC Civil Services (IAS/IFS) Preliminary Exam 2026 Application Active",
    tag: "UPSC",
    href: "/jobs/upsc-cse-2026",
    isNew: false,
  },
  {
    id: "4",
    title: "PM Internship Scheme Round 2 Registration Started for 1.25 Lakh Seats",
    tag: "Scheme",
    href: "/jobs/pm-internship-2026",
    isNew: true,
  },
];

export interface UpdateBarProps {
  items?: UpdateTickerItem[];
  className?: string;
}

export const UpdateBar: React.FC<UpdateBarProps> = ({
  items = DEFAULT_UPDATES,
  className = "",
}) => {
  return (
    <section
      aria-label="Latest Job Notifications & Alerts"
      className={[
        "bg-[#FFFBEB] border-y border-[#FDE68A] text-[#92400E] text-xs py-1.5 overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Container size="lg" className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 shrink-0 font-bold bg-[#D97706] text-white px-2 py-0.5 rounded text-[11px] tracking-wide uppercase shadow-2xs">
          <Bell className="h-3 w-3 animate-pulse" aria-hidden="true" />
          <span>Latest Alerts</span>
        </div>

        <div className="flex-1 overflow-x-auto no-scrollbar whitespace-nowrap flex items-center gap-6">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="inline-flex items-center gap-1.5 hover:text-[#B45309] hover:underline font-medium text-slate-800 shrink-0 transition-colors"
            >
              {item.tag && (
                <span className="bg-white border border-[#FDE68A] text-[#92400E] px-1.5 py-0.2 rounded text-[10px] font-bold">
                  {item.tag}
                </span>
              )}
              <span>{item.title}</span>
              {item.isNew && (
                <span className="inline-flex items-center px-1 rounded text-[9px] font-extrabold bg-[#DC2626] text-white">
                  NEW
                </span>
              )}
              <ChevronRight className="h-3 w-3 text-slate-400" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};

UpdateBar.displayName = "UpdateBar";
