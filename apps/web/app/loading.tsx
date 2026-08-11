export default function Loading() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-12 space-y-8 animate-pulse">
      <div className="h-10 w-2/3 max-w-lg bg-slate-900 rounded-xl"></div>
      <div className="h-12 w-full bg-slate-900 rounded-2xl border border-slate-800"></div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-56 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <div className="h-6 w-3/4 bg-slate-800 rounded"></div>
            <div className="h-4 w-1/2 bg-slate-800 rounded"></div>
            <div className="h-4 w-full bg-slate-800 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
