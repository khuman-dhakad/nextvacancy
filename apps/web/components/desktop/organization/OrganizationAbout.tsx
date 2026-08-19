import React from "react";
import { Info, CheckCircle2, Shield, Building } from "lucide-react";

import { Card } from "@/components/ui";
import { OrganizationProfile } from "@/types";

export interface OrganizationAboutProps {
  profile: OrganizationProfile;
  className?: string;
}

export const OrganizationAbout: React.FC<OrganizationAboutProps> = ({
  profile,
  className = "",
}) => {
  return (
    <section aria-label={`About ${profile.name}`} className={className}>
      <Card className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-xs space-y-8">
        {/* Section 1: Overview & Charter */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-[var(--primary)]" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              About {profile.name} ({profile.shortName})
            </h2>
          </div>

          <p className="text-slate-700 text-sm leading-relaxed font-medium">
            {profile.description}
          </p>

          {profile.aboutDetails && profile.aboutDetails.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {profile.aboutDetails.map((detail, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 leading-relaxed"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Section 2: Standard Selection Process */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-700" />
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Standard Examination &amp; Recruitment Methodology
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {profile.selectionProcess.map((step, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-gradient-to-b from-blue-50/50 to-slate-50 border border-blue-100 space-y-2 relative"
              >
                <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-[var(--primary)] font-mono text-[10px] font-black">
                  Stage 0{index + 1}
                </span>
                <p className="text-xs font-bold text-slate-900 leading-snug">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Key Departments & Ministries Allocated */}
        {profile.keyDepartments && profile.keyDepartments.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-slate-600" />
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Participating Ministries, Attached Offices &amp; Cadres
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.keyDepartments.map((dept, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold border border-slate-200 transition-colors"
                >
                  {dept}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </section>
  );
};

OrganizationAbout.displayName = "OrganizationAbout";
