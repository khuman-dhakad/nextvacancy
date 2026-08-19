import React from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Calendar,
  Share2,
  Globe,
  Award,
  Layers,
} from "lucide-react";
import { Card } from "@/components/ui";
import { OrganizationProfile } from "@/types";


export interface OrganizationHeroProps {
  profile: OrganizationProfile;
  className?: string;
}

export const OrganizationHero: React.FC<OrganizationHeroProps> = ({
  profile,
  className = "",
}) => {
  const shareText = `Check out recruitment circulars and latest vacancies from ${profile.name} (${profile.shortName}) on NEXTVACANCY: https://nextvacancy.com/organizations/${profile.slug}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <section aria-label={`${profile.name} Profile Header`} className={className}>
      <Card className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-sm relative overflow-hidden space-y-6">
        {/* Top subtle brand accent border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--primary)] via-[#1E3A8A] to-amber-500" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
          {/* Left Avatar & Identity */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Logo Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-100 border-2 border-slate-200/80 flex items-center justify-center text-[var(--primary)] shrink-0 shadow-2xs">
              <Building2 className="h-10 w-10 text-[var(--primary)]" aria-hidden="true" />
            </div>

            {/* Name, Acronym & Verified Status */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[var(--primary)] font-mono font-black text-xs border border-blue-200">
                  {profile.shortName}
                </span>

                {profile.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    <span>Verified Authority</span>
                  </span>
                )}

                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                  {profile.categoryType}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {profile.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
                {profile.tagline}
              </p>
            </div>
          </div>

          {/* Right CTAs: Official Portal & WhatsApp Share */}
          <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-colors cursor-pointer"
            >
              <Share2 className="h-4 w-4 text-green-600" />
              <span>Share Alerts</span>
            </Link>

            <Link
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#0F2744] hover:bg-[#183B66] text-white shadow-sm transition-all cursor-pointer"
            >
              <Globe className="h-4 w-4" />
              <span>Official Website</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </Link>
          </div>
        </div>

        {/* Quick Meta Stats Pill Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-slate-100 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Headquarters</span>
              <span className="font-bold text-slate-800 truncate block">{profile.headquarters}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Established</span>
              <span className="font-bold text-slate-800 font-mono block">Year {profile.establishedYear}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Layers className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Jurisdiction</span>
              <span className="font-bold text-slate-800 block">{profile.state}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Award className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Recruitment Body</span>
              <span className="font-bold text-slate-800 block">{profile.categoryType}</span>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};

OrganizationHero.displayName = "OrganizationHero";
