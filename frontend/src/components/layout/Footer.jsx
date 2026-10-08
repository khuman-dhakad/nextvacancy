import { useState } from "react";
import { Briefcase, Building2, CheckCircle2, ChevronDown, Globe, Mail, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const [openSection, setOpenSection] = useState(null);

  function toggleSection(section) {
    setOpenSection((current) => (current === section ? null : section));
  }

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      {/* Top Value / Trust Highlights */}
      <div className="border-b border-slate-100 bg-slate-50/70">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-800">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">100% Verified Notices</h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Every vacancy posting is cross-referenced with gazettes and official commission circulars.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100/80 text-rose-900">
              <Globe size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Direct Official Links</h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Direct URLs to official application servers, admit card portals, and PDF notifications.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100/80 text-blue-900">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recruitment Directory</h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Normalized authorities covering UPSC, SSC, Banking, Railways, Defence, and State PSCs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-black text-slate-950">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-900 text-white">
                <Briefcase size={16} />
              </span>
              <span>
                NEXT<span className="text-rose-900">VACANCY</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-500">
              Your comprehensive portal for verified government recruitment (Sarkari Naukri), private careers, admit cards, exam schedules, and merit list results.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Mail size={14} className="text-slate-400" />
              <span>support@nextvacancy.com</span>
            </div>
          </div>

          {/* Col 2: Opportunities Accordion */}
          <div className="border-b border-slate-100 sm:border-0">
            <button
              type="button"
              onClick={() => toggleSection("opportunities")}
              className="flex min-h-[44px] w-full items-center justify-between py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-900 sm:min-h-0 sm:cursor-default sm:pointer-events-none sm:py-0"
              aria-expanded={openSection === "opportunities"}
              aria-controls="footer-opportunities-list"
            >
              <span>Opportunities</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 sm:hidden ${
                  openSection === "opportunities" ? "rotate-180 text-rose-900" : "text-slate-400"
                }`}
                aria-hidden="true"
              />
            </button>
            <ul
              id="footer-opportunities-list"
              className={`space-y-2.5 text-xs pb-3 pt-1 sm:pb-0 sm:pt-3 sm:space-y-2 ${
                openSection === "opportunities" ? "block" : "hidden sm:block"
              }`}
            >
              <li>
                <Link to="/government-jobs" className="hover:text-rose-900 transition-colors">Government Jobs</Link>
              </li>
              <li>
                <Link to="/private-jobs" className="hover:text-rose-900 transition-colors">Private Sector &amp; Tech</Link>
              </li>
              <li>
                <Link to="/admit-cards" className="hover:text-rose-900 transition-colors">Admit Cards &amp; Hall Tickets</Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-rose-900 transition-colors">Results &amp; Merit Lists</Link>
              </li>
              <li>
                <Link to="/organizations" className="hover:text-rose-900 transition-colors">Recruiting Authorities</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-rose-900 transition-colors">Search Vacancies</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Authorities Accordion */}
          <div className="border-b border-slate-100 sm:border-0">
            <button
              type="button"
              onClick={() => toggleSection("authorities")}
              className="flex min-h-[44px] w-full items-center justify-between py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-900 sm:min-h-0 sm:cursor-default sm:pointer-events-none sm:py-0"
              aria-expanded={openSection === "authorities"}
              aria-controls="footer-authorities-list"
            >
              <span>Authorities</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 sm:hidden ${
                  openSection === "authorities" ? "rotate-180 text-rose-900" : "text-slate-400"
                }`}
                aria-hidden="true"
              />
            </button>
            <ul
              id="footer-authorities-list"
              className={`space-y-2.5 text-xs pb-3 pt-1 sm:pb-0 sm:pt-3 sm:space-y-2 ${
                openSection === "authorities" ? "block" : "hidden sm:block"
              }`}
            >
              <li>
                <Link to="/organizations/ssc" className="hover:text-rose-900 transition-colors">Staff Selection (SSC)</Link>
              </li>
              <li>
                <Link to="/organizations/upsc" className="hover:text-rose-900 transition-colors">Union Public Service (UPSC)</Link>
              </li>
              <li>
                <Link to="/organizations/rrb" className="hover:text-rose-900 transition-colors">Railway Recruitment (RRB)</Link>
              </li>
              <li>
                <Link to="/organizations/ibps" className="hover:text-rose-900 transition-colors">Banking Institute (IBPS)</Link>
              </li>
              <li>
                <Link to="/organizations" className="hover:text-rose-900 transition-colors">All 50+ Commissions →</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Legal Accordion */}
          <div className="border-b border-slate-100 sm:border-0">
            <button
              type="button"
              onClick={() => toggleSection("company")}
              className="flex min-h-[44px] w-full items-center justify-between py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-900 sm:min-h-0 sm:cursor-default sm:pointer-events-none sm:py-0"
              aria-expanded={openSection === "company"}
              aria-controls="footer-company-list"
            >
              <span>Company &amp; Legal</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 sm:hidden ${
                  openSection === "company" ? "rotate-180 text-rose-900" : "text-slate-400"
                }`}
                aria-hidden="true"
              />
            </button>
            <ul
              id="footer-company-list"
              className={`space-y-2.5 text-xs pb-3 pt-1 sm:pb-0 sm:pt-3 sm:space-y-2 ${
                openSection === "company" ? "block" : "hidden sm:block"
              }`}
            >
              <li>
                <Link to="/about" className="hover:text-rose-900 transition-colors">About NextVacancy</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-rose-900 transition-colors">Contact &amp; Grievance</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-rose-900 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-rose-900 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-rose-900 transition-colors">Disclaimer</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="mt-8 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 text-xs leading-relaxed text-amber-950 sm:mt-10">
          <div className="flex items-start gap-2.5">
            <ShieldAlert size={16} className="mt-0.5 shrink-0 text-amber-700" />
            <div>
              <span className="font-bold">Disclaimer:</span> NextVacancy is an independent public information portal. We are not affiliated with, sponsored by, or endorsed by any government agency, public sector undertaking, or commission. Job notices are curated for aspirant convenience; always confirm details on the respective official authority portal before applying.
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:mt-8 sm:flex-row">
          <p>© {new Date().getFullYear()} NextVacancy. All rights reserved.</p>
          <p>Verified opportunities. Clear next steps.</p>
        </div>
      </div>
    </footer>
  );
}
