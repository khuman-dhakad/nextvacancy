import { useEffect, useRef, useState } from "react";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  FileCheck2,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Shield,
  User,
  X,
} from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";

const primaryNavItems = [
  { label: "All Vacancies", to: "/" },
  { label: "Government", to: "/government-jobs" },
  { label: "Private & Tech", to: "/private-jobs" },
  { label: "Admit Cards", to: "/admit-cards" },
  { label: "Results", to: "/results" },
  { label: "Organizations", to: "/organizations" },
];

export function Header() {
  const { session, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Close user dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Handle ESC key for modals/menus
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  async function handleLogout() {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 px-4 py-1.5 text-center text-xs font-medium text-slate-200">
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-emerald-400" />
          <span>Verified recruitment circulars &amp; direct official application portals.</span>
        </span>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-950 transition hover:opacity-90"
            aria-label="NextVacancy Home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-900 text-white shadow-xs">
              <Briefcase size={20} />
            </span>
            <span className="text-2xl font-black tracking-tight">
              NEXT<span className="text-rose-900">VACANCY</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main Navigation">
          {primaryNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-rose-50 text-rose-900"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Area */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button */}
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
            aria-label="Search all vacancies"
          >
            <Search size={15} className="text-slate-500" />
            <span className="hidden sm:inline">Search</span>
          </Link>

          {/* User Session State / Login Trigger */}
          {session ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-100 text-xs font-black text-rose-900">
                  {session.role === "ADMIN" ? <Shield size={14} /> : <User size={14} />}
                </div>
                <span className="hidden text-xs font-bold sm:inline">
                  {session.role === "ADMIN" ? "Administrator" : session.user?.fullName?.split(" ")[0] || "My Account"}
                </span>
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-slate-950/5 animate-in fade-in zoom-in-95"
                  role="menu"
                >
                  <div className="border-b border-slate-100 px-3 py-2 text-xs">
                    <p className="font-semibold text-slate-900">
                      {session.role === "ADMIN" ? "Admin Session" : session.user?.fullName || "Candidate Account"}
                    </p>
                    <p className="truncate text-slate-500">{session.user?.email || "Authenticated"}</p>
                    <span className="mt-1 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                      {session.role}
                    </span>
                  </div>

                  <div className="pt-1 text-xs">
                    {session.role === "ADMIN" ? (
                      <>
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                          role="menuitem"
                        >
                          <LayoutDashboard size={15} />
                          Admin Dashboard
                        </Link>
                        <Link
                          to="/admin/jobs"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                          role="menuitem"
                        >
                          <FileText size={15} />
                          Manage Jobs
                        </Link>
                        <Link
                          to="/admin/categories"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                          role="menuitem"
                        >
                          <GraduationCap size={15} />
                          Categories
                        </Link>
                        <Link
                          to="/admin/organizations"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                          role="menuitem"
                        >
                          <Building2 size={15} />
                          Organizations
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                          role="menuitem"
                        >
                          <LayoutDashboard size={15} />
                          Dashboard
                        </Link>
                        <Link
                          to="/notifications"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                          role="menuitem"
                        >
                          <FileCheck2 size={15} />
                          Alerts &amp; Notices
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                          role="menuitem"
                        >
                          <Settings size={15} />
                          Account Settings
                        </Link>
                      </>
                    )}

                    <div className="my-1 border-t border-slate-100" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-rose-700 hover:bg-rose-50"
                      role="menuitem"
                    >
                      <LogOut size={15} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-xl px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-900 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-rose-800"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-[88px] z-50 bg-slate-950/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            ref={mobileMenuRef}
            className="max-h-[calc(100vh-88px)] w-full overflow-y-auto border-b border-slate-200 bg-white px-5 py-6 shadow-2xl animate-in slide-in-from-top-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Explore Categories
              </p>
              {primaryNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-3 py-3 text-sm font-bold transition ${
                      isActive
                        ? "bg-rose-50 text-rose-900"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                    }`
                  }
                >
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            {session ? (
              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {session.role === "ADMIN" ? "Admin Access" : "My Account"}
                </p>
                <div className="mt-2 space-y-1">
                  {session.role === "ADMIN" ? (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100"
                      >
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </Link>
                      <Link
                        to="/admin/jobs"
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100"
                      >
                        <FileText size={16} /> Manage Jobs
                      </Link>
                      <Link
                        to="/admin/categories"
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100"
                      >
                        <GraduationCap size={16} /> Categories
                      </Link>
                      <Link
                        to="/admin/organizations"
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100"
                      >
                        <Building2 size={16} /> Organizations
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100"
                      >
                        <LayoutDashboard size={16} /> Candidate Dashboard
                      </Link>
                      <Link
                        to="/notifications"
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100"
                      >
                        <FileCheck2 size={16} /> Alerts &amp; Notifications
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100"
                      >
                        <Settings size={16} /> Account Settings
                      </Link>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-50"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    className="flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-100"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-center rounded-xl bg-rose-900 px-4 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-rose-800"
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
