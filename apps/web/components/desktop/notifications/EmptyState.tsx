import React from "react";
import Link from "next/link";
import { BellOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Notifications in this Category",
  description = "You are all caught up! New recruitment gazettes, admit cards, and examination results will appear here as they are published.",
  actionLabel = "Browse Active Vacancies",
  actionHref = "/search",
  className = "",
}) => {
  return (
    <div className={["text-center py-12 px-4 sm:py-16 max-w-md mx-auto space-y-4", className].filter(Boolean).join(" ")}>
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[var(--primary)] flex items-center justify-center mx-auto shadow-2xs border border-blue-100">
        <BellOff className="h-6 w-6" aria-hidden="true" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          {description}
        </p>
      </div>

      <div className="pt-2">
        <Link href={actionHref}>
          <Button
            variant="primary"
            size="sm"
            className="bg-[#0F2744] hover:bg-[#183B66] text-white font-bold text-xs shadow-xs"
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
          >
            {actionLabel}
          </Button>
        </Link>
      </div>
    </div>
  );
};

EmptyState.displayName = "EmptyState";
