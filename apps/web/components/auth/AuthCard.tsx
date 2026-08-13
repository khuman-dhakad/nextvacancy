import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui";
import { Building2, ShieldCheck } from "lucide-react";

export interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  children,
  footer,
  className = "",
}) => {
  return (
    <div
      className={[
        "w-full max-w-md mx-auto space-y-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-lg p-1"
          aria-label="NEXTVACANCY Home"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center font-black shadow-md">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">
            NEXT<span className="text-[var(--accent)]">VACANCY</span>
          </span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Main Card */}
      <Card className="bg-white border border-[var(--border)] shadow-xl rounded-3xl p-6 sm:p-8">
        <CardContent className="p-0 space-y-5">
          {children}
        </CardContent>
      </Card>

      {/* Optional Footer Links */}
      {footer && <div className="text-center text-xs text-slate-500">{footer}</div>}

      {/* Trust & Security Badge */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
        <span>End-to-End Encrypted & Verified Recruitment Portal</span>
      </div>
    </div>
  );
};

AuthCard.displayName = "AuthCard";
