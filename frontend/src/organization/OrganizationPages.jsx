import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Layers,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../api.js";

function ErrorState({ message }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-950" role="alert">
      <h2 className="text-base font-bold">We couldn’t load this organization.</h2>
      <p className="mt-1 text-xs text-rose-800">{message}</p>
    </div>
  );
}

function usePageMetadata(title, description, canonical) {
  useEffect(() => {
    document.title = title;
    const setMeta = (selector, attributes, content) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
        document.head.appendChild(element);
      }
      element.content = content;
    };
    setMeta('meta[name="description"]', { name: "description" }, description);
    setMeta('meta[property="og:title"]', { property: "og:title" }, title);
    setMeta('meta[property="og:description"]', { property: "og:description" }, description);
    setMeta('meta[property="og:url"]', { property: "og:url" }, canonical);
    setMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
    setMeta('meta[name="twitter:title"]', { name: "twitter:title" }, title);
    setMeta('meta[name="twitter:description"]', { name: "twitter:description" }, description);
    let canonicalLink = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;
  }, [title, description, canonical]);
}

function StructuredData({ value }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(value).replaceAll("<", "\\u003c"),
      }}
    />
  );
}

export function OrganizationDirectoryPage() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  usePageMetadata(
    "Recruiting Organizations & Commissions Directory | NextVacancy",
    "Browse official career portals, recruitment circulars, exam calendars, and selection patterns across major recruitment authorities.",
    "https://nextvacancy.com/organizations"
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiGet("/api/v1/organizations")
      .then((result) => { if (active) setOrganizations(Array.isArray(result) ? result : []); })
      .catch((failure) => { if (active) setError(failure.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(organizations.map((org) => org.categoryType).filter(Boolean))],
    [organizations]
  );

  const filtered = useMemo(() => {
    return organizations.filter((org) => {
      if (category !== "All" && org.categoryType !== category) return false;
      const normalizedQuery = query.trim().toLowerCase();
      return (
        !normalizedQuery ||
        [org.name, org.shortName, org.headquarters, org.state, org.categoryType].some((v) =>
          v?.toLowerCase().includes(normalizedQuery)
        )
      );
    });
  }, [organizations, category, query]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link to="/" className="hover:text-slate-900">Home</Link>
        <ChevronRight size={13} className="text-slate-400" />
        <span className="font-semibold text-slate-900">Organizations &amp; Commissions</span>
      </nav>

      {/* Banner */}
      <section className="rounded-3xl border border-slate-200/90 bg-linear-to-br from-slate-900 via-slate-950 to-[#0F2744] p-6 text-white sm:p-10">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-300">National &amp; State Authority Directory</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">Recruiting Commissions &amp; Boards</h1>
          <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:text-sm">
            Browse examination calendars, eligibility patterns, syllabus frameworks, and active vacancy notifications across verified central commissions, public sector banks, defence boards, and state PSCs.
          </p>
        </div>
      </section>

      {error ? (
        <ErrorState message={error} />
      ) : (
        <>
          {/* Search & Filter Bar */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:p-5" aria-label="Organization search and filters">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  aria-label="Search organizations"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search commission name, acronym, or state..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-9 pl-10 text-xs font-medium text-slate-900 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear organization search query"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <span className="text-xs font-bold text-slate-500">
                Showing {filtered.length} of {organizations.length} Recruiting Bodies
              </span>
            </div>

            <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1" aria-label="Organization category tabs">
              {categories.map((catName) => (
                <button
                  key={catName}
                  type="button"
                  aria-pressed={category === catName}
                  onClick={() => setCategory(catName)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition shrink-0 ${
                    category === catName
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:text-slate-950"
                  }`}
                >
                  {catName}
                </button>
              ))}
            </div>
          </section>

          {/* Cards Grid */}
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading organizations">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-44 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
              <Building2 className="mx-auto text-slate-300" size={36} />
              <h2 className="mt-3 text-base font-bold text-slate-800">No recruiting authorities found</h2>
              <p className="mt-1 text-xs text-slate-500">Try adjusting your search query or selected category.</p>
            </section>
          ) : (
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Recruiting organizations">
              {filtered.map((org) => (
                <article
                  key={org.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-900">
                        {org.shortName}
                      </span>
                      {org.categoryType && (
                        <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                          {org.categoryType}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-3 text-base font-bold text-slate-900 group-hover:text-rose-900 transition-colors">
                      <Link to={`/organizations/${encodeURIComponent(org.slug)}`}>
                        {org.name}
                      </Link>
                    </h2>

                    {org.tagline && (
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">{org.tagline}</p>
                    )}

                    {org.headquarters && (
                      <p className="mt-2.5 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={13} className="text-slate-400" />
                        <span>{org.headquarters}</span>
                      </p>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <span className="font-semibold text-emerald-700">
                      {org.stats?.activeVacanciesCount || 0} Active Drives
                    </span>
                    <Link
                      to={`/organizations/${encodeURIComponent(org.slug)}`}
                      className="font-bold text-rose-900 hover:underline"
                    >
                      View Career Hub →
                    </Link>
                  </div>
                </article>
              ))}
            </section>
          )}
        </>
      )}
    </main>
  );
}

export function OrganizationProfilePage() {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setProfile(null);
    setError("");
    setNotFound(false);
    setJobs([]);
    setRelated([]);

    if (!slug) {
      if (active) setError("Organization not found.");
      return () => { active = false; };
    }

    Promise.all([
      apiGet(`/api/v1/organizations/${encodeURIComponent(slug)}`),
      apiGet(`/api/v1/organizations/${encodeURIComponent(slug)}/jobs`, { page: 0, size: 50 }),
      apiGet(`/api/v1/organizations/${encodeURIComponent(slug)}/related`, { limit: 3 }),
    ])
      .then(([org, jobPage, relatedOrgs]) => {
        if (!active) return;
        setProfile(org);
        setJobs(Array.isArray(jobPage?.content) ? jobPage.content : []);
        setRelated(Array.isArray(relatedOrgs) ? relatedOrgs : []);
      })
      .catch((failure) => {
        if (!active) return;
        setNotFound(failure.status === 404);
        setError(failure.message || "Unable to load organization.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [slug]);

  const pageTitle = profile
    ? `${profile.name} (${profile.shortName}) Recruitment 2026 — Vacancies, Exams & Results | NextVacancy`
    : "Organization Profile | NextVacancy";
  const description = profile
    ? `View official recruitment drives, examination calendars, admit cards, and merit list results for ${profile.name} (${profile.shortName}).`
    : "Recruiting commission profile, active vacancies, and official notices.";
  const canonical = `https://nextvacancy.com/organizations/${encodeURIComponent(slug || "")}`;
  usePageMetadata(pageTitle, description, canonical);

  if (error && notFound) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-slate-900">Organization not found</h1>
        <p className="mt-2 text-xs text-slate-600">{error}</p>
        <Link className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white" to="/organizations">
          Browse all organizations
        </Link>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12">
        <ErrorState message={error} />
      </main>
    );
  }

  if (loading || !profile) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="h-80 animate-pulse rounded-3xl bg-slate-100" aria-label="Loading organization profile" />
      </main>
    );
  }

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://nextvacancy.com" },
      { "@type": "ListItem", position: 2, name: "Organizations", item: "https://nextvacancy.com/organizations" },
      { "@type": "ListItem", position: 3, name: profile.name, item: canonical },
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: profile.name,
    alternateName: profile.shortName,
    ...(profile.website ? { url: profile.website } : {}),
    ...(profile.headquarters ? { address: { "@type": "PostalAddress", addressLocality: profile.headquarters, addressCountry: "IN" } } : {}),
    ...(profile.description ? { description: profile.description } : {}),
  };

  const stats = profile.stats || {
    activeVacanciesCount: 0,
    totalPostsCount: 0,
    admitCardsCount: 0,
    resultsCount: 0,
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-8">
      <StructuredData value={organizationSchema} />
      <StructuredData value={breadcrumbs} />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link to="/" className="hover:text-slate-900">Home</Link>
        <ChevronRight size={13} className="text-slate-400" />
        <Link to="/organizations" className="hover:text-slate-900">Organizations</Link>
        <ChevronRight size={13} className="text-slate-400" />
        <span className="font-semibold text-slate-900">{profile.shortName}</span>
      </nav>

      {/* Hero Authority Header */}
      <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-900">
              <Building2 size={28} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-slate-100 px-2.5 py-0.5 font-mono text-xs font-bold text-slate-900">
                  {profile.shortName}
                </span>
                {profile.verified && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                    <CheckCircle2 size={12} /> Verified Authority
                  </span>
                )}
                {profile.categoryType && (
                  <span className="rounded-md bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                    {profile.categoryType}
                  </span>
                )}
              </div>

              <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
                {profile.name}
              </h1>
              {profile.tagline && (
                <p className="mt-1 text-xs text-slate-600 sm:text-sm">{profile.tagline}</p>
              )}
            </div>
          </div>

          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800"
            >
              <span>Official Authority Website</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>

        {/* Quick Meta Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 text-xs sm:grid-cols-4">
          {profile.headquarters && (
            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Headquarters</span>
              <p className="mt-0.5 font-bold text-slate-900">{profile.headquarters}</p>
            </div>
          )}
          {profile.establishedYear && (
            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Established</span>
              <p className="mt-0.5 font-bold text-slate-900">Year {profile.establishedYear}</p>
            </div>
          )}
          {profile.state && (
            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Jurisdiction</span>
              <p className="mt-0.5 font-bold text-slate-900">{profile.state}</p>
            </div>
          )}
          {profile.categoryType && (
            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Authority Type</span>
              <p className="mt-0.5 font-bold text-slate-900">{profile.categoryType}</p>
            </div>
          )}
        </div>
      </section>

      {/* Authority Real-time KPI Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Organization statistics">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <p className="text-2xl font-black text-rose-900">{stats.activeVacanciesCount}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Active Recruitment Drives</p>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <p className="text-2xl font-black text-slate-900">{(stats.totalPostsCount || 0).toLocaleString("en-IN")}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Total Posts Advertised</p>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <p className="text-2xl font-black text-amber-700">{stats.admitCardsCount || 0}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Admit Cards Available</p>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <p className="text-2xl font-black text-blue-900">{stats.resultsCount || 0}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Declared Results</p>
        </div>
      </section>

      {/* About & Selection Methodology */}
      <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <div>
          <h2 className="text-lg font-bold text-slate-950">About {profile.name} ({profile.shortName})</h2>
          {profile.description && (
            <p className="mt-2 text-xs leading-relaxed text-slate-700 sm:text-sm">{profile.description}</p>
          )}
        </div>

        {profile.aboutDetails?.length > 0 && (
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {profile.aboutDetails.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        )}

        {profile.selectionProcess?.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-950">Standard Recruitment &amp; Exam Methodology</h3>
            <ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {profile.selectionProcess.map((step, idx) => (
                <li key={idx} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <span className="text-[11px] font-bold text-rose-900">Stage {idx + 1}</span>
                  <p className="mt-1 text-xs font-semibold text-slate-900">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {profile.keyDepartments?.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-950">Associated Ministries &amp; Departments</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.keyDepartments.map((dept) => (
                <span key={dept} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                  {dept}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Recruitment Postings List */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-slate-950">Active Circulars &amp; Job Openings</h2>
        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-xs text-slate-500">
            No active recruitment postings found for this authority at this moment.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <article key={job.id} className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
                <div>
                  <h3 className="font-bold text-sm text-slate-950 hover:text-rose-900 transition-colors">
                    <Link to={`/jobs/${encodeURIComponent(job.slug)}`}>{job.title}</Link>
                  </h3>
                  <p className="mt-2 text-xs line-clamp-2 text-slate-600">{job.shortSummary}</p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <span className="font-semibold text-slate-700">{job.location || "All India"}</span>
                  <span className="font-bold text-rose-900">{(job.status || "ACTIVE").replaceAll("_", " ")}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Frequently Asked Questions */}
      {profile.faqs?.length > 0 && (
        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-950">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {profile.faqs.map((faq, idx) => (
              <details key={idx} className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 group">
                <summary className="cursor-pointer text-xs font-bold text-slate-950 flex items-center justify-between">
                  <span>{faq.question}</span>
                  <ChevronRight size={14} className="text-slate-400 transition group-open:rotate-90" />
                </summary>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 pt-2 border-t border-slate-200/60">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related Authorities */}
      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-950">Related Recruiting Authorities</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((org) => (
              <Link
                key={org.id}
                to={`/organizations/${encodeURIComponent(org.slug)}`}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs transition hover:border-slate-400 hover:shadow-md"
              >
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-900">
                  {org.shortName}
                </span>
                <p className="mt-2 text-xs font-bold text-slate-900">{org.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
