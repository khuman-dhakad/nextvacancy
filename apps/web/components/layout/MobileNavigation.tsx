"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  Building2,
  Briefcase,
  FileCheck,
  Award,
  Key,
  GraduationCap,
  Sparkles,
  Users,
  MessageCircle,
  Home,
  Info,
  HelpCircle,
} from "lucide-react";

export interface MobileNavigationProps {
  className?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isFirstRender = useRef(true);

  // Manage body scroll, keyboard escape, and focus management
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
      if (!isFirstRender.current) {
        triggerButtonRef.current?.focus();
      }
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className={["lg:hidden", className].filter(Boolean).join(" ")}>
      {/* Hamburger Trigger Button */}
      <button
        ref={triggerButtonRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-drawer"
        aria-label="Open navigation menu"
        className="inline-flex items-center justify-center h-11 w-11 rounded-lg text-slate-700 hover:text-[var(--primary)] hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] cursor-pointer"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Slide-out Drawer */}
      <div
        id="mobile-navigation-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className={[
          "fixed top-0 right-0 z-50 h-full w-4/5 max-w-sm bg-white shadow-2xl flex flex-col",
          "transform transition-transform duration-250 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none",
        ].join(" ")}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--surface-subtle)]">
          <div className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-black text-sm">
              N
            </span>
            <span className="font-extrabold text-base tracking-tight text-[var(--primary)]">
              NEXTVACANCY
            </span>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Search Shortcut */}
        <div className="p-4 border-b border-[var(--border)]">
          <Link
            href="/search"
            onClick={handleLinkClick}
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-lg border border-[var(--border-strong)] bg-slate-50 text-xs font-medium text-slate-500 hover:border-[var(--primary)] transition-colors min-h-[44px]"
          >
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-400" />
              <span>Search vacancies, exams...</span>
            </span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
              /
            </span>
          </Link>
        </div>

        {/* Scrollable Nav Links */}
        <nav aria-label="Mobile Menu Links" className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Main Opportunities */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Categories
            </p>
            <Link
              href="/"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100 hover:text-[var(--primary)] transition-colors min-h-[44px]"
            >
              <Home className="h-4 w-4 text-[var(--primary)]" />
              <span>Home</span>
            </Link>
            <Link
              href="/category/government"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100 hover:text-[var(--primary)] transition-colors min-h-[44px]"
            >
              <Building2 className="h-4 w-4 text-[#D97706]" />
              <span>Government Jobs</span>
            </Link>
            <Link
              href="/category/private"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100 hover:text-[var(--primary)] transition-colors min-h-[44px]"
            >
              <Briefcase className="h-4 w-4 text-[#1D4ED8]" />
              <span>Private Jobs</span>
            </Link>
            <Link
              href="/category/admit-card"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100 hover:text-[var(--primary)] transition-colors min-h-[44px]"
            >
              <FileCheck className="h-4 w-4 text-[#059669]" />
              <span>Admit Cards</span>
            </Link>
            <Link
              href="/category/result"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100 hover:text-[var(--primary)] transition-colors min-h-[44px]"
            >
              <Award className="h-4 w-4 text-[#DC2626]" />
              <span>Results & Merit Lists</span>
            </Link>
            <Link
              href="/category/answer-key"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100 hover:text-[var(--primary)] transition-colors min-h-[44px]"
            >
              <Key className="h-4 w-4 text-purple-600" />
              <span>Answer Keys</span>
            </Link>
            <Link
              href="/category/scholarship"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100 hover:text-[var(--primary)] transition-colors min-h-[44px]"
            >
              <GraduationCap className="h-4 w-4 text-amber-600" />
              <span>Scholarships</span>
            </Link>
            <Link
              href="/category/internship"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100 hover:text-[var(--primary)] transition-colors min-h-[44px]"
            >
              <Sparkles className="h-4 w-4 text-pink-600" />
              <span>Internships</span>
            </Link>
            <Link
              href="/category/apprenticeship"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100 hover:text-[var(--primary)] transition-colors min-h-[44px]"
            >
              <Users className="h-4 w-4 text-indigo-600" />
              <span>Apprenticeships</span>
            </Link>
          </div>

          {/* Aspirant Community */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs">
              <MessageCircle className="h-4 w-4 text-emerald-600" />
              <span>WhatsApp Alerts</span>
            </div>
            <p className="text-[11px] text-emerald-700 leading-tight">
              Get instant notifications on new govt jobs and admit card releases.
            </p>
            <a
              href="https://whatsapp.com/channel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              Join WhatsApp Channel
            </a>
          </div>

          {/* Quick Links */}
          <div className="space-y-1 pt-2 border-t border-[var(--border)]">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Information
            </p>
            <Link
              href="/about"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <Info className="h-3.5 w-3.5" />
              <span>About NEXTVACANCY</span>
            </Link>
            <Link
              href="/contact"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Contact & Support</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

MobileNavigation.displayName = "MobileNavigation";
