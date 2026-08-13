import React from "react";
import { Container, Card, Button } from "@/components/ui";
import { MessageCircle, Send, BellRing, Sparkles, CheckCircle2 } from "lucide-react";

export interface CommunityCTAProps {
  className?: string;
}

export const CommunityCTA: React.FC<CommunityCTAProps> = ({
  className = "",
}) => {
  return (
    <section
      aria-label="Join NEXTVACANCY Community and Instant Alerts"
      className={["py-8 sm:py-12", className].filter(Boolean).join(" ")}
    >
      <Container size="lg">
        <Card className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)] via-[#15345a] to-[var(--primary)] text-white border-none shadow-xl rounded-3xl p-6 sm:p-10">
          {/* Subtle Glow Circle */}
          <div
            className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left Content */}
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Over 1,50,000+ Job Aspirants Connected</span>
              </div>

              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug">
                Never Miss a <span className="text-[#F59E0B]">Sarkari Naukri</span> or Exam Deadline
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Join our official WhatsApp and Telegram channels for instant real-time notifications on released admit cards, exam dates, answer keys, and newly published vacancies.
              </p>

              {/* Benefits Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200 pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Instant PDF notification downloads</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Daily morning recruitment digest</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Zero spam, 100% verified alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>State & Central job segregations</span>
                </div>
              </div>
            </div>

            {/* Right CTAs */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto lg:w-72 shrink-0">
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  variant="accent"
                  size="lg"
                  fullWidth
                  className="bg-[#25D366] hover:bg-[#1EBE5D] text-slate-950 font-black shadow-md min-h-[48px] text-xs sm:text-sm"
                  leftIcon={<MessageCircle className="h-4 w-4" />}
                >
                  Join WhatsApp Group
                </Button>
              </a>

              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  className="bg-[#229ED9] hover:bg-[#1B89BD] text-white font-bold shadow-md min-h-[48px] text-xs sm:text-sm"
                  leftIcon={<Send className="h-4 w-4" />}
                >
                  Join Telegram Channel
                </Button>
              </a>

              <div className="text-center pt-1">
                <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <BellRing className="h-3 w-3" />
                  <span>Free service • Cancel notifications anytime</span>
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </section>
  );
};

CommunityCTA.displayName = "CommunityCTA";
