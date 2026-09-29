import React from "react";
import { ImportantLink } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import {
  Link as LinkIcon,
  ExternalLink,
  FileDown,
  Globe,
  Sparkles,
  Award,
  FileCheck,
  KeyRound,
} from "lucide-react";

export interface ImportantLinksProps {
  links?: ImportantLink[];
  className?: string;
  variant?: "auto" | "compact" | "grid";
}

export const ImportantLinks: React.FC<ImportantLinksProps> = ({
  links = [],
  className = "",
  variant = "auto",
}) => {
  if (!links || links.length === 0) return null;

  const getLinkMeta = (type: ImportantLink["linkType"], label: string) => {
    switch (type) {
      case "apply_online":
        return {
          icon: Sparkles,
          color: "text-[#D97706] bg-amber-50 border-amber-200/80 group-hover:bg-amber-100",
          actionText: "Click to Apply",
          hint: "Direct Application Portal",
          bottomIcon: ExternalLink,
          bottomText: "Apply Online",
        };
      case "official_notification_pdf":
        return {
          icon: FileDown,
          color: "text-blue-700 bg-blue-50 border-blue-200/80 group-hover:bg-blue-100",
          actionText: "Download PDF",
          hint: "Official Notification",
          bottomIcon: FileDown,
          bottomText: "Download File",
        };
      case "official_website":
        return {
          icon: Globe,
          color: "text-emerald-700 bg-emerald-50 border-emerald-200/80 group-hover:bg-emerald-100",
          actionText: "Official Website",
          hint: "Commission Portal",
          bottomIcon: ExternalLink,
          bottomText: "Visit Portal",
        };
      case "admit_card":
        return {
          icon: FileCheck,
          color: "text-indigo-700 bg-indigo-50 border-indigo-200/80 group-hover:bg-indigo-100",
          actionText: "Download Admit Card",
          hint: "Exam Hall Ticket",
          bottomIcon: FileDown,
          bottomText: "Get Hall Ticket",
        };
      case "result_merit_list":
        return {
          icon: Award,
          color: "text-purple-700 bg-purple-50 border-purple-200/80 group-hover:bg-purple-100",
          actionText: "Check Result",
          hint: "Merit List & Scorecard",
          bottomIcon: ExternalLink,
          bottomText: "View Results",
        };
      case "answer_key":
        return {
          icon: KeyRound,
          color: "text-teal-700 bg-teal-50 border-teal-200/80 group-hover:bg-teal-100",
          actionText: "View Answer Key",
          hint: "Official Key & Objections",
          bottomIcon: ExternalLink,
          bottomText: "View Answers",
        };
      default:
        return {
          icon: LinkIcon,
          color: "text-slate-700 bg-slate-100 border-slate-200 group-hover:bg-slate-200/80",
          actionText: label || "Official Link",
          hint: "Verified Resource",
          bottomIcon: ExternalLink,
          bottomText: "Open Link",
        };
    }
  };

  return (
    <Card
      className={[
        "bg-white border-slate-200/90 overflow-hidden shadow-2xs rounded-2xl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <CardHeader className="p-4 sm:p-5 border-b border-slate-200/90 bg-slate-50/70">
        <CardTitle
          as="h2"
          className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2"
        >
          <LinkIcon className="h-4 w-4 text-[var(--primary)] shrink-0" aria-hidden="true" />
          <span>Official Useful Links &amp; Portals</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        <div className="@container">
          <div
            className={[
              "grid gap-3.5 items-stretch",
              variant === "compact"
                ? "grid-cols-1"
                : "grid-cols-1 @[380px]:grid-cols-2 @[640px]:grid-cols-3 @[880px]:grid-cols-4",
            ].join(" ")}
          >
            {links.map((link, idx) => {
              const meta = getLinkMeta(link.linkType, link.label);
              const MainIcon = meta.icon;
              const BottomIcon = meta.bottomIcon;
              const displaySecondary = link.label && link.label !== meta.actionText ? link.label : meta.hint;

              return (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-between text-center p-4 sm:p-5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-[var(--primary)] hover:shadow-md transition-all duration-200 group h-full min-h-[164px] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                >
                  {/* Top: 48x48 Soft Colored Square with Crisp Icon */}
                  <div
                    className={[
                      "w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-2xs",
                      meta.color,
                    ].join(" ")}
                  >
                    <MainIcon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  {/* Middle: Clear Balanced Typography */}
                  <div className="my-2.5 space-y-1 w-full px-1">
                    <div className="text-sm sm:text-[15px] font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors leading-tight">
                      {meta.actionText}
                    </div>
                    <div className="text-xs text-slate-500 font-medium leading-normal line-clamp-1">
                      {displaySecondary}
                    </div>
                  </div>

                  {/* Bottom: Action Link Badge with Icon */}
                  <div className="pt-2.5 mt-auto border-t border-slate-100/90 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 group-hover:text-[var(--primary)] transition-colors">
                    <span>{meta.bottomText}</span>
                    <BottomIcon
                      className="h-3.5 w-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform"
                      aria-hidden="true"
                    />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

ImportantLinks.displayName = "ImportantLinks";
