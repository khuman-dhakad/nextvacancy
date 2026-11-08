import { lazy, Suspense } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import { Header } from "./components/layout/Header.jsx";
import { Footer } from "./components/layout/Footer.jsx";
import { HomePage } from "./home/HomePage.jsx";
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
import { PublicCatalogPage, PublicJobDetails } from "./catalog/PublicCatalogPages.jsx";
import { OfflinePage, PwaSupport } from "./pwa/PwaSupport.jsx";

const AdminDashboardPage = lazy(() =>
  import("./admin/AdminPages.jsx").then((m) => ({ default: m.AdminDashboardPage }))
);
const AdminJobsPage = lazy(() =>
  import("./admin/AdminPages.jsx").then((m) => ({ default: m.AdminJobsPage }))
);
const AdminJobEditorPage = lazy(() =>
  import("./admin/AdminPages.jsx").then((m) => ({ default: m.AdminJobEditorPage }))
);
const AdminCategoriesPage = lazy(() =>
  import("./admin/AdminPages.jsx").then((m) => ({ default: m.AdminCategoriesPage }))
);
const AdminOrganizationsPage = lazy(() =>
  import("./admin/AdminPages.jsx").then((m) => ({ default: m.AdminOrganizationsPage }))
);
const AdminAnalyticsPage = lazy(() =>
  import("./admin/AdminPages.jsx").then((m) => ({ default: m.AdminAnalyticsPage }))
);

function AdminSkeleton() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 rounded-xl bg-slate-200" />
        <div className="h-12 w-full rounded-2xl bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="h-28 rounded-2xl bg-slate-200" />
          <div className="h-28 rounded-2xl bg-slate-200" />
          <div className="h-28 rounded-2xl bg-slate-200" />
          <div className="h-28 rounded-2xl bg-slate-200" />
        </div>
      </div>
    </main>
  );
}

function AppRoutes() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <PwaSupport />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
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
            <Route
              path="/admin/dashboard"
              element={
                <Suspense fallback={<AdminSkeleton />}>
                  <AdminDashboardPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <Suspense fallback={<AdminSkeleton />}>
                  <AdminJobsPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/jobs/new"
              element={
                <Suspense fallback={<AdminSkeleton />}>
                  <AdminJobEditorPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/jobs/:id/edit"
              element={
                <Suspense fallback={<AdminSkeleton />}>
                  <AdminJobEditorPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <Suspense fallback={<AdminSkeleton />}>
                  <AdminCategoriesPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/organizations"
              element={
                <Suspense fallback={<AdminSkeleton />}>
                  <AdminOrganizationsPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <Suspense fallback={<AdminSkeleton />}>
                  <AdminAnalyticsPage />
                </Suspense>
              }
            />
          </Route>
          <Route
            path="*"
            element={
              <main className="mx-auto max-w-3xl px-5 py-24 text-center">
                <h1 className="text-3xl font-black text-slate-900">404 — Page Not Found</h1>
                <p className="mt-2 text-sm text-slate-600">The requested recruitment page or resource does not exist.</p>
                <Link
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-900 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-800"
                  to="/"
                >
                  Browse Vacancies
                </Link>
              </main>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
