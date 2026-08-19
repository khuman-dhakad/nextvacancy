import React from "react";
import { Container, Card, Button } from "@/components/ui";
import { MessageCircle, Send, Users, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

export interface CommunityCTAProps {
  className?: string;
}

export const CommunityCTA: React.FC<CommunityCTAProps> = ({ className = "" }) => {
  return (
    <section
      aria-label="Join Aspirants Community"
      className={["py-16 bg-white border-b border-slate-200", className]
        .filter(Boolean)
        .join(" ")}
    >
      <Container size="lg" className="space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-[var(--primary)] text-xs font-bold border border-blue-200/80">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
            <span>Join 1.5 Million+ Indian Aspirants</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Get Instant Alerts on WhatsApp &amp; Telegram
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Direct notification bulletins, official Gazette PDF downloads, exam date changes, and
            scorecard releases delivered instantly to your device.
          </p>
        </div>

        {/* 2-Column Channel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* WhatsApp Channel Card */}
          <Card className="bg-gradient-to-br from-emerald-950 via-[#062419] to-[#041B13] text-white p-7 sm:p-8 rounded-3xl border border-emerald-800/80 shadow-md flex flex-col justify-between space-y-6 group hover:border-emerald-500 transition-all duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <MessageCircle className="h-6 w-6" aria-hidden="true" />
                </div>
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-700/60 font-mono">
                  850K+ Subscribers
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-white tracking-tight">
                  Official WhatsApp Channel
                </h3>
                <p className="text-xs text-emerald-200/80 leading-relaxed font-medium">
                  Real-time breaking recruitment notices, syllabus PDFs, and urgent registration
                  deadline reminders.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-emerald-300/80 font-semibold">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <span>Zero Spam • Direct Official Circulars</span>
              </div>

              <a
                href="https://whatsapp.com/channel/0029VaFzY400YKFh2ooNfA0H"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl min-h-[46px] shadow-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>Join WhatsApp Channel</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              </a>
            </div>
          </Card>

          {/* Telegram Channel Card */}
          <Card className="bg-gradient-to-br from-[#08223D] via-[#0B2E52] to-[#0E3A66] text-white p-7 sm:p-8 rounded-3xl border border-sky-800/80 shadow-md flex flex-col justify-between space-y-6 group hover:border-sky-500 transition-all duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
                  <Send className="h-6 w-6" aria-hidden="true" />
                </div>
                <span className="text-[11px] font-bold text-sky-300 bg-sky-900/60 px-3 py-1 rounded-full border border-sky-700/60 font-mono">
                  650K+ Members
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-white tracking-tight">
                  Official Telegram Group
                </h3>
                <p className="text-xs text-sky-200/80 leading-relaxed font-medium">
                  Fastest admit card download links, answer keys, objection trackers, and cut-off
                  merit analysis PDFs.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-sky-300/80 font-semibold">
                <Users className="h-4 w-4 text-sky-400 shrink-0" aria-hidden="true" />
                <span>Instant Push Alerts • 100% Free Access</span>
              </div>

              <a
                href="https://t.me/nextvacancy_official"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl min-h-[46px] shadow-sm flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  <span>Join Telegram Channel</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
};

CommunityCTA.displayName = "CommunityCTA";
