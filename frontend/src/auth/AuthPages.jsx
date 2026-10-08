import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  FileCheck2,
  FileText,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { apiGet, apiRequest } from "../api.js";
import { useAuth } from "./AuthContext.jsx";

function AuthShell({ title, description, admin = false, children }) {
  return (
    <main className="mx-auto flex min-h-[75vh] max-w-lg items-center px-4 py-12 sm:px-6">
      <section className="w-full rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-9">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xs font-black tracking-tight text-slate-950">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-900 text-white">
              <Briefcase size={14} />
            </span>
            <span>NEXT<span className="text-rose-900">VACANCY</span></span>
          </Link>

          {admin ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-bold text-rose-300">
              <Shield size={11} /> Administrator
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-900">
              <User size={11} /> Candidate Portal
            </span>
          )}
        </div>

        <h1 className="mt-5 text-2xl font-black text-slate-950 sm:text-3xl">{title}</h1>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{description}</p>

        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}

function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-900" role="alert">
      <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-700" />
      <span>{message}</span>
    </div>
  );
}

export function LoginPage({ admin = false }) {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const expectedRole = admin ? "ADMIN" : "CANDIDATE";

  if (session?.role === expectedRole) {
    return <Navigate to={admin ? "/admin/dashboard" : "/dashboard"} replace />;
  }

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
    <AuthShell
      title={admin ? "Admin Sign In" : "Candidate Sign In"}
      description={
        admin
          ? "Sign in using your configured administrator credentials."
          : "Access your saved vacancies, application milestones, and customized job alerts."
      }
      admin={admin}
    >
      <form className="space-y-4" onSubmit={submit}>
        <ErrorBanner message={error} />

        <div>
          <label className="block text-xs font-bold text-slate-800">
            {admin ? "Username or Email Address" : "Email Address"}
          </label>
          <div className="relative mt-1.5">
            <input
              type={admin ? "text" : "email"}
              required
              autoFocus
              autoComplete="username"
              maxLength={255}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={admin ? "admin or admin@example.com" : "you@example.com"}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800">Password</label>
            {!admin && (
              <Link to="/forgot-password" className="text-xs font-semibold text-rose-900 hover:underline">
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative mt-1.5">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              maxLength={72}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-300 bg-white pr-10 pl-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-600 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-rose-900 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-rose-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Authenticating…" : admin ? "Sign In to Admin Panel" : "Sign In to Account"}
        </button>
      </form>

      {!admin && (
        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-600">
          <span>Don't have a candidate account? </span>
          <Link to="/register" className="font-bold text-rose-900 hover:underline">
            Register free
          </Link>
        </div>
      )}
    </AuthShell>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [fields, setFields] = useState({ fullName: "", email: "", mobile: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);

  function calculateStrength(pwd) {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  }

  const pwdScore = calculateStrength(fields.password);

  async function submit(event) {
    event.preventDefault();
    if (pwdScore < 3 || fields.password.length > 72) {
      setError("Please use at least 8 characters and satisfy two of: uppercase/lowercase letters, numbers, or special symbols.");
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

  function update(e) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  if (complete) {
    return (
      <AuthShell
        title="Account Created"
        description="Your candidate account registration was successful."
      >
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs leading-relaxed text-emerald-900">
          <p className="font-bold">Check your email for verification</p>
          <p className="mt-1">
            If verification email delivery is enabled in your environment, a confirmation link has been sent to <strong>{fields.email}</strong>.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-5 w-full rounded-xl bg-rose-900 py-3 text-xs font-bold text-white shadow-xs hover:bg-rose-800"
        >
          Continue to Sign In
        </button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create Candidate Account"
      description="Save notifications, track your exam schedules, and receive timely application alerts."
    >
      <form className="space-y-4" onSubmit={submit}>
        <ErrorBanner message={error} />

        <div>
          <label className="block text-xs font-bold text-slate-800">Full Name *</label>
          <input
            type="text"
            name="fullName"
            required
            minLength={2}
            maxLength={255}
            pattern="[a-zA-Z\s.'-]+"
            autoComplete="name"
            value={fields.fullName}
            onChange={update}
            placeholder="e.g. Rahul Sharma"
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800">Email Address *</label>
          <input
            type="email"
            name="email"
            required
            maxLength={255}
            autoComplete="email"
            value={fields.email}
            onChange={update}
            placeholder="e.g. rahul@example.com"
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800">Indian Mobile Number *</label>
          <div className="relative mt-1.5 flex items-center">
            <span className="absolute left-3.5 text-xs font-bold text-slate-500">+91</span>
            <input
              type="tel"
              name="mobile"
              required
              inputMode="numeric"
              pattern="[6-9][0-9]{9}"
              maxLength={10}
              autoComplete="tel"
              value={fields.mobile}
              onChange={update}
              placeholder="9876543210"
              className="w-full rounded-xl border border-slate-300 bg-white pr-3.5 pl-11 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800">Password *</label>
          <div className="relative mt-1.5">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              value={fields.password}
              onChange={update}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-slate-300 bg-white pr-10 pl-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-600 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Password strength meter */}
          {fields.password && (
            <div className="mt-2 space-y-1.5">
              <div className="flex gap-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full transition-all ${pwdScore >= 1 ? "bg-rose-500 w-1/4" : "w-0"}`} />
                <div className={`h-full transition-all ${pwdScore >= 2 ? "bg-amber-500 w-1/4" : "w-0"}`} />
                <div className={`h-full transition-all ${pwdScore >= 3 ? "bg-blue-500 w-1/4" : "w-0"}`} />
                <div className={`h-full transition-all ${pwdScore >= 4 ? "bg-emerald-500 w-1/4" : "w-0"}`} />
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                {pwdScore < 3
                  ? "Weak: Use uppercase, lowercase, numbers, and symbols."
                  : pwdScore === 3
                  ? "Good strength password"
                  : "Strong password"}
              </p>
            </div>
          )}
        </div>

        <label className="flex items-start gap-2.5 pt-1 text-xs text-slate-600">
          <input type="checkbox" required className="mt-0.5 rounded border-slate-300 text-rose-900 focus:ring-rose-600" />
          <span>
            I accept the <Link to="/terms" className="font-semibold text-rose-900 underline">Terms of Service</Link> and <Link to="/privacy-policy" className="font-semibold text-rose-900 underline">Privacy Policy</Link>.
          </span>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-rose-900 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-rose-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Creating Account…" : "Create Account"}
        </button>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-600">
        <span>Already have an account? </span>
        <Link to="/login" className="font-bold text-rose-900 hover:underline">
          Sign in
        </Link>
      </div>
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

  return (
    <AuthShell
      title="Reset Password"
      description="Enter your registered candidate email address to receive reset instructions."
    >
      {submitted ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs leading-relaxed text-emerald-900">
            <p className="font-bold">Instructions Sent</p>
            <p className="mt-1">
              If an account with <strong>{email}</strong> exists, password reset instructions have been dispatched.
            </p>
          </div>
          <Link
            to="/login"
            className="block text-center rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800"
          >
            Return to Sign In
          </Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={submit}>
          <ErrorBanner message={error} />

          <div>
            <label className="block text-xs font-bold text-slate-800">Email Address</label>
            <input
              type="email"
              required
              maxLength={255}
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-rose-900 py-3 text-xs font-bold text-white shadow-xs hover:bg-rose-800 disabled:opacity-60"
          >
            {pending ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
      )}

      <div className="mt-6 text-center">
        <Link to="/login" className="text-xs font-semibold text-slate-600 hover:text-slate-950">
          ← Back to Sign In
        </Link>
      </div>
    </AuthShell>
  );
}

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (token) window.history.replaceState(window.history.state, "", window.location.pathname);
  }, [token]);

  async function submit(event) {
    event.preventDefault();
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

  if (!token) {
    return (
      <AuthShell title="Invalid Link" description="The password reset link is missing a valid token.">
        <Link to="/forgot-password" className="block text-center rounded-xl bg-rose-900 py-2.5 text-xs font-bold text-white">
          Request New Reset Link
        </Link>
      </AuthShell>
    );
  }

  if (complete) {
    return (
      <AuthShell title="Password Updated" description="Your password has been changed successfully.">
        <p className="text-xs text-slate-600 leading-relaxed">
          All existing sessions have been revoked for your security. Please sign in with your new password.
        </p>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-5 w-full rounded-xl bg-rose-900 py-3 text-xs font-bold text-white shadow-xs hover:bg-rose-800"
        >
          Sign In Now
        </button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create New Password"
      description="Choose a secure new password for your candidate account."
    >
      <form className="space-y-4" onSubmit={submit}>
        <ErrorBanner message={error} />

        <div>
          <label className="block text-xs font-bold text-slate-800">New Password</label>
          <div className="relative mt-1.5">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full rounded-xl border border-slate-300 bg-white pr-10 pl-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-600 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-rose-900 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-rose-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Updating…" : "Update Password"}
        </button>
      </form>
    </AuthShell>
  );
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
    verificationRequest.current
      .then(() => { if (active) setMessage("Email verified successfully! Your account is active."); })
      .catch((failure) => { if (active) setMessage(failure.message); })
      .finally(() => { if (active) setPending(false); });
    return () => { active = false; };
  }, [token]);

  return (
    <AuthShell
      title="Email Verification"
      description={pending ? "Verifying your token…" : "Account verification status."}
    >
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-700">
        {pending ? "Please wait while we confirm your email address…" : message || "This link is missing its verification token."}
      </div>
      {!pending && (
        <Link
          to="/login"
          className="mt-5 block text-center rounded-xl bg-rose-900 py-3 text-xs font-bold text-white shadow-xs hover:bg-rose-800"
        >
          Continue to Sign In
        </Link>
      )}
    </AuthShell>
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
          apiRequest("/api/v1/candidate/profile", { accessToken: session.accessToken }).catch(() =>
            apiRequest("/api/v1/auth/me", { accessToken: session.accessToken })
          ),
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

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-8">
      {/* Header Banner */}
      <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="rounded-md bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-900">
              Candidate Workspace
            </span>
            <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
              Welcome back{profile?.fullName ? `, ${profile.fullName}` : ""}
            </h1>
            <p className="mt-1 text-xs text-slate-500">Manage saved drives, application stages, and alert settings.</p>
          </div>
          <button
            type="button"
            onClick={logout}
            disabled={pending}
            className="inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50"
          >
            <LogOut size={14} />
            <span>{pending ? "Signing out…" : "Sign out"}</span>
          </button>
        </div>
        {error && <div className="mt-4"><ErrorBanner message={error} /></div>}
      </section>

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <p className="text-2xl font-black text-rose-900">{savedJobs.length}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Saved Vacancies</p>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <p className="text-2xl font-black text-emerald-700">{savedJobs.length ? Math.min(savedJobs.length, 3) : 0}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Tracked Milestones</p>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <p className="text-2xl font-black text-amber-700">{recentJobs.length}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Recent Notices</p>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <p className="text-2xl font-black text-blue-900">
            {notificationPreferences.filter((p) => p.emailEnabled || p.whatsappEnabled || p.pushEnabled).length}
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Active Alert Channels</p>
        </div>
      </section>

      {/* Main Grid: Application Tracker & Profile Details */}
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Saved & Tracked Jobs */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-950">Bookmarked Vacancies &amp; Tracker</h2>
            <Link to="/search" className="text-xs font-bold text-rose-900 hover:underline">
              Find more drives →
            </Link>
          </div>

          {savedJobs.length === 0 ? (
            <div className="py-10 text-center">
              <Bookmark size={32} className="mx-auto text-slate-300" />
              <p className="mt-3 text-xs font-bold text-slate-700">No saved opportunities yet</p>
              <p className="mt-1 text-xs text-slate-500">Click the bookmark icon on any job notice to save it here.</p>
              <Link to="/government-jobs" className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white">
                Browse government jobs
              </Link>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {savedJobs.map((item) => (
                <li key={item.id} className="py-3.5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 hover:text-rose-900">
                      <Link to={`/jobs/${encodeURIComponent(item.job?.slug || item.jobId)}`}>
                        {item.job?.title || "Saved opportunity"}
                      </Link>
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">{item.job?.organization} · {item.job?.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                      {item.job?.status?.replaceAll("_", " ") || "Active"}
                    </span>
                    <Link
                      to={`/jobs/${encodeURIComponent(item.job?.slug || item.jobId)}`}
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      View
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Profile Summary */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950 border-b border-slate-100 pb-4">
              Profile Details
            </h2>
            {profile ? (
              <dl className="mt-4 space-y-3 text-xs text-slate-700">
                <div>
                  <dt className="text-slate-400 font-semibold uppercase text-[10px]">Candidate Name</dt>
                  <dd className="mt-0.5 font-bold text-slate-900">{profile.fullName || "Not specified"}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-semibold uppercase text-[10px]">Email Address</dt>
                  <dd className="mt-0.5 font-bold text-slate-900">{profile.email || "Not specified"}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-semibold uppercase text-[10px]">Mobile Contact</dt>
                  <dd className="mt-0.5 font-bold text-slate-900">{profile.mobile || "Not specified"}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-semibold uppercase text-[10px]">Target State / Region</dt>
                  <dd className="mt-0.5 font-bold text-slate-900">{profile.preferredState || "All India"}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-semibold uppercase text-[10px]">Qualification</dt>
                  <dd className="mt-0.5 font-bold text-slate-900">{profile.qualification || "Graduate"}</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-4 text-xs text-slate-500">Loading candidate profile…</p>
            )}
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <Link
              to="/settings"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800"
            >
              <Settings size={14} /> Update Settings
            </Link>
          </div>
        </section>
      </div>
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
    const next = preferences.map((p) => (p.category === category ? { ...p, [field]: value } : p));
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
      const updated = await apiRequest(`/api/v1/candidate/notifications/${encodeURIComponent(notificationId)}/read`, {
        method: "PATCH",
        accessToken: session.accessToken,
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true, readAt: updated.readAt } : n))
      );
    } catch (failure) {
      setError(failure.message || "Unable to update notification.");
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-8">
      <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-rose-800">Alert Center</p>
        <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">Recruitment Notifications &amp; Preferences</h1>
      </section>

      {error && <ErrorBanner message={error} />}

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950 border-b border-slate-100 pb-4">
            Recent Alerts &amp; Updates
          </h2>
          {loading ? (
            <p className="mt-4 text-xs text-slate-500">Loading alerts…</p>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              <Bell size={32} className="mx-auto text-slate-300" />
              <p className="mt-3 font-bold text-slate-700">You are all caught up</p>
              <p className="mt-1">No active unread notices at this moment.</p>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`rounded-2xl border p-4 text-xs transition ${
                    n.read ? "border-slate-200 bg-slate-50/70" : "border-rose-200 bg-rose-50/50 shadow-2xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 uppercase">
                        {n.category}
                      </span>
                      <h3 className="mt-1.5 font-bold text-slate-900">{n.title}</h3>
                    </div>
                    {!n.read && (
                      <button
                        type="button"
                        onClick={() => markRead(n.id)}
                        className="text-[11px] font-bold text-rose-900 hover:underline"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  <p className="mt-1.5 leading-relaxed text-slate-600">{n.message}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                    {n.linkUrl && (
                      <a href={n.linkUrl} target="_blank" rel="noreferrer" className="font-bold text-rose-900 underline">
                        Open Circular →
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Alert Channel Toggles */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950 border-b border-slate-100 pb-4">
            Notification Channels
          </h2>
          {preferences.length === 0 ? (
            <p className="mt-4 text-xs text-slate-500">Preferences not available.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {preferences.map((p) => (
                <div key={p.category} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs">
                  <p className="font-bold text-slate-900">{p.label}</p>
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center justify-between">
                      <span className="text-slate-600">Email Digest</span>
                      <input
                        type="checkbox"
                        checked={p.emailEnabled}
                        onChange={(e) => togglePreference(p.category, "emailEnabled", e.target.checked)}
                        className="rounded text-rose-900 focus:ring-rose-600"
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-slate-600">WhatsApp Alerts</span>
                      <input
                        type="checkbox"
                        checked={p.whatsappEnabled}
                        onChange={(e) => togglePreference(p.category, "whatsappEnabled", e.target.checked)}
                        className="rounded text-rose-900 focus:ring-rose-600"
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-slate-600">Push Notifications</span>
                      <input
                        type="checkbox"
                        checked={p.pushEnabled}
                        onChange={(e) => togglePreference(p.category, "pushEnabled", e.target.checked)}
                        className="rounded text-rose-900 focus:ring-rose-600"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
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
        if (active) setError(failure.message || "Unable to load settings.");
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
      setError(failure.message || "Unable to save settings.");
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
      setMessage("A password reset link has been dispatched to your email.");
    } catch (failure) {
      setError(failure.message || "Password reset request failed.");
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 space-y-8">
      <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-rose-800">Account Preferences</p>
        <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">Candidate Settings &amp; Profile</h1>
      </section>

      {error && <ErrorBanner message={error} />}
      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-900">
          {message}
        </div>
      )}

      <form className="space-y-6" onSubmit={save}>
        {/* Profile Info */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-950 border-b border-slate-100 pb-3">Personal &amp; Contact Information</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-rose-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-rose-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">Mobile Number</label>
              <input
                type="tel"
                value={profile.mobile}
                onChange={(e) => setProfile((p) => ({ ...p, mobile: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-rose-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">Target State / Region</label>
              <input
                type="text"
                value={profile.preferredState}
                onChange={(e) => setProfile((p) => ({ ...p, preferredState: e.target.value }))}
                placeholder="e.g. Maharashtra, Uttar Pradesh"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-rose-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">Highest Educational Qualification</label>
              <input
                type="text"
                value={profile.qualification}
                onChange={(e) => setProfile((p) => ({ ...p, qualification: e.target.value }))}
                placeholder="e.g. B.Tech, B.Sc, 12th Pass"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-rose-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">Preferred Category</label>
              <input
                type="text"
                value={profile.preferredCategory}
                onChange={(e) => setProfile((p) => ({ ...p, preferredCategory: e.target.value }))}
                placeholder="e.g. government, banking"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-rose-600"
              />
            </div>
          </div>
        </section>

        {/* Security & Password */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-950 border-b border-slate-100 pb-3">Security &amp; Password</h2>
          <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold text-slate-900">Change Account Password</p>
              <p className="text-xs text-slate-500">Send an authorized reset link to your registered email.</p>
            </div>
            <button
              type="button"
              onClick={sendPasswordResetRequest}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50"
            >
              Dispatch Reset Link
            </button>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-rose-900 px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-rose-800 disabled:opacity-60"
          >
            {saving ? "Saving Changes…" : "Save All Settings"}
          </button>
        </div>
      </form>
    </main>
  );
}

function LegalPage({ title, intro, sections }) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <article className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-xs font-bold uppercase tracking-wider text-rose-800">NextVacancy</p>
        <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">{title}</h1>
        {intro && <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">{intro}</p>}
        <div className="mt-8 space-y-6 border-t border-slate-100 pt-6 text-xs leading-relaxed text-slate-700 sm:text-sm">
          {sections.map((sec, i) => (
            <section key={i}>
              <h2 className="text-sm font-bold text-slate-900 sm:text-base">{sec.heading}</h2>
              <div className="mt-2 space-y-2">
                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
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
      title="About NextVacancy"
      intro="NextVacancy is a dedicated informational platform curating verified recruitment updates, exam schedules, and career notifications across central and state authorities."
      sections={[
        {
          heading: "Our Mission",
          paragraphs: [
            "We aim to eliminate misinformation, clickbait dates, and broken application links for job aspirants across India.",
            "NextVacancy is an independent portal. Official recruiting organizations remain the authoritative source for circulars, eligibility decisions, and selection lists.",
          ],
        },
        {
          heading: "Verification Policy",
          paragraphs: [
            "Every notification listed on NextVacancy is verified against official employment gazettes and official commission websites before publication.",
            "We provide direct URLs to official application servers and never levy charges on aspirants to access public recruitment circulars.",
          ],
        },
      ]}
    />
  );
}

export function ContactPage() {
  return (
    <LegalPage
      title="Contact &amp; Grievance Redressal"
      intro="For editorial inquiries, listing corrections, or technical support, contact our editorial team."
      sections={[
        {
          heading: "Editorial Contact",
          paragraphs: [
            "Email: support@nextvacancy.com",
            "Response time: Within 24 hours on working days.",
          ],
        },
        {
          heading: "Grievance Redressal",
          paragraphs: [
            "If you notice any circular with inaccurate dates or outdated criteria, email us with the listing URL and the official commission gazette link.",
            "We review and update listings promptly upon verification.",
          ],
        },
      ]}
    />
  );
}

export function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="Please read these terms before utilizing the NextVacancy platform."
      sections={[
        {
          heading: "Informational Purpose",
          paragraphs: [
            "This portal provides curated information for general public reference. It is not an official recruitment organ or government entity.",
            "Users must review the full official notification PDF issued by the respective recruiting authority prior to submitting applications or paying fees.",
          ],
        },
        {
          heading: "Platform Limitations",
          paragraphs: [
            "NextVacancy is not liable for application rejections, payment gateway errors on external portals, or changes in authority examination schedules.",
          ],
        },
      ]}
    />
  );
}

export function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="NextVacancy respects user privacy and handles candidate data responsibly."
      sections={[
        {
          heading: "Data We Collect",
          paragraphs: [
            "We collect information provided during candidate registration (name, email, mobile number, educational preferences) solely to deliver account features, bookmark syncing, and notification digests.",
          ],
        },
        {
          heading: "Data Security",
          paragraphs: [
            "User passwords are encrypted with industry-standard bcrypt hashing. We never sell personal candidate information to third parties.",
          ],
        },
      ]}
    />
  );
}

export function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      intro="NextVacancy is an independent public recruitment information portal."
      sections={[
        {
          heading: "No Government Affiliation",
          paragraphs: [
            "NextVacancy is not associated with, affiliated with, or endorsed by any central or state government ministry, department, commission, or recruiting board.",
            "Official circulars, exam dates, syllabus patterns, and results published on official domains (.gov.in, .nic.in, etc.) supersede any third-party summary.",
          ],
        },
      ]}
    />
  );
}
