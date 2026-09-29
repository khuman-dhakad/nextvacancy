import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { apiRequest } from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const initializationStarted = useRef(false);

  const acceptSession = useCallback((response) => {
    setSession({
      accessToken: response.accessToken,
      role: response.role,
      user: response.user,
      expiresAt: Date.now() + response.expiresIn * 1000,
    });
    setCsrfToken(response.csrfToken);
    setError("");
  }, []);

  const bootstrap = useCallback(async () => {
    if (initializationStarted.current) return;
    initializationStarted.current = true;
    try {
      const csrf = await apiRequest("/api/v1/auth/csrf");
      setCsrfToken(csrf.csrfToken);
      const refreshed = await apiRequest("/api/v1/auth/refresh", {
        method: "POST",
        csrfToken: csrf.csrfToken,
      });
      acceptSession(refreshed);
    } catch (failure) {
      if (failure.status !== 401 && failure.status !== 403) {
        setError(failure.message);
      }
    } finally {
      setLoading(false);
    }
  }, [acceptSession]);

  useEffect(() => { bootstrap(); }, [bootstrap]);

  useEffect(() => {
    if (!session) return undefined;
    const delay = Math.max(1_000, session.expiresAt - Date.now() - 60_000);
    const timer = window.setTimeout(async () => {
      try {
        const refreshed = await apiRequest("/api/v1/auth/refresh", {
          method: "POST",
          csrfToken,
        });
        acceptSession(refreshed);
      } catch (failure) {
        setSession(null);
        setCsrfToken("");
        setError(failure.message);
      }
    }, delay);
    return () => window.clearTimeout(timer);
  }, [acceptSession, csrfToken, session]);

  const signIn = useCallback(async (credentials, isAdmin = false) => {
    const result = await apiRequest(isAdmin ? "/api/v1/auth/admin/login" : "/api/v1/auth/login", {
      method: "POST",
      body: credentials,
    });
    acceptSession(result);
    return result;
  }, [acceptSession]);

  const signOut = useCallback(async () => {
    try {
      if (session) {
        await apiRequest("/api/v1/auth/logout", {
          method: "POST",
          accessToken: session.accessToken,
          csrfToken,
        });
      }
    } finally {
      setSession(null);
      setCsrfToken("");
    }
  }, [csrfToken, session]);

  const value = useMemo(() => ({
    session,
    csrfToken,
    loading,
    error,
    signIn,
    signOut,
  }), [session, csrfToken, loading, error, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider.");
  return value;
}
