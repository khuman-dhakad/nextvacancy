import React from "react";
import Link from "next/link";
import { BookmarkX, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Records Found",
  description = "You do not have any items saved in this section yet.",
  actionLabel = "Browse Vacancies",
  actionHref = "/search",
  className = "",
}) => {
  return (
    <div className={["text-center py-10 px-4 sm:py-14 max-w-md mx-auto space-y-4", className].filter(Boolean).join(" ")}>
      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D97706] flex items-center justify-center mx-auto shadow-2xs">
        <BookmarkX className="h-6 w-6" aria-hidden="true" />
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
            variant="accent"
            size="sm"
            className="font-bold text-xs shadow-xs"
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
