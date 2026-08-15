import React from "react";
import {
  ExternalLink,
  Download,
  Globe2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { Card, Badge, Button } from "@/components/ui";
import { ImportantLink } from "@/types";


export interface OfficialLinksProps {
  links: ImportantLink[];
  className?: string;
}

const getLinkMeta = (linkType: ImportantLink["linkType"]) => {
  switch (linkType) {
    case "apply_online":
      return {
        title: "Click to Apply Online",
        subtitle: "Direct candidate application & registration portal",
        icon: ArrowUpRight,
        bgStyle: "bg-emerald-50 text-emerald-700 border-emerald-200",
        btnVariant: "accent" as const,
        badgeText: "Primary Portal",
        badgeVariant: "success" as const,
      };
    case "official_notification_pdf":
      return {
        title: "Download Official Notification PDF",
        subtitle: "Complete gazette circular, syllabus & exam rules",
        icon: Download,
        bgStyle: "bg-red-50 text-red-700 border-red-200",
        btnVariant: "destructive" as const,
        badgeText: "Gazette Notice",
        badgeVariant: "danger" as const,
      };
    case "official_website":
      return {
        title: "Official Commission Website",
        subtitle: "Main authority domain for live alerts & announcements",
        icon: Globe2,
        bgStyle: "bg-blue-50 text-blue-700 border-blue-200",
        btnVariant: "secondary" as const,
        badgeText: "Govt Domain",
        badgeVariant: "info" as const,
      };
    default:
      return {
        title: "Candidate & Correction Portal",
        subtitle: "Admit cards, answer key tracker & OTR dashboard",
        icon: FileText,
        bgStyle: "bg-amber-50 text-amber-800 border-amber-200",
        btnVariant: "outline" as const,
        badgeText: "Candidate Link",
        badgeVariant: "warning" as const,
      };
  }
};

export const OfficialLinks: React.FC<OfficialLinksProps> = ({
  links = [],
  className = "",
}) => {
  // Ensure we display at least the standard action portals
  const displayLinks = links.length > 0 ? links : [
    {
      label: "Apply Online (Official Registration)",
      url: "https://ssc.gov.in",
      linkType: "apply_online" as const,
    },
    {
      label: "Download Detailed Notification PDF",
      url: "https://ssc.gov.in/notice",
      linkType: "official_notification_pdf" as const,
    },
    {
      label: "Official Commission Portal",
      url: "https://ssc.gov.in",
      linkType: "official_website" as const,
    },
    {
      label: "Admit Card & Application Status",
      url: "https://ssc.gov.in/candidate",
      linkType: "admit_card" as const,
    },
  ];

  return (
    <section aria-label="Official Links and Application Portals" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Direct External Gateways
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Official Useful Links &amp; Application Portals
            </h2>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            <span>Direct Government Redirection</span>
          </div>
        </div>

        {/* 2x2 Equal Height Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayLinks.map((link, idx) => {
            const meta = getLinkMeta(link.linkType);
            const Icon = meta.icon;

            return (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between space-y-4 group"
              >
                <div className="flex items-start gap-4">
                  {/* 48x48 Soft Colored Icon Square */}
                  <div
                    className={[
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105",
                      meta.bgStyle,
                    ].join(" ")}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={meta.badgeVariant} size="sm">
                        {meta.badgeText}
                      </Badge>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" aria-hidden="true" />
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-[var(--primary)] transition-colors">
                      {link.label || meta.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      {meta.subtitle}
                    </p>
                  </div>
                </div>

                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-xl"
                >
                  <Button
                    variant={meta.btnVariant}
                    size="md"
                    fullWidth
                    className="font-bold text-xs shadow-xs"
                    rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
                  >
                    Open Official Link
                  </Button>
                </a>
              </div>
            );
          })}
        </div>

        {/* Anti-Scam Disclaimer Notice */}
        <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="h-4 w-4 text-[var(--primary)] shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed">
            <strong>Verification Note:</strong> NEXTVACANCY routes candidates directly to authorized Government commission portals. Never pay fees on unverified third-party websites.
          </p>
        </div>
      </Card>
    </section>
  );
};

OfficialLinks.displayName = "OfficialLinks";
