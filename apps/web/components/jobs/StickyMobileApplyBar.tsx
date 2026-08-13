import React from "react";
import { Button } from "@/components/ui";
import { Clock, ExternalLink } from "lucide-react";

export interface StickyMobileApplyBarProps {
  lastDate?: string;
  applyUrl?: string;
  isEndingSoon?: boolean;
}

export const StickyMobileApplyBar: React.FC<StickyMobileApplyBarProps> = ({
  lastDate,
  applyUrl,
  isEndingSoon = false,
}) => {
  if (!applyUrl) return null;

  return (
    <aside
      aria-label="Quick Mobile Application Bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[var(--border)] px-4 py-2.5 shadow-xl pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        {/* Left: Last date warning */}
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Application Deadline
          </span>
          <div className="flex items-center gap-1 text-xs font-black truncate">
            <Clock
              className={`h-3.5 w-3.5 shrink-0 ${
                isEndingSoon ? "text-[#DC2626]" : "text-slate-600"
              }`}
              aria-hidden="true"
            />
            <span className={isEndingSoon ? "text-[#DC2626]" : "text-slate-900"}>
              {lastDate || "Check Notice"}
            </span>
          </div>
        </div>

        {/* Right: Primary Apply Button */}
        <a
          href={applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          <Button
            variant="accent"
            size="md"
            className="font-bold shadow-xs min-h-[44px] px-5"
            rightIcon={<ExternalLink className="h-4 w-4" aria-hidden="true" />}
          >
            Apply Now
          </Button>
        </a>
      </div>
    </aside>
  );
};

StickyMobileApplyBar.displayName = "StickyMobileApplyBar";
