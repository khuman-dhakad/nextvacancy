"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { Container, Button } from "@/components/ui";
import { TrustBar } from "@/components/desktop/home/TrustBar";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";

export interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const pathname = usePathname();
  const router = useRouter();

  // Detect OS safely without cascading renders
  const isMac = React.useSyncExternalStore(
    () => () => {},
    () => (typeof navigator !== "undefined" ? navigator.platform.toUpperCase().includes("MAC") : false),
    () => false
  );

  // Attach global keyboard shortcut (Ctrl+K / ⌘K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        router.push("/search");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <header className={["w-full flex flex-col select-none", className].filter(Boolean).join(" ")}>
      {/* 1. Top Trust & Verification Navigation Bar */}
      <TrustBar />

      {/* 2. Premium Sticky Main Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-shadow">
        <Container size="lg" className="flex items-center justify-between h-[72px] gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            aria-label="NEXTVACANCY Homepage"
            className="flex items-center gap-3 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2744] rounded-2xl p-1 group shrink-0"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0F2744] to-[#183B66] text-white flex items-center justify-center font-black text-xl shadow-xs tracking-tight transition-transform group-hover:scale-105">
              N
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-lg font-black tracking-tight text-[#0F2744] leading-none flex items-center gap-1">
                NEXT<span className="text-[#D97706]">VACANCY</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </span>
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-0.5">
                Official Careers Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <DesktopNavigation activePath={pathname} />

          {/* Search Shortcut & Sign In Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link href="/search" aria-label="Search all recruitments">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200/90 text-slate-600 hover:text-[#0F2744] hover:border-slate-300 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2744] cursor-pointer text-xs font-bold shadow-2xs"
                aria-label={`Quick search recruitments (${isMac ? "⌘K" : "Ctrl K"})`}
              >
                <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden sm:inline text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md border border-slate-200 font-mono">
                  {isMac ? "⌘K" : "Ctrl K"}
                </kbd>
              </button>
            </Link>

            <Link href="/login">
              <Button
                variant="primary"
                size="md"
                className="bg-[#0F2744] hover:bg-[#183B66] text-white font-bold text-xs px-5 shadow-xs"
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
