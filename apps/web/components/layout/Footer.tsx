import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui";
import { ShieldCheck, MessageCircle, Send } from "lucide-react";

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      aria-label="Site Footer"
      className={["bg-[#0B1D33] text-slate-300 border-t border-[#183B66] text-xs", className]
        .filter(Boolean)
        .join(" ")}
    >
      {/* 1. Main Footer Navigation Links */}
      <div className="py-10 sm:py-12 border-b border-[#183B66]">
        <Container size="lg">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {/* Col 1: Brand & Bio */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-white text-[#0F2744] flex items-center justify-center font-black text-base shadow-xs">
                  N
                </div>
                <span className="text-lg font-black tracking-tight text-white">
                  NEXT<span className="text-[#D97706]">VACANCY</span>
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-sm">
                India&apos;s fast, reliable, and verified recruitment information portal.
                Providing authentic updates on government jobs, private careers, admit cards,
                and exam results for job seekers nationwide.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://whatsapp.com/channel/0029VaFzY400YKFh2ooNfA0H"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700/60 hover:bg-emerald-700 text-emerald-200 text-xs font-semibold transition-colors border border-emerald-600/50"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>WhatsApp Community</span>
                </a>
                <a
                  href="https://t.me/nextvacancy_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-700/60 hover:bg-sky-700 text-sky-200 text-xs font-semibold transition-colors border border-sky-600/50"
                >
                  <Send className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Telegram</span>
                </a>
              </div>
            </div>

            {/* Col 2: Major Job Categories */}
            <div className="space-y-3">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                Recruitments
              </p>
              <ul className="space-y-2 list-none p-0 m-0 text-slate-400">
                <li>
                  <Link href="/category/government" className="hover:text-white hover:underline transition-colors">
                    Government Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/category/private" className="hover:text-white hover:underline transition-colors">
                    Private & IT Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/category/railway" className="hover:text-white hover:underline transition-colors">
                    Railway Vacancies
                  </Link>
                </li>
                <li>
                  <Link href="/category/banking" className="hover:text-white hover:underline transition-colors">
                    Banking & IBPS
                  </Link>
                </li>
                <li>
                  <Link href="/category/defence" className="hover:text-white hover:underline transition-colors">
                    Defence & Police
                  </Link>
                </li>
                <li>
                  <Link href="/category/teaching" className="hover:text-white hover:underline transition-colors">
                    Teaching & TET
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Exam Updates */}
            <div className="space-y-3">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                Exam Corner
              </p>
              <ul className="space-y-2 list-none p-0 m-0 text-slate-400">
                <li>
                  <Link href="/category/admit-card" className="hover:text-white hover:underline transition-colors">
                    Admit Cards
                  </Link>
                </li>
                <li>
                  <Link href="/category/result" className="hover:text-white hover:underline transition-colors">
                    Results & Cut-Off
                  </Link>
                </li>
                <li>
                  <Link href="/category/answer-key" className="hover:text-white hover:underline transition-colors">
                    Answer Keys
                  </Link>
                </li>
                <li>
                  <Link href="/category/scholarship" className="hover:text-white hover:underline transition-colors">
                    Scholarships
                  </Link>
                </li>
                <li>
                  <Link href="/category/internship" className="hover:text-white hover:underline transition-colors">
                    Internship Schemes
                  </Link>
                </li>
                <li>
                  <Link href="/category/apprenticeship" className="hover:text-white hover:underline transition-colors">
                    Apprenticeships
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Legal & Information */}
            <div className="space-y-3">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                Legal & Support
              </p>
              <ul className="space-y-2 list-none p-0 m-0 text-slate-400">
                <li>
                  <Link href="/about" className="hover:text-white hover:underline transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white hover:underline transition-colors">
                    Contact & Grievances
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-white hover:underline transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white hover:underline transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="hover:text-white hover:underline transition-colors">
                    Official Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Official Government Disclaimer Banner */}
      <div className="py-5 bg-[#081525] border-b border-[#183B66]/80 text-[11px] text-slate-400 leading-relaxed">
        <Container size="lg">
          <div className="flex items-start gap-2.5 max-w-5xl mx-auto">
            <ShieldCheck className="h-4 w-4 text-[#D97706] shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              <strong className="text-slate-200">Legal Disclaimer:</strong> NEXTVACANCY is an independent educational and career information platform. We are not associated, affiliated, endorsed by, or in any way officially connected with the Government of India, State Governments, or any recruitment commission/body (UPSC, SSC, NTA, State PSCs, etc.). All notification details, vacancies, dates, and fees are compiled from official department gazettes and websites for public awareness.
            </p>
          </div>
        </Container>
      </div>

      {/* 3. Copyright Bar */}
      <div className="py-4 bg-[#050E1A] text-[11px] text-slate-500">
        <Container size="lg" className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p>© {currentYear} NEXTVACANCY. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/privacy-policy" className="hover:text-white hover:underline">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white hover:underline">
              Terms
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white hover:underline">
              Help
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";
