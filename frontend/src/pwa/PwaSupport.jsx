import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function OfflineNotice() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;
  return <div className="fixed inset-x-0 top-0 z-50 bg-amber-400 px-4 py-2 text-center text-xs font-bold text-slate-950" role="status" aria-live="polite">You are offline. Some pages and updates may be unavailable until you reconnect.</div>;
}

function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem("nextvacancy_pwa_dismissed") === "true";
    } catch {
      dismissed = false;
    }
    if (dismissed) return undefined;

    const onInstallPrompt = (event) => {
      event.preventDefault();
      setPromptEvent(event);
    };
    window.addEventListener("beforeinstallprompt", onInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onInstallPrompt);
  }, []);

  if (!promptEvent) return null;

  async function install() {
    setError("");
    try {
      await promptEvent.prompt();
      await promptEvent.userChoice;
      setPromptEvent(null);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Unable to start the installation prompt.");
    }
  }

  function dismiss() {
    setPromptEvent(null);
    try {
      sessionStorage.setItem("nextvacancy_pwa_dismissed", "true");
    } catch {
      setError("The install prompt was dismissed, but this browser could not save that preference.");
    }
  }

  return (
    <aside className="fixed bottom-4 left-4 right-4 z-40 rounded-2xl border border-slate-700 bg-[#0F2744] p-4 text-white shadow-2xl sm:left-auto sm:right-6 sm:max-w-md" aria-label="App installation prompt">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold">Install NEXTVACANCY</h2>
          <p className="mt-1 text-xs text-slate-300">Add the recruitment portal to your home screen for quick access.</p>
          {error && <p className="mt-2 text-xs text-rose-200" role="alert">{error}</p>}
        </div>
        <button type="button" className="rounded-lg px-2 py-1 text-sm text-slate-300 hover:bg-slate-700" onClick={dismiss} aria-label="Dismiss installation prompt">×</button>
      </div>
      <div className="mt-3 flex justify-end gap-2 border-t border-slate-700 pt-3">
        <button type="button" className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-300" onClick={dismiss}>Not now</button>
        <button type="button" className="rounded-lg bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950" onClick={install}>Install app</button>
      </div>
    </aside>
  );
}

export function PwaSupport() {
  return <><OfflineNotice /><InstallPrompt /></>;
}

export function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg items-center px-5 py-12">
      <section className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">NEXTVACANCY</p>
        <h1 className="mt-3 text-2xl font-black text-slate-950">You’re currently offline</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Check your network connection and try again. Current recruitment records require a connection to the service.</p>
        <div className="mt-6 flex justify-center gap-4 text-sm font-semibold">
          <Link className="text-rose-900 underline" to="/">Return home</Link>
          <Link className="text-rose-900 underline" to="/search">Search vacancies</Link>
        </div>
      </section>
    </main>
  );
}
