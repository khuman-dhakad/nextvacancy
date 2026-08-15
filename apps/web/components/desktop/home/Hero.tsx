import React from "react";
import { Container } from "@/components/ui";
import { SearchPanel } from "./SearchPanel";
import { TrendingChips } from "./TrendingChips";

export const Hero: React.FC = () => {
  return (
    <section
      aria-label="Hero and Smart Search Experience"
      className="relative overflow-hidden bg-[#0A1E38] text-white pt-14 pb-14 select-none"
      style={{
        background: "linear-gradient(135deg, #061527 0%, #0A1E38 50%, #0E294B 100%)",
      }}
    >
      {/* Ambient Lighting Background Effect */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <Container size="lg" className="relative">
        {/* Top Hero Row: Headline on Left, SVG Parliament Building on Right */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Text Block */}
          <div className="w-full lg:w-7/12 space-y-4 text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight text-white leading-[1.2]">
              India&apos;s Most Trusted
              <span className="block text-[#F59E0B] mt-1">
                Government &amp; Private Jobs Portal
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-normal">
              Get authentic notifications, exam dates, admit cards, results,
              answer keys &amp; scholarships – all in one place.
            </p>
          </div>

          {/* Right SVG Indian Parliament / Rashtrapati Bhavan Architecture Illustration */}
          <div className="w-full lg:w-5/12 hidden lg:flex justify-end items-center pointer-events-none select-none relative">
            <svg
              viewBox="0 0 480 260"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full max-w-[420px] h-auto opacity-60 text-blue-200"
              aria-hidden="true"
            >
              {/* Central Dome & Spire */}
              <path
                d="M240 18 L240 45"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="240" cy="18" r="3.5" fill="currentColor" />
              <path
                d="M200 85 C200 45 280 45 280 85 Z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M215 85 C215 58 265 58 265 85 Z"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
                strokeDasharray="2 2"
              />
              <rect
                x="195"
                y="85"
                width="90"
                height="10"
                stroke="currentColor"
                strokeWidth="1.8"
                rx="2"
              />

              {/* Classical Drum & Windows */}
              <line x1="210" y1="95" x2="210" y2="120" stroke="currentColor" strokeWidth="1.5" />
              <line x1="225" y1="95" x2="225" y2="120" stroke="currentColor" strokeWidth="1.5" />
              <line x1="240" y1="95" x2="240" y2="120" stroke="currentColor" strokeWidth="1.5" />
              <line x1="255" y1="95" x2="255" y2="120" stroke="currentColor" strokeWidth="1.5" />
              <line x1="270" y1="95" x2="270" y2="120" stroke="currentColor" strokeWidth="1.5" />

              {/* Pediment & Entablature */}
              <polygon
                points="175,120 305,120 240,105"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <rect
                x="170"
                y="120"
                width="140"
                height="8"
                stroke="currentColor"
                strokeWidth="1.8"
                rx="1"
              />

              {/* Main Colonaded Portico */}
              <g stroke="currentColor" strokeWidth="1.8">
                <line x1="185" y1="128" x2="185" y2="195" />
                <line x1="205" y1="128" x2="205" y2="195" />
                <line x1="225" y1="128" x2="225" y2="195" />
                <line x1="240" y1="128" x2="240" y2="195" />
                <line x1="255" y1="128" x2="255" y2="195" />
                <line x1="275" y1="128" x2="275" y2="195" />
                <line x1="295" y1="128" x2="295" y2="195" />
              </g>

              {/* Left Wing Colonnade */}
              <rect x="50" y="145" width="120" height="6" stroke="currentColor" strokeWidth="1.5" />
              <g stroke="currentColor" strokeWidth="1.2">
                <line x1="60" y1="151" x2="60" y2="195" />
                <line x1="75" y1="151" x2="75" y2="195" />
                <line x1="90" y1="151" x2="90" y2="195" />
                <line x1="105" y1="151" x2="105" y2="195" />
                <line x1="120" y1="151" x2="120" y2="195" />
                <line x1="135" y1="151" x2="135" y2="195" />
                <line x1="150" y1="151" x2="150" y2="195" />
                <line x1="165" y1="151" x2="165" y2="195" />
              </g>
              <rect x="40" y="140" width="30" height="55" stroke="currentColor" strokeWidth="1.5" />
              <path d="M40 140 Q55 125 70 140" stroke="currentColor" strokeWidth="1.5" />

              {/* Right Wing Colonnade */}
              <rect x="310" y="145" width="120" height="6" stroke="currentColor" strokeWidth="1.5" />
              <g stroke="currentColor" strokeWidth="1.2">
                <line x1="315" y1="151" x2="315" y2="195" />
                <line x1="330" y1="151" x2="330" y2="195" />
                <line x1="345" y1="151" x2="345" y2="195" />
                <line x1="360" y1="151" x2="360" y2="195" />
                <line x1="375" y1="151" x2="375" y2="195" />
                <line x1="390" y1="151" x2="390" y2="195" />
                <line x1="405" y1="151" x2="405" y2="195" />
                <line x1="420" y1="151" x2="420" y2="195" />
              </g>
              <rect x="410" y="140" width="30" height="55" stroke="currentColor" strokeWidth="1.5" />
              <path d="M410 140 Q425 125 440 140" stroke="currentColor" strokeWidth="1.5" />

              {/* Base Line */}
              <rect x="25" y="195" width="430" height="6" stroke="currentColor" strokeWidth="1.8" />
              <rect x="15" y="201" width="450" height="6" stroke="currentColor" strokeWidth="1.8" />
              <line x1="0" y1="207" x2="480" y2="207" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Floating 4-Column Search Experience */}
        <div className="mt-10 w-full">
          <SearchPanel />
        </div>

        {/* Trending Searches Row */}
        <div className="mt-5 w-full">
          <TrendingChips />
        </div>
      </Container>
    </section>
  );
};

Hero.displayName = "Hero";
