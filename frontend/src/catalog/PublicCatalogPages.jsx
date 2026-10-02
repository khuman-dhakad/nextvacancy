import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Building2, MapPin } from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { apiGet, apiRequest } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

const catalogs = {
  home: {
    title: "Latest vacancies",
    description: "Search verified recruitment notices and explore the details you need to make your next move.",
    category: "",
  },
  search: {
    title: "Search All Vacancies & Exams",
    description: "Filter and search through real-time notifications, eligibility criteria, and application deadlines.",
    category: "",
  },
  results: {
    title: "Exam Results, Merit Lists & Cut-Offs",
    description: "Check published scorecards, qualifying cut-off marks, and merit lists.",
    category: "result",
  },
  government: {
    title: "Government Jobs (Sarkari Naukri) 2026",
    description: "Browse central and state government recruitment notifications, eligibility requirements, and exam dates.",
    category: "government",
  },
  private: {
    title: "Private Sector Jobs & Tech Careers",
    description: "Browse private sector employment openings and corporate opportunities.",
    category: "private",
  },
  admitCards: {
    title: "Admit Cards & Exam Hall Tickets",
    description: "Browse exam admit card, hall ticket, and exam city slip notifications.",
    category: "admit-card",
  },
};

const catalogPaths = {
  home: "/",
  government: "/government-jobs",
  private: "/private-jobs",
  admitCards: "/admit-cards",
  results: "/results",
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
  return (
    <Link className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-lg" to={`/jobs/${encodeURIComponent(job.slug)}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-800">{job.category}</p>
          <h2 className="mt-2 text-lg font-bold text-slate-900 group-hover:text-rose-900">{job.title}</h2>
        </div>
        {job.isVerified && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">Verified</span>}
      </div>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{job.shortSummary}</p>
      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
        <span className="inline-flex items-center gap-1.5"><Building2 size={15} />{job.organization}</span>
        <span className="inline-flex items-center gap-1.5"><MapPin size={15} />{job.location}</span>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
        <span className="font-semibold text-slate-800">{job.totalVacancies} vacancies</span>
        <span className="font-medium text-rose-900">{job.status.replaceAll("_", " ").toLowerCase()}</span>
      </div>
    </Link>
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
  const fixedConfig = catalogs[mode];
  const isDynamic = mode === "category";
  const dynamicCategory = isDynamic ? categories.find((category) => category.slug === routeCategory) : null;
  const category = isDynamic ? dynamicCategory?.slug : fixedConfig.category || categoryFilter;
  const title = isDynamic ? dynamicCategory?.name || (categories.length ? "Category not found" : "Loading category…") : fixedConfig.title;
  const description = isDynamic ? dynamicCategory?.description || "Browse vacancies in this category." : fixedConfig.description;
  const canonicalPath = isDynamic ? `/category/${routeCategory || ""}` : catalogPaths[mode] || `/${mode}`;

  const loadCategories = useCallback(async () => {
    setCategoriesError("");
    try {
      setCategories(await apiGet("/api/v1/categories"));
      setCategoriesLoaded(true);
    } catch (failure) {
      setCategoriesError(failure.message || "Unable to load categories.");
    }
  }, []);

  const loadJobs = useCallback(async () => {
    if (isDynamic && !dynamicCategory) {
      setCatalogPage(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const jobPage = await apiGet("/api/v1/jobs", {
        page: pageNumber - 1,
        size: 8,
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
  }, [category, dynamicCategory, isDynamic, location, pageNumber, query, qualification, sort, status]);

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
          itemListElement: catalogPage.content.slice(0, 10).map((job, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `https://nextvacancy.com/jobs/${job.slug}`,
            name: job.title,
          })),
        },
      };
      updateMetadata(`${title} | NEXTVACANCY`, description, canonicalPath, schema);
    }
  }, [canonicalPath, catalogPage, description, title]);

  function updateFilter(name, value) {
    const next = new URLSearchParams(searchParams);
    if (value && value !== "all") next.set(name, value);
    else next.delete(name);
    next.set("page", "1");
    setSearchParams(next);
  }

  if (isDynamic && categoriesError) {
    return <main className="mx-auto max-w-3xl px-5 py-20 text-center">
      <h1 className="text-3xl font-bold">Unable to load this category</h1>
      <p className="mt-3 text-sm text-slate-600" role="alert">{categoriesError}</p>
      <button className="mt-4 text-rose-900 underline" onClick={loadCategories}>Try again</button>
    </main>;
  }

  if (isDynamic && categoriesLoaded && !dynamicCategory) {
    return <main className="mx-auto max-w-3xl px-5 py-20 text-center"><h1 className="text-3xl font-bold">Category not found</h1><Link className="mt-4 inline-block text-rose-900 underline" to="/">Browse vacancies</Link></main>;
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:py-14">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950 via-rose-900 to-fuchsia-900 px-6 py-10 text-white sm:px-10 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-200">Your next step starts here</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-rose-100">{description}</p>
      </section>
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-label="Job search filters">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-xs font-semibold text-slate-600">Keyword
            <input className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm" value={query} onChange={(event) => updateFilter("q", event.target.value)} placeholder="Role, organization, location, or qualification" />
          </label>
          {(mode === "home" || mode === "search") && <label className="text-xs font-semibold text-slate-600">Category
            <select className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm" value={categoryFilter || "all"} onChange={(event) => updateFilter("category", event.target.value)}>
              <option value="all">All categories</option>
              {categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
            </select>
          </label>}
          <label className="text-xs font-semibold text-slate-600">Status
            <select className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm" value={status || "all"} onChange={(event) => updateFilter("status", event.target.value)}>
              <option value="all">All statuses</option>
              <option value="OPEN">Active / Open</option>
              <option value="ENDING_SOON">Closing soon</option>
              <option value="ADMIT_CARD_OUT">Admit card out</option>
              <option value="RESULT_OUT">Result declared</option>
              <option value="ANSWER_KEY_OUT">Answer key out</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-slate-600">Qualification
            <input className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm" value={qualification} onChange={(event) => updateFilter("qualification", event.target.value)} placeholder="e.g. graduate" />
          </label>
          <label className="text-xs font-semibold text-slate-600">Location
            <input className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm" value={location} onChange={(event) => updateFilter("location", event.target.value)} placeholder="e.g. Delhi" />
          </label>
          <label className="text-xs font-semibold text-slate-600">Sort by
            <select className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm" value={sort} onChange={(event) => updateFilter("sort", event.target.value)}>
              <option value="latest">Latest / newly added</option>
              <option value="deadline">Application deadline</option>
              <option value="views">Most viewed / popular</option>
              <option value="alphabetical">Alphabetical (A-Z)</option>
            </select>
          </label>
        </div>
      </section>
      {categoriesError && <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900" role="alert">{categoriesError}</div>}
      <section className="mt-9" aria-live="polite">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          {catalogPage && <p className="text-sm text-slate-500">{catalogPage.totalElements} results</p>}
        </div>
        {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-950" role="alert"><p className="font-semibold">We couldn’t load current vacancies.</p><p className="mt-1 text-sm">{error}</p><button className="mt-4 text-sm font-semibold underline" onClick={loadJobs}>Try again</button></div>
          : loading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading vacancies">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-52 animate-pulse rounded-2xl bg-slate-100" />)}</div>
            : catalogPage?.content.length ? <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{catalogPage.content.map((job) => <JobCard key={job.id} job={job} />)}</div>
              <nav className="mt-8 flex items-center justify-center gap-4" aria-label="Job result pages">
                <button className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-40" disabled={catalogPage.first} onClick={() => updateFilter("page", String(Math.max(1, pageNumber - 1)))}><ArrowLeft size={16} />Previous</button>
                <span className="text-sm text-slate-600">Page {catalogPage.number + 1} of {Math.max(catalogPage.totalPages, 1)}</span>
                <button className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-40" disabled={catalogPage.last} onClick={() => updateFilter("page", String(pageNumber + 1))}>Next<ArrowRight size={16} /></button>
              </nav>
            </> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <BriefcaseBusiness className="mx-auto text-slate-400" size={32} />
              <h3 className="mt-3 font-semibold text-slate-900">No matching vacancies</h3>
              <p className="mt-1 text-sm text-slate-500">Try changing your search or clearing a filter.</p>
            </div>}
      </section>
    </main>
  );
}

function DetailSection({ title, children }) {
  if (!children || (Array.isArray(children) && children.length === 0)) return null;
  return <section className="mt-7 border-t border-slate-100 pt-6"><h2 className="text-lg font-bold text-slate-900">{title}</h2><div className="mt-3 text-sm leading-6 text-slate-700">{children}</div></section>;
}

function DetailList({ entries }) {
  if (!Array.isArray(entries) || entries.length === 0) return null;
  return <ul className="list-disc space-y-1 pl-5">{entries.map((entry, index) => <li key={index}>{typeof entry === "string" ? entry : entry.label || JSON.stringify(entry)}</li>)}</ul>;
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
    apiGet(`/api/v1/jobs/${encodeURIComponent(slug)}`).then((record) => {
      if (active) setJob(record);
    }).catch((failure) => {
      if (active) setError(failure.message || "Job not found.");
    });
    apiGet(`/api/v1/jobs/${encodeURIComponent(slug)}/related`).then((records) => {
      if (active) setRelated(records);
    }).catch((failure) => {
      if (active) setRelatedError(failure.message || "Unable to load related jobs.");
    });
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    if (!job) return;
    const title = `${job.title} — Notification, Eligibility & Apply Online | NEXTVACANCY`;
    const description = `${job.shortSummary} View detailed vacancy breakdown, age criteria, salary structure, and official application portals.`;
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
    updateMetadata(title, description, `/jobs/${job.slug}`, schema);
  }, [job]);

  useEffect(() => {
    let active = true;
    if (session?.role !== "CANDIDATE") {
      setSaved(false);
      return () => { active = false; };
    }
    apiRequest("/api/v1/candidate/saved-jobs", { accessToken: session.accessToken }).then((savedJobs) => {
      if (active) setSaved(savedJobs.some((savedJob) => savedJob.job.slug === slug));
    }).catch((failure) => {
      if (active) setSavedError(failure.message || "Unable to check saved jobs.");
    });
    return () => { active = false; };
  }, [session, slug]);

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

  if (error) return <main className="mx-auto max-w-4xl px-5 py-16"><Link className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-rose-900" to="/"> <ArrowLeft size={16} />Back to vacancies</Link><div className="rounded-2xl border border-rose-200 bg-rose-50 p-6" role="alert"><h1 className="font-bold">Job unavailable</h1><p className="mt-1 text-sm">{error}</p></div></main>;
  if (!job) return <main className="mx-auto max-w-4xl px-5 py-10"><div className="h-72 animate-pulse rounded-2xl bg-slate-100" role="status">Loading job details…</div></main>;

  const dates = job.importantDates || {};
  const links = Array.isArray(job.importantLinks) ? job.importantLinks : [];
  return (
    <main className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
      <button className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-rose-900" onClick={() => navigate(-1)}><ArrowLeft size={16} />Back to vacancies</button>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-800">
          <Link className="hover:underline" to={`/category/${encodeURIComponent(job.category)}`}>{job.category}</Link>
          <span>·</span><span>{job.status.replaceAll("_", " ")}</span>{job.isVerified && <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-800">Verified</span>}
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{job.title}</h1>
        <p className="mt-3 text-lg text-slate-600">{job.organization}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1.5">{job.location}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1.5">{job.totalVacancies} vacancies</span>
          {job.jobType && <span className="rounded-full bg-slate-100 px-3 py-1.5">{job.jobType}</span>}
        </div>
        <p className="mt-8 leading-7 text-slate-700">{job.shortSummary}</p>
        <div className="mt-6">
          {session?.role === "CANDIDATE" ? <button className="rounded-xl border border-rose-900 px-4 py-2.5 text-sm font-semibold text-rose-900 disabled:opacity-50" onClick={toggleSavedJob} disabled={saving}>{saving ? "Updating…" : saved ? "Remove from saved jobs" : "Save this job"}</button>
            : !session ? <Link className="inline-block rounded-xl border border-rose-900 px-4 py-2.5 text-sm font-semibold text-rose-900" to="/login">Sign in to save this job</Link> : null}
          {savedError && <p className="mt-2 text-sm text-rose-800" role="alert">{savedError}</p>}
        </div>
        <dl className="mt-8 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
          <div><dt className="text-sm font-semibold text-slate-500">Salary / stipend</dt><dd className="mt-1 font-medium text-slate-900">{job.salaryOrStipend}</dd></div>
          <div><dt className="text-sm font-semibold text-slate-500">Qualification</dt><dd className="mt-1 font-medium text-slate-900">{job.qualificationSummary}</dd></div>
          <div><dt className="text-sm font-semibold text-slate-500">Application deadline</dt><dd className="mt-1 font-medium text-slate-900">{dates.applicationEndDate || "Not specified"}</dd></div>
          {job.department && <div><dt className="text-sm font-semibold text-slate-500">Department</dt><dd className="mt-1 font-medium text-slate-900">{job.department}</dd></div>}
        </dl>
        <DetailSection title="Important dates"><dl className="grid gap-2 sm:grid-cols-2">{Object.entries(dates).map(([key, value]) => value ? <div key={key}><dt className="font-semibold">{key.replace(/([A-Z])/g, " $1")}</dt><dd>{String(value)}</dd></div> : null)}</dl></DetailSection>
        <DetailSection title="Qualifications"><DetailList entries={job.qualificationsList} /></DetailSection>
        <DetailSection title="Vacancy breakdown"><DetailList entries={job.vacancyBreakdown} /></DetailSection>
        <DetailSection title="Age limit">{job.ageLimit && <pre className="whitespace-pre-wrap font-sans">{JSON.stringify(job.ageLimit, null, 2)}</pre>}</DetailSection>
        <DetailSection title="Salary and fee details">{job.feeStructure && <pre className="whitespace-pre-wrap font-sans">{JSON.stringify(job.feeStructure, null, 2)}</pre>}</DetailSection>
        <DetailSection title="Selection process"><DetailList entries={job.selectionProcess} /></DetailSection>
        <DetailSection title="How to apply"><DetailList entries={job.howToApplySteps} /></DetailSection>
        <DetailSection title="Required documents"><DetailList entries={job.requiredDocuments} /></DetailSection>
        <DetailSection title="Official links">
          <ul className="space-y-2">{links.map((officialLink, index) => <li key={`${officialLink.url}-${index}`}><a className="font-semibold text-rose-900 underline" href={officialLink.url} target="_blank" rel="noreferrer">{officialLink.label || officialLink.linkType}</a></li>)}</ul>
        </DetailSection>
        <DetailSection title="Frequently asked questions">
          <dl className="space-y-4">{(job.faqs || []).map((faq, index) => <div key={index}><dt className="font-semibold">{faq.question}</dt><dd>{faq.answer}</dd></div>)}</dl>
        </DetailSection>
        <p className="mt-8 text-xs text-slate-500">Posted {new Date(job.createdAt).toLocaleDateString()}</p>
      </article>
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-slate-900">Related vacancies</h2>
        {relatedError && <p className="mt-3 text-sm text-rose-800" role="alert">{relatedError}</p>}
        {related.length > 0 ? <div className="mt-4 grid gap-4 sm:grid-cols-2">{related.map((relatedJob) => <JobCard key={relatedJob.id} job={relatedJob} />)}</div> : !relatedError && <p className="mt-3 text-sm text-slate-500">No related vacancies found.</p>}
      </section>
    </main>
  );
}
