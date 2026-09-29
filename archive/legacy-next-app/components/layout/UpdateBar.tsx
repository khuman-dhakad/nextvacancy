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

export interface UpdateBarProps {
  items?: UpdateTickerItem[];
  className?: string;
}

const TickerItem: React.FC<{ item: UpdateTickerItem }> = ({ item }) => (
  <Link
    href={item.href}
    className="inline-flex items-center gap-1.5 hover:text-[#B45309] hover:underline font-medium text-slate-800 shrink-0 transition-colors px-6"
  >
    {item.tag && (
      <span className="bg-white border border-[#FDE68A] text-[#92400E] px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
        {item.tag}
      </span>
    )}
    <span className="whitespace-nowrap">{item.title}</span>
    {item.isNew && (
      <span className="inline-flex items-center px-1 rounded text-[9px] font-extrabold bg-[#DC2626] text-white shrink-0">
        NEW
      </span>
    )}
    <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" aria-hidden="true" />
  </Link>
);

export const UpdateBar: React.FC<UpdateBarProps> = ({
  items = [],
  className = "",
}) => {
  if (items.length === 0) return null;

  // Duplicate items for seamless infinite ticker loop
  const tickerItems = [...items, ...items];

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
        {/* Fixed Label */}
        <div className="flex items-center gap-1.5 shrink-0 font-bold bg-[#D97706] text-white px-2 py-0.5 rounded text-[11px] tracking-wide uppercase shadow-xs z-10">
          <Bell className="h-3 w-3 animate-pulse" aria-hidden="true" />
          <span>Latest</span>
        </div>

        {/* Animated Ticker Container */}
        <div className="flex-1 overflow-hidden relative">
          {/* Fade edge left */}
          <div
            className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-[#FFFBEB] to-transparent z-10 pointer-events-none"
            aria-hidden="true"
          />
          {/* Fade edge right */}
          <div
            className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-[#FFFBEB] to-transparent z-10 pointer-events-none"
            aria-hidden="true"
          />
          {/* The actual scrolling ticker */}
          <div
            className="animate-ticker"
            role="marquee"
            aria-label="Scrolling job alerts"
          >
            {tickerItems.map((item, idx) => (
              <TickerItem key={`${item.id}-${idx}`} item={item} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

UpdateBar.displayName = "UpdateBar";
