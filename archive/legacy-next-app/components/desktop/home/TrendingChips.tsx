import React from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import { Badge } from "@/components/ui";


export interface TrendingChipItem {
  label: string;
  query: string;
  isHot?: boolean;
}

export const DEFAULT_TRENDING_CHIPS: TrendingChipItem[] = [
  { label: "SSC CGL 2026", query: "SSC CGL", isHot: true },
  { label: "UPSC Civil Services", query: "UPSC", isHot: true },
  { label: "Railway RRB NTPC", query: "Railway", isHot: false },
  { label: "Banking (SBI / IBPS)", query: "Bank", isHot: false },
  { label: "Defence & Police", query: "Defence", isHot: false },
  { label: "State PSC Recruitment", query: "PSC", isHot: false },
];

export interface TrendingChipsProps {
  chips?: TrendingChipItem[];
  className?: string;
}

export const TrendingChips: React.FC<TrendingChipsProps> = ({
  chips = DEFAULT_TRENDING_CHIPS,
  className = "",
}) => {
  return (
    <div
      className={["flex items-center gap-2 flex-wrap text-xs", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="text-slate-300 font-bold inline-flex items-center gap-1.5">
        <Flame className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
        Trending Searches:
      </span>

      {chips.map((chip) => (
        <Link
          key={chip.query}
          href={`/search?q=${encodeURIComponent(chip.query)}`}
          className="px-3.5 py-1.5 rounded-full bg-[#07172B]/80 hover:bg-[#07172B] text-slate-200 hover:text-white border border-slate-700/70 transition-colors font-medium inline-flex items-center gap-1.5"
        >
          <span>{chip.label}</span>
          {chip.isHot && (
            <Badge variant="danger" size="sm" className="text-[9px] px-1 py-0">
              HOT
            </Badge>
          )}
        </Link>
      ))}
    </div>
  );
};

TrendingChips.displayName = "TrendingChips";
