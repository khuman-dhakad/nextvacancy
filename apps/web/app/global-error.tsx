"use client";

import { useEffect } from "react";

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
      <body className="bg-slate-950 text-slate-100 flex min-h-screen flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <h2 className="text-xl font-bold text-red-400">Something went wrong</h2>
          <p className="text-xs text-slate-400">
            A temporary system error occurred while rendering the page.
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
