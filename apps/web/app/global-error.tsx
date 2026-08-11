"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client-side exception
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 flex min-h-screen flex-col items-center justify-center p-4 antialiased">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm text-center space-y-4">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-50 text-red-600 mb-1">
            <AlertCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Something went wrong
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            A temporary system error occurred while loading this page. Please try again.
          </p>
          <div className="pt-2">
            <button
              onClick={() => reset()}
              type="button"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0F2744] hover:bg-[#183B66] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2744] focus-visible:ring-offset-2"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
