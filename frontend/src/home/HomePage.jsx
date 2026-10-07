import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Landmark,
  Layers,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiGet } from "../api.js";

function JobCard({ job }) {
  const isGovt = job.category === "government";
  const isAdmit = job.status === "ADMIT_CARD_OUT";
  const isResult = job.status === "RESULT_OUT";

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md">
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-700">
            {job.category}
          </span>
          {job.isVerified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
              <CheckCircle2 size={12} /> Verified
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mt-3 text-base font-bold leading-snug text-slate-900 group-hover:text-rose-900">
          <Link to={`/jobs/${encodeURIComponent(job.slug)}`} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {job.title}
          </Link>
        </h3>

        {/* Organization & Location */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 font-medium text-slate-700">
            <Building2 size={13} className="text-slate-400" />
            {job.organization}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-500">
            <MapPin size={13} className="text-slate-400" />
            {job.location}
          </span>
        </div>

        {/* Short Summary */}
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600">
          {job.shortSummary}
        </p>
      </div>

      {/* Footer Metrics */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <div className="font-semibold text-slate-800">
          <span className="text-slate-500 font-normal">Vacancies:</span> {job.totalVacancies}
        </div>
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 font-bold ${
            isAdmit
              ? "bg-amber-50 text-amber-800"
              : isResult
              ? "bg-blue-50 text-blue-800"
              : job.status === "ENDING_SOON"
              ? "bg-rose-50 text-rose-800"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {job.status.replaceAll("_", " ").toLowerCase()}
        </span>
      </div>
    </article>
  );
}

const quickCategoryPills = [
  { label: "All Openings", path: "/" },
  { label: "Central Govt", path: "/government-jobs" },
  { label: "State PSC", path: "/category/state-psc" },
  { label: "Banking & Finance", path: "/category/banking" },
  { label: "Railways (RRB)", path: "/category/railway" },
  { label: "Defence & Police", path: "/category/defence" },
  { label: "Admit Cards", path: "/admit-cards" },
  { label: "Exam Results", path: "/results" },
];

export function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // Active Tab for Opportunity Showcase
  const [activeTab, setActiveTab] = useState("all");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [categoryList, orgList, jobPage] = await Promise.all([
        apiGet("/api/v1/categories").catch(() => []),
        apiGet("/api/v1/organizations").catch(() => []),
        apiGet("/api/v1/jobs", { page: 0, size: 12, sort: "latest" }).catch(() => ({ content: [] })),
      ]);
      setCategories(Array.isArray(categoryList) ? categoryList : []);
      setOrganizations(Array.isArray(orgList) ? orgList : []);
      setLatestJobs(Array.isArray(jobPage?.content) ? jobPage.content : []);
    } catch (failure) {
      setError(failure.message || "Unable to load current opportunities.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter jobs based on active tab
  const displayedJobs = useMemo(() => {
    if (activeTab === "government") {
      return latestJobs.filter((job) => job.category === "government");
    }
    if (activeTab === "private") {
      return latestJobs.filter((job) => job.category === "private");
    }
    if (activeTab === "admit-card") {
      return latestJobs.filter((job) => job.status === "ADMIT_CARD_OUT" || job.category === "admit-card");
    }
    if (activeTab === "results") {
      return latestJobs.filter((job) => job.status === "RESULT_OUT" || job.category === "result");
    }
    return latestJobs;
  }, [activeTab, latestJobs]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (searchCategory) params.set("category", searchCategory);
    if (searchLocation.trim()) params.set("location", searchLocation.trim());
    navigate(`/search?${params.toString()}`);
  }

  return (
    <main className="space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-linear-to-b from-slate-900 via-[#1e1b4b] to-slate-950 px-4 pt-14 pb-20 text-white sm:px-6 sm:pt-20 sm:pb-28 lg:px-8">
        {/* Subtle background glow effect */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 -z-0 h-96 w-full -translate-x-1/2 transform bg-rose-600/15 blur-[120px]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-bold text-rose-300 backdrop-blur-md">
            <Sparkles size={13} className="text-rose-400" />
            <span>Official 2026 Recruitment &amp; Notification Portal</span>
          </div>

          {/* Headline */}
          <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find verified vacancies, exam dates &amp; clear next steps.
          </h1>

          {/* Supporting Copy */}
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Cross-referenced gazette circulars, recruitment board updates, admit cards, and merit lists from 50+ central &amp; state commissions.
          </p>

          {/* Interactive Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="mx-auto mt-8 max-w-4xl rounded-2xl border border-slate-700/80 bg-slate-900/90 p-2.5 shadow-2xl backdrop-blur-xl sm:p-3"
          >
            <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-[1fr_200px_160px_auto]">
              {/* Keyword */}
              <div className="relative flex items-center">
                <Search size={17} className="absolute left-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Job title, organization, or qualification..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-3 pr-4 pl-10 text-xs font-medium text-white placeholder-slate-400 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 sm:text-sm"
                />
              </div>

              {/* Category */}
              <div className="relative flex items-center">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-3 text-xs font-medium text-white outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 sm:text-sm"
                  aria-label="Filter by category"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug} className="bg-slate-900 text-white">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="relative flex items-center">
                <MapPin size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Location / State"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-3 pr-4 pl-10 text-xs font-medium text-white placeholder-slate-400 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 sm:text-sm"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-rose-700 px-6 py-3 text-xs font-bold text-white shadow-md transition hover:bg-rose-600 sm:text-sm"
              >
                <span>Search</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </form>

          {/* Quick Pill Filter Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Popular:</span>
            {quickCategoryPills.map((pill) => (
              <Link
                key={pill.label}
                to={pill.path}
                className="rounded-full border border-slate-700/80 bg-slate-800/60 px-3 py-1 text-xs font-semibold text-slate-200 backdrop-blur-xs transition hover:border-slate-500 hover:bg-slate-700 hover:text-white"
              >
                {pill.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME PLATFORM STATISTICS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-900">
              <Briefcase size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{latestJobs.length ? `${latestJobs.length}+` : "Active"}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Vacancies</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
              <Building2 size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{organizations.length ? `${organizations.length}` : "50+"}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Recruiting Bodies</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">100%</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Gazette Verified</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-800">
              <Layers size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{categories.length ? `${categories.length}` : "10"}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Curated Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY HUBS DISCOVERY GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-rose-800">Discovery Hub</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">Explore by Opportunity Category</h2>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-900 hover:underline"
          >
            <span>View all categories</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${encodeURIComponent(cat.slug)}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs transition hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-900 group-hover:bg-rose-900 group-hover:text-white transition-colors">
                  <GraduationCap size={20} />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-rose-900">{cat.name}</h3>
                {cat.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{cat.description}</p>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-rose-900">
                <span>{cat.jobCount || 0} active drives</span>
                <ArrowRight size={13} className="transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. OPPORTUNITY SHOWCASE TABS & CARDS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-rose-800">Recruitment Feed</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">Latest Verified Notifications</h2>
          </div>

          {/* Segmented Filter Tabs */}
          <div className="flex gap-1.5 overflow-x-auto rounded-xl border border-slate-200 bg-slate-100 p-1">
            {[
              { key: "all", label: "All Drives" },
              { key: "government", label: "Government" },
              { key: "private", label: "Private & Tech" },
              { key: "admit-card", label: "Admit Cards" },
              { key: "results", label: "Results" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === tab.key
                    ? "bg-white text-slate-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="mt-6">
          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-900">
              <p className="font-bold">Unable to load vacancies</p>
              <p className="mt-1 text-xs">{error}</p>
              <button
                onClick={loadData}
                className="mt-3 text-xs font-bold underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          ) : loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading opportunities">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : displayedJobs.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <Briefcase size={36} className="mx-auto text-slate-300" />
              <h3 className="mt-3 text-base font-bold text-slate-800">No vacancies in this tab</h3>
              <p className="mt-1 text-xs text-slate-500">Check back shortly or view all vacancies.</p>
              <Link
                to="/search"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white"
              >
                Search All Openings
              </Link>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-xs font-bold text-slate-800 shadow-2xs transition hover:border-slate-400 hover:bg-slate-50"
          >
            <span>Browse All {latestJobs.length}+ Vacancies &amp; Exams</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* 5. FEATURED RECRUITING AUTHORITIES SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/90 bg-linear-to-br from-slate-900 to-[#0F2744] p-6 text-white sm:p-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-300">National Directory</p>
              <h2 className="mt-1 text-2xl font-black sm:text-3xl">Recruitment Authorities &amp; Commissions</h2>
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
                Direct access to examination calendars, pattern documents, and official career portals.
              </p>
            </div>
            <Link
              to="/organizations"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-xs transition hover:bg-white/20"
            >
              <span>Explore All Commissions</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {organizations.slice(0, 6).map((org) => (
              <Link
                key={org.id}
                to={`/organizations/${encodeURIComponent(org.slug)}`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-700/80 bg-slate-800/60 p-5 backdrop-blur-xs transition hover:border-amber-400/50 hover:bg-slate-800"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-amber-400/10 px-2 py-0.5 font-mono text-xs font-bold text-amber-300">
                      {org.shortName}
                    </span>
                    {org.categoryType && (
                      <span className="text-[11px] font-semibold text-slate-400">
                        {org.categoryType}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {org.name}
                  </h3>
                  {org.tagline && (
                    <p className="mt-1 line-clamp-2 text-xs text-slate-400">{org.tagline}</p>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-700/60 pt-3 text-xs">
                  <span className="font-semibold text-emerald-400">
                    {org.stats?.activeVacanciesCount || 0} active drives
                  </span>
                  <span className="font-bold text-slate-300 group-hover:text-white">
                    View Portal →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TRUST & VERIFICATION EDITORIAL SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">Official Gazette Cross-Check</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Every job posting on NextVacancy is vetted against official gazette notifications, central employment news, and state recruitment releases.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-900">
              <ExternalLink size={20} />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">Direct Official Links Only</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              We never hide application links behind paywalls or intermediary ad walls. You receive direct links to official commission portals.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-800">
              <Bell size={20} />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">Lifecycle Milestone Alerts</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Track vacancies from initial announcement through online application deadlines, admit card releases, exam dates, and final merit results.
            </p>
          </div>
        </div>
      </section>

      {/* 7. CANDIDATE REGISTRATION CTA BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-rose-200 bg-linear-to-r from-rose-900 via-rose-800 to-slate-900 p-8 text-white shadow-xl sm:p-12">
          <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-rose-200">Candidate Experience</p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                Never Miss a Recruitment Deadline
              </h2>
              <p className="mt-2 max-w-xl text-xs leading-relaxed text-rose-100 sm:text-sm">
                Create a free candidate account to bookmark vacancies, track application stages, and configure real-time alerts.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="rounded-xl bg-white px-6 py-3 text-xs font-bold text-rose-950 shadow-md transition hover:bg-slate-100"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-xs font-bold text-white backdrop-blur-xs transition hover:bg-white/20"
              >
                Candidate Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
