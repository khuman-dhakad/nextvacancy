import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function ProtectedRoute({ role }) {
  const { session, loading, error } = useAuth();
  const location = useLocation();

  if (loading) {
    return <main className="mx-auto max-w-3xl px-5 py-20 text-center text-slate-600">Checking your session…</main>;
  }
  if (error && !session) {
    return <main className="mx-auto max-w-3xl px-5 py-20 text-center" role="alert"><h1 className="text-xl font-bold">Unable to verify your session</h1><p className="mt-2 text-slate-600">{error}</p></main>;
  }
  if (!session) {
    const loginPath = role === "ADMIN" ? "/admin/login" : "/login";
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  }
  if (role && session.role !== role) {
    return <main className="mx-auto max-w-3xl px-5 py-20 text-center"><h1 className="text-xl font-bold">You don’t have permission to view this page.</h1></main>;
  }
  return <Outlet />;
}
