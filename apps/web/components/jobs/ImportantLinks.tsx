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
} from "lucide-react";

export interface ImportantLinksProps {
  links?: ImportantLink[];
  className?: string;
}

export const ImportantLinks: React.FC<ImportantLinksProps> = ({
  links = [],
  className = "",
}) => {
  if (!links || links.length === 0) return null;

  const getLinkMeta = (type: ImportantLink["linkType"]) => {
    switch (type) {
      case "apply_online":
        return {
          icon: Sparkles,
          color: "text-[#D97706] bg-amber-50 border-amber-200",
          actionText: "Click to Apply",
        };
      case "official_notification_pdf":
        return {
          icon: FileDown,
          color: "text-blue-700 bg-blue-50 border-blue-200",
          actionText: "Download PDF",
        };
      case "official_website":
        return {
          icon: Globe,
          color: "text-emerald-700 bg-emerald-50 border-emerald-200",
          actionText: "Visit Portal",
        };
      case "admit_card":
        return {
          icon: FileCheck,
          color: "text-indigo-700 bg-indigo-50 border-indigo-200",
          actionText: "Download Hall Ticket",
        };
      case "result_merit_list":
        return {
          icon: Award,
          color: "text-purple-700 bg-purple-50 border-purple-200",
          actionText: "Check Result",
        };
      default:
        return {
          icon: LinkIcon,
          color: "text-slate-700 bg-slate-100 border-slate-200",
          actionText: "Open Link",
        };
    }
  };

  return (
    <Card className={["bg-white border-[var(--border)] overflow-hidden shadow-2xs", className].filter(Boolean).join(" ")}>
      <CardHeader className="p-4 sm:p-5 border-b border-[var(--border)] bg-slate-50/70">
        <CardTitle as="h2" className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
          <LinkIcon className="h-4 w-4 text-[var(--primary)] shrink-0" aria-hidden="true" />
          <span>Official Useful Links & Portals</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {links.map((link, idx) => {
            const meta = getLinkMeta(link.linkType);
            const Icon = meta.icon;

            return (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border)] bg-slate-50/80 hover:bg-white hover:border-[var(--primary)] hover:shadow-xs transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className={`p-2 rounded-lg border ${meta.color} shrink-0`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-slate-900 group-hover:text-[var(--primary)] transition-colors block truncate">
                      {link.label}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      {meta.actionText}
                    </span>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-[var(--primary)] transition-colors shrink-0" aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

ImportantLinks.displayName = "ImportantLinks";
