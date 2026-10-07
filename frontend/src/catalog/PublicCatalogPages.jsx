import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  Filter,
  GraduationCap,
  HelpCircle,
  IndianRupee,
  Layers,
  MapPin,
  RotateCcw,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { apiGet, apiRequest } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

const catalogs = {
  home: {
    title: "All Recruitment Vacancies",
    description: "Browse current vacancies, check eligibility criteria, syllabus, and application deadlines across government and private sectors.",
    category: "",
  },
  search: {
    title: "Search All Vacancies & Exams",
    description: "Find verified recruitment notifications by role, authority, educational qualification, and location.",
    category: "",
  },
  results: {
    title: "Exam Results, Merit Lists & Cut-Offs 2026",
    description: "Check official scorecards, qualifying cut-off marks, scorecard download links, and final selection lists.",
    category: "result",
  },
  government: {
    title: "Government Jobs (Sarkari Naukri) 2026",
    description: "Central and state government recruitment circulars, civil services, defence, police, and public sector drives.",
    category: "government",
  },
  private: {
    title: "Private Sector Jobs & Tech Careers",
    description: "Corporate recruitment drives, technology roles, banking careers, and graduate trainee positions.",
    category: "private",
  },
  admitCards: {
    title: "Admit Cards, Hall Tickets & Exam City Slips",
    description: "Download official examination hall tickets, computer-based test (CBT) entry passes, and city intimation slips.",
    category: "admit-card",
  },
};

const catalogPaths = {
  home: "/",
  government: "/government-jobs",
  private: "/private-jobs",
  admitCards: "/admit-cards",
  results: "/results",
  search: "/search",
};

function getPageNumber(value) {
  const page = Number(value || 1);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

function updateMetadata(title, description, canonicalPath, structuredData) {
  document.title = title;
  const ensureMeta = (selector, tag, attrs, content) => {
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement(tag);
      Object.entries(attrs).forEach(([name, value]) => element.setAttribute(name, value));
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  };
  ensureMeta('meta[name="description"]', "meta", { name: "description" }, description);
  ensureMeta('meta[property="og:title"]', "meta", { property: "og:title" }, title);
  ensureMeta('meta[property="og:description"]', "meta", { property: "og:description" }, description);
  ensureMeta('meta[property="og:url"]', "meta", { property: "og:url" }, `https://nextvacancy.com${canonicalPath}`);
  ensureMeta('meta[name="twitter:card"]', "meta", { name: "twitter:card" }, "summary_large_image");
  ensureMeta('meta[name="twitter:title"]', "meta", { name: "twitter:title" }, title);
  ensureMeta('meta[name="twitter:description"]', "meta", { name: "twitter:description" }, description);
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = `https://nextvacancy.com${canonicalPath}`;
  let schema = document.getElementById("page-structured-data");
  if (schema) schema.remove();
  if (structuredData) {
    schema = document.createElement("script");
    schema.id = "page-structured-data";
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify(structuredData).replaceAll("<", "\\u003c");
    document.head.appendChild(schema);
  }
}

function JobCard({ job }) {
  const isAdmit = job.status === "ADMIT_CARD_OUT";
  const isResult = job.status === "RESULT_OUT";
  const isEnding = job.status === "ENDING_SOON";

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-700">
            {job.category}
          </span>
          {job.isVerified && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
              <CheckCircle2 size={12} /> Verified
            </span>
          )}
        </div>

        <h3 className="mt-3 text-base font-bold leading-snug text-slate-900 group-hover:text-rose-900 transition-colors">
          <Link to={`/jobs/${encodeURIComponent(job.slug)}`}>
            {job.title}
          </Link>
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <Building2 size={13} className="text-slate-400" />
            {job.organization}
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <MapPin size={13} className="text-slate-400" />
            {job.location}
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600">
          {job.shortSummary}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <div className="font-semibold text-slate-800">
          <span className="text-slate-500 font-normal">Vacancies:</span> {job.totalVacancies}
        </div>
        <span
          className={`rounded-md px-2 py-0.5 font-bold ${
            isAdmit
              ? "bg-amber-50 text-amber-800"
              : isResult
              ? "bg-blue-50 text-blue-800"
              : isEnding
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

export function PublicCatalogPage({ mode = "home" }) {
  const { category: routeCategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [catalogPage, setCatalogPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoriesError, setCategoriesError] = useState("");

  const pageNumber = getPageNumber(searchParams.get("page"));
  const query = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";
  const qualification = searchParams.get("qualification") || "";
  const location = searchParams.get("location") || "";
  const sort = searchParams.get("sort") || "latest";

  const fixedConfig = catalogs[mode] || catalogs.home;
  const isDynamic = mode === "category";
  const dynamicCategory = isDynamic ? categories.find((c) => c.slug === routeCategory) : null;
  const category = isDynamic ? dynamicCategory?.slug : fixedConfig.category || categoryFilter;
  const title = isDynamic ? dynamicCategory?.name || (categoriesLoaded ? "Category not found" : "Loading category…") : fixedConfig.title;
  const description = isDynamic ? dynamicCategory?.description || "Browse vacancies in this category." : fixedConfig.description;
  const canonicalPath = isDynamic ? `/category/${routeCategory || ""}` : catalogPaths[mode] || `/${mode}`;

  const loadCategories = useCallback(async () => {
    setCategoriesError("");
    try {
      const list = await apiGet("/api/v1/categories");
      setCategories(Array.isArray(list) ? list : []);
      setCategoriesLoaded(true);
    } catch (failure) {
      setCategoriesError(failure.message || "Unable to load categories.");
    }
  }, []);

  const loadJobs = useCallback(async () => {
    if (isDynamic && !dynamicCategory && categoriesLoaded) {
      setCatalogPage(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const jobPage = await apiGet("/api/v1/jobs", {
        page: pageNumber - 1,
        size: 9,
        q: query,
        category,
        status,
        qualification,
        location,
        sort,
        direction: sort === "alphabetical" ? "asc" : "desc",
      });
      setCatalogPage(jobPage);
    } catch (failure) {
      setCatalogPage(null);
      setError(failure.message || "Unable to load vacancies.");
    } finally {
      setLoading(false);
    }
  }, [category, dynamicCategory, isDynamic, categoriesLoaded, location, pageNumber, query, qualification, sort, status]);

  useEffect(() => { loadCategories(); }, [loadCategories]);
  useEffect(() => { loadJobs(); }, [loadJobs]);

  useEffect(() => {
    if (catalogPage) {
      const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: title,
        description,
        url: `https://nextvacancy.com${canonicalPath}`,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: catalogPage.totalElements,
          itemListElement: (catalogPage.content || []).slice(0, 10).map((job, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `https://nextvacancy.com/jobs/${job.slug}`,
            name: job.title,
          })),
        },
      };
      updateMetadata(`${title} | NextVacancy`, description, canonicalPath, schema);
    }
  }, [canonicalPath, catalogPage, description, title]);

  function updateFilter(name, value) {
    const next = new URLSearchParams(searchParams);
    if (value && value !== "all") next.set(name, value);
    else next.delete(name);
    next.set("page", "1");
    setSearchParams(next);
  }

  function resetAllFilters() {
    setSearchParams(new URLSearchParams());
  }

  const hasActiveFilters = Boolean(query || (categoryFilter && categoryFilter !== "all") || (status && status !== "all") || qualification || location || sort !== "latest");

  if (isDynamic && categoriesError) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-2xl font-black text-slate-900">Unable to load this category</h1>
        <p className="mt-2 text-sm text-slate-600" role="alert">{categoriesError}</p>
        <button className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-rose-900 underline" onClick={loadCategories}>
          <RotateCcw size={15} /> Try again
        </button>
      </main>
    );
  }

  if (isDynamic && categoriesLoaded && !dynamicCategory) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-2xl font-black text-slate-900">Category not found</h1>
        <p className="mt-2 text-sm text-slate-600">The requested category does not exist in our catalog.</p>
        <Link className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white" to="/">
          Browse all vacancies
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link to="/" className="hover:text-slate-900">Home</Link>
        <ChevronRight size={13} className="text-slate-400" />
        <span className="font-semibold text-slate-900">{title}</span>
      </nav>

      {/* Header Banner */}
      <section className="rounded-3xl border border-slate-200/90 bg-linear-to-br from-slate-900 via-slate-950 to-[#0F2744] p-6 text-white sm:p-10">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wider text-rose-300">Recruitment Hub</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:text-sm">{description}</p>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:p-5" aria-label="Job search filters">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Filter size={14} className="text-rose-900" /> Filter &amp; Refine Results
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-800 hover:underline"
            >
              <X size={13} /> Reset Filters
            </button>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* Keyword Search */}
          <label className="text-xs font-semibold text-slate-700">
            Keyword
            <div className="relative mt-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => updateFilter("q", e.target.value)}
                placeholder="Role, post, dept..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-8 text-xs font-medium text-slate-900 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </label>

          {/* Category Dropdown (for home/search) */}
          {!isDynamic && (
            <label className="text-xs font-semibold text-slate-700">
              Category
              <select
                value={categoryFilter || "all"}
                onChange={(e) => updateFilter("category", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </label>
          )}

          {/* Status */}
          <label className="text-xs font-semibold text-slate-700">
            Status
            <select
              value={status || "all"}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            >
              <option value="all">All Statuses</option>
              <option value="OPEN">Open / Active</option>
              <option value="ENDING_SOON">Ending Soon</option>
              <option value="ADMIT_CARD_OUT">Admit Card Released</option>
              <option value="RESULT_OUT">Result Declared</option>
              <option value="ANSWER_KEY_OUT">Answer Key Out</option>
              <option value="CLOSED">Closed / Archived</option>
            </select>
          </label>

          {/* Qualification */}
          <label className="text-xs font-semibold text-slate-700">
            Qualification
            <input
              type="text"
              value={qualification}
              onChange={(e) => updateFilter("qualification", e.target.value)}
              placeholder="e.g. 10th, 12th, Graduate"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </label>

          {/* Location */}
          <label className="text-xs font-semibold text-slate-700">
            Location / State
            <input
              type="text"
              value={location}
              onChange={(e) => updateFilter("location", e.target.value)}
              placeholder="e.g. All India, Delhi"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </label>

          {/* Sort By */}
          <label className="text-xs font-semibold text-slate-700">
            Sort by
            <select
              value={sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            >
              <option value="latest">Latest Added</option>
              <option value="views">Most Viewed</option>
              <option value="alphabetical">Alphabetical (A-Z)</option>
            </select>
          </label>
        </div>
      </section>

      {/* Main Results Section */}
      <section className="mt-8" aria-live="polite">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-950">
            {title} {catalogPage ? `(${catalogPage.totalElements} vacancies)` : ""}
          </h2>
          {catalogPage && (
            <span className="text-xs text-slate-500">
              Showing page {catalogPage.number + 1} of {Math.max(1, catalogPage.totalPages)}
            </span>
          )}
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-950" role="alert">
            <p className="font-bold">We couldn’t load current vacancies.</p>
            <p className="mt-1 text-xs text-rose-800">{error}</p>
            <button
              onClick={loadJobs}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-rose-900 px-4 py-2 text-xs font-bold text-white shadow-xs"
            >
              <RotateCcw size={13} /> Try again
            </button>
          </div>
        ) : loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading vacancies">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-48 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : catalogPage?.content?.length ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {catalogPage.content.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {/* Pagination Controls */}
            {catalogPage.totalPages > 1 && (
              <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Pagination">
                <button
                  type="button"
                  disabled={catalogPage.first}
                  onClick={() => updateFilter("page", String(Math.max(1, pageNumber - 1)))}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft size={14} /> Previous
                </button>
                <span className="text-xs font-semibold text-slate-600">
                  Page {catalogPage.number + 1} of {catalogPage.totalPages}
                </span>
                <button
                  type="button"
                  disabled={catalogPage.last}
                  onClick={() => updateFilter("page", String(pageNumber + 1))}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next <ArrowRight size={14} />
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <Briefcase size={36} className="mx-auto text-slate-300" />
            <h3 className="mt-3 text-base font-bold text-slate-800">No matching vacancies found</h3>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your search criteria, clearing a filter, or searching with broader terms.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function HighlightBox({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-rose-900 shadow-2xs">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="mt-0.5 text-xs font-bold text-slate-900">{String(value)}</p>
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }) {
  if (!children) return null;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        {Icon && <Icon size={18} className="text-rose-900" />}
        <h2 className="text-base font-bold text-slate-950">{title}</h2>
      </div>
      <div className="mt-4 text-xs leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}

export function PublicJobDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [job, setJob] = useState(null);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState("");
  const [relatedError, setRelatedError] = useState("");
  const [saved, setSaved] = useState(false);
  const [savedError, setSavedError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    setJob(null);
    setError("");
    apiGet(`/api/v1/jobs/${encodeURIComponent(slug)}`)
      .then((record) => { if (active) setJob(record); })
      .catch((failure) => { if (active) setError(failure.message || "Job not found."); });

    apiGet(`/api/v1/jobs/${encodeURIComponent(slug)}/related`)
      .then((records) => { if (active) setRelated(Array.isArray(records) ? records : []); })
      .catch((failure) => { if (active) setRelatedError(failure.message || "Unable to load related jobs."); });

    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    if (!job) return;
    const pageTitle = `${job.title} — Notification, Eligibility & Apply Online | NextVacancy`;
    const pageDescription = `${job.shortSummary} View complete vacancy breakdown, age limit, salary details, eligibility and official direct application links.`;
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://nextvacancy.com/" },
            { "@type": "ListItem", position: 2, name: job.organization, item: `https://nextvacancy.com/jobs/${job.slug}` },
          ],
        },
        {
          "@type": "JobPosting",
          title: job.title,
          description: job.shortSummary,
          datePosted: job.createdAt,
          validThrough: job.importantDates?.applicationEndDate ? `${job.importantDates.applicationEndDate}T23:59:59Z` : undefined,
          employmentType: job.jobType === "Contractual" ? "CONTRACTOR" : "FULL_TIME",
          hiringOrganization: { "@type": "Organization", name: job.organization },
          jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "IN" } },
        },
      ],
    };
    updateMetadata(pageTitle, pageDescription, `/jobs/${job.slug}`, schema);
  }, [job]);

  useEffect(() => {
    let active = true;
    if (session?.role !== "CANDIDATE") {
      setSaved(false);
      return () => { active = false; };
    }
    apiRequest("/api/v1/candidate/saved-jobs", { accessToken: session.accessToken })
      .then((savedJobs) => {
        if (active && Array.isArray(savedJobs)) {
          setSaved(savedJobs.some((s) => s.job?.slug === slug || s.jobId === job?.id));
        }
      })
      .catch(() => { if (active) setSaved(false); });

    return () => { active = false; };
  }, [session, slug, job?.id]);

  async function toggleSavedJob() {
    if (!job || !session) return;
    setSaving(true);
    setSavedError("");
    try {
      await apiRequest(`/api/v1/candidate/saved-jobs/${encodeURIComponent(job.id)}`, {
        method: saved ? "DELETE" : "PUT",
        accessToken: session.accessToken,
      });
      setSaved(!saved);
    } catch (failure) {
      setSavedError(failure.message || "Unable to update saved jobs.");
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-rose-900 underline">
          <ArrowLeft size={15} /> Back to all vacancies
        </Link>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8">
          <h1 className="text-xl font-bold text-rose-950">Job posting unavailable</h1>
          <p className="mt-2 text-xs text-rose-800">{error}</p>
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="h-96 animate-pulse rounded-3xl bg-slate-100" role="status" aria-label="Loading vacancy details" />
      </main>
    );
  }

  const dates = job.importantDates || {};
  const links = Array.isArray(job.importantLinks) ? job.importantLinks : [];
  const qualifications = Array.isArray(job.qualificationsList) ? job.qualificationsList : [];
  const vacancies = Array.isArray(job.vacancyBreakdown) ? job.vacancyBreakdown : [];
  const selectionSteps = Array.isArray(job.selectionProcess) ? job.selectionProcess : [];
  const applySteps = Array.isArray(job.howToApplySteps) ? job.howToApplySteps : [];
  const documents = Array.isArray(job.requiredDocuments) ? job.requiredDocuments : [];
  const faqs = Array.isArray(job.faqs) ? job.faqs : [];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Back button & Breadcrumbs */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-slate-950"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <div className="flex items-center gap-2 text-slate-500">
          <Link to="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link to={`/category/${encodeURIComponent(job.category)}`} className="hover:text-slate-900">{job.category}</Link>
          <span>/</span>
          <span className="font-semibold text-slate-900">{job.organization}</span>
        </div>
      </div>

      {/* Main Header Article Card */}
      <article className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
        {/* Badges row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-rose-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-rose-900">
              {job.category}
            </span>
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
              {job.status.replaceAll("_", " ")}
            </span>
            {job.isVerified && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                <ShieldCheck size={14} /> Verified Notification
              </span>
            )}
          </div>

          {/* Bookmark / Save button */}
          <div>
            {session?.role === "CANDIDATE" ? (
              <button
                type="button"
                onClick={toggleSavedJob}
                disabled={saving}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                  saved
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                <span>{saved ? "Saved" : "Save Job"}</span>
              </button>
            ) : !session ? (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <Bookmark size={14} /> Sign in to Save
              </Link>
            ) : null}
          </div>
        </div>

        {/* Title & Organization */}
        <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          {job.title}
        </h1>
        <p className="mt-1 text-sm font-semibold text-slate-600">{job.organization}</p>

        {/* Summary */}
        <p className="mt-4 text-xs leading-relaxed text-slate-700 sm:text-sm">
          {job.shortSummary}
        </p>

        {/* Highlights Grid */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <HighlightBox icon={Users} label="Total Vacancies" value={job.totalVacancies} />
          <HighlightBox icon={IndianRupee} label="Salary / Stipend" value={job.salaryOrStipend} />
          <HighlightBox icon={MapPin} label="Job Location" value={job.location} />
          <HighlightBox icon={GraduationCap} label="Qualification" value={job.qualificationSummary} />
        </div>

        {/* Action Direct Links Card */}
        {links.length > 0 && (
          <div className="mt-8 rounded-2xl border border-rose-200 bg-linear-to-r from-rose-50/80 to-amber-50/50 p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-rose-950">Official Direct Links</h2>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-rose-800"
                >
                  <span>{link.label || link.linkType || "Official Link"}</span>
                  <ExternalLink size={13} />
                </a>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Structured Details Sections */}
      <div className="mt-6 space-y-6">
        {/* Important Dates */}
        {Object.keys(dates).length > 0 && (
          <SectionCard title="Important Examination & Application Dates" icon={Calendar}>
            <dl className="grid gap-3 sm:grid-cols-2">
              {Object.entries(dates).map(([k, v]) =>
                v ? (
                  <div key={k} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <dt className="text-[11px] font-bold uppercase text-slate-500">
                      {k.replace(/([A-Z])/g, " $1")}
                    </dt>
                    <dd className="mt-1 text-xs font-bold text-slate-900">{String(v)}</dd>
                  </div>
                ) : null
              )}
            </dl>
          </SectionCard>
        )}

        {/* Qualifications Details */}
        {qualifications.length > 0 && (
          <SectionCard title="Educational Qualifications &amp; Eligibility Criteria" icon={GraduationCap}>
            <ul className="space-y-2">
              {qualifications.map((q, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>{typeof q === "string" ? q : q.title || q.label || JSON.stringify(q)}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        )}

        {/* Vacancy Breakdown */}
        {vacancies.length > 0 && (
          <SectionCard title="Post-Wise Vacancy Breakdown" icon={Layers}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 font-bold text-slate-600">
                    <th className="pb-2">Post / Designation</th>
                    <th className="pb-2">Category</th>
                    <th className="pb-2 text-right">Vacancies</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vacancies.map((v, idx) => (
                    <tr key={idx} className="py-2">
                      <td className="py-2 font-medium text-slate-900">{v.post || v.name || v.label || "Position"}</td>
                      <td className="py-2 text-slate-600">{v.category || "General"}</td>
                      <td className="py-2 text-right font-bold text-slate-900">{v.count || v.vacancies || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )}

        {/* Age Limit & Relaxations */}
        {job.ageLimit && (
          <SectionCard title="Age Limit &amp; Relaxation Criteria" icon={Clock}>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              {typeof job.ageLimit === "object" ? (
                <dl className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(job.ageLimit).map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[11px] font-bold uppercase text-slate-500">
                        {k.replace(/([A-Z])/g, " $1")}
                      </dt>
                      <dd className="mt-0.5 text-xs font-bold text-slate-900">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p>{String(job.ageLimit)}</p>
              )}
            </div>
          </SectionCard>
        )}

        {/* Fee Structure */}
        {job.feeStructure && (
          <SectionCard title="Application Fee &amp; Payment Mode" icon={IndianRupee}>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              {typeof job.feeStructure === "object" ? (
                <dl className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(job.feeStructure).map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[11px] font-bold uppercase text-slate-500">
                        {k.replace(/([A-Z])/g, " $1")}
                      </dt>
                      <dd className="mt-0.5 text-xs font-bold text-slate-900">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p>{String(job.feeStructure)}</p>
              )}
            </div>
          </SectionCard>
        )}

        {/* Selection Process */}
        {selectionSteps.length > 0 && (
          <SectionCard title="Selection Methodology &amp; Exam Pattern" icon={Award}>
            <ol className="space-y-3">
              {selectionSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-900 text-[11px] font-bold text-white">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {typeof step === "string" ? step : step.stage || step.name || JSON.stringify(step)}
                    </p>
                    {step.description && (
                      <p className="mt-1 text-xs text-slate-600">{step.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </SectionCard>
        )}

        {/* How to Apply Steps */}
        {applySteps.length > 0 && (
          <SectionCard title="How to Apply Step-by-Step" icon={FileText}>
            <ol className="list-decimal space-y-2 pl-4 text-xs">
              {applySteps.map((s, idx) => (
                <li key={idx} className="leading-relaxed text-slate-700">
                  {typeof s === "string" ? s : s.step || JSON.stringify(s)}
                </li>
              ))}
            </ol>
          </SectionCard>
        )}

        {/* Required Documents */}
        {documents.length > 0 && (
          <SectionCard title="Required Documents &amp; Certificates" icon={FileCheck2}>
            <ul className="grid gap-2 sm:grid-cols-2 text-xs">
              {documents.map((doc, idx) => (
                <li key={idx} className="flex items-center gap-2 rounded-lg bg-slate-50 p-2.5">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>{typeof doc === "string" ? doc : doc.name || JSON.stringify(doc)}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        )}

        {/* Frequently Asked Questions */}
        {faqs.length > 0 && (
          <SectionCard title="Frequently Asked Questions (FAQs)" icon={HelpCircle}>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <details key={idx} className="rounded-xl border border-slate-100 bg-slate-50 p-3 group">
                  <summary className="cursor-pointer font-bold text-slate-900 text-xs flex items-center justify-between">
                    <span>{faq.question}</span>
                    <ChevronRight size={14} className="transition group-open:rotate-90 text-slate-400" />
                  </summary>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 pt-2 border-t border-slate-200/60">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </SectionCard>
        )}
      </div>

      {/* Related Vacancies */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-slate-950">Related Opportunities</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((rel) => (
              <JobCard key={rel.id} job={rel} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
