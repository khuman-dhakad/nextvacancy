import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui";
import { AiSearchReadinessReport } from "@/types";


export interface AiSearchReadinessCardProps {
  report: AiSearchReadinessReport;
  className?: string;
}

export const AiSearchReadinessCard: React.FC<AiSearchReadinessCardProps> = ({
  report,
  className = "",
}) => {
  return (
    <section aria-label="Generative AI & LLM Search Engine Readiness" className={className}>
      <Card className="p-6 sm:p-8 bg-[#0F2744] text-white border border-[#183B66] rounded-2xl shadow-md space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                Generative AI Search Engine Optimization (GEO)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              AI Search Readiness (Perplexity, SearchGPT &amp; Gemini)
            </h2>
            <p className="text-xs text-slate-300 font-medium max-w-2xl">
              {report.summary}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 border border-white/20 p-3.5 rounded-2xl shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                AI Readiness Score
              </span>
              <span className="text-xs text-emerald-400 font-bold">
                Optimized for LLM RAG
              </span>
            </div>
            <div className="w-14 h-14 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-mono font-black text-2xl shadow-md">
              {report.overallScore}
            </div>
          </div>
        </div>

        {/* AI Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {report.metrics.map((metric) => (
            <div
              key={metric.id}
              className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-white text-xs sm:text-sm">
                  {metric.label}
                </span>
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  {metric.score}%
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
};

AiSearchReadinessCard.displayName = "AiSearchReadinessCard";
