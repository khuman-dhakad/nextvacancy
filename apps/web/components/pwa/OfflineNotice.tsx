"use client";

import React, { useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true;
}

export const OfflineNotice: React.FC = () => {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 left-0 right-0 z-50 py-2 px-4 text-center text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 bg-amber-500 text-slate-950"
    >
      <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>You are currently offline. Viewing cached recruitment updates.</span>
    </div>
  );
};

OfflineNotice.displayName = "OfflineNotice";
