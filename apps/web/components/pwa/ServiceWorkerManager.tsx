"use client";

import { useEffect } from "react";

export const ServiceWorkerManager: React.FC = () => {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    // In development, automatically unregister any stale service workers to prevent cached chunk conflicts
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
    }
  }, []);

  return null;
};

ServiceWorkerManager.displayName = "ServiceWorkerManager";
