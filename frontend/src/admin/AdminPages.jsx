import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { apiGet, apiRequest } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

const jobStatuses = ["OPEN", "ENDING_SOON", "CLOSED", "ADMIT_CARD_OUT", "RESULT_OUT", "ANSWER_KEY_OUT"];
const jobCategories = ["government", "private", "admit-card", "result", "answer-key", "scholarship", "scheme", "internship", "apprenticeship", "work-from-home"];

function useAdminApi() {
  const { session } = useAuth();
  return useCallback((path, options = {}) => apiRequest(path, {
    ...options,
    accessToken: session?.accessToken,
  }), [session?.accessToken]);
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-black text-slate-950">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Notice({ message, type = "error" }) {
  if (!message) return null;
  const style = type === "success"
    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
    : "border-rose-200 bg-rose-50 text-rose-900";
  return <p className={`mb-4 rounded-xl border p-3 text-sm ${style}`} role={type === "error" ? "alert" : "status"}>{message}</p>;
}

function Loading({ label = "Loading…" }) {
  return <p className="py-8 text-center text-sm text-slate-500" role="status">{label}</p>;
}

function StatCard({ label, value, tone = "rose" }) {
  const tones = {
    rose: "bg-rose-50 text-rose-900 border-rose-200",
    slate: "bg-slate-100 text-slate-900 border-slate-200",
    emerald: "bg-emerald-50 text-emerald-900 border-emerald-200",
    amber: "bg-amber-50 text-amber-900 border-amber-200",
  };
  return (
    <div className={`rounded-2xl border p-5 ${tones[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
    </div>
  );
}

const inputClass = "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-100";

function Field({ label, value, onChange, required = false, type = "text", maxLength }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input className={inputClass} type={type} value={value ?? ""} required={required} maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function JsonField({ label, value, onChange, rows = 4 }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label} (JSON)
      <textarea className={`${inputClass} font-mono text-xs`} rows={rows} value={value}
        onChange={(event) => onChange(event.target.value)} spellCheck="false" />
    </label>
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
        request("/api/v1/admin/jobs?page=0&size=5"),
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

  useEffect(() => { load(); }, [load]);

  const cards = useMemo(() => summary ? [
    { label: "Total jobs", value: summary.totalJobs, tone: "rose" },
    { label: "Open jobs", value: summary.openJobs, tone: "emerald" },
    { label: "Organizations", value: summary.totalOrganizations, tone: "slate" },
    { label: "Active categories", value: summary.activeCategories, tone: "amber" },
    { label: "Total views", value: summary.totalViews, tone: "slate" },
  ] : [], [summary]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:py-12">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-800">NEXTVACANCY ADMIN</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Administrator dashboard</h1>
          </div>
          <nav className="flex flex-wrap gap-2" aria-label="Admin management">
            <Link className="rounded-xl border px-3 py-2 text-sm font-semibold" to="/admin/jobs">Jobs</Link>
            <Link className="rounded-xl border px-3 py-2 text-sm font-semibold" to="/admin/categories">Categories</Link>
            <Link className="rounded-xl border px-3 py-2 text-sm font-semibold" to="/admin/organizations">Organizations</Link>
            <Link className="rounded-xl border px-3 py-2 text-sm font-semibold" to="/admin/analytics">Analytics</Link>
          </nav>
        </div>
      </section>
      <div className="mt-5"><Notice message={error} /></div>
      {loading ? <Loading label="Loading current database records…" /> : !error && (
        <>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => <StatCard key={card.label} {...card} />)}
          </div>
          <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div><h2 className="text-xl font-black">Recent jobs</h2><p className="mt-1 text-sm text-slate-500">Latest persisted recruitment records.</p></div>
                <Link className="text-sm font-semibold text-rose-900 underline" to="/admin/jobs">Manage jobs</Link>
              </div>
              {jobs.length === 0 ? <p className="text-sm text-slate-500">No database records found.</p> : (
                <div className="space-y-3">
                  {jobs.map((job) => <div key={job.id} className="flex items-start justify-between gap-4 rounded-2xl border p-3">
                    <div><p className="font-bold">{job.title}</p><p className="mt-1 text-sm text-slate-500">{job.organization} · {job.location}</p></div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold">{job.status}</span>
                  </div>)}
                </div>
              )}
            </section>
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black">Master data</h2>
              <p className="mt-1 text-sm text-slate-500">Database-backed category and organization records.</p>
              <p className="mt-5 text-sm font-semibold">Categories: {categories.length}</p>
              <p className="mt-2 text-sm font-semibold">Organizations: {organizations.length}</p>
            </section>
          </div>
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">Recent admin activity</h2>
            {activity.length === 0 ? <p className="mt-3 text-sm text-slate-500">No audit activity has been recorded yet.</p> : (
              <ul className="mt-3 divide-y divide-slate-100">
                {activity.map((entry) => <li key={entry.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                  <div><p className="font-semibold text-slate-900">{entry.action} · {entry.entityTitle || entry.entity}</p><p className="text-slate-500">{entry.details}</p></div>
                  <time className="text-xs text-slate-500" dateTime={entry.timestamp}>{new Date(entry.timestamp).toLocaleString()}</time>
                </li>)}
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

  useEffect(() => { load(); }, [load]);

  async function changeStatus(job, status) {
    setError("");
    setNotice("");
    try {
      await request(`/api/v1/admin/jobs/${encodeURIComponent(job.id)}/status`, { method: "PATCH", body: { status } });
      setNotice(`Publication status changed to ${status}.`);
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
      setNotice("Job duplicated as a closed draft.");
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
      setNotice(`${updated} jobs updated.`);
      setSelectedIds([]);
      await load();
    } catch (failure) {
      setError(failure.message || "Unable to update selected job statuses.");
    }
  }

  async function bulkRemove() {
    if (!selectedIds.length || !window.confirm(`Delete ${selectedIds.length} selected jobs? This cannot be undone.`)) return;
    setError("");
    setNotice("");
    try {
      const deleted = await request("/api/v1/admin/jobs/bulk/delete", {
        method: "POST",
        body: { ids: selectedIds },
      });
      setNotice(`${deleted} jobs deleted.`);
      setSelectedIds([]);
      await load();
    } catch (failure) {
      setError(failure.message || "Unable to delete selected jobs.");
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <SectionHeader title="Job inventory" subtitle="Create, edit, duplicate, publish, and delete persisted job records."
        action={<Link className="rounded-xl bg-rose-900 px-4 py-2.5 text-sm font-semibold text-white" to="/admin/jobs/new">Create job</Link>} />
      <Notice message={error} /><Notice message={notice} type="success" />
      {selectedIds.length > 0 && <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border bg-white p-3">
        <span className="mr-2 text-sm font-semibold">{selectedIds.length} selected</span>
        <label className="sr-only" htmlFor="bulk-job-status">Set selected job status</label>
        <select id="bulk-job-status" className="rounded-lg border px-2.5 py-2 text-sm" defaultValue="" onChange={(event) => {
          if (event.target.value) bulkStatus(event.target.value);
          event.target.value = "";
        }}>
          <option value="">Change status…</option>
          {jobStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
        <button className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-800" onClick={bulkRemove}>Delete selected</button>
        <button className="rounded-lg border px-3 py-2 text-sm" onClick={() => setSelectedIds([])}>Clear selection</button>
      </div>}
      {loading ? <Loading label="Loading jobs…" /> : jobs.length === 0 ? <p className="rounded-2xl border bg-white p-6 text-sm text-slate-600">No jobs found.</p> : (
        <div className="space-y-3">
          {jobs.map((job) => <article key={job.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={selectedIds.includes(job.id)} aria-label={`Select ${job.title}`}
                  onChange={(event) => setSelectedIds((current) => event.target.checked
                    ? [...current, job.id]
                    : current.filter((id) => id !== job.id))} />
              </label>
              <div className="min-w-0">
                <h2 className="font-bold text-slate-950">{job.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{job.organization} · {job.category} · {job.location}</p>
                <p className="mt-1 text-xs text-slate-500">/{job.slug} · {job.viewsCount} views</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="sr-only" htmlFor={`status-${job.id}`}>Status for {job.title}</label>
                <select id={`status-${job.id}`} className="rounded-lg border px-2.5 py-2 text-sm" value={job.status}
                  onChange={(event) => changeStatus(job, event.target.value)}>
                  {jobStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <Link className="rounded-lg border px-3 py-2 text-sm font-semibold" to={`/admin/jobs/${encodeURIComponent(job.id)}/edit`}>Edit</Link>
                <button className="rounded-lg border px-3 py-2 text-sm font-semibold" onClick={() => duplicate(job)}>Duplicate</button>
                <button className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-800" onClick={() => remove(job)}>Delete</button>
              </div>
            </div>
          </article>)}
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
  const [job, setJob] = useState(blankJob);
  const [jsonFields, setJsonFields] = useState({
    qualificationsList: "[]", importantDates: "{}", feeStructure: "null", ageLimit: "null",
    vacancyBreakdown: "[]", selectionProcess: "[]", howToApplySteps: "[]",
    requiredDocuments: "[]", importantLinks: "[]", faqs: "[]",
  });
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!editing) return;
    let active = true;
    request(`/api/v1/admin/jobs/${encodeURIComponent(id)}`).then((loaded) => {
      if (!active) return;
      setJob({ ...blankJob, ...loaded });
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
    }).catch((failure) => {
      if (active) setError(failure.message || "Unable to load this job.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [editing, id, request]);

  function update(name, value) {
    setJob((current) => ({ ...current, [name]: value }));
  }

  function updateJson(name, value) {
    setJsonFields((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    let values;
    try {
      values = Object.fromEntries(Object.entries(jsonFields).map(([key, value]) => [key, JSON.parse(value)]));
    } catch (failure) {
      setError(`Invalid JSON: ${failure.message}`);
      return;
    }
    setSaving(true);
    try {
      const payload = { ...job, ...values, totalVacancies: String(job.totalVacancies) };
      await request(editing ? `/api/v1/admin/jobs/${encodeURIComponent(id)}` : "/api/v1/admin/jobs", {
        method: editing ? "PUT" : "POST",
        body: payload,
      });
      navigate("/admin/jobs", { state: { adminNotice: editing ? "Job updated." : "Job created." } });
    } catch (failure) {
      setError(failure.message || "Unable to save job.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main className="mx-auto max-w-5xl px-5 py-8"><Loading label="Loading job…" /></main>;

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <SectionHeader title={editing ? "Edit job" : "Create job"} subtitle="Required fields and structured details are saved to the Spring API."
        action={<Link className="text-sm font-semibold text-rose-900 underline" to="/admin/jobs">Cancel</Link>} />
      <Notice message={error} /><Notice message={notice} type="success" />
      <form className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={submit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title" required maxLength={255} value={job.title} onChange={(value) => update("title", value)} />
          <Field label="Slug (optional)" maxLength={255} value={job.slug} onChange={(value) => update("slug", value)} />
          <Field label="Organization" required maxLength={255} value={job.organization} onChange={(value) => update("organization", value)} />
          <Field label="Organization logo URL" value={job.organizationLogo} onChange={(value) => update("organizationLogo", value)} />
          <Field label="Department" value={job.department} onChange={(value) => update("department", value)} />
          <Field label="Location" required maxLength={255} value={job.location} onChange={(value) => update("location", value)} />
          <label className="block text-sm font-medium text-slate-700">Category
            <select className={inputClass} value={job.category} onChange={(event) => update("category", event.target.value)}>
              {jobCategories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">Publication status
            <select className={inputClass} value={job.status} onChange={(event) => update("status", event.target.value)}>
              {jobStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
          <Field label="Total vacancies" required value={job.totalVacancies} onChange={(value) => update("totalVacancies", value)} />
          <Field label="Salary or stipend" required value={job.salaryOrStipend} onChange={(value) => update("salaryOrStipend", value)} />
          <Field label="Job type" value={job.jobType} onChange={(value) => update("jobType", value)} />
          <Field label="Application mode" value={job.applicationMode} onChange={(value) => update("applicationMode", value)} />
          <Field label="Qualification summary" required value={job.qualificationSummary} onChange={(value) => update("qualificationSummary", value)} />
        </div>
        <label className="block text-sm font-medium text-slate-700">Short summary
          <textarea className={inputClass} rows={3} required value={job.shortSummary} onChange={(event) => update("shortSummary", event.target.value)} />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(jsonFields).map(([name, value]) => (
            <JsonField key={name} label={name} value={value} onChange={(next) => updateJson(name, next)}
              rows={name === "importantLinks" || name === "importantDates" ? 6 : 4} />
          ))}
        </div>
        <div className="flex flex-wrap gap-5 text-sm">
          {[["isFeatured", "Featured"], ["isTrending", "Trending"], ["isVerified", "Verified"]].map(([field, label]) => (
            <label key={field} className="inline-flex items-center gap-2"><input type="checkbox" checked={Boolean(job[field])} onChange={(event) => update(field, event.target.checked)} />{label}</label>
          ))}
        </div>
        <button className="rounded-xl bg-rose-900 px-5 py-3 text-sm font-bold text-white disabled:opacity-60" disabled={saving}>
          {saving ? "Saving…" : editing ? "Save changes" : "Create job"}
        </button>
      </form>
    </main>
  );
}

function useMasterData(endpoint, kind) {
  const request = useAdminApi();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const blank = kind === "category"
    ? { name: "", slug: "", description: "", icon: "", isActive: true, isFeatured: false }
    : { name: "", shortName: "", slug: "", logoUrl: "", website: "", description: "", state: "", categoryType: "", isActive: true };
  const [form, setForm] = useState(blank);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await request(endpoint));
    } catch (failure) {
      setError(failure.message || `Unable to load ${kind}s.`);
    } finally {
      setLoading(false);
    }
  }, [endpoint, kind, request]);

  useEffect(() => { load(); }, [load]);

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

  function edit(item) {
    setEditingId(item.id);
    setForm(kind === "category" ? {
      name: item.name ?? "", slug: item.slug ?? "", description: item.description ?? "",
      icon: item.icon ?? "", isActive: item.isActive, isFeatured: item.isFeatured,
    } : {
      name: item.name ?? "", shortName: item.shortName ?? "", slug: item.slug ?? "",
      logoUrl: item.logoUrl ?? "", website: item.website ?? "", description: item.description ?? "",
      state: item.state ?? "", categoryType: item.categoryType ?? "", isActive: item.isActive,
    });
  }

  async function toggle(item) {
    setError("");
    setNotice("");
    try {
      const statusBody = kind === "category"
        ? { isActive: !item.isActive, isFeatured: item.isFeatured }
        : { isActive: !item.isActive };
      await request(`${endpoint}/${encodeURIComponent(item.id)}/status`, { method: "PATCH", body: statusBody });
      setNotice(`${kind[0].toUpperCase()}${kind.slice(1)} status updated.`);
      await load();
    } catch (failure) {
      setError(failure.message || `Unable to update ${kind} status.`);
    }
  }

  async function toggleFeatured(item) {
    setError("");
    setNotice("");
    try {
      await request(`${endpoint}/${encodeURIComponent(item.id)}/status`, {
        method: "PATCH",
        body: { isActive: item.isActive, isFeatured: !item.isFeatured },
      });
      setNotice("Featured status updated.");
      await load();
    } catch (failure) {
      setError(failure.message || "Unable to update featured status.");
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    setError("");
    setNotice("");
    try {
      await request(`${endpoint}/${encodeURIComponent(item.id)}`, { method: "DELETE" });
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
    if (!selectedIds.length || !window.confirm(`Delete ${selectedIds.length} selected ${kind}s? This cannot be undone.`)) return;
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

  return { items, loading, saving, error, notice, form, setForm, editingId, setEditingId, setNotice, save, edit, toggle, toggleFeatured, remove, selectedIds, setSelectedIds, bulkActive, bulkRemove };
}

function MasterDataPage({ kind }) {
  const category = kind === "category";
  const endpoint = category ? "/api/v1/admin/categories" : "/api/v1/admin/organizations";
  const title = category ? "Category management" : "Organization management";
  const data = useMasterData(endpoint, kind);

  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <SectionHeader title={title} subtitle={`Create, edit, activate, and remove database-backed ${kind} records.`}
        action={<Link className="text-sm font-semibold text-rose-900 underline" to="/admin/dashboard">Back to dashboard</Link>} />
      <Notice message={data.error} /><Notice message={data.notice} type="success" />
      <form className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-3" onSubmit={data.save}>
        <Field label="Name" required maxLength={255} value={data.form.name} onChange={(value) => data.setForm((current) => ({ ...current, name: value }))} />
        {category ? <>
          <Field label="Slug (optional)" maxLength={255} value={data.form.slug} onChange={(value) => data.setForm((current) => ({ ...current, slug: value }))} />
          <Field label="Icon" maxLength={128} value={data.form.icon} onChange={(value) => data.setForm((current) => ({ ...current, icon: value }))} />
        </> : <>
          <Field label="Short name" required maxLength={64} value={data.form.shortName} onChange={(value) => data.setForm((current) => ({ ...current, shortName: value }))} />
          <Field label="Slug (optional)" maxLength={255} value={data.form.slug} onChange={(value) => data.setForm((current) => ({ ...current, slug: value }))} />
          <Field label="Logo URL" value={data.form.logoUrl} onChange={(value) => data.setForm((current) => ({ ...current, logoUrl: value }))} />
          <Field label="Website" value={data.form.website} onChange={(value) => data.setForm((current) => ({ ...current, website: value }))} />
          <Field label="State" maxLength={128} value={data.form.state} onChange={(value) => data.setForm((current) => ({ ...current, state: value }))} />
          <Field label="Category type" maxLength={128} value={data.form.categoryType} onChange={(value) => data.setForm((current) => ({ ...current, categoryType: value }))} />
        </>}
        <label className="block text-sm font-medium text-slate-700 md:col-span-2">{category ? "Description" : "Organization description"}
          <textarea className={inputClass} rows={2} value={data.form.description} onChange={(event) => data.setForm((current) => ({ ...current, description: event.target.value }))} />
        </label>
        <div className="flex flex-wrap items-end gap-4">
          <label className="inline-flex items-center gap-2 pb-2 text-sm"><input type="checkbox" checked={data.form.isActive} onChange={(event) => data.setForm((current) => ({ ...current, isActive: event.target.checked }))} />Active</label>
          {category && <label className="inline-flex items-center gap-2 pb-2 text-sm"><input type="checkbox" checked={data.form.isFeatured} onChange={(event) => data.setForm((current) => ({ ...current, isFeatured: event.target.checked }))} />Featured</label>}
          <button className="rounded-lg bg-rose-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-60" disabled={data.saving}>{data.saving ? "Saving…" : data.editingId ? "Save changes" : `Create ${kind}`}</button>
          {data.editingId && <button type="button" className="rounded-lg border px-3 py-2 text-sm" onClick={() => { data.setEditingId(""); data.setForm(kind === "category" ? { name: "", slug: "", description: "", icon: "", isActive: true, isFeatured: false } : { name: "", shortName: "", slug: "", logoUrl: "", website: "", description: "", state: "", categoryType: "", isActive: true }); }}>Cancel edit</button>}
        </div>
      </form>
      {data.selectedIds.length > 0 && <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border bg-white p-3">
        <span className="mr-2 text-sm font-semibold">{data.selectedIds.length} selected</span>
        <button className="rounded-lg border px-3 py-2 text-sm" onClick={() => data.bulkActive(true)}>Activate selected</button>
        <button className="rounded-lg border px-3 py-2 text-sm" onClick={() => data.bulkActive(false)}>Deactivate selected</button>
        <button className="rounded-lg border border-rose-200 px-3 py-2 text-sm text-rose-800" onClick={data.bulkRemove}>Delete selected</button>
        <button className="rounded-lg border px-3 py-2 text-sm" onClick={() => data.setSelectedIds([])}>Clear selection</button>
      </div>}
      {data.loading ? <Loading label={`Loading ${kind}s…`} /> : data.items.length === 0 ? <p className="rounded-xl border bg-white p-5 text-sm text-slate-600">No records found.</p> : (
        <div className="space-y-3">
          {data.items.map((item) => <article key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-white p-4">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={data.selectedIds.includes(item.id)} aria-label={`Select ${item.name}`}
                onChange={(event) => data.setSelectedIds((current) => event.target.checked
                  ? [...current, item.id]
                  : current.filter((id) => id !== item.id))} />
            </label>
            <div><h2 className="font-bold">{item.name}</h2><p className="text-sm text-slate-500">{item.slug}{!category && item.shortName ? ` · ${item.shortName}` : ""}</p><p className="mt-1 text-xs text-slate-500">{item.isActive ? "Active" : "Inactive"}{category && item.isFeatured ? " · Featured" : ""} · {item.jobCount} jobs</p></div>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-lg border px-3 py-2 text-sm font-semibold" onClick={() => data.edit(item)}>Edit</button>
              {category && <button className="rounded-lg border px-3 py-2 text-sm font-semibold" onClick={() => data.toggleFeatured(item)}>{item.isFeatured ? "Unfeature" : "Feature"}</button>}
              <button className="rounded-lg border px-3 py-2 text-sm font-semibold" onClick={() => data.toggle(item)}>{item.isActive ? "Deactivate" : "Activate"}</button>
              <button className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-800" onClick={() => data.remove(item)}>Delete</button>
            </div>
          </article>)}
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
    request("/api/v1/admin/analytics").then(setMetrics).catch((failure) => {
      setError(failure.message || "Unable to load analytics.");
    }).finally(() => setLoading(false));
  }, [request]);

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <SectionHeader title="Admin analytics" subtitle="Operational totals computed from PostgreSQL-backed records."
        action={<Link className="text-sm font-semibold text-rose-900 underline" to="/admin/dashboard">Back to dashboard</Link>} />
      <Notice message={error} />
      {loading ? <Loading label="Loading analytics…" /> : metrics && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Jobs" value={metrics.totalJobs} />
          <StatCard label="Open jobs" value={metrics.openJobs} tone="emerald" />
          <StatCard label="Organizations" value={metrics.totalOrganizations} tone="slate" />
          <StatCard label="Average views per job" value={Number(metrics.averageViewsPerJob).toFixed(1)} tone="amber" />
        </div>
      )}
    </main>
  );
}
