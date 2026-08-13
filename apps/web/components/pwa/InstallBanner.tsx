"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export interface InstallBannerProps {
  className?: string;
}

export const InstallBanner: React.FC<InstallBannerProps> = ({
  className = "",
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem("nextvacancy_pwa_dismissed");
      if (isDismissed) return;
    } catch {
      // Ignore private browsing storage restrictions
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setIsVisible(false);
        setDeferredPrompt(null);
      }
    } catch {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem("nextvacancy_pwa_dismissed", "true");
    } catch {
      // Ignore private browsing storage restrictions
    }
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="PWA App Installation Prompt"
      className={[
        "fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50",
        "bg-[var(--primary)] text-white rounded-2xl p-4 shadow-2xl border border-slate-700",
        "animate-in fade-in slide-in-from-bottom-4 duration-300",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-[#F59E0B] shrink-0 border border-amber-500/30">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
              <path d="M12 18h.01" />
            </svg>
          </div>
          <div className="space-y-1">
            <h2 className="text-xs sm:text-sm font-bold text-white leading-snug">
              Install NEXTVACANCY App
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
              Get instant notification alerts and fast 1-tap access on your home screen.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss app install prompt"
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
        <button
          type="button"
          onClick={handleDismiss}
          className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[38px]"
        >
          Not now
        </button>
        <Button
          variant="accent"
          size="sm"
          onClick={handleInstallClick}
          className="font-bold shadow-xs min-h-[38px] px-4"
        >
          Install App
        </Button>
      </div>
    </aside>
  );
};

InstallBanner.displayName = "InstallBanner";
