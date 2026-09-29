import { useEffect, useMemo, useState } from "react";
import { Building2, CheckCircle2, ExternalLink, MapPin, Search } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../api.js";

function ErrorState({ message }) {
  return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-950" role="alert">
    <h1 className="font-semibold">We couldn’t load this organization.</h1>
    <p className="mt-1 text-sm">{message}</p>
  </div>;
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
  return <script type="application/ld+json" dangerouslySetInnerHTML={{
    __html: JSON.stringify(value).replaceAll("<", "\\u003c"),
  }} />;
}

export function OrganizationDirectoryPage() {
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  usePageMetadata(
    "Recruiting Organizations & Commissions Directory | NEXTVACANCY",
    "Browse official career portals, recruitment circulars, exam calendars, and selection patterns across major recruitment authorities.",
    "https://nextvacancy.com/organizations",
  );

  useEffect(() => {
    let active = true;
    apiGet("/api/v1/organizations")
      .then((result) => { if (active) setOrganizations(result); })
      .catch((failure) => { if (active) setError(failure.message); });
    return () => { active = false; };
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(organizations.map((organization) => organization.categoryType).filter(Boolean))],
    [organizations],
  );
  const filtered = organizations.filter((organization) => {
    if (category !== "All" && organization.categoryType !== category) return false;
    const normalizedQuery = query.trim().toLowerCase();
    return !normalizedQuery || [
      organization.name,
      organization.shortName,
      organization.headquarters,
      organization.state,
      organization.categoryType,
    ].some((value) => value?.toLowerCase().includes(normalizedQuery));
  });

  return <main className="mx-auto max-w-7xl space-y-8 px-5 py-10 sm:py-14">
    <section className="space-y-4 rounded-3xl bg-gradient-to-br from-[#0F2744] to-[#183B66] p-6 text-white sm:p-10">
      <p className="text-xs font-bold uppercase tracking-wider text-amber-300">National &amp; State Recruitment Directory</p>
      <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Recruitment Authorities &amp; Commissions</h1>
      <p className="max-w-2xl text-sm leading-6 text-slate-200">Browse active vacancy notifications, examination calendars, and merit lists from recruitment boards, commissions, public sector banks, defence agencies, and state PSCs.</p>
    </section>

    {error ? <ErrorState message={error} /> : <>
      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6" aria-label="Organization search and filters">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <label className="relative w-full sm:max-w-md">
            <span className="sr-only">Search organizations</span>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search authority, acronym, or state" />
          </label>
          <span className="text-xs font-bold text-slate-500">Showing {filtered.length} of {organizations.length} Recruiting Bodies</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Organization categories">
          {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} className={`rounded-xl px-3.5 py-1.5 text-xs font-bold ${category === item ? "bg-[#0F2744] text-white" : "bg-slate-100 text-slate-600"}`} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
      </section>

      {filtered.length === 0 ? <section className="rounded-3xl border border-slate-200 bg-white px-5 py-16 text-center">
        <Building2 className="mx-auto text-slate-300" size={42} />
        <h2 className="mt-3 text-lg font-bold text-slate-800">No recruiting authorities found</h2>
        <p className="mt-1 text-sm text-slate-500">Try adjusting your search query or category.</p>
      </section> : <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Recruiting organizations">
        {filtered.map((organization) => <article key={organization.id} className="flex flex-col justify-between gap-5 rounded-3xl border border-slate-200 bg-white p-6 transition hover:border-blue-900 hover:shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 font-mono text-xs font-black text-blue-950">{organization.shortName}</span>
              {organization.categoryType && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">{organization.categoryType}</span>}
            </div>
            <h2 className="text-lg font-black leading-snug text-slate-900"><Link className="hover:text-blue-900" to={`/organizations/${encodeURIComponent(organization.slug)}`}>{organization.name}</Link></h2>
            {organization.tagline && <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">{organization.tagline}</p>}
            {organization.headquarters && <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500"><MapPin size={14} />{organization.headquarters}</p>}
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-emerald-700">{organization.stats.activeVacanciesCount} Active Drives</span>
            <Link className="text-xs font-bold text-blue-950 hover:underline" to={`/organizations/${encodeURIComponent(organization.slug)}`}>View Career Portal →</Link>
          </div>
        </article>)}
      </section>}
    </>}
  </main>;
}

export function OrganizationProfilePage() {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
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
      apiGet(`/api/v1/organizations/${encodeURIComponent(slug)}/jobs`, { page: 0, size: 100 }),
      apiGet(`/api/v1/organizations/${encodeURIComponent(slug)}/related`, { limit: 3 }),
    ]).then(([organization, jobPage, relatedOrganizations]) => {
      if (!active) return;
      setProfile(organization);
      setJobs(jobPage.content);
      setRelated(relatedOrganizations);
    }).catch((failure) => {
      if (!active) return;
      setNotFound(failure.status === 404);
      setError(failure.message || "Unable to load organization.");
    });
    return () => { active = false; };
  }, [slug]);

  const pageTitle = profile
    ? `${profile.name} (${profile.shortName}) Recruitment 2026, Vacancies & Results`
    : "Organization Profile | NEXTVACANCY";
  const description = profile
    ? `Explore official ${profile.name} (${profile.shortName}) career updates, latest vacancy notifications, admit cards, selection process, and syllabus on NEXTVACANCY.`
    : "Recruitment organization profile and current career updates.";
  const canonical = `https://nextvacancy.com/organizations/${encodeURIComponent(slug)}`;
  usePageMetadata(pageTitle, description, canonical);

  if (error && notFound) return <main className="mx-auto max-w-3xl px-5 py-20 text-center">
    <h1 className="text-3xl font-bold">Organization not found</h1>
    <p className="mt-3 text-sm text-slate-600">{error}</p>
    <Link className="mt-4 inline-block text-rose-900 underline" to="/organizations">Browse organizations</Link>
  </main>;
  if (error) return <main className="mx-auto max-w-7xl px-5 py-12"><ErrorState message={error} /></main>;
  if (!profile) return <main className="mx-auto max-w-7xl px-5 py-12"><div className="h-64 animate-pulse rounded-3xl bg-slate-100" aria-label="Loading organization" /></main>;

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

  return <main className="mx-auto max-w-7xl space-y-8 px-5 py-10">
    <StructuredData value={organizationSchema} />
    <StructuredData value={breadcrumbs} />
    {profile.faqs?.length > 0 && <StructuredData value={{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: profile.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    }} />}
    {jobs.length > 0 && <StructuredData value={{
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Latest Recruitment Postings by ${profile.name}`,
      itemListElement: jobs.map((job, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: job.title,
        url: `https://nextvacancy.com/jobs/${job.slug}`,
      })),
    }} />}

    <nav aria-label="Breadcrumb" className="text-sm text-slate-500"><Link className="hover:underline" to="/">Home</Link> / <Link className="hover:underline" to="/organizations">Organizations</Link> / <span>{profile.shortName}</span></nav>
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl border border-slate-200 bg-blue-50 p-4"><Building2 className="text-blue-950" size={36} /></div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 font-mono text-xs font-black text-blue-950">{profile.shortName}</span>
              {profile.verified && <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800"><CheckCircle2 size={13} />Verified Authority</span>}
              {profile.categoryType && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">{profile.categoryType}</span>}
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{profile.name}</h1>
            {profile.tagline && <p className="mt-1 max-w-2xl text-sm text-slate-600">{profile.tagline}</p>}
          </div>
        </div>
        {profile.website && <a className="inline-flex items-center gap-2 self-start rounded-xl bg-[#0F2744] px-4 py-2.5 text-xs font-bold text-white" href={profile.website} target="_blank" rel="noopener noreferrer">Official Website <ExternalLink size={14} /></a>}
      </div>
      <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 text-xs sm:grid-cols-4">
        {profile.headquarters && <div><span className="text-slate-500">Headquarters</span><p className="mt-1 font-bold text-slate-900">{profile.headquarters}</p></div>}
        {profile.establishedYear && <div><span className="text-slate-500">Established</span><p className="mt-1 font-bold text-slate-900">Year {profile.establishedYear}</p></div>}
        {profile.state && <div><span className="text-slate-500">Jurisdiction</span><p className="mt-1 font-bold text-slate-900">{profile.state}</p></div>}
        {profile.categoryType && <div><span className="text-slate-500">Recruitment Body</span><p className="mt-1 font-bold text-slate-900">{profile.categoryType}</p></div>}
      </div>
    </section>

    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Organization statistics">
      <Stat label="Active Recruitment Drives" value={`${profile.stats.activeVacanciesCount} Active`} />
      <Stat label="Total Recruitment Posts" value={profile.stats.totalPostsCount.toLocaleString("en-IN")} />
      <Stat label="Admit Cards & Hall Tickets" value={`${profile.stats.admitCardsCount} Available`} />
      <Stat label="Declared Results & Scorecards" value={`${profile.stats.resultsCount} Released`} />
    </section>

    <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-black text-slate-900">About {profile.name} ({profile.shortName})</h2>
      {profile.description && <p className="text-sm leading-6 text-slate-700">{profile.description}</p>}
      {profile.aboutDetails?.length > 0 && <ul className="grid gap-2 sm:grid-cols-2">{profile.aboutDetails.map((detail) => <li key={detail} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{detail}</li>)}</ul>}
      {profile.selectionProcess?.length > 0 && <div><h3 className="font-bold text-slate-900">Standard Examination &amp; Recruitment Methodology</h3><ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{profile.selectionProcess.map((step, index) => <li key={`${index}-${step}`} className="rounded-xl border border-blue-100 bg-blue-50/50 p-4"><span className="text-xs font-bold text-blue-900">Stage 0{index + 1}</span><p className="mt-2 text-sm font-semibold text-slate-800">{step}</p></li>)}</ol></div>}
      {profile.keyDepartments?.length > 0 && <div><h3 className="font-bold text-slate-900">Participating Ministries, Offices &amp; Departments</h3><div className="mt-2 flex flex-wrap gap-2">{profile.keyDepartments.map((department) => <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold" key={department}>{department}</span>)}</div></div>}
    </section>

    <section className="space-y-4" aria-labelledby="organization-jobs-heading">
      <h2 id="organization-jobs-heading" className="text-2xl font-black text-slate-950">Recruitment posts by {profile.shortName}</h2>
      {jobs.length === 0 ? <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600">No current public recruitment posts were found.</p> : <ul className="grid gap-3 md:grid-cols-2">{jobs.map((job) => <li key={job.id} className="rounded-2xl border border-slate-200 bg-white p-5"><Link className="font-bold text-blue-950 hover:underline" to={`/jobs/${encodeURIComponent(job.slug)}`}>{job.title}</Link><p className="mt-2 text-sm text-slate-600">{job.shortSummary}</p><p className="mt-3 text-xs font-semibold text-slate-500">{job.status.replaceAll("_", " ")} · {job.location}</p></li>)}</ul>}
    </section>

    {profile.faqs?.length > 0 && <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-black text-slate-900">Frequently Asked Questions</h2>
      {profile.faqs.map((faq) => <details className="border-b border-slate-100 py-3 last:border-0" key={faq.question}><summary className="cursor-pointer font-semibold text-slate-900">{faq.question}</summary><p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p></details>)}
    </section>}

    {related.length > 0 && <section className="space-y-4"><h2 className="text-xl font-black text-slate-950">Related Recruiting Authorities</h2><div className="grid gap-4 sm:grid-cols-3">{related.map((organization) => <Link className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-900" key={organization.id} to={`/organizations/${encodeURIComponent(organization.slug)}`}><span className="font-mono text-xs font-bold text-blue-900">{organization.shortName}</span><span className="mt-2 block font-bold text-slate-900">{organization.name}</span></Link>)}</div></section>}
  </main>;
}

function Stat({ label, value }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xl font-black text-blue-950">{value}</p><p className="mt-1 text-xs font-bold text-slate-500">{label}</p></div>;
}
