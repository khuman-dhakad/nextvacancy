"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, LogOut, LayoutDashboard, Bell, Settings, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Container, Button } from "@/components/ui";
import { TrustBar } from "@/components/desktop/home/TrustBar";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";
import { UserProfile } from "@/types";
import { logoutAction } from "@/app/login/actions";

export interface HeaderProps {
  className?: string;
  currentUser?: UserProfile | null;
}

export const Header: React.FC<HeaderProps> = ({ className = "", currentUser }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  // Close dropdown on outside click
  useEffect(() => {
    if (!userDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#user-profile-menu")) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [userDropdownOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAction();
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className={["w-full flex flex-col select-none", className].filter(Boolean).join(" ")}>
      {/* 1. Top Trust & Verification Navigation Bar */}
      <TrustBar />

      {/* 2. Premium Sticky Main Header */}
      <div className="sticky top-0 z-40 bg-[#850A42] border-b border-[#630731] shadow-md transition-shadow">
        <Container size="lg" className="flex items-center justify-between h-[76px] gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            aria-label="NEXTVACANCY Homepage"
            className="flex items-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg p-1 group shrink-0"
          >
            <div className="h-10 w-10 rounded-md bg-white text-[#850A42] flex items-center justify-center font-black text-xl shadow-xs tracking-tight transition-transform group-hover:scale-105">
              N
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-lg font-black tracking-tight text-white leading-none flex items-center gap-1">
                NEXT<span className="text-amber-300">VACANCY</span>
              </span>
              <span className="text-[10px] font-semibold text-pink-100 tracking-[0.12em] uppercase mt-0.5">
                Official Job Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <DesktopNavigation activePath={pathname} />

          {/* Search Shortcut & Sign In / User Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link href="/search" aria-label="Search all recruitments">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md border border-white/40 text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer text-xs font-bold"
                aria-label={`Quick search recruitments (${isMac ? "⌘K" : "Ctrl K"})`}
              >
                <Search className="h-4 w-4 text-pink-100" aria-hidden="true" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden sm:inline text-[10px] bg-white/15 text-pink-50 px-1.5 py-0.5 rounded border border-white/20 font-mono">
                  {isMac ? "⌘K" : "Ctrl K"}
                </kbd>
              </button>
            </Link>

            {currentUser ? (
              /* Authenticated User Menu */
              <div className="relative" id="user-profile-menu">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer text-xs font-bold"
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="h-6 w-6 rounded-full bg-white text-[#850A42] flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                    {currentUser.fullName ? currentUser.fullName.charAt(0) : "U"}
                  </div>
                  <span className="max-w-[120px] truncate hidden md:inline">
                    {currentUser.fullName.split(" ")[0]}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-80" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900 truncate">{currentUser.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-50 text-[#850A42]">
                        {currentUser.role}
                      </span>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 font-medium"
                    >
                      <LayoutDashboard className="h-4 w-4 text-slate-500" />
                      <span>Candidate Dashboard</span>
                    </Link>

                    <Link
                      href="/notifications"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 font-medium"
                    >
                      <Bell className="h-4 w-4 text-slate-500" />
                      <span>Notification Center</span>
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 font-medium"
                    >
                      <Settings className="h-4 w-4 text-slate-500" />
                      <span>Account Settings</span>
                    </Link>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-rose-50 text-rose-700 font-bold transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Unauthenticated Sign In CTA */
              <Link href="/login">
                <Button
                  variant="primary"
                  size="md"
                  className="bg-white hover:bg-pink-50 text-[#850A42] font-bold text-xs px-5 shadow-xs rounded-md"
                >
                  Sign In
                </Button>
              </Link>
            )}

            <div className="lg:hidden">
              <MobileNavigation currentUser={currentUser} />
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};

Header.displayName = "Header";
