import React from "react";
import Link from "next/link";
import { Search, MessageCircle, Send, ShieldCheck } from "lucide-react";
import { Container, Button } from "@/components/ui";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";

export interface HeaderProps {
  className?: string;
  activePath?: string;
}

export const Header: React.FC<HeaderProps> = ({
  className = "",
  activePath,
}) => {
  return (
    <header className={["w-full flex flex-col", className].filter(Boolean).join(" ")}>
      {/* 1. Top Utility Strip */}
      <div className="bg-[var(--primary)] text-white text-[11px] font-medium py-1 border-b border-[#183B66]">
        <Container size="lg" className="flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="flex items-center gap-1 font-semibold text-[#FDE68A]">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Authentic Recruitment Updates</span>
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline text-slate-300">
              Government & Private Jobs across India
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://whatsapp.com/channel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200 transition-colors"
            >
              <MessageCircle className="h-3 w-3" aria-hidden="true" />
              <span>WhatsApp Alerts</span>
            </a>
            <span className="text-slate-500">•</span>
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-sky-300 hover:text-sky-200 transition-colors"
            >
              <Send className="h-3 w-3" aria-hidden="true" />
              <span>Telegram</span>
            </a>
          </div>
        </Container>
      </div>

      {/* 2. Main Brand Header & Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-[var(--border)] shadow-2xs">
        <Container size="lg" className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo / Brand Name */}
          <Link
            href="/"
            aria-label="NEXTVACANCY Homepage"
            className="flex items-center gap-2.5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-lg p-1"
          >
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-xs">
              N
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-[var(--primary)] leading-none">
                NEXT<span className="text-[#D97706]">VACANCY</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-0.5">
                Careers & Exams Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <DesktopNavigation activePath={activePath} />

          {/* Search & Actions */}
          <div className="flex items-center gap-2">
            <Link href="/search" aria-label="Search all job notifications">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex text-xs font-semibold text-slate-600 hover:text-[var(--primary)] hover:border-[var(--primary)]"
                leftIcon={<Search className="h-3.5 w-3.5 text-slate-400" />}
              >
                <span>Search</span>
                <kbd className="ml-1 text-[10px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded border border-slate-200">
                  Ctrl+K
                </kbd>
              </Button>

              {/* Mobile Search Icon Button */}
              <button
                type="button"
                aria-label="Search"
                className="sm:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg text-slate-700 hover:text-[var(--primary)] hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
              </button>
            </Link>

            {/* Mobile Navigation Drawer Trigger */}
            <MobileNavigation />
          </div>
        </Container>
      </div>
    </header>
  );
};

Header.displayName = "Header";
