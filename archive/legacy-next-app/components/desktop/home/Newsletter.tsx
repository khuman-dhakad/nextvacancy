import React from "react";
import { Container, Button } from "@/components/ui";
import { Mail, ArrowRight, BellRing, Sparkles, ShieldCheck } from "lucide-react";

export interface NewsletterProps {
  className?: string;
}

export const Newsletter: React.FC<NewsletterProps> = ({ className = "" }) => {
  return (
    <section
      aria-label="Recruitment Digest and Newsletter Subscription"
      className={[
        "py-16 bg-slate-50 border-b border-slate-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Container size="lg">
        <div className="bg-[#0B1D33] text-white rounded-2xl p-8 sm:p-12 lg:p-16 shadow-[0_20px_48px_rgb(15_39_68/0.2)] border border-[#28486B] relative overflow-hidden">

          <div className="relative max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 text-[#F59E0B] text-xs font-bold border border-amber-500/30">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Daily 8 AM Recruitment Digest</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Never Miss a Recruitment Update
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
                Subscribe to receive verified government job alerts, admit cards, exam schedules,
                and declared merit lists directly in your inbox. 100% free with zero spam.
              </p>
            </div>

            {/* Email Subscription Form */}
            <form
              action="/search"
              method="GET"
              role="search"
              aria-label="Subscribe to email recruitment digest"
              className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto pt-2"
            >
              <div className="relative flex-1">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address..."
                  aria-label="Enter your email address for recruitment updates"
                  className="w-full pl-12 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 bg-white border border-slate-300 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-[var(--primary)] min-h-[48px] font-medium"
                />
              </div>
              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="font-bold min-h-[48px] px-8 shadow-lg text-sm shrink-0 active:scale-[0.98] transition-transform bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl"
                rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
              >
                Subscribe Free
              </Button>
            </form>

            {/* Trust Bullet Strip */}
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400 font-medium pt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                <span>Zero Spam Guarantee</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <BellRing className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                <span>1-Click Unsubscribe Anytime</span>
              </span>
              <span>•</span>
              <span>Joined by 1.5M+ Aspirants</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

Newsletter.displayName = "Newsletter";
