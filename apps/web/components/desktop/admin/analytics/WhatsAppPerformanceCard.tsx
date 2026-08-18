import React from "react";
import { MessageCircle, Flame } from "lucide-react";
import { Card } from "@/components/ui";
import { WhatsAppMetrics } from "@/types";


export interface WhatsAppPerformanceCardProps {
  metrics: WhatsAppMetrics;
  className?: string;
}

export const WhatsAppPerformanceCard: React.FC<WhatsAppPerformanceCardProps> = ({
  metrics,
  className = "",
}) => {
  return (
    <section aria-label="WhatsApp Virality & Engagement Performance" className={className}>
      <Card className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MessageCircle className="h-4 w-4 text-green-600" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Direct Messaging &amp; Social Virality
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              WhatsApp Broadcast &amp; Sharing Performance
            </h2>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-800 text-xs font-bold border border-green-200">
            <Flame className="h-3.5 w-3.5 text-green-600" />
            <span>High Organic Virality Channel</span>
          </div>
        </div>

        {/* 4 Conversion Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-green-50/60 border border-green-200 space-y-1">
            <span className="text-[11px] font-bold text-green-800 uppercase tracking-wider block">
              Total Shared Links
            </span>
            <span className="text-2xl font-black text-green-700 font-mono block">
              {metrics.totalSharedLinks.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-green-600 font-semibold">
              {metrics.viralGrowthRate} Active Growth
            </span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Viral Click-Through Rate
            </span>
            <span className="text-2xl font-black text-emerald-700 font-mono block">
              {metrics.clickThroughRate}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">
              Conversion to Applied
            </span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1 sm:col-span-2">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
              Most Shared Recruitment Circular
            </span>
            <span className="text-xs font-bold text-slate-900 line-clamp-1 block">
              {metrics.mostSharedJobTitle}
            </span>
            <div className="flex items-center justify-between text-[11px] text-amber-800 font-semibold pt-0.5">
              <span>{metrics.mostSharedJobOrg}</span>
              <span className="font-mono font-bold">{metrics.mostSharedJobCount.toLocaleString("en-IN")} shares</span>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};

WhatsAppPerformanceCard.displayName = "WhatsAppPerformanceCard";
