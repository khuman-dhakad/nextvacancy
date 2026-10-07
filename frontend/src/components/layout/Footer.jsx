import { Briefcase, Building2, CheckCircle2, Globe, Mail, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
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
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
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

          {/* Col 2: Opportunities */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Opportunities</h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link to="/government-jobs" className="hover:text-rose-900">Government Jobs</Link>
              </li>
              <li>
                <Link to="/private-jobs" className="hover:text-rose-900">Private Sector &amp; Tech</Link>
              </li>
              <li>
                <Link to="/admit-cards" className="hover:text-rose-900">Admit Cards &amp; Hall Tickets</Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-rose-900">Results &amp; Merit Lists</Link>
              </li>
              <li>
                <Link to="/organizations" className="hover:text-rose-900">Recruiting Authorities</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-rose-900">Search Vacancies</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Authorities */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Authorities</h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link to="/organizations/ssc" className="hover:text-rose-900">Staff Selection (SSC)</Link>
              </li>
              <li>
                <Link to="/organizations/upsc" className="hover:text-rose-900">Union Public Service (UPSC)</Link>
              </li>
              <li>
                <Link to="/organizations/rrb" className="hover:text-rose-900">Railway Recruitment (RRB)</Link>
              </li>
              <li>
                <Link to="/organizations/ibps" className="hover:text-rose-900">Banking Institute (IBPS)</Link>
              </li>
              <li>
                <Link to="/organizations" className="hover:text-rose-900">All 50+ Commissions →</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Legal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Company &amp; Legal</h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-rose-900">About NextVacancy</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-rose-900">Contact &amp; Grievance</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-rose-900">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-rose-900">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-rose-900">Disclaimer</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="mt-10 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 text-xs leading-relaxed text-amber-950">
          <div className="flex items-start gap-2.5">
            <ShieldAlert size={16} className="mt-0.5 shrink-0 text-amber-700" />
            <div>
              <span className="font-bold">Disclaimer:</span> NextVacancy is an independent public information portal. We are not affiliated with, sponsored by, or endorsed by any government agency, public sector undertaking, or commission. Job notices are curated for aspirant convenience; always confirm details on the respective official authority portal before applying.
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} NextVacancy. All rights reserved.</p>
          <p>Verified opportunities. Clear next steps.</p>
        </div>
      </div>
    </footer>
  );
}
