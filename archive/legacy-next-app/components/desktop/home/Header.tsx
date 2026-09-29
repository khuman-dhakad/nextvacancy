import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Container, Button } from "@/components/ui";

export interface HeaderProps {
  className?: string;
  activePath?: string;
}

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Govt Jobs", href: "/category/government" },
  { label: "Private Jobs", href: "/category/private" },
  { label: "Admit Cards", href: "/category/admit-card" },
  { label: "Results", href: "/category/result" },
  { label: "Answer Keys", href: "/category/answer-key" },
  { label: "Scholarships", href: "/category/scholarship" },
  { label: "Internships", href: "/category/internship" },
];

export const Header: React.FC<HeaderProps> = ({
  className = "",
  activePath = "/",
}) => {
  return (
    <header
      className={[
        "sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs select-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
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
            <span className="text-[10px] font-bold text-slate-600 tracking-widest uppercase mt-1">
              Careers &amp; Exams Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Main Header Navigation"
          className="hidden lg:flex items-center gap-1 xl:gap-2"
        >
          {NAV_LINKS.map((item) => {
            const isActive = activePath === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "relative px-3 py-2 text-[13px] xl:text-sm font-bold transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-md",
                  isActive
                    ? "text-[#0F172A]"
                    : "text-slate-600 hover:text-[#0F172A]",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span
                    className="absolute bottom-[-14px] left-2 right-2 h-[3px] bg-[#F59E0B] rounded-full"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Search Shortcut & Sign In CTA */}
        <div className="flex items-center gap-3">
          <Link href="/search" aria-label="Search all recruitments">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-[var(--primary)] hover:border-slate-300 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] cursor-pointer text-xs font-semibold"
              aria-label="Quick search recruitments (Ctrl+K)"
            >
              <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
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
        </div>
      </Container>
    </header>
  );
};

Header.displayName = "Header";
