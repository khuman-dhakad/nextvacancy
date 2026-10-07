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
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/jobs" element={<AdminJobsPage />} />
            <Route path="/admin/jobs/new" element={<AdminJobEditorPage />} />
            <Route path="/admin/jobs/:id/edit" element={<AdminJobEditorPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/organizations" element={<AdminOrganizationsPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
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
