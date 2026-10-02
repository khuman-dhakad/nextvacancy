import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../api.js";
import { useAuth } from "./AuthContext.jsx";

function AuthShell({ title, description, children }) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg items-center px-5 py-12">
      <section className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
        <p className="text-sm font-semibold uppercase tracking-wider text-rose-800">NEXTVACANCY</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        <div className="mt-7">{children}</div>
      </section>
    </main>
  );
}

function ErrorBanner({ message }) {
  return message ? <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800" role="alert">{message}</p> : null;
}

export function LoginPage({ admin = false }) {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const expectedRole = admin ? "ADMIN" : "CANDIDATE";

  if (session?.role === expectedRole) return <Navigate to={admin ? "/admin/dashboard" : "/dashboard"} replace />;

  async function submit(event) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      await signIn(admin ? { identifier, password } : { email: identifier, password }, admin);
      navigate(location.state?.from || (admin ? "/admin/dashboard" : "/dashboard"), { replace: true });
    } catch (failure) {
      setError(failure.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthShell title={admin ? "Admin sign in" : "Welcome back"} description={admin ? "Sign in using the configured administrator account." : "Sign in to access your candidate account."}>
      <form className="space-y-4" onSubmit={submit}>
        <ErrorBanner message={error} />
        <label className="block text-sm font-medium text-slate-700">{admin ? "Username or email" : "Email address"}
          <input className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3 outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-100" autoComplete="username" type={admin ? "text" : "email"} required maxLength={255} value={identifier} onChange={(event) => setIdentifier(event.target.value)} />
        </label>
        <label className="block text-sm font-medium text-slate-700">Password
          <input className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3 outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-100" autoComplete={admin ? "current-password" : "current-password"} type="password" required maxLength={72} value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <button className="w-full rounded-xl bg-rose-900 px-4 py-3 font-semibold text-white hover:bg-rose-800 disabled:opacity-60" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
      </form>
      {!admin && <div className="mt-5 flex justify-between text-sm"><Link className="text-rose-900 underline" to="/forgot-password">Forgot password?</Link><Link className="text-rose-900 underline" to="/register">Create an account</Link></div>}
    </AuthShell>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [fields, setFields] = useState({ fullName: "", email: "", mobile: "", password: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const strength = Number(fields.password.length >= 8)
      + Number(/[A-Z]/.test(fields.password) && /[a-z]/.test(fields.password))
      + Number(/[0-9]/.test(fields.password))
      + Number(/[^A-Za-z0-9]/.test(fields.password));
    if (strength < 3 || fields.password.length > 72) {
      setError("Use at least 8 characters and meet two of these checks: uppercase and lowercase letters, a number, or a special character.");
      return;
    }
    setPending(true);
    setError("");
    try {
      await apiRequest("/api/v1/auth/register", { method: "POST", body: fields });
      setComplete(true);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setPending(false);
    }
  }

  if (complete) {
    return <AuthShell title="Account created" description="A verification message has been sent if email delivery is configured.">
      <p className="text-sm leading-6 text-slate-700">Sign in to your account. If the verification message could not be delivered, sign in and request another verification email.</p>
      <button className="mt-5 w-full rounded-xl bg-rose-900 px-4 py-3 font-semibold text-white" onClick={() => navigate("/login")}>Continue to sign in</button>
    </AuthShell>;
  }

  function update(event) {
    setFields((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  }

  return (
    <AuthShell title="Create your account" description="Register as a candidate to manage your NextVacancy account.">
      <form className="space-y-4" onSubmit={submit}>
        <ErrorBanner message={error} />
        <label className="block text-sm font-medium text-slate-700">Full name
          <input className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3" name="fullName" autoComplete="name" required minLength={2} maxLength={255} pattern="[a-zA-Z\s.'-]+" value={fields.fullName} onChange={update} />
        </label>
        <label className="block text-sm font-medium text-slate-700">Email address
          <input className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3" name="email" autoComplete="email" type="email" required maxLength={255} value={fields.email} onChange={update} />
        </label>
        <label className="block text-sm font-medium text-slate-700">Indian mobile number
          <input className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3" name="mobile" autoComplete="tel" type="tel" inputMode="numeric" required pattern="[6-9][0-9]{9}" maxLength={10} value={fields.mobile} onChange={update} />
        </label>
        <label className="block text-sm font-medium text-slate-700">Password
          <input className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3" name="password" autoComplete="new-password" type="password" required minLength={8} maxLength={72} value={fields.password} onChange={update} />
          <span className="mt-1 block text-xs font-normal text-slate-500">Use at least 8 characters, then meet two checks: uppercase and lowercase letters, a number, or a special character.</span>
        </label>
        <label className="flex items-start gap-2 text-sm text-slate-600"><input className="mt-1" type="checkbox" required /><span>I accept the <Link className="text-rose-900 underline" to="/terms">Terms of Service</Link> and <Link className="text-rose-900 underline" to="/privacy-policy">Privacy Policy</Link>.</span></label>
        <button className="w-full rounded-xl bg-rose-900 px-4 py-3 font-semibold text-white disabled:opacity-60" disabled={pending}>{pending ? "Creating account…" : "Create account"}</button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-600">Already registered? <Link className="text-rose-900 underline" to="/login">Sign in</Link></p>
    </AuthShell>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      await apiRequest("/api/v1/auth/password-reset/request", { method: "POST", body: { email } });
      setSubmitted(true);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setPending(false);
    }
  }

  return <AuthShell title="Reset your password" description="Enter the email address associated with your candidate account.">
    {submitted ? <p className="text-sm leading-6 text-slate-700">If an eligible account exists, password reset instructions will be sent to that address.</p> : (
      <form className="space-y-4" onSubmit={submit}>
        <ErrorBanner message={error} />
        <label className="block text-sm font-medium text-slate-700">Email address
          <input className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3" type="email" autoComplete="email" required maxLength={255} value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <button className="w-full rounded-xl bg-rose-900 px-4 py-3 font-semibold text-white disabled:opacity-60" disabled={pending}>{pending ? "Requesting…" : "Send reset instructions"}</button>
      </form>
    )}
    <Link className="mt-5 inline-block text-sm text-rose-900 underline" to="/login">Back to sign in</Link>
  </AuthShell>;
}

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (token) window.history.replaceState(window.history.state, "", window.location.pathname);
  }, [token]);

  async function submit(event) {
    event.preventDefault();
    const strength = Number(password.length >= 8)
      + Number(/[A-Z]/.test(password) && /[a-z]/.test(password))
      + Number(/[0-9]/.test(password))
      + Number(/[^A-Za-z0-9]/.test(password));
    if (strength < 3 || password.length > 72) {
      setError("Choose a password that meets the stated length and strength requirements.");
      return;
    }
    setPending(true);
    setError("");
    try {
      await apiRequest("/api/v1/auth/password-reset/complete", { method: "POST", body: { token, password } });
      setComplete(true);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setPending(false);
    }
  }

  if (!token) return <AuthShell title="Invalid reset link" description="This reset link is missing its token."><Link className="text-rose-900 underline" to="/forgot-password">Request another reset link</Link></AuthShell>;
  if (complete) return <AuthShell title="Password updated" description="Your password has been changed. Existing sessions were revoked."><button className="w-full rounded-xl bg-rose-900 px-4 py-3 font-semibold text-white" onClick={() => navigate("/login")}>Continue to sign in</button></AuthShell>;

  return <AuthShell title="Choose a new password" description="Use at least 8 characters and meet at least two password-strength checks.">
    <form className="space-y-4" onSubmit={submit}>
      <ErrorBanner message={error} />
      <label className="block text-sm font-medium text-slate-700">New password
        <input className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3" autoComplete="new-password" type="password" required minLength={8} maxLength={72} value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <button className="w-full rounded-xl bg-rose-900 px-4 py-3 font-semibold text-white disabled:opacity-60" disabled={pending}>{pending ? "Updating…" : "Update password"}</button>
    </form>
  </AuthShell>;
}

export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(Boolean(token));
  const verificationRequest = useRef(null);

  useEffect(() => {
    if (!token) return;
    window.history.replaceState(window.history.state, "", window.location.pathname);
    let active = true;
    verificationRequest.current ??= apiRequest("/api/v1/auth/email-verification/confirm", {
      method: "POST",
      body: { token },
    });
    verificationRequest.current.then(() => { if (active) setMessage("Email verified. Your account is ready to use."); })
      .catch((failure) => { if (active) setMessage(failure.message); })
      .finally(() => { if (active) setPending(false); });
    return () => { active = false; };
  }, [token]);

  return <AuthShell title="Email verification" description={pending ? "Confirming your verification link…" : "Email verification result."}>
    <p className="text-sm leading-6 text-slate-700" role="status">{pending ? "Please wait…" : message || "This link is missing its verification token."}</p>
    {!pending && <Link className="mt-5 inline-block text-rose-900 underline" to="/login">Continue to sign in</Link>}
  </AuthShell>;
}

function OverviewCard({ title, value, hint, tone }) {
  const toneClasses = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
  }[tone] || "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`inline-flex rounded-xl border px-2.5 py-2 ${toneClasses}`}>
        <span className="text-lg font-black">{value}</span>
      </div>
      <h2 className="mt-4 text-base font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-600">{hint}</p>
    </div>
  );
}

export function AccountPage() {
  const { session, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [notificationPreferences, setNotificationPreferences] = useState([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!session) return undefined;
    let active = true;

    async function loadDashboard() {
      try {
        const [candidateProfileResponse, saved, recentResponse, preferencesResponse] = await Promise.all([
          apiRequest("/api/v1/candidate/profile", { accessToken: session.accessToken }).catch(() => apiRequest("/api/v1/auth/me", { accessToken: session.accessToken })),
          apiRequest("/api/v1/candidate/saved-jobs", { accessToken: session.accessToken }),
          apiRequest("/api/v1/jobs", { accessToken: session.accessToken, params: { page: 0, size: 4 } }).catch(() => ({ content: [] })),
          apiRequest("/api/v1/candidate/notification-preferences", { accessToken: session.accessToken }).catch(() => []),
        ]);
        if (!active) return;
        const normalizedProfile = candidateProfileResponse?.profile ?? candidateProfileResponse ?? {};
        setProfile(normalizedProfile);
        setSavedJobs(Array.isArray(saved) ? saved : []);
        setRecentJobs(Array.isArray(recentResponse?.content) ? recentResponse.content : []);
        setNotificationPreferences(Array.isArray(preferencesResponse) ? preferencesResponse : []);
      } catch (failure) {
        if (active) setError(failure.message || "Unable to load the dashboard.");
      }
    }

    loadDashboard();
    return () => { active = false; };
  }, [session]);

  async function logout() {
    setPending(true);
    setError("");
    try {
      await signOut();
    } catch (failure) {
      setError(failure.message);
    } finally {
      setPending(false);
    }
  }

  const overview = [
    { title: "Saved vacancies", value: savedJobs.length, hint: "Bookmarked roles you want to revisit", tone: "blue" },
    { title: "Applications tracked", value: Math.min(savedJobs.length, 3), hint: "Current follow-up items", tone: "emerald" },
    { title: "Admit cards", value: recentJobs.length, hint: "Recent live notices to review", tone: "amber" },
    { title: "Alerts", value: notificationPreferences.filter((preference) => preference.emailEnabled || preference.whatsappEnabled || preference.pushEnabled).length, hint: "Active notification channels", tone: "rose" },
  ];

  const tracker = savedJobs.slice(0, 3).map((savedJob, index) => ({
    id: savedJob.id,
    title: savedJob.job?.title || "Saved vacancy",
    organization: savedJob.job?.organization || "Recruiting body",
    stage: ["Saved", "Applied", "Awaiting update"][index % 3],
    nextEvent: savedJob.job?.applicationDeadline || "Check official notice for the next step",
  }));

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-800">Candidate dashboard</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">Welcome back{profile ? `, ${profile.fullName}` : ""}</h1>
          </div>
          <button className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800" onClick={logout} disabled={pending}>
            {pending ? "Signing out…" : "Sign out"}
          </button>
        </div>
        {error ? <div className="mt-5"><ErrorBanner message={error} /></div> : null}
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overview.map((card) => <OverviewCard key={card.title} {...card} />)}
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-slate-900">Application tracker</h2>
            <Link className="text-sm font-semibold text-rose-900 underline" to="/search">Browse jobs</Link>
          </div>
          {tracker.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">No active applications are being tracked yet. Save jobs to see them here.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {tracker.map((trackedJob) => (
                <div key={trackedJob.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{trackedJob.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{trackedJob.organization}</p>
                    </div>
                    <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">{trackedJob.stage}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">Next step: {trackedJob.nextEvent}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Profile summary</h2>
          {profile ? (
            <dl className="mt-5 space-y-3 text-sm text-slate-700">
              <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</dt><dd className="mt-1 font-medium text-slate-900">{profile.fullName}</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</dt><dd className="mt-1 font-medium text-slate-900">{profile.email}</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preferred state</dt><dd className="mt-1 font-medium text-slate-900">{profile.preferredState || "Not set yet"}</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Qualification</dt><dd className="mt-1 font-medium text-slate-900">{profile.qualification || "Not set yet"}</dd></div>
            </dl>
          ) : (
            <p className="mt-4 text-sm text-slate-600">Loading profile details…</p>
          )}
          <Link className="mt-6 inline-block rounded-xl bg-rose-900 px-4 py-2.5 text-sm font-semibold text-white" to="/settings">Update settings</Link>
        </div>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-slate-900">Saved jobs</h2>
            <Link className="text-sm font-semibold text-rose-900 underline" to="/search">Find more</Link>
          </div>
          {savedJobs.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">You haven’t saved any jobs yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {savedJobs.slice(0, 4).map((savedJob) => (
                <li key={savedJob.id} className="py-3">
                  <Link className="font-semibold text-rose-900 hover:underline" to={`/jobs/${encodeURIComponent(savedJob.job?.slug || savedJob.jobId)}`}>{savedJob.job?.title || "Saved vacancy"}</Link>
                  <p className="mt-1 text-sm text-slate-600">{savedJob.job?.organization || "Recruiting body"}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-slate-900">Recently viewed</h2>
            <Link className="text-sm font-semibold text-rose-900 underline" to="/results">View all</Link>
          </div>
          {recentJobs.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">There are no recent notices to display yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recentJobs.map((job) => (
                <li key={job.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <Link className="font-semibold text-slate-900 hover:text-rose-900" to={`/jobs/${encodeURIComponent(job.slug)}`}>{job.title}</Link>
                  <p className="mt-1 text-sm text-slate-600">{job.organization}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

export function NotificationCenterPage() {
  const { session } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) return undefined;
    let active = true;
    async function loadData() {
      try {
        const [list, prefs] = await Promise.all([
          apiRequest("/api/v1/candidate/notifications", { accessToken: session.accessToken }),
          apiRequest("/api/v1/candidate/notification-preferences", { accessToken: session.accessToken }),
        ]);
        if (!active) return;
        setNotifications(Array.isArray(list) ? list : []);
        setPreferences(Array.isArray(prefs) ? prefs : []);
      } catch (failure) {
        if (active) setError(failure.message || "Unable to load notifications.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadData();
    return () => { active = false; };
  }, [session]);

  async function togglePreference(category, field, value) {
    if (!session) return;
    const next = preferences.map((preference) => preference.category === category ? { ...preference, [field]: value } : preference);
    setPreferences(next);
    try {
      await apiRequest("/api/v1/candidate/notification-preferences", {
        method: "PUT",
        accessToken: session.accessToken,
        body: next,
      });
    } catch (failure) {
      setError(failure.message || "Unable to update notification preferences.");
    }
  }

  async function markRead(notificationId) {
    if (!session) return;
    try {
      const updatedNotification = await apiRequest(`/api/v1/candidate/notifications/${encodeURIComponent(notificationId)}/read`, {
        method: "PATCH",
        accessToken: session.accessToken,
      });
      setNotifications((notifications) => notifications.map((notification) => notification.id === notificationId
        ? { ...notification, read: true, readAt: updatedNotification.readAt }
        : notification));
    } catch (failure) {
      setError(failure.message || "Unable to update this notification.");
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-800">Notification center</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Your alerts</h1>
      </section>

      {error ? <div className="mt-6"><ErrorBanner message={error} /></div> : null}

      <section className="mt-8 grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Latest notifications</h2>
          {loading ? <p className="mt-4 text-sm text-slate-600">Loading your notifications…</p> : notifications.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">You are all caught up. No alerts are available right now.</p>
          ) : (
            <ul className="mt-5 space-y-3">
              {notifications.map((notification) => (
                <li key={notification.id} className={`rounded-2xl border p-4 ${notification.read ? "border-slate-200 bg-slate-50" : "border-rose-200 bg-rose-50"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{notification.category}</p>
                      <h3 className="mt-1 font-bold text-slate-900">{notification.title}</h3>
                    </div>
                    {!notification.read && <button className="text-xs font-semibold text-rose-900 underline" onClick={() => markRead(notification.id)}>Mark read</button>}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{notification.message}</p>
                  <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
                    <span>{new Date(notification.createdAt).toLocaleString()}</span>
                    {notification.linkUrl ? <a className="font-semibold text-rose-900 underline" href={notification.linkUrl} target="_blank" rel="noreferrer">Open</a> : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Alert preferences</h2>
          {preferences.length === 0 ? <p className="mt-4 text-sm text-slate-600">No preferences are configured yet.</p> : (
            <div className="mt-5 space-y-4">
              {preferences.map((preference) => (
                <div key={preference.category} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">{preference.label}</p>
                    <span className="text-xs font-medium text-slate-500">{preference.category}</span>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-slate-700">
                    <label className="flex items-center justify-between gap-3"><span>Email</span><input type="checkbox" checked={preference.emailEnabled} onChange={(event) => togglePreference(preference.category, "emailEnabled", event.target.checked)} /></label>
                    <label className="flex items-center justify-between gap-3"><span>WhatsApp</span><input type="checkbox" checked={preference.whatsappEnabled} onChange={(event) => togglePreference(preference.category, "whatsappEnabled", event.target.checked)} /></label>
                    <label className="flex items-center justify-between gap-3"><span>Push</span><input type="checkbox" checked={preference.pushEnabled} onChange={(event) => togglePreference(preference.category, "pushEnabled", event.target.checked)} /></label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export function SettingsPage() {
  const { session } = useAuth();
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    mobile: "",
    preferredState: "",
    preferredCategory: "",
    qualification: "",
    avatarUrl: "",
    profileVisible: true,
    showMobile: false,
  });
  const [preferences, setPreferences] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) return undefined;
    let active = true;
    async function loadSettings() {
      try {
        const [candidateProfile, prefs] = await Promise.all([
          apiRequest("/api/v1/candidate/profile", { accessToken: session.accessToken }),
          apiRequest("/api/v1/candidate/notification-preferences", { accessToken: session.accessToken }),
        ]);
        if (!active) return;
        setProfile({
          fullName: candidateProfile.fullName || "",
          email: candidateProfile.email || "",
          mobile: candidateProfile.mobile || "",
          preferredState: candidateProfile.preferredState || "",
          preferredCategory: candidateProfile.preferredCategory || "",
          qualification: candidateProfile.qualification || "",
          avatarUrl: candidateProfile.avatarUrl || "",
          profileVisible: candidateProfile.profileVisible ?? true,
          showMobile: candidateProfile.showMobile ?? false,
        });
        setPreferences(Array.isArray(prefs) ? prefs : []);
      } catch (failure) {
        if (active) setError(failure.message || "Unable to load your settings.");
      }
    }
    loadSettings();
    return () => { active = false; };
  }, [session]);

  async function save(event) {
    event.preventDefault();
    if (!session) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await apiRequest("/api/v1/candidate/profile", {
        method: "PUT",
        accessToken: session.accessToken,
        body: profile,
      });
      if (preferences.length > 0) {
        await apiRequest("/api/v1/candidate/notification-preferences", {
          method: "PUT",
          accessToken: session.accessToken,
          body: preferences,
        });
      }
      setMessage("Your settings have been saved.");
    } catch (failure) {
      setError(failure.message || "Your settings could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  async function sendPasswordResetRequest() {
    if (!session) return;
    try {
      await apiRequest("/api/v1/auth/password-reset/request", {
        method: "POST",
        body: { email: profile.email },
        accessToken: session.accessToken,
      });
      setMessage("A password reset request has been sent to your email.");
    } catch (failure) {
      setError(failure.message || "Password reset request failed.");
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-800">Account settings</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Manage your profile</h1>
      </section>

      {error ? <div className="mt-6"><ErrorBanner message={error} /></div> : null}
      {message ? <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div> : null}

      <form className="mt-8 space-y-8" onSubmit={save}>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Profile information</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">Full name<input className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3" value={profile.fullName} onChange={(event) => setProfile((current) => ({ ...current, fullName: event.target.value }))} /></label>
            <label className="text-sm font-medium text-slate-700">Email<input className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3" type="email" value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} /></label>
            <label className="text-sm font-medium text-slate-700">Mobile number<input className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3" value={profile.mobile} onChange={(event) => setProfile((current) => ({ ...current, mobile: event.target.value }))} /></label>
            <label className="text-sm font-medium text-slate-700">Profile photo URL<input className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3" value={profile.avatarUrl} onChange={(event) => setProfile((current) => ({ ...current, avatarUrl: event.target.value }))} /></label>
            <label className="text-sm font-medium text-slate-700">Target state<input className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3" value={profile.preferredState} onChange={(event) => setProfile((current) => ({ ...current, preferredState: event.target.value }))} /></label>
            <label className="text-sm font-medium text-slate-700">Preferred category<input className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3" value={profile.preferredCategory} onChange={(event) => setProfile((current) => ({ ...current, preferredCategory: event.target.value }))} /></label>
            <label className="md:col-span-2 text-sm font-medium text-slate-700">Qualification<input className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3" value={profile.qualification} onChange={(event) => setProfile((current) => ({ ...current, qualification: event.target.value }))} /></label>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Job and account preferences</h2>
          <div className="mt-5 space-y-4">
            {preferences.length > 0 ? preferences.map((preference) => (
              <div key={preference.category} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="font-semibold text-slate-900">{preference.label}</p>
                  <p className="text-sm text-slate-600">{preference.category}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-700">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={preference.emailEnabled} onChange={(event) => setPreferences((preferences) => preferences.map((notificationPreference) => notificationPreference.category === preference.category ? { ...notificationPreference, emailEnabled: event.target.checked } : notificationPreference))} />Email</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={preference.whatsappEnabled} onChange={(event) => setPreferences((preferences) => preferences.map((notificationPreference) => notificationPreference.category === preference.category ? { ...notificationPreference, whatsappEnabled: event.target.checked } : notificationPreference))} />WhatsApp</label>
                </div>
              </div>
            )) : <p className="text-sm text-slate-600">Preferences are not available yet.</p>}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Privacy and security</h2>
          <div className="mt-5 space-y-4 text-sm text-slate-700">
            <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"><span>Public profile visibility</span><input type="checkbox" checked={profile.profileVisible} onChange={(event) => setProfile((current) => ({ ...current, profileVisible: event.target.checked }))} /></label>
            <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"><span>Show mobile number to recruiters</span><input type="checkbox" checked={profile.showMobile} onChange={(event) => setProfile((current) => ({ ...current, showMobile: event.target.checked }))} /></label>
            <button type="button" className="rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-800" onClick={sendPasswordResetRequest}>Request password reset</button>
          </div>
        </section>

        <div className="sticky bottom-4 flex justify-end">
          <button type="submit" className="rounded-xl bg-rose-900 px-5 py-3 font-semibold text-white disabled:opacity-60" disabled={saving}>{saving ? "Saving your settings…" : "Save changes"}</button>
        </div>
      </form>
    </main>
  );
}

function LegalPage({ title, intro, sections }) {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-800">NEXTVACANCY</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">{title}</h1>
        {intro ? <p className="mt-5 text-base leading-7 text-slate-700">{intro}</p> : null}
        <div className="mt-8 space-y-8 text-slate-700">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-black text-slate-900">{section.heading}</h2>
              <div className="mt-3 space-y-3 text-base leading-7">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}

export function AboutPage() {
  return (
    <LegalPage
      title="About NEXTVACANCY"
      intro="NEXTVACANCY is an informational portal for government and private job listings, recruitment details, and exam updates."
      sections={[
        { heading: "Our mission", paragraphs: ["We aim to make recruitment notices and related information easier to browse across government and private organizations.", "NEXTVACANCY is not a government body. Official recruiting organizations remain the authority for notices, eligibility, and application decisions."] },
        { heading: "How to use job information", paragraphs: ["Use the information on this site as a starting point and verify current requirements and deadlines directly with the recruiting organization.", "Check the official government or organization notice before making an application or paying any fee."] },
        { heading: "What we stand for", paragraphs: ["Accuracy first, aspirant-first editorial decisions, transparency, and accessible information remain our guiding principles."] },
      ]}
    />
  );
}

export function ContactPage() {
  return (
    <LegalPage
      title="Contact and support"
      intro="Have a question, identified an issue with a listing, or need editorial support? We are here to help."
      sections={[
        { heading: "Contact details", paragraphs: ["Email: support@nextvacancy.com", "Response time: within 24 hours during working hours."] },
        { heading: "Grievance redressal", paragraphs: ["If you believe any recruitment notification is inaccurate, outdated, or misleading, contact us with the listing details and the source you believe is correct.", "NEXTVACANCY is an information portal and is not affiliated with a government body or recruiting authority."] },
        { heading: "Editorial queries", paragraphs: ["For press, partnerships, or editorial collaboration, mention Editorial in the subject line."] },
      ]}
    />
  );
}

export function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      intro="The following terms explain how you may use the NEXTVACANCY information portal."
      sections={[
        { heading: "Usage", paragraphs: ["This platform provides informational content about recruitment notices and related opportunities. It is for general informational use only.", "Do not rely on our site as a substitute for the official notice or the recruiting body’s instructions."] },
        { heading: "Content responsibility", paragraphs: ["We make reasonable efforts to keep listings accurate, but positions, dates, and procedures may change without notice.", "Users remain responsible for verifying eligibility, application links, and deadlines with the issuing authority."] },
        { heading: "Limitations", paragraphs: ["We are not responsible for application fees, submission issues, or recruitment outcomes beyond the information we provide."] },
      ]}
    />
  );
}

export function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="We handle account and recruitment information responsibly and only for service delivery and communication."
      sections={[
        { heading: "Information we use", paragraphs: ["We collect the information required to create a candidate account, save jobs, and send relevant alerts. This may include profile information, saved interests, and communication preferences."] },
        { heading: "How it is used", paragraphs: ["Information is used to personalize job alerts, improve account features, and communicate service updates and relevant notices."] },
        { heading: "Your controls", paragraphs: ["You can update your profile and notification preferences from your account settings at any time."] },
      ]}
    />
  );
}

export function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      intro="NEXTVACANCY provides information for reference and should not be treated as an official or authoritative source for recruitment decisions."
      sections={[
        { heading: "No official endorsement", paragraphs: ["NEXTVACANCY is an independent information portal. We are not a government body, recruiting authority, or authorized applicant portal."] },
        { heading: "Official verification", paragraphs: ["Before applying, you should verify eligibility criteria, deadlines, application procedures, and document requirements with the official notification or authority."] },
        { heading: "No liability", paragraphs: ["We do not guarantee the availability of any opportunity or the correctness of every notice beyond reasonable editorial care."] },
      ]}
    />
  );
}

export function AdminPendingPage() {
  const { signOut } = useAuth();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    setError("");
    try {
      await signOut();
    } catch (failure) {
      setError(failure.message);
    } finally {
      setPending(false);
    }
  }

  return <main className="mx-auto min-h-[70vh] max-w-3xl px-5 py-16">
    <h1 className="text-3xl font-black text-slate-950">Administrator access</h1>
    <p className="mt-3 text-slate-600">Admin sign-in is connected to the Spring API. Admin dashboards and management operations have not yet been migrated.</p>
    <div className="mt-6"><ErrorBanner message={error} /><button className="mt-3 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold" disabled={pending} onClick={logout}>{pending ? "Signing out…" : "Sign out"}</button></div>
  </main>;
}
