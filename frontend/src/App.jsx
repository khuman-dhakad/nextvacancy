import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Building2, MapPin, Search } from "lucide-react";
import { Link, Route, Routes, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { apiGet, apiRequest } from "./api.js";
import { AuthProvider, useAuth } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import { OrganizationDirectoryPage, OrganizationProfilePage } from "./organization/OrganizationPages.jsx";
import {
  AboutPage,
  AccountPage,
  ContactPage,
  DisclaimerPage,
  ForgotPasswordPage,
  LoginPage,
  NotificationCenterPage,
  PrivacyPolicyPage,
  RegisterPage,
  ResetPasswordPage,
  SettingsPage,
  TermsPage,
  VerifyEmailPage,
} from "./auth/AuthPages.jsx";
import {
  AdminAnalyticsPage,
  AdminCategoriesPage,
  AdminDashboardPage,
  AdminJobEditorPage,
  AdminJobsPage,
  AdminOrganizationsPage,
} from "./admin/AdminPages.jsx";
import { PublicCatalogPage, PublicJobDetails } from "./catalog/PublicCatalogPages.jsx";
import { OfflinePage, PwaSupport } from "./pwa/PwaSupport.jsx";

function Header() {
  const { session, signOut } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link className="text-xl font-extrabold tracking-tight text-rose-900" to="/">
          NEXTVACANCY
        </Link>
        <span className="hidden text-sm text-slate-500 sm:block">Verified opportunities. Clear next steps.</span>
        <nav className="flex items-center gap-4">
          <Link className="text-sm font-semibold text-rose-900 hover:text-rose-700" to="/">Browse jobs</Link>
          <Link className="hidden text-sm font-semibold text-rose-900 hover:text-rose-700 md:inline" to="/government-jobs">Government</Link>
          <Link className="hidden text-sm font-semibold text-rose-900 hover:text-rose-700 md:inline" to="/private-jobs">Private</Link>
          <Link className="hidden text-sm font-semibold text-rose-900 hover:text-rose-700 md:inline" to="/admit-cards">Admit cards</Link>
          <Link className="hidden text-sm font-semibold text-rose-900 hover:text-rose-700 md:inline" to="/results">Results</Link>
          <Link className="hidden text-sm font-semibold text-rose-900 hover:text-rose-700 md:inline" to="/search">Search</Link>
          {session ? (
            <>
              <Link className="text-sm font-semibold text-rose-900 hover:text-rose-700" to={session.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}>Account</Link>
              {session.role === "CANDIDATE" && (
                <>
                  <Link className="text-sm font-semibold text-rose-900 hover:text-rose-700" to="/notifications">Alerts</Link>
                  <Link className="text-sm font-semibold text-rose-900 hover:text-rose-700" to="/settings">Settings</Link>
                </>
              )}
            </>
          ) : <Link className="text-sm font-semibold text-rose-900 hover:text-rose-700" to="/login">Sign in</Link>}
        </nav>
      </div>
    </header>
  );
}

function ErrorMessage({ message, retry }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-950" role="alert">
      <p className="font-semibold">We couldn’t load current vacancies.</p>
      <p className="mt-1 text-sm">{message}</p>
      {retry && <button className="mt-4 text-sm font-semibold underline" onClick={retry}>Try again</button>}
    </div>
  );
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

function JobDirectory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(null);
  const [error, setError] = useState("");
  const pageNumber = Math.max(0, Number(searchParams.get("page") || 0));
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";

  async function loadCategories() {
    try {
      setCategories(await apiGet("/api/v1/categories"));
    } catch (caught) {
      setError(caught.message);
    }
  }

  async function loadJobs() {
    setError("");
    try {
      setPage(await apiGet("/api/v1/jobs", { page: pageNumber, size: 12, q: query, category, status }));
    } catch (caught) {
      setPage(null);
      setError(caught.message);
    }
  }

  useEffect(() => { loadCategories(); }, []);
  useEffect(() => { loadJobs(); }, [pageNumber, query, category, status]);

  function updateFilter(name, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(name, value);
    else next.delete(name);
    next.delete("page");
    setSearchParams(next);
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:py-14">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950 via-rose-900 to-fuchsia-900 px-6 py-10 text-white sm:px-10 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-200">Current openings</p>
        <h1 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">Find a role that fits your skills and location.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-rose-100">Browse vacancies, check eligibility and keep track of important dates.</p>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-label="Job search filters">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_200px]">
          <label className="relative">
            <span className="sr-only">Search vacancies</span>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100" value={query} onChange={(event) => updateFilter("q", event.target.value)} placeholder="Role, organization, or location" />
          </label>
          <label>
            <span className="sr-only">Filter by category</span>
            <select className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 outline-none focus:border-rose-500" value={category} onChange={(event) => updateFilter("category", event.target.value)}>
              <option value="">All categories</option>
              {categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
            </select>
          </label>
          <label>
            <span className="sr-only">Filter by status</span>
            <select className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 outline-none focus:border-rose-500" value={status} onChange={(event) => updateFilter("status", event.target.value)}>
              <option value="">All statuses</option>
              <option value="OPEN">Open</option>
              <option value="ENDING_SOON">Ending soon</option>
            </select>
          </label>
        </div>
      </section>

      <section className="mt-9" aria-live="polite">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-rose-800">OPPORTUNITIES</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Latest vacancies</h2>
          </div>
          {page && <p className="text-sm text-slate-500">{page.totalElements} results</p>}
        </div>
        {error ? <ErrorMessage message={error} retry={loadJobs} /> : !page ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading vacancies">
            {Array.from({ length: 6 }, (_, index) => <div key={index} className="h-52 animate-pulse rounded-2xl bg-slate-100" />)}
          </div>
        ) : page.content.length ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{page.content.map((job) => <JobCard key={job.id} job={job} />)}</div>
            <nav className="mt-8 flex items-center justify-center gap-4" aria-label="Job result pages">
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40" disabled={page.first} onClick={() => updateFilter("page", String(pageNumber - 1))}><ArrowLeft size={16} />Previous</button>
              <span className="text-sm text-slate-600">Page {page.number + 1} of {Math.max(page.totalPages, 1)}</span>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40" disabled={page.last} onClick={() => updateFilter("page", String(pageNumber + 1))}>Next<ArrowRight size={16} /></button>
            </nav>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <BriefcaseBusiness className="mx-auto text-slate-400" size={32} />
            <h3 className="mt-3 font-semibold text-slate-900">No matching vacancies</h3>
            <p className="mt-1 text-sm text-slate-500">Try changing your search or clearing a filter.</p>
          </div>
        )}
      </section>
    </main>
  );
}

function JobDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [savedError, setSavedError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    apiGet(`/api/v1/jobs/${encodeURIComponent(slug)}`)
      .then((result) => { if (active) setJob(result); })
      .catch((caught) => { if (active) setError(caught.message); });
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    let active = true;
    if (session?.role !== "CANDIDATE") {
      setSaved(false);
      return () => { active = false; };
    }
    apiRequest("/api/v1/candidate/saved-jobs", { accessToken: session.accessToken })
      .then((savedJobs) => {
        if (active) setSaved(savedJobs.some((savedJob) => savedJob.job.slug === slug));
      })
      .catch((caught) => { if (active) setSavedError(caught.message); });
    return () => { active = false; };
  }, [session, slug]);

  async function toggleSavedJob() {
    if (!job || !session) return;
    setSaving(true);
    setSavedError("");
    try {
      if (saved) {
        await apiRequest(`/api/v1/candidate/saved-jobs/${encodeURIComponent(job.id)}`, {
          method: "DELETE",
          accessToken: session.accessToken,
        });
        setSaved(false);
      } else {
        await apiRequest(`/api/v1/candidate/saved-jobs/${encodeURIComponent(job.id)}`, {
          method: "PUT",
          accessToken: session.accessToken,
        });
        setSaved(true);
      }
    } catch (caught) {
      setSavedError(caught.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-4xl px-5 py-10 sm:py-14">
      <button className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-rose-900" onClick={() => navigate(-1)}><ArrowLeft size={16} />Back to vacancies</button>
      {error ? <ErrorMessage message={error} /> : !job ? <div className="h-72 animate-pulse rounded-2xl bg-slate-100" /> : (
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-rose-800">{job.category}</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{job.title}</h1>
          <p className="mt-3 text-lg text-slate-600">{job.organization}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1.5">{job.location}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5">{job.totalVacancies} vacancies</span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5">{job.status.replaceAll("_", " ").toLowerCase()}</span>
          </div>
          <p className="mt-8 leading-7 text-slate-700">{job.shortSummary}</p>
          <div className="mt-6">
            {session?.role === "CANDIDATE" ? (
              <button className="rounded-xl border border-rose-900 px-4 py-2.5 text-sm font-semibold text-rose-900 disabled:opacity-50" onClick={toggleSavedJob} disabled={saving}>
                {saving ? "Updating…" : saved ? "Remove from saved jobs" : "Save this job"}
              </button>
            ) : !session ? (
              <Link className="inline-block rounded-xl border border-rose-900 px-4 py-2.5 text-sm font-semibold text-rose-900" to="/login">Sign in to save this job</Link>
            ) : null}
            {savedError && <p className="mt-2 text-sm text-rose-800" role="alert">{savedError}</p>}
          </div>
          <dl className="mt-8 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
            <div><dt className="text-sm font-semibold text-slate-500">Salary / stipend</dt><dd className="mt-1 font-medium text-slate-900">{job.salaryOrStipend}</dd></div>
            <div><dt className="text-sm font-semibold text-slate-500">Qualification</dt><dd className="mt-1 font-medium text-slate-900">{job.qualificationSummary}</dd></div>
          </dl>
          <p className="mt-8 text-xs text-slate-500">Posted {new Date(job.createdAt).toLocaleDateString()}</p>
        </article>
      )}
    </main>
  );
}

function AppRoutes() {
  const { session } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <PwaSupport />
      <Routes>
        <Route path="/" element={<PublicCatalogPage mode="home" />} />
        <Route path="/search" element={<PublicCatalogPage mode="search" />} />
        <Route path="/results" element={<PublicCatalogPage mode="results" />} />
        <Route path="/government-jobs" element={<PublicCatalogPage mode="government" />} />
        <Route path="/private-jobs" element={<PublicCatalogPage mode="private" />} />
        <Route path="/admit-cards" element={<PublicCatalogPage mode="admitCards" />} />
        <Route path="/category/:category" element={<PublicCatalogPage mode="category" />} />
        <Route path="/jobs/:slug" element={<PublicJobDetails />} />
        <Route path="/organizations" element={<OrganizationDirectoryPage />} />
        <Route path="/organizations/:slug" element={<OrganizationProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<LoginPage admin />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/offline" element={<OfflinePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route element={<ProtectedRoute role="CANDIDATE" />}>
          <Route path="/dashboard" element={<AccountPage />} />
          <Route path="/notifications" element={<NotificationCenterPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route element={<ProtectedRoute role="ADMIN" />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/jobs" element={<AdminJobsPage />} />
          <Route path="/admin/jobs/new" element={<AdminJobEditorPage />} />
          <Route path="/admin/jobs/:id/edit" element={<AdminJobEditorPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/organizations" element={<AdminOrganizationsPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        </Route>
        <Route path="*" element={<main className="mx-auto max-w-3xl px-5 py-20 text-center"><h1 className="text-3xl font-bold">Page not found</h1><Link className="mt-4 inline-block text-rose-900 underline" to="/">Browse vacancies</Link></main>} />
      </Routes>
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">NEXTVACANCY · Verified opportunities. Clear next steps.</footer>
    </div>
  );
}

export default function App() {
  return <AuthProvider><AppRoutes /></AuthProvider>;
}
