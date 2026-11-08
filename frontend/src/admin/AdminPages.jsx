import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code,
  Copy,
  Edit3,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  GraduationCap,
  HelpCircle,
  Layers,
  LayoutDashboard,
  Link2,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

const jobStatuses = ["OPEN", "ENDING_SOON", "CLOSED", "ADMIT_CARD_OUT", "RESULT_OUT", "ANSWER_KEY_OUT"];
const jobCategories = [
  "government",
  "private",
  "admit-card",
  "result",
  "answer-key",
  "scholarship",
  "scheme",
  "internship",
  "apprenticeship",
  "work-from-home",
];

function useAdminApi() {
  const { session } = useAuth();
  return useCallback(
    (path, options = {}) =>
      apiRequest(path, {
        ...options,
        accessToken: session?.accessToken,
      }),
    [session?.accessToken]
  );
}

function AdminNav({ activeTab }) {
  const links = [
    { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Jobs", to: "/admin/jobs", icon: FileText },
    { label: "Categories", to: "/admin/categories", icon: GraduationCap },
    { label: "Organizations", to: "/admin/organizations", icon: Building2 },
    { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  ];

  return (
    <nav className="flex flex-wrap gap-1.5 rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-2xs">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = activeTab === link.label;
        return (
          <Link
            key={link.to}
            to={link.to}
            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              isActive
                ? "bg-rose-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Icon size={14} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SectionHeader({ title, subtitle, action, activeTab = "Dashboard" }) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-900">
              <Shield size={11} /> Admin Control
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      <AdminNav activeTab={activeTab} />
    </div>
  );
}

function Notice({ message, type = "error", onClose }) {
  if (!message) return null;
  const isSuccess = type === "success";
  return (
    <div
      className={`mb-4 flex items-center justify-between gap-3 rounded-2xl border p-4 text-xs font-semibold shadow-2xs ${
        isSuccess
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-rose-200 bg-rose-50 text-rose-900"
      }`}
      role={isSuccess ? "status" : "alert"}
    >
      <div className="flex items-center gap-2.5">
        {isSuccess ? <CheckCircle2 size={16} className="shrink-0 text-emerald-700" /> : <AlertCircle size={16} className="shrink-0 text-rose-700" />}
        <span>{message}</span>
      </div>
      {onClose && (
        <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-black/5">
          <X size={14} />
        </button>
      )}
    </div>
  );
}

function Loading({ label = "Loading data…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center" role="status">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-rose-900 border-t-transparent" />
      <p className="mt-3 text-xs font-semibold text-slate-500">{label}</p>
    </div>
  );
}

function StatCard({ label, value, tone = "rose", icon: Icon }) {
  const tones = {
    rose: "bg-rose-50/70 border-rose-200/80 text-rose-950",
    slate: "bg-slate-50 border-slate-200/90 text-slate-900",
    emerald: "bg-emerald-50/70 border-emerald-200/80 text-emerald-950",
    amber: "bg-amber-50/70 border-amber-200/80 text-amber-950",
    blue: "bg-blue-50/70 border-blue-200/80 text-blue-950",
  };
  return (
    <div className={`rounded-2xl border p-5 shadow-2xs transition hover:shadow-xs ${tones[tone]}`}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
        {Icon && <Icon size={16} className="text-slate-400" />}
      </div>
      <p className="mt-2 text-3xl font-black tracking-tight">{value ?? 0}</p>
    </div>
  );
}

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600";

function Field({ label, value, onChange, required = false, type = "text", maxLength, placeholder, hint }) {
  return (
    <label className="block text-xs font-bold text-slate-800">
      <div className="flex items-center justify-between">
        <span>
          {label} {required && <span className="text-rose-700">*</span>}
        </span>
        {hint && <span className="text-[10px] font-normal text-slate-400">{hint}</span>}
      </div>
      <input
        className={inputClass}
        type={type}
        value={value ?? ""}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, required = false, rows = 3, placeholder, hint }) {
  return (
    <label className="block text-xs font-bold text-slate-800">
      <div className="flex items-center justify-between">
        <span>
          {label} {required && <span className="text-rose-700">*</span>}
        </span>
        {hint && <span className="text-[10px] font-normal text-slate-400">{hint}</span>}
      </div>
      <textarea
        className={inputClass}
        rows={rows}
        required={required}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function JsonField({ label, value, onChange, rows = 4, hint, defaultTemplate }) {
  const [isValid, setIsValid] = useState(true);
  const [formatError, setFormatError] = useState("");

  useEffect(() => {
    try {
      if (value) JSON.parse(value);
      setIsValid(true);
      setFormatError("");
    } catch (e) {
      setIsValid(false);
      setFormatError(e.message);
    }
  }, [value]);

  function formatJson() {
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setFormatError(`Syntax error: ${e.message}`);
    }
  }

  function resetTemplate() {
    if (defaultTemplate) {
      onChange(JSON.stringify(defaultTemplate, null, 2));
    }
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800">
          {label} <span className="font-mono text-[10px] text-slate-400">(JSON)</span>
        </label>
        <div className="flex items-center gap-2">
          {defaultTemplate && (
            <button
              type="button"
              onClick={resetTemplate}
              className="text-[10px] font-bold text-slate-500 hover:text-slate-900"
            >
              Default
            </button>
          )}
          <button
            type="button"
            onClick={formatJson}
            className="text-[10px] font-bold text-rose-900 hover:underline"
          >
            Format
          </button>
        </div>
      </div>
      {hint && <p className="text-[10px] text-slate-400">{hint}</p>}
      <textarea
        className={`${inputClass} font-mono text-[11px] ${
          !isValid ? "border-rose-400 focus:border-rose-600 focus:ring-rose-200" : ""
        }`}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        spellCheck="false"
      />
      {!isValid && <p className="text-[10px] font-semibold text-rose-700">{formatError}</p>}
    </div>
  );
}

const blankJob = {
  title: "",
  slug: "",
  shortSummary: "",
  organization: "",
  organizationLogo: "",
  department: "",
  category: "government",
  status: "CLOSED",
  location: "",
  totalVacancies: "",
  salaryOrStipend: "",
  jobType: "",
  applicationMode: "",
  qualificationSummary: "",
  qualificationsList: [],
  importantDates: {},
  feeStructure: null,
  ageLimit: null,
  vacancyBreakdown: [],
  selectionProcess: [],
  howToApplySteps: [],
  requiredDocuments: [],
  importantLinks: [],
  faqs: [],
  isFeatured: false,
  isTrending: false,
  isVerified: true,
};

function toJsonText(value, emptyValue) {
  return JSON.stringify(value ?? emptyValue, null, 2);
}

export function AdminDashboardPage() {
  const request = useAdminApi();
  const [summary, setSummary] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [dashboard, jobsPage, categoryList, orgList, activityList] = await Promise.all([
        request("/api/v1/admin/dashboard"),
        request("/api/v1/admin/jobs?page=0&size=6"),
        request("/api/v1/admin/categories"),
        request("/api/v1/admin/organizations"),
        request("/api/v1/admin/activity?limit=8"),
      ]);
      setSummary(dashboard);
      setJobs(jobsPage.content ?? []);
      setCategories(categoryList);
      setOrganizations(orgList);
      setActivity(activityList);
    } catch (failure) {
      setError(failure.message || "Unable to load the admin dashboard.");
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    load();
  }, [load]);

  const cards = useMemo(
    () =>
      summary
        ? [
            { label: "Total Openings", value: summary.totalJobs, tone: "rose", icon: Briefcase },
            { label: "Open Drives", value: summary.openJobs, tone: "emerald", icon: CheckCircle2 },
            { label: "Authorities", value: summary.totalOrganizations, tone: "slate", icon: Building2 },
            { label: "Active Categories", value: summary.activeCategories, tone: "amber", icon: GraduationCap },
            { label: "Total Views", value: summary.totalViews, tone: "blue", icon: Eye },
          ]
        : [],
    [summary]
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <SectionHeader
        title="Admin Control Center"
        subtitle="Manage verified recruitment postings, master taxonomy records, and view system metrics."
        activeTab="Dashboard"
        action={
          <Link
            to="/admin/jobs/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-rose-800"
          >
            <Plus size={15} />
            <span>Create New Job</span>
          </Link>
        }
      />

      <Notice message={error} />

      {loading ? (
        <Loading label="Loading administration dashboard metrics…" />
      ) : (
        <>
          {/* KPI Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {cards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>

          {/* Quick Management Grid */}
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
            {/* Recent Vacancies */}
            <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-950">Recent Persisted Vacancies</h2>
                  <p className="mt-0.5 text-xs text-slate-500">Latest active database records.</p>
                </div>
                <Link to="/admin/jobs" className="text-xs font-bold text-rose-900 hover:underline">
                  Manage all jobs →
                </Link>
              </div>

              {jobs.length === 0 ? (
                <p className="py-10 text-center text-xs text-slate-500">No database records found.</p>
              ) : (
                <div className="mt-4 divide-y divide-slate-100">
                  {jobs.map((job) => (
                    <article key={job.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <Link
                          to={`/admin/jobs/${encodeURIComponent(job.id)}/edit`}
                          className="font-bold text-xs text-slate-900 hover:text-rose-900 truncate block"
                        >
                          {job.title}
                        </Link>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {job.organization} · {job.location} · {job.totalVacancies} vacancies
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          job.status === "OPEN"
                            ? "bg-emerald-50 text-emerald-800"
                            : job.status === "ENDING_SOON"
                            ? "bg-rose-50 text-rose-800"
                            : job.status === "ADMIT_CARD_OUT"
                            ? "bg-amber-50 text-amber-800"
                            : job.status === "RESULT_OUT"
                            ? "bg-blue-50 text-blue-800"
                            : "bg-slate-100 text-slate-700"
                        }`}>
                          {job.status}
                        </span>
                        <Link
                          to={`/admin/jobs/${encodeURIComponent(job.id)}/edit`}
                          className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* Master Data Snapshot */}
            <div className="space-y-6">
              <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-slate-950">Master Data Collections</h2>
                <p className="mt-0.5 text-xs text-slate-500">Taxonomies and recruiting organizations.</p>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                    <div className="flex items-center gap-2.5">
                      <GraduationCap size={16} className="text-rose-900" />
                      <span className="text-xs font-bold text-slate-800">Job Categories</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-900">{categories.length}</span>
                      <Link to="/admin/categories" className="text-xs font-bold text-rose-900 hover:underline">
                        Manage
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                    <div className="flex items-center gap-2.5">
                      <Building2 size={16} className="text-blue-900" />
                      <span className="text-xs font-bold text-slate-800">Organizations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-900">{organizations.length}</span>
                      <Link to="/admin/organizations" className="text-xs font-bold text-rose-900 hover:underline">
                        Manage
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              {/* Quick Actions Panel */}
              <section className="rounded-3xl border border-rose-200 bg-rose-50/60 p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900">Quick Actions</h3>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link
                    to="/admin/jobs/new"
                    className="flex items-center justify-center rounded-xl bg-white p-2.5 text-xs font-bold text-slate-800 shadow-2xs hover:border-slate-300"
                  >
                    + Post Vacancy
                  </Link>
                  <Link
                    to="/admin/categories"
                    className="flex items-center justify-center rounded-xl bg-white p-2.5 text-xs font-bold text-slate-800 shadow-2xs hover:border-slate-300"
                  >
                    + Add Category
                  </Link>
                  <Link
                    to="/admin/organizations"
                    className="flex items-center justify-center rounded-xl bg-white p-2.5 text-xs font-bold text-slate-800 shadow-2xs hover:border-slate-300"
                  >
                    + Add Authority
                  </Link>
                  <Link
                    to="/admin/analytics"
                    className="flex items-center justify-center rounded-xl bg-white p-2.5 text-xs font-bold text-slate-800 shadow-2xs hover:border-slate-300"
                  >
                    View Metrics
                  </Link>
                </div>
              </section>
            </div>
          </div>

          {/* Audit Activity Stream */}
          <section className="mt-8 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-950">Administrative Audit Activity</h2>
            <p className="mt-0.5 text-xs text-slate-500">Track database modifications and author actions.</p>

            {activity.length === 0 ? (
              <p className="mt-4 text-xs text-slate-500">No audit activity logged yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-slate-100">
                {activity.map((entry) => (
                  <li key={entry.id} className="py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>
                      <p className="font-bold text-slate-900">
                        <span className="text-rose-900">{entry.action}</span> · {entry.entityTitle || entry.entity}
                      </p>
                      <p className="mt-0.5 text-slate-500">{entry.details}</p>
                    </div>
                    <time className="text-[11px] text-slate-400 font-mono" dateTime={entry.timestamp}>
                      {new Date(entry.timestamp).toLocaleString()}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export function AdminJobsPage() {
  const request = useAdminApi();
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(location.state?.adminNotice || "");
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const page = await request("/api/v1/admin/jobs?page=0&size=100");
      setJobs(page.content ?? []);
    } catch (failure) {
      setError(failure.message || "Unable to load admin jobs.");
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    load();
  }, [load]);

  async function changeStatus(job, status) {
    setError("");
    setNotice("");
    try {
      await request(`/api/v1/admin/jobs/${encodeURIComponent(job.id)}/status`, {
        method: "PATCH",
        body: { status },
      });
      setNotice(`Publication status for "${job.title}" changed to ${status}.`);
      await load();
    } catch (failure) {
      setError(failure.message || "Unable to update job status.");
    }
  }

  async function duplicate(job) {
    setError("");
    setNotice("");
    try {
      await request(`/api/v1/admin/jobs/${encodeURIComponent(job.id)}/duplicate`, { method: "POST" });
      setNotice(`Job "${job.title}" duplicated as a closed draft.`);
      await load();
    } catch (failure) {
      setError(failure.message || "Unable to duplicate job.");
    }
  }

  async function remove(job) {
    if (!window.confirm(`Delete "${job.title}"? This cannot be undone.`)) return;
    setError("");
    setNotice("");
    try {
      await request(`/api/v1/admin/jobs/${encodeURIComponent(job.id)}`, { method: "DELETE" });
      setNotice("Job deleted.");
      await load();
    } catch (failure) {
      setError(failure.message || "Unable to delete job.");
    }
  }

  async function bulkStatus(status) {
    setError("");
    setNotice("");
    try {
      const updated = await request("/api/v1/admin/jobs/bulk/status", {
        method: "PATCH",
        body: { ids: selectedIds, status },
      });
      setNotice(`${updated} jobs updated to ${status}.`);
      setSelectedIds([]);
      await load();
    } catch (failure) {
      setError(failure.message || "Unable to update selected job statuses.");
    }
  }

  async function bulkRemove() {
    if (!selectedIds.length || !window.confirm(`Delete ${selectedIds.length} selected jobs? This cannot be undone.`))
      return;
    setError("");
    setNotice("");
    try {
      const deleted = await request("/api/v1/admin/jobs/bulk/delete", {
        method: "POST",
        body: { ids: selectedIds },
      });
      setNotice(`${deleted} jobs permanently deleted.`);
      setSelectedIds([]);
      await load();
    } catch (failure) {
      setError(failure.message || "Unable to delete selected jobs.");
    }
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (filterStatus && job.status !== filterStatus) return false;
      const q = filterQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        job.title?.toLowerCase().includes(q) ||
        job.organization?.toLowerCase().includes(q) ||
        job.location?.toLowerCase().includes(q) ||
        job.category?.toLowerCase().includes(q)
      );
    });
  }, [jobs, filterStatus, filterQuery]);

  const allFilteredSelected =
    filteredJobs.length > 0 && filteredJobs.every((j) => selectedIds.includes(j.id));

  function toggleSelectAll() {
    if (allFilteredSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredJobs.map((j) => j.id));
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-6">
      <SectionHeader
        title="Job Inventory &amp; Circulars"
        subtitle="Author, edit, duplicate, publish, and delete persisted vacancy records."
        activeTab="Jobs"
        action={
          <Link
            to="/admin/jobs/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-800"
          >
            <Plus size={15} />
            <span>Create New Job</span>
          </Link>
        }
      />

      <Notice message={error} onClose={() => setError("")} />
      <Notice message={notice} type="success" onClose={() => setNotice("")} />

      {/* Filter & Search Bar */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
        <div className="grid gap-3 sm:grid-cols-[1fr_200px_auto]">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search by title, organization, or location..."
              className="w-full rounded-xl border border-slate-300 bg-white pr-4 pl-10 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
          >
            <option value="">All Statuses</option>
            {jobStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={load}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw size={13} />
            <span>Refresh</span>
          </button>
        </div>
      </section>

      {/* Bulk Actions Floating Bar */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs">
          <span className="font-bold text-rose-950">{selectedIds.length} vacancies selected</span>
          <label className="sr-only" htmlFor="bulk-job-status">
            Set selected job status
          </label>
          <select
            id="bulk-job-status"
            className="rounded-xl border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900"
            defaultValue=""
            onChange={(event) => {
              if (event.target.value) bulkStatus(event.target.value);
              event.target.value = "";
            }}
          >
            <option value="">Bulk Change Status…</option>
            {jobStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={bulkRemove}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-900 px-3.5 py-1.5 font-bold text-white shadow-xs hover:bg-rose-800"
          >
            <Trash2 size={13} />
            <span>Delete Selected</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-100"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Main Jobs Listing */}
      {loading ? (
        <Loading label="Loading jobs inventory from PostgreSQL…" />
      ) : filteredJobs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-xs text-slate-500">
          <Briefcase size={36} className="mx-auto text-slate-300" />
          <p className="mt-3 text-sm font-bold text-slate-800">No jobs match the current filter</p>
          <p className="mt-1">Try resetting your status or search keywords.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2 text-xs font-semibold text-slate-500">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={allFilteredSelected}
                onChange={toggleSelectAll}
                className="rounded border-slate-300 text-rose-900 focus:ring-rose-600"
              />
              <span>Select all ({filteredJobs.length})</span>
            </label>
            <span>Showing {filteredJobs.length} records</span>
          </div>

          {filteredJobs.map((job) => {
            const isSelected = selectedIds.includes(job.id);
            return (
              <article
                key={job.id}
                className={`rounded-2xl border p-4 shadow-2xs transition ${
                  isSelected
                    ? "border-rose-300 bg-rose-50/40"
                    : "border-slate-200/90 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      aria-label={`Select ${job.title}`}
                      onChange={(e) =>
                        setSelectedIds((prev) =>
                          e.target.checked ? [...prev, job.id] : prev.filter((id) => id !== job.id)
                        )
                      }
                      className="mt-1 rounded border-slate-300 text-rose-900 focus:ring-rose-600"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                          {job.category}
                        </span>
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          job.status === "OPEN"
                            ? "bg-emerald-50 text-emerald-800"
                            : job.status === "ENDING_SOON"
                            ? "bg-rose-50 text-rose-800"
                            : job.status === "ADMIT_CARD_OUT"
                            ? "bg-amber-50 text-amber-800"
                            : job.status === "RESULT_OUT"
                            ? "bg-blue-50 text-blue-800"
                            : "bg-slate-100 text-slate-700"
                        }`}>
                          {job.status}
                        </span>
                        {job.isVerified && (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            Verified
                          </span>
                        )}
                        {job.isFeatured && (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            Featured
                          </span>
                        )}
                      </div>
                      <h2 className="mt-1.5 text-sm font-bold text-slate-950">
                        <Link to={`/admin/jobs/${encodeURIComponent(job.id)}/edit`} className="hover:text-rose-900">
                          {job.title}
                        </Link>
                      </h2>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {job.organization} · {job.location} · {job.totalVacancies} vacancies · {job.viewsCount || 0} views
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] text-slate-400">/{job.slug}</p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="sr-only" htmlFor={`status-${job.id}`}>
                      Status for {job.title}
                    </label>
                    <select
                      id={`status-${job.id}`}
                      className="rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-rose-600"
                      value={job.status}
                      onChange={(event) => changeStatus(job, event.target.value)}
                    >
                      {jobStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    <Link
                      to={`/jobs/${encodeURIComponent(job.slug)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      title="View public page"
                    >
                      <ExternalLink size={13} />
                      <span>View</span>
                    </Link>

                    <Link
                      to={`/admin/jobs/${encodeURIComponent(job.id)}/edit`}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => duplicate(job)}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      <Copy size={13} />
                      <span>Duplicate</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => remove(job)}
                      className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-800 hover:bg-rose-100"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export function AdminJobEditorPage() {
  const request = useAdminApi();
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);

  const [activeFormTab, setActiveFormTab] = useState("core");
  const [job, setJob] = useState(blankJob);
  const [advancedMode, setAdvancedMode] = useState(false);

  const [visualForm, setVisualForm] = useState({
    notificationDate: "",
    applicationStart: "",
    applicationEnd: "",
    examDate: "",
    admitCardDate: "",
    generalFee: "Rs. 100",
    scStFee: "Nil / Exempted",
    paymentMode: "Online (Net Banking / Debit / UPI)",
    minAge: "18",
    maxAge: "30",
    asOfDate: "",
    relaxationSummary: "As per Govt rules (OBC 3 yrs, SC/ST 5 yrs)",
    applyOnlineUrl: "",
    notificationPdfUrl: "",
    officialWebsiteUrl: "",
    qualificationsText: "",
    selectionProcessText: "Written Examination (Objective / CBT)\nDocument Verification\nMedical Examination",
    howToApplyText: "Visit the official recruitment portal\nComplete candidate registration and fill application form\nUpload photograph, signature, and educational certificates\nPay application fee and print final confirmation page",
    requiredDocumentsText: "Recent passport-size colour photograph\nScanned clear signature\nEducational qualification certificates & mark sheets\nCaste / Category certificate (if applicable)\nGovernment Photo ID proof (Aadhaar / PAN / Voter ID)",
  });

  const [jsonFields, setJsonFields] = useState({
    qualificationsList: "[]",
    importantDates: "{}",
    feeStructure: "null",
    ageLimit: "null",
    vacancyBreakdown: "[]",
    selectionProcess: "[]",
    howToApplySteps: "[]",
    requiredDocuments: "[]",
    importantLinks: "[]",
    faqs: "[]",
  });

  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!editing) return;
    let active = true;
    request(`/api/v1/admin/jobs/${encodeURIComponent(id)}`)
      .then((loaded) => {
        if (!active) return;
        setJob({ ...blankJob, ...loaded });

        const dates = loaded.importantDates || {};
        const fee = loaded.feeStructure || {};
        const age = loaded.ageLimit || {};
        const links = Array.isArray(loaded.importantLinks) ? loaded.importantLinks : [];
        const applyLink = links.find((l) => l.type === "APPLY" || /apply/i.test(l.title || ""));
        const pdfLink = links.find((l) => l.type === "NOTIFICATION" || /pdf|notification/i.test(l.title || ""));
        const webLink = links.find((l) => l.type === "WEBSITE" || /website|portal/i.test(l.title || ""));

        const quals = Array.isArray(loaded.qualificationsList) ? loaded.qualificationsList.join("\n") : "";
        const selProcess = Array.isArray(loaded.selectionProcess) ? loaded.selectionProcess.join("\n") : "";
        const steps = Array.isArray(loaded.howToApplySteps) ? loaded.howToApplySteps.join("\n") : "";
        const docs = Array.isArray(loaded.requiredDocuments) ? loaded.requiredDocuments.join("\n") : "";

        setVisualForm({
          notificationDate: dates.notificationDate || "",
          applicationStart: dates.applicationStart || "",
          applicationEnd: dates.applicationEnd || "",
          examDate: dates.examDate || "",
          admitCardDate: dates.admitCardDate || "",
          generalFee: fee.generalFee || "",
          scStFee: fee.scStFee || "",
          paymentMode: fee.paymentMode || "",
          minAge: age.minAge != null ? String(age.minAge) : "",
          maxAge: age.maxAge != null ? String(age.maxAge) : "",
          asOfDate: age.asOfDate || "",
          relaxationSummary: age.relaxationSummary || "",
          applyOnlineUrl: applyLink ? applyLink.url : "",
          notificationPdfUrl: pdfLink ? pdfLink.url : "",
          officialWebsiteUrl: webLink ? webLink.url : "",
          qualificationsText: quals,
          selectionProcessText: selProcess,
          howToApplyText: steps,
          requiredDocumentsText: docs,
        });

        setJsonFields({
          qualificationsList: toJsonText(loaded.qualificationsList, []),
          importantDates: toJsonText(loaded.importantDates, {}),
          feeStructure: toJsonText(loaded.feeStructure, null),
          ageLimit: toJsonText(loaded.ageLimit, null),
          vacancyBreakdown: toJsonText(loaded.vacancyBreakdown, []),
          selectionProcess: toJsonText(loaded.selectionProcess, []),
          howToApplySteps: toJsonText(loaded.howToApplySteps, []),
          requiredDocuments: toJsonText(loaded.requiredDocuments, []),
          importantLinks: toJsonText(loaded.importantLinks, []),
          faqs: toJsonText(loaded.faqs, []),
        });
      })
      .catch((failure) => {
        if (active) setError(failure.message || "Unable to load this job.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [editing, id, request]);

  function update(name, value) {
    setJob((current) => ({ ...current, [name]: value }));
  }

  function updateVisual(name, value) {
    setVisualForm((current) => ({ ...current, [name]: value }));
  }

  function updateJson(name, value) {
    setJsonFields((current) => ({ ...current, [name]: value }));
  }

  function generateSlug() {
    if (!job.title) return;
    const generated = job.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    update("slug", generated);
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    let payloadValues;
    if (advancedMode) {
      try {
        payloadValues = Object.fromEntries(
          Object.entries(jsonFields).map(([key, value]) => [key, JSON.parse(value)])
        );
      } catch (failure) {
        setError(`Invalid JSON in Advanced Mode: ${failure.message}`);
        return;
      }
    } else {
      const dates = {};
      if (visualForm.notificationDate) dates.notificationDate = visualForm.notificationDate;
      if (visualForm.applicationStart) dates.applicationStart = visualForm.applicationStart;
      if (visualForm.applicationEnd) dates.applicationEnd = visualForm.applicationEnd;
      if (visualForm.examDate) dates.examDate = visualForm.examDate;
      if (visualForm.admitCardDate) dates.admitCardDate = visualForm.admitCardDate;

      const fee = {};
      if (visualForm.generalFee) fee.generalFee = visualForm.generalFee;
      if (visualForm.scStFee) fee.scStFee = visualForm.scStFee;
      if (visualForm.paymentMode) fee.paymentMode = visualForm.paymentMode;

      const age = {};
      if (visualForm.minAge) age.minAge = Number(visualForm.minAge) || visualForm.minAge;
      if (visualForm.maxAge) age.maxAge = Number(visualForm.maxAge) || visualForm.maxAge;
      if (visualForm.asOfDate) age.asOfDate = visualForm.asOfDate;
      if (visualForm.relaxationSummary) age.relaxationSummary = visualForm.relaxationSummary;

      const links = [];
      if (visualForm.applyOnlineUrl) {
        links.push({ title: "Apply Online", url: visualForm.applyOnlineUrl.trim(), type: "APPLY" });
      }
      if (visualForm.notificationPdfUrl) {
        links.push({ title: "Official Notification PDF", url: visualForm.notificationPdfUrl.trim(), type: "NOTIFICATION" });
      }
      if (visualForm.officialWebsiteUrl) {
        links.push({ title: "Official Website", url: visualForm.officialWebsiteUrl.trim(), type: "WEBSITE" });
      }

      const splitLines = (text) => (text || "").split("\n").map((s) => s.trim()).filter(Boolean);

      payloadValues = {
        qualificationsList: splitLines(visualForm.qualificationsText),
        importantDates: dates,
        feeStructure: Object.keys(fee).length > 0 ? fee : null,
        ageLimit: Object.keys(age).length > 0 ? age : null,
        importantLinks: links,
        selectionProcess: splitLines(visualForm.selectionProcessText),
        howToApplySteps: splitLines(visualForm.howToApplyText),
        requiredDocuments: splitLines(visualForm.requiredDocumentsText),
        vacancyBreakdown: job.vacancyBreakdown || [],
        faqs: job.faqs || [],
      };
    }

    setSaving(true);
    try {
      const payload = {
        ...job,
        ...payloadValues,
        totalVacancies: String(job.totalVacancies || "1"),
      };
      await request(editing ? `/api/v1/admin/jobs/${encodeURIComponent(id)}` : "/api/v1/admin/jobs", {
        method: editing ? "PUT" : "POST",
        body: payload,
      });
      navigate("/admin/jobs", {
        state: { adminNotice: editing ? "Job updated successfully." : "Job created successfully." },
      });
    } catch (failure) {
      setError(failure.message || "Unable to save job.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <Loading label="Loading vacancy details…" />
      </main>
    );
  }

  const tabs = [
    { id: "core", label: "1. Core Vacancy Details", icon: Briefcase },
    { id: "dates_fees", label: "2. Dates, Fees & Links", icon: Calendar },
    { id: "eligibility", label: "3. Qualifications & Process", icon: GraduationCap },
    { id: "advanced", label: "4. Advanced & Raw JSON", icon: Code },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-6">
      <SectionHeader
        title={editing ? `Edit: ${job.title || "Vacancy"}` : "Create New Opportunity"}
        subtitle="Saved opportunities are validated and published live to the public catalog."
        activeTab="Jobs"
        action={
          <Link
            to="/admin/jobs"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={14} />
            <span>Cancel &amp; Return</span>
          </Link>
        }
      />

      <Notice message={error} onClose={() => setError("")} />
      <Notice message={notice} type="success" onClose={() => setNotice("")} />

      <form className="space-y-6 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8" onSubmit={submit}>
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeFormTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveFormTab(t.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:text-slate-950"
                }`}
              >
                <Icon size={14} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Core Details */}
        {activeFormTab === "core" && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Field
                    label="Notice / Post Title"
                    required
                    maxLength={255}
                    value={job.title}
                    placeholder="e.g. UPSC Civil Services Examination 2026"
                    onChange={(value) => update("title", value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={generateSlug}
                  title="Generate URL slug from title"
                  className="mb-0.5 inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  <Sparkles size={13} className="text-amber-600" />
                  <span>Auto Slug</span>
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="URL Slug (Optional)"
                maxLength={255}
                value={job.slug}
                placeholder="upsc-cse-2026"
                hint="Auto-generated if left empty"
                onChange={(value) => update("slug", value)}
              />
              <Field
                label="Recruiting Organization"
                required
                maxLength={255}
                value={job.organization}
                placeholder="e.g. Union Public Service Commission"
                onChange={(value) => update("organization", value)}
              />
              <Field
                label="Department / Ministry"
                value={job.department}
                placeholder="e.g. Department of Personnel & Training"
                onChange={(value) => update("department", value)}
              />
              <Field
                label="Organization Logo URL"
                value={job.organizationLogo}
                placeholder="https://example.com/logo.png"
                onChange={(value) => update("organizationLogo", value)}
              />
              <Field
                label="Location / State"
                required
                maxLength={255}
                value={job.location}
                placeholder="e.g. All India or New Delhi"
                onChange={(value) => update("location", value)}
              />
              <Field
                label="Total Vacancies"
                required
                value={job.totalVacancies}
                placeholder="e.g. 1056"
                onChange={(value) => update("totalVacancies", value)}
              />
              <label className="block text-xs font-bold text-slate-800">
                Category Type <span className="text-rose-700">*</span>
                <select
                  className={inputClass}
                  value={job.category}
                  onChange={(e) => update("category", e.target.value)}
                >
                  {jobCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-bold text-slate-800">
                Publication Status <span className="text-rose-700">*</span>
                <select
                  className={inputClass}
                  value={job.status}
                  onChange={(e) => update("status", e.target.value)}
                >
                  {jobStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <Field
                label="Salary / Pay Scale"
                required
                value={job.salaryOrStipend}
                placeholder="e.g. Pay Level 10 (Rs. 56,100 - 1,77,500)"
                onChange={(value) => update("salaryOrStipend", value)}
              />
              <Field
                label="Job Type"
                value={job.jobType}
                placeholder="e.g. Full-time / Permanent"
                onChange={(value) => update("jobType", value)}
              />
              <Field
                label="Application Mode"
                value={job.applicationMode}
                placeholder="e.g. Online Portal"
                onChange={(value) => update("applicationMode", value)}
              />
            </div>

            <TextAreaField
              label="Short Summary Overview"
              required
              rows={3}
              value={job.shortSummary}
              placeholder="Brief 2-3 sentence overview of this vacancy for search cards and listing previews..."
              onChange={(value) => update("shortSummary", value)}
            />

            <div className="flex flex-wrap gap-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs font-bold text-slate-800">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(job.isVerified)}
                  onChange={(e) => update("isVerified", e.target.checked)}
                  className="rounded border-slate-300 text-rose-900 focus:ring-rose-600"
                />
                <span>Gazette Verified Notice</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(job.isFeatured)}
                  onChange={(e) => update("isFeatured", e.target.checked)}
                  className="rounded border-slate-300 text-rose-900 focus:ring-rose-600"
                />
                <span>Feature on Homepage Hub</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(job.isTrending)}
                  onChange={(e) => update("isTrending", e.target.checked)}
                  className="rounded border-slate-300 text-rose-900 focus:ring-rose-600"
                />
                <span>Mark as Trending</span>
              </label>
            </div>
          </div>
        )}

        {/* Tab 2: Dates, Fees & Links */}
        {activeFormTab === "dates_fees" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Dates Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Calendar size={14} className="text-rose-800" />
                <span>Important Dates</span>
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field
                  label="Application Start Date"
                  value={visualForm.applicationStart}
                  placeholder="e.g. 2026-02-01 or 1 Feb 2026"
                  onChange={(v) => updateVisual("applicationStart", v)}
                />
                <Field
                  label="Last Date to Apply (End)"
                  value={visualForm.applicationEnd}
                  placeholder="e.g. 2026-03-05 or 5 Mar 2026"
                  onChange={(v) => updateVisual("applicationEnd", v)}
                />
                <Field
                  label="Exam Date"
                  value={visualForm.examDate}
                  placeholder="e.g. 2026-05-24"
                  onChange={(v) => updateVisual("examDate", v)}
                />
                <Field
                  label="Admit Card Date"
                  value={visualForm.admitCardDate}
                  placeholder="e.g. May 2026"
                  onChange={(v) => updateVisual("admitCardDate", v)}
                />
              </div>
            </div>

            {/* Fee Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Application Fee Structure
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field
                  label="General / OBC / EWS Fee"
                  value={visualForm.generalFee}
                  placeholder="e.g. Rs. 100"
                  onChange={(v) => updateVisual("generalFee", v)}
                />
                <Field
                  label="SC / ST / PwD / Female Fee"
                  value={visualForm.scStFee}
                  placeholder="e.g. Nil / Exempted"
                  onChange={(v) => updateVisual("scStFee", v)}
                />
                <Field
                  label="Payment Mode"
                  value={visualForm.paymentMode}
                  placeholder="e.g. Online (Net Banking / UPI / Debit)"
                  onChange={(v) => updateVisual("paymentMode", v)}
                />
              </div>
            </div>

            {/* Age Limit Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Age Limit &amp; Relaxation
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field
                  label="Minimum Age (Years)"
                  value={visualForm.minAge}
                  placeholder="18"
                  onChange={(v) => updateVisual("minAge", v)}
                />
                <Field
                  label="Maximum Age (Years)"
                  value={visualForm.maxAge}
                  placeholder="30"
                  onChange={(v) => updateVisual("maxAge", v)}
                />
                <Field
                  label="Age as of Date"
                  value={visualForm.asOfDate}
                  placeholder="e.g. 01-08-2026"
                  onChange={(v) => updateVisual("asOfDate", v)}
                />
                <Field
                  label="Age Relaxation Summary"
                  value={visualForm.relaxationSummary}
                  placeholder="e.g. OBC 3 yrs, SC/ST 5 yrs"
                  onChange={(v) => updateVisual("relaxationSummary", v)}
                />
              </div>
            </div>

            {/* Links Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Link2 size={14} className="text-rose-800" />
                <span>Important Official Links</span>
              </h3>
              <div className="space-y-3">
                <Field
                  label="Official Apply Online URL"
                  value={visualForm.applyOnlineUrl}
                  placeholder="https://upsconline.nic.in"
                  hint="Direct link where candidate registers"
                  onChange={(v) => updateVisual("applyOnlineUrl", v)}
                />
                <Field
                  label="Official Notification PDF URL"
                  value={visualForm.notificationPdfUrl}
                  placeholder="https://upsc.gov.in/sites/default/files/Notice-CSE-2026.pdf"
                  hint="Official notification document"
                  onChange={(v) => updateVisual("notificationPdfUrl", v)}
                />
                <Field
                  label="Official Organization Website"
                  value={visualForm.officialWebsiteUrl}
                  placeholder="https://upsc.gov.in"
                  hint="Authority portal"
                  onChange={(v) => updateVisual("officialWebsiteUrl", v)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Eligibility & Process */}
        {activeFormTab === "eligibility" && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <Field
              label="Qualification Summary"
              required
              value={job.qualificationSummary}
              placeholder="e.g. Graduate Degree in any discipline from a recognized University"
              hint="One-line summary for listing previews"
              onChange={(value) => update("qualificationSummary", value)}
            />

            <TextAreaField
              label="Detailed Qualification Requirements"
              rows={4}
              value={visualForm.qualificationsText}
              placeholder={"Graduate Degree in any discipline from a recognized University.\nFinal year appearing students may also apply.\nCandidates must hold valid identity proof."}
              hint="Enter one requirement per line (automatically converted to candidate bullet points)"
              onChange={(value) => updateVisual("qualificationsText", value)}
            />

            <TextAreaField
              label="Selection Process Stages"
              rows={3}
              value={visualForm.selectionProcessText}
              placeholder={"Preliminary Examination (Objective / CBT)\nMain Examination (Written / Descriptive)\nPersonal Interview & Document Verification"}
              hint="Enter one stage per line"
              onChange={(value) => updateVisual("selectionProcessText", value)}
            />

            <TextAreaField
              label="How To Apply Steps"
              rows={4}
              value={visualForm.howToApplyText}
              placeholder={"Visit the official recruitment portal.\nComplete One-Time Registration (OTR).\nFill application form and upload documents.\nPay application fee and download confirmation."}
              hint="Enter one step per line"
              onChange={(value) => updateVisual("howToApplyText", value)}
            />

            <TextAreaField
              label="Required Documents"
              rows={3}
              value={visualForm.requiredDocumentsText}
              placeholder={"Recent passport photograph\nScanned signature\nAadhaar Card / Photo ID proof\nEducational mark sheets"}
              hint="Enter one document per line"
              onChange={(value) => updateVisual("requiredDocumentsText", value)}
            />
          </div>
        )}

        {/* Tab 4: Advanced & Raw JSON */}
        {activeFormTab === "advanced" && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-950">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold">Advanced JSON &amp; Custom Schema Mode</h4>
                  <p className="mt-0.5 text-amber-800">
                    {advancedMode
                      ? "Advanced Mode is ON: The JSON fields below will be submitted directly to the server."
                      : "Simple Visual Form is currently active. Switch on Advanced Mode only if you wish to override with raw JSON."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAdvancedMode(!advancedMode)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold shadow-xs transition ${
                    advancedMode
                      ? "bg-rose-900 text-white hover:bg-rose-800"
                      : "bg-amber-900 text-white hover:bg-amber-800"
                  }`}
                >
                  {advancedMode ? "✓ Advanced Mode Enabled" : "Enable Raw JSON Mode"}
                </button>
              </div>
            </div>

            {advancedMode && (
              <div className="grid gap-4 md:grid-cols-2">
                <JsonField
                  label="Vacancy Breakdown"
                  value={jsonFields.vacancyBreakdown}
                  onChange={(v) => updateJson("vacancyBreakdown", v)}
                  hint="Array: [{ postName, vacancies, category }]"
                  defaultTemplate={[{ postName: "General Post", vacancies: "500", category: "UR" }]}
                />
                <JsonField
                  label="Frequently Asked Questions (FAQs)"
                  value={jsonFields.faqs}
                  onChange={(v) => updateJson("faqs", v)}
                  hint="Array: [{ question, answer }]"
                  defaultTemplate={[
                    { question: "What is the last date to apply?", answer: "Check the important dates section." },
                  ]}
                />
                <JsonField
                  label="Important Dates (JSON)"
                  value={jsonFields.importantDates}
                  onChange={(v) => updateJson("importantDates", v)}
                  hint="Object: { applicationStart, applicationEnd, examDate }"
                />
                <JsonField
                  label="Important Links (JSON)"
                  value={jsonFields.importantLinks}
                  onChange={(v) => updateJson("importantLinks", v)}
                  hint="Array: [{ title, url, type }]"
                />
              </div>
            )}
          </div>
        )}

        {/* Footer Navigation & Submit */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-6">
          <div className="flex gap-2">
            {activeFormTab !== "core" && (
              <button
                type="button"
                onClick={() => {
                  const tabOrder = ["core", "dates_fees", "eligibility", "advanced"];
                  const currentIndex = tabOrder.indexOf(activeFormTab);
                  setActiveFormTab(tabOrder[currentIndex - 1]);
                }}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                ← Previous Section
              </button>
            )}
            {activeFormTab !== "advanced" && (
              <button
                type="button"
                onClick={() => {
                  const tabOrder = ["core", "dates_fees", "eligibility", "advanced"];
                  const currentIndex = tabOrder.indexOf(activeFormTab);
                  setActiveFormTab(tabOrder[currentIndex + 1]);
                }}
                className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-200"
              >
                Next Section →
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-900 px-6 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-rose-800 disabled:opacity-60"
          >
            <CheckCircle2 size={16} />
            <span>{saving ? "Persisting Record…" : editing ? "Save Changes" : "Create Vacancy"}</span>
          </button>
        </div>
      </form>
    </main>
  );
}

function useMasterData(endpoint, kind) {
  const request = useAdminApi();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const blank =
    kind === "category"
      ? { name: "", slug: "", description: "", icon: "", isActive: true, isFeatured: false }
      : {
          name: "",
          shortName: "",
          slug: "",
          logoUrl: "",
          website: "",
          description: "",
          state: "",
          categoryType: "",
          isActive: true,
        };
  const [form, setForm] = useState(blank);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRecords(await request(endpoint));
    } catch (failure) {
      setError(failure.message || `Unable to load ${kind}s.`);
    } finally {
      setLoading(false);
    }
  }, [endpoint, kind, request]);

  useEffect(() => {
    load();
  }, [load]);

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await request(editingId ? `${endpoint}/${encodeURIComponent(editingId)}` : endpoint, {
        method: editingId ? "PUT" : "POST",
        body: form,
      });
      setNotice(`${kind[0].toUpperCase()}${kind.slice(1)} ${editingId ? "updated" : "created"}.`);
      setEditingId("");
      setForm(blank);
      await load();
    } catch (failure) {
      setError(failure.message || `Unable to save ${kind}.`);
    } finally {
      setSaving(false);
    }
  }

  function edit(record) {
    setEditingId(record.id);
    setForm(
      kind === "category"
        ? {
            name: record.name ?? "",
            slug: record.slug ?? "",
            description: record.description ?? "",
            icon: record.icon ?? "",
            isActive: record.isActive,
            isFeatured: record.isFeatured,
          }
        : {
            name: record.name ?? "",
            shortName: record.shortName ?? "",
            slug: record.slug ?? "",
            logoUrl: record.logoUrl ?? "",
            website: record.website ?? "",
            description: record.description ?? "",
            state: record.state ?? "",
            categoryType: record.categoryType ?? "",
            isActive: record.isActive,
          }
    );
  }

  async function toggle(record) {
    setError("");
    setNotice("");
    try {
      const statusBody =
        kind === "category"
          ? { isActive: !record.isActive, isFeatured: record.isFeatured }
          : { isActive: !record.isActive };
      await request(`${endpoint}/${encodeURIComponent(record.id)}/status`, { method: "PATCH", body: statusBody });
      setNotice(`${kind[0].toUpperCase()}${kind.slice(1)} status updated.`);
      await load();
    } catch (failure) {
      setError(failure.message || `Unable to update ${kind} status.`);
    }
  }

  async function toggleFeatured(record) {
    setError("");
    setNotice("");
    try {
      await request(`${endpoint}/${encodeURIComponent(record.id)}/status`, {
        method: "PATCH",
        body: { isActive: record.isActive, isFeatured: !record.isFeatured },
      });
      setNotice("Featured status updated.");
      await load();
    } catch (failure) {
      setError(failure.message || "Unable to update featured status.");
    }
  }

  async function remove(record) {
    if (!window.confirm(`Delete "${record.name}"? This cannot be undone.`)) return;
    setError("");
    setNotice("");
    try {
      await request(`${endpoint}/${encodeURIComponent(record.id)}`, { method: "DELETE" });
      setNotice(`${kind[0].toUpperCase()}${kind.slice(1)} deleted.`);
      await load();
    } catch (failure) {
      setError(failure.message || `Unable to delete ${kind}.`);
    }
  }

  async function bulkActive(isActive) {
    if (!selectedIds.length) return;
    setError("");
    setNotice("");
    try {
      const count = await request(`${endpoint}/bulk/status`, {
        method: "PATCH",
        body: { ids: selectedIds, isActive },
      });
      setNotice(`${count} ${kind}s updated.`);
      setSelectedIds([]);
      await load();
    } catch (failure) {
      setError(failure.message || `Unable to update selected ${kind}s.`);
    }
  }

  async function bulkRemove() {
    if (!selectedIds.length || !window.confirm(`Delete ${selectedIds.length} selected ${kind}s? This cannot be undone.`))
      return;
    setError("");
    setNotice("");
    try {
      const count = await request(`${endpoint}/bulk/delete`, {
        method: "POST",
        body: { ids: selectedIds },
      });
      setNotice(`${count} ${kind}s deleted.`);
      setSelectedIds([]);
      await load();
    } catch (failure) {
      setError(failure.message || `Unable to delete selected ${kind}s.`);
    }
  }

  return {
    records,
    loading,
    saving,
    error,
    notice,
    form,
    setForm,
    editingId,
    setEditingId,
    setNotice,
    setError,
    save,
    edit,
    toggle,
    toggleFeatured,
    remove,
    selectedIds,
    setSelectedIds,
    bulkActive,
    bulkRemove,
    blank,
  };
}

function MasterDataPage({ kind }) {
  const category = kind === "category";
  const endpoint = category ? "/api/v1/admin/categories" : "/api/v1/admin/organizations";
  const title = category ? "Category Taxonomy" : "Recruiting Organizations";
  const subtitle = `Create, edit, activate, and remove database-backed ${kind} records.`;
  const masterData = useMasterData(endpoint, kind);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-6">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        activeTab={category ? "Categories" : "Organizations"}
        action={
          <button
            type="button"
            onClick={() => {
              masterData.setEditingId("");
              masterData.setForm(masterData.blank);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-800"
          >
            <Plus size={15} />
            <span>Add New {category ? "Category" : "Authority"}</span>
          </button>
        }
      />

      <Notice message={masterData.error} onClose={() => masterData.setError("")} />
      <Notice message={masterData.notice} type="success" onClose={() => masterData.setNotice("")} />

      {/* Editor Form Card */}
      <form
        className="space-y-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm"
        onSubmit={masterData.save}
      >
        <h2 className="text-sm font-bold text-slate-950">
          {masterData.editingId ? `Edit ${kind}` : `Create New ${kind}`}
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <Field
            label="Name"
            required
            maxLength={255}
            value={masterData.form.name}
            placeholder={category ? "e.g. Banking & Finance" : "e.g. Staff Selection Commission"}
            onChange={(value) => masterData.setForm((prev) => ({ ...prev, name: value }))}
          />

          {category ? (
            <>
              <Field
                label="Slug (Optional)"
                maxLength={255}
                value={masterData.form.slug}
                placeholder="banking"
                onChange={(value) => masterData.setForm((prev) => ({ ...prev, slug: value }))}
              />
              <Field
                label="Icon Identifier"
                maxLength={128}
                value={masterData.form.icon}
                placeholder="building"
                onChange={(value) => masterData.setForm((prev) => ({ ...prev, icon: value }))}
              />
            </>
          ) : (
            <>
              <Field
                label="Acronym / Short Name"
                required
                maxLength={64}
                value={masterData.form.shortName}
                placeholder="SSC"
                onChange={(value) => masterData.setForm((prev) => ({ ...prev, shortName: value }))}
              />
              <Field
                label="Slug (Optional)"
                maxLength={255}
                value={masterData.form.slug}
                placeholder="ssc"
                onChange={(value) => masterData.setForm((prev) => ({ ...prev, slug: value }))}
              />
              <Field
                label="Logo URL"
                value={masterData.form.logoUrl}
                placeholder="https://example.com/logo.png"
                onChange={(value) => masterData.setForm((prev) => ({ ...prev, logoUrl: value }))}
              />
              <Field
                label="Official Website URL"
                value={masterData.form.website}
                placeholder="https://ssc.gov.in"
                onChange={(value) => masterData.setForm((prev) => ({ ...prev, website: value }))}
              />
              <Field
                label="State / Region"
                maxLength={128}
                value={masterData.form.state}
                placeholder="All India"
                onChange={(value) => masterData.setForm((prev) => ({ ...prev, state: value }))}
              />
              <Field
                label="Authority Type"
                maxLength={128}
                value={masterData.form.categoryType}
                placeholder="Commission"
                onChange={(value) => masterData.setForm((prev) => ({ ...prev, categoryType: value }))}
              />
            </>
          )}
        </div>

        <label className="block text-xs font-bold text-slate-800">
          Description
          <textarea
            className={inputClass}
            rows={2}
            value={masterData.form.description}
            placeholder={`Brief description of this ${kind}...`}
            onChange={(e) => masterData.setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-4 text-xs font-bold text-slate-800">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={masterData.form.isActive}
                onChange={(e) => masterData.setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="rounded border-slate-300 text-rose-900 focus:ring-rose-600"
              />
              <span>Active in public directory</span>
            </label>
            {category && (
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={masterData.form.isFeatured}
                  onChange={(e) => masterData.setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                  className="rounded border-slate-300 text-rose-900 focus:ring-rose-600"
                />
                <span>Featured on homepage</span>
              </label>
            )}
          </div>

          <div className="flex items-center gap-2">
            {masterData.editingId && (
              <button
                type="button"
                className="rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  masterData.setEditingId("");
                  masterData.setForm(masterData.blank);
                }}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="rounded-xl bg-rose-900 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-800 disabled:opacity-60"
              disabled={masterData.saving}
            >
              {masterData.saving ? "Persisting…" : masterData.editingId ? "Save Changes" : `Create ${kind}`}
            </button>
          </div>
        </div>
      </form>

      {/* Bulk Action Controls */}
      {masterData.selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold">
          <span className="text-rose-950">{masterData.selectedIds.length} selected</span>
          <button
            type="button"
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-slate-800 hover:bg-slate-100"
            onClick={() => masterData.bulkActive(true)}
          >
            Activate
          </button>
          <button
            type="button"
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-slate-800 hover:bg-slate-100"
            onClick={() => masterData.bulkActive(false)}
          >
            Deactivate
          </button>
          <button
            type="button"
            className="rounded-xl bg-rose-900 px-3 py-1.5 text-white shadow-xs hover:bg-rose-800"
            onClick={masterData.bulkRemove}
          >
            Delete Selected
          </button>
          <button
            type="button"
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-slate-600 hover:bg-slate-100"
            onClick={() => masterData.setSelectedIds([])}
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Records Table / Cards */}
      {masterData.loading ? (
        <Loading label={`Loading ${kind}s…`} />
      ) : masterData.records.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-xs text-slate-500">
          No {kind} records found in the database.
        </div>
      ) : (
        <div className="space-y-3">
          {masterData.records.map((record) => {
            const isSelected = masterData.selectedIds.includes(record.id);
            return (
              <article
                key={record.id}
                className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 shadow-2xs transition ${
                  isSelected ? "border-rose-300 bg-rose-50/40" : "border-slate-200/90 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    aria-label={`Select ${record.name}`}
                    onChange={(e) =>
                      masterData.setSelectedIds((prev) =>
                        e.target.checked ? [...prev, record.id] : prev.filter((id) => id !== record.id)
                      )
                    }
                    className="rounded border-slate-300 text-rose-900 focus:ring-rose-600"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-950">{record.name}</h3>
                    <p className="text-xs text-slate-500">
                      /{record.slug} {!category && record.shortName ? `· ${record.shortName}` : ""}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[10px] font-bold">
                      <span
                        className={`rounded-md px-2 py-0.5 ${
                          record.isActive ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {record.isActive ? "Active" : "Inactive"}
                      </span>
                      {category && record.isFeatured && (
                        <span className="rounded-md bg-amber-50 px-2 py-0.5 text-amber-800">Featured</span>
                      )}
                      <span className="text-slate-400">{record.jobCount || 0} associated jobs</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    onClick={() => masterData.edit(record)}
                  >
                    Edit
                  </button>
                  {category && (
                    <button
                      type="button"
                      className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      onClick={() => masterData.toggleFeatured(record)}
                    >
                      {record.isFeatured ? "Unfeature" : "Feature"}
                    </button>
                  )}
                  <button
                    type="button"
                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    onClick={() => masterData.toggle(record)}
                  >
                    {record.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-800 hover:bg-rose-100"
                    onClick={() => masterData.remove(record)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export function AdminCategoriesPage() {
  return <MasterDataPage kind="category" />;
}

export function AdminOrganizationsPage() {
  return <MasterDataPage kind="organization" />;
}

export function AdminAnalyticsPage() {
  const request = useAdminApi();
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request("/api/v1/admin/analytics")
      .then(setMetrics)
      .catch((failure) => {
        setError(failure.message || "Unable to load analytics.");
      })
      .finally(() => setLoading(false));
  }, [request]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-6">
      <SectionHeader
        title="Admin Platform Analytics"
        subtitle="Operational totals and views computed in real-time from PostgreSQL."
        activeTab="Analytics"
      />

      <Notice message={error} onClose={() => setError("")} />

      {loading ? (
        <Loading label="Computing analytics metrics…" />
      ) : metrics ? (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Job Postings" value={metrics.totalJobs} tone="rose" icon={Briefcase} />
            <StatCard label="Open Active Drives" value={metrics.openJobs} tone="emerald" icon={CheckCircle2} />
            <StatCard label="Recruiting Bodies" value={metrics.totalOrganizations} tone="slate" icon={Building2} />
            <StatCard
              label="Avg Views Per Drive"
              value={Number(metrics.averageViewsPerJob || 0).toFixed(1)}
              tone="amber"
              icon={Eye}
            />
          </div>

          <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-base font-bold text-slate-950">Analytics Summary</h2>
            <p className="mt-1 text-xs text-slate-500">Platform operational status.</p>
            <div className="mt-4 divide-y divide-slate-100 text-xs">
              <div className="py-3 flex justify-between">
                <span className="font-semibold text-slate-600">Total Persistent Jobs:</span>
                <span className="font-bold text-slate-900">{metrics.totalJobs}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="font-semibold text-slate-600">Total Open Status:</span>
                <span className="font-bold text-slate-900">{metrics.openJobs}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="font-semibold text-slate-600">Total Registered Authorities:</span>
                <span className="font-bold text-slate-900">{metrics.totalOrganizations}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="font-semibold text-slate-600">Average Engagement Views:</span>
                <span className="font-bold text-slate-900">{Number(metrics.averageViewsPerJob || 0).toFixed(2)}</span>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
