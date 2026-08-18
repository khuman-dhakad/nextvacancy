import React from "react";
import Link from "next/link";
import {
  Trophy,
  Eye,
  MousePointerClick,
  Share2,
  ExternalLink,
  Edit3,
} from "lucide-react";
import { Card } from "@/components/ui";
import { RankedJobPerformance } from "@/types";


export interface TopPerformingJobsTableProps {
  jobs: RankedJobPerformance[];
  className?: string;
}

export const TopPerformingJobsTable: React.FC<TopPerformingJobsTableProps> = ({
  jobs = [],
  className = "",
}) => {
  return (
    <section aria-label="Top Performing Recruitment Campaigns" className={className}>
      <Card className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Conversion Leaderboard
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Top Performing Recruitment Circulars
            </h2>
          </div>

          <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full">
            Ranked by Total Verified Reach &amp; CTR
          </span>
        </div>

        {/* Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th scope="col" className="py-3.5 px-4 text-center w-12">Rank</th>
                  <th scope="col" className="py-3.5 px-4">Recruitment Campaign</th>
                  <th scope="col" className="py-3.5 px-4">Authority</th>
                  <th scope="col" className="py-3.5 px-4 text-right">Page Views</th>
                  <th scope="col" className="py-3.5 px-4 text-right">Apply Clicks</th>
                  <th scope="col" className="py-3.5 px-4 text-right">WhatsApp Shares</th>
                  <th scope="col" className="py-3.5 px-4 text-center">CTR %</th>
                  <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {jobs.map((job) => {
                  const isTop3 = job.rank <= 3;
                  const rankBadgeColor =
                    job.rank === 1
                      ? "bg-amber-400 text-slate-950 font-black shadow-xs"
                      : job.rank === 2
                      ? "bg-slate-300 text-slate-900 font-bold"
                      : job.rank === 3
                      ? "bg-amber-700 text-white font-bold"
                      : "bg-slate-100 text-slate-600 font-bold";

                  return (
                    <tr
                      key={job.id}
                      className={[
                        "hover:bg-slate-50/80 transition-colors group",
                        isTop3 ? "bg-amber-50/20" : "",
                      ].join(" ")}
                    >
                      <td className="py-3.5 px-4 text-center align-middle">
                        <span className={["w-6 h-6 rounded-full inline-flex items-center justify-center text-[11px] font-mono", rankBadgeColor].join(" ")}>
                          #{job.rank}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 align-middle max-w-xs sm:max-w-sm">
                        <Link
                          href={`/jobs/${job.slug}`}
                          target="_blank"
                          className="font-bold text-slate-900 hover:text-[var(--primary)] transition-colors leading-snug line-clamp-1 block"
                        >
                          {job.title}
                        </Link>
                      </td>

                      <td className="py-3.5 px-4 align-middle whitespace-nowrap text-slate-600 font-semibold">
                        {job.organization}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 align-middle">
                        <span className="inline-flex items-center gap-1">
                          <Eye className="h-3 w-3 text-slate-400" />
                          <span>{job.views.toLocaleString("en-IN")}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 align-middle">
                        <span className="inline-flex items-center gap-1">
                          <MousePointerClick className="h-3 w-3 text-emerald-600" />
                          <span>{job.applyClicks.toLocaleString("en-IN")}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-green-700 align-middle">
                        <span className="inline-flex items-center gap-1">
                          <Share2 className="h-3 w-3 text-green-600" />
                          <span>{job.whatsappClicks.toLocaleString("en-IN")}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center align-middle">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 text-[var(--primary)] font-mono font-bold text-[11px] border border-blue-200">
                          {job.ctr}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right align-middle whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/jobs/${job.slug}`}
                            target="_blank"
                            title="View Public Post"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                          <Link
                            href={`/admin/jobs/${job.id}/edit`}
                            title="Edit in CMS"
                            className="p-1.5 text-slate-400 hover:text-[var(--primary)] hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </section>
  );
};

TopPerformingJobsTable.displayName = "TopPerformingJobsTable";
