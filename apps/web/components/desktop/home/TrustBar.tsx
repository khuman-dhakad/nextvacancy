import React from "react";
import {
  CheckCircle2,
  ShieldCheck,
  Award,
  MessageCircle,
  Send,
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
        "w-full bg-[#07172B] text-slate-300 text-xs font-medium py-1.5 border-b border-slate-800/90 select-none overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Container size="lg" className="flex items-center justify-between gap-4 min-w-0">
        {/* Left Trust Indicators — hide progressively on narrow screens */}
        <div className="flex items-center gap-4 min-w-0 overflow-hidden">
          <span className="flex items-center gap-1.5 text-slate-200 font-semibold shrink-0">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
            <span className="hidden xs:inline">Trusted by 1M+ Aspirants</span>
            <span className="xs:hidden">1M+ Trusted</span>
          </span>
          <span className="hidden sm:flex items-center gap-1.5 text-slate-200 font-semibold shrink-0">
            <ShieldCheck className="h-3.5 w-3.5 text-sky-400 shrink-0" aria-hidden="true" />
            <span>100% Authentic Updates</span>
          </span>
          <span className="hidden lg:flex items-center gap-1.5 text-amber-300/90 font-semibold shrink-0">
            <Award className="h-3.5 w-3.5 text-[#F59E0B] shrink-0" aria-hidden="true" />
            <span>Gazette Verified Circulars</span>
          </span>
        </div>

        {/* Right Social Direct Alerts — always visible */}
        <div className="flex items-center gap-4 shrink-0 text-xs font-bold">
          <a
            href="https://whatsapp.com/channel/0029VaFzY400YKFh2ooNfA0H"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors focus-visible:outline-none focus-visible:underline"
            aria-label="Join WhatsApp recruitment alert channel"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">WhatsApp Alerts</span>
          </a>
          <span className="text-slate-600 shrink-0" aria-hidden="true">•</span>
          <a
            href="https://t.me/nextvacancy_official"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors focus-visible:outline-none focus-visible:underline"
            aria-label="Join Telegram channel for instant exam circulars"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Telegram</span>
          </a>
        </div>
      </Container>
    </div>
  );
};

TrustBar.displayName = "TrustBar";
