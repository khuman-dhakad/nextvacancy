import React from "react";
import {
  CheckCircle2,
  ShieldCheck,
  Award,
  MessageCircle,
  Send,
  UserCheck,
} from "lucide-react";
import { Container } from "@/components/ui";

export interface TrustBarProps {
  className?: string;
}

export const TrustBar: React.FC<TrustBarProps> = ({ className = "" }) => {
  return (
    <div
      aria-label="Trust and Verification Bar"
      className={[
        "w-full bg-[#07172B] text-slate-300 text-xs font-medium py-2 border-b border-slate-800/90 select-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Container size="lg" className="flex items-center justify-between">
        {/* Left Trust Indicators */}
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>Trusted by 1M+ Aspirants</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 text-sky-400 shrink-0" aria-hidden="true" />
            <span>100% Authentic Updates</span>
          </span>
          <span className="hidden lg:flex items-center gap-1.5 text-amber-300/90 font-semibold">
            <Award className="h-3.5 w-3.5 text-[#F59E0B] shrink-0" aria-hidden="true" />
            <span>Gazette Verified Circulars</span>
          </span>
          <span className="hidden xl:flex items-center gap-1.5 text-slate-300">
            <UserCheck className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span>No Registration Required to View Jobs</span>
          </span>
        </div>

        {/* Right Social Direct Alerts */}
        <div className="flex items-center gap-5 shrink-0 text-xs font-bold">
          <a
            href="https://whatsapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors focus-visible:outline-none focus-visible:underline"
            aria-label="Join WhatsApp recruitment alert channel"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>WhatsApp Alerts</span>
          </a>
          <span className="text-slate-600">•</span>
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors focus-visible:outline-none focus-visible:underline"
            aria-label="Join Telegram channel for instant exam circulars"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Telegram Updates</span>
          </a>
        </div>
      </Container>
    </div>
  );
};

TrustBar.displayName = "TrustBar";
