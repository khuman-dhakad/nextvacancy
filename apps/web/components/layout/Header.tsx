import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Container, Button } from "@/components/ui";
import { TrustBar } from "@/components/desktop/home/TrustBar";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";

export interface HeaderProps {
  className?: string;
  activePath?: string;
}

export const Header: React.FC<HeaderProps> = ({
  className = "",
  activePath = "/",
}) => {
  return (
    <header className={["w-full flex flex-col select-none", className].filter(Boolean).join(" ")}>
      {/* 1. Trust Navigation Bar */}
      <TrustBar />

      {/* 2. Premium Sticky Main Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <Container size="lg" className="flex items-center justify-between h-[80px]">
          {/* Brand Logo */}
          <Link
            href="/"
            aria-label="NEXTVACANCY Homepage"
            className="flex items-center gap-3 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-xl p-1 group"
          >
            <div className="h-11 w-11 rounded-xl bg-[#0F2744] text-white flex items-center justify-center font-black text-2xl shadow-sm tracking-tight transition-transform group-hover:scale-105">
              N
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-xl font-black tracking-tight text-[#0F2744] leading-none">
                NEXT<span className="text-[#F59E0B]">VACANCY</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-1">
                Careers &amp; Exams Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <DesktopNavigation activePath={activePath} />

          {/* Search Shortcut & Sign In Button */}
          <div className="flex items-center gap-3">
            <Link href="/search" aria-label="Search all recruitments">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-[var(--primary)] hover:border-slate-300 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] cursor-pointer text-xs font-semibold"
                aria-label="Quick search recruitments (Ctrl+K)"
              >
                <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden sm:inline text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                  ⌘K
                </kbd>
              </button>
            </Link>

            <Link href="/login">
              <Button
                variant="primary"
                size="md"
                className="bg-[#0F2744] hover:bg-[#183B66] text-white font-bold text-xs px-5 py-2.5 rounded-[12px] min-h-[40px] shadow-xs"
              >
                Sign In
              </Button>
            </Link>

            <div className="lg:hidden">
              <MobileNavigation />
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};

Header.displayName = "Header";
