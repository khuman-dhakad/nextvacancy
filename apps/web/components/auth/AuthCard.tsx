import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui";
import {
  ShieldCheck,
  CheckCircle2,
  BellRing,
  Award,
  Zap,
} from "lucide-react";

export interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  /** Shown in the left trust panel on desktop — defaults to 3 recruitment benefits */
  trustPoints?: Array<{ icon: React.ComponentType<{ className?: string }>; text: string }>;
}

const DEFAULT_TRUST_POINTS: AuthCardProps["trustPoints"] = [
  {
    icon: ShieldCheck,
    text: "100% Gazette-verified recruitment circulars — zero clickbait",
  },
  {
    icon: BellRing,
    text: "Instant alerts when admit cards, results & answer keys are released",
  },
  {
    icon: Award,
    text: "Track 54,000+ active government & private job notifications",
  },
  {
    icon: Zap,
    text: "Free forever — no paywall, no premium plan required",
  },
];

export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  children,
  footer,
  className = "",
  trustPoints = DEFAULT_TRUST_POINTS,
}) => {
  return (
    <div className={["w-full max-w-5xl mx-auto", className].filter(Boolean).join(" ")}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 shadow-2xl rounded-3xl overflow-hidden border border-slate-200/80">

        {/* ─── Left Panel — Brand & Trust (Desktop Only) ─── */}
        <div
          className="hidden lg:flex flex-col justify-between p-10 text-white relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #061527 0%, #0F2744 55%, #0E294B 100%)",
          }}
        >
          {/* Ambient background glow */}
          <div
            className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/8 rounded-full blur-2xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Parliament SVG watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none" aria-hidden="true">
            <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-white">
              <path d="M160 12L160 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="160" cy="12" r="3" fill="currentColor" />
              <path d="M133 57 C133 30 187 30 187 57 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <rect x="130" y="57" width="60" height="7" stroke="currentColor" strokeWidth="1.5" rx="1" />
              <g stroke="currentColor" strokeWidth="1.2">
                <line x1="140" y1="64" x2="140" y2="130" />
                <line x1="150" y1="64" x2="150" y2="130" />
                <line x1="160" y1="64" x2="160" y2="130" />
                <line x1="170" y1="64" x2="170" y2="130" />
                <line x1="180" y1="64" x2="180" y2="130" />
              </g>
              <rect x="30" y="90" width="100" height="5" stroke="currentColor" strokeWidth="1.2" />
              <g stroke="currentColor" strokeWidth="1">
                <line x1="40" y1="95" x2="40" y2="130" />
                <line x1="55" y1="95" x2="55" y2="130" />
                <line x1="70" y1="95" x2="70" y2="130" />
                <line x1="85" y1="95" x2="85" y2="130" />
                <line x1="100" y1="95" x2="100" y2="130" />
                <line x1="115" y1="95" x2="115" y2="130" />
              </g>
              <rect x="190" y="90" width="100" height="5" stroke="currentColor" strokeWidth="1.2" />
              <g stroke="currentColor" strokeWidth="1">
                <line x1="200" y1="95" x2="200" y2="130" />
                <line x1="215" y1="95" x2="215" y2="130" />
                <line x1="230" y1="95" x2="230" y2="130" />
                <line x1="245" y1="95" x2="245" y2="130" />
                <line x1="260" y1="95" x2="260" y2="130" />
                <line x1="275" y1="95" x2="275" y2="130" />
              </g>
              <rect x="10" y="130" width="300" height="5" stroke="currentColor" strokeWidth="1.5" />
              <line x1="0" y1="135" x2="320" y2="135" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          {/* Brand Logo */}
          <div className="relative">
            <Link href="/" aria-label="NEXTVACANCY Home" className="inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-xl">
              <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center font-black text-xl shadow-md">
                N
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white block leading-none">
                  NEXT<span className="text-[#F59E0B]">VACANCY</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5 block">
                  Careers &amp; Exams Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Hero Text */}
          <div className="relative space-y-3 my-8">
            <h2 className="text-2xl font-black text-white tracking-tight leading-snug">
              India&apos;s Most Trusted<br />
              <span className="text-[#F59E0B]">Recruitment Portal</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xs">
              Authentic, gazette-verified circulars for 54,000+ government &amp; private opportunities across India.
            </p>
          </div>

          {/* Trust Points */}
          <ul className="relative space-y-3.5">
            {trustPoints?.map((point, idx) => {
              const Icon = point.icon;
              return (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
                  </div>
                  <span className="leading-snug">{point.text}</span>
                </li>
              );
            })}
          </ul>

          {/* Bottom badge */}
          <div className="relative mt-8 flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <span>End-to-End Encrypted &amp; Verified Platform</span>
          </div>
        </div>

        {/* ─── Right Panel — Auth Form ─── */}
        <div className="bg-white flex flex-col justify-center p-8 sm:p-10">
          {/* Mobile-only logo */}
          <div className="flex justify-center mb-6 lg:hidden">
            <Link href="/" aria-label="NEXTVACANCY Home" className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center font-black text-xl shadow-sm">
                N
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                NEXT<span className="text-[var(--accent)]">VACANCY</span>
              </span>
            </Link>
          </div>

          <div className="space-y-1.5 mb-7">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              {subtitle}
            </p>
          </div>

          <Card className="border-0 shadow-none">
            <CardContent className="p-0 space-y-5">
              {children}
            </CardContent>
          </Card>

          {footer && (
            <div className="mt-6 text-center text-xs text-slate-500">
              {footer}
            </div>
          )}

          {/* Trust Badge — mobile only */}
          <div className="flex items-center justify-center gap-1.5 mt-5 text-[11px] text-slate-400 lg:hidden">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            <span>Gazette Verified &amp; 100% Free Recruitment Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

AuthCard.displayName = "AuthCard";
