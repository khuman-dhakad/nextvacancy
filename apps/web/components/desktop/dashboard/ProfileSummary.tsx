import React from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  Calendar,
  CheckCircle2,
  Edit3,
} from "lucide-react";
import { Card, Button } from "@/components/ui";
import { UserDashboardProfile } from "@/services/dashboard/dashboard.service";


export interface ProfileSummaryProps {
  profile: UserDashboardProfile;
  className?: string;
}

export const ProfileSummary: React.FC<ProfileSummaryProps> = ({
  profile,
  className = "",
}) => {
  return (
    <section aria-label="Profile Summary & Preferences" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <User className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Candidate Profile
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Personal Information &amp; Preferences
            </h2>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="font-bold text-xs shadow-xs"
            leftIcon={<Edit3 className="h-3.5 w-3.5" />}
          >
            Edit Profile
          </Button>
        </div>

        {/* 6-Field Detail Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Full Name */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              <span>Full Name</span>
            </span>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              {profile.fullName}
            </p>
          </div>

          {/* Email Address */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              <span>Registered Email</span>
            </span>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-slate-900 leading-snug truncate">
                {profile.email}
              </p>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
            </div>
          </div>

          {/* Mobile Number */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              <span>WhatsApp / Mobile</span>
            </span>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              {profile.mobile}
            </p>
          </div>

          {/* Preferred State */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              <span>Target Region</span>
            </span>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              {profile.preferredState}
            </p>
          </div>

          {/* Preferred Category */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              <span>Exam Category</span>
            </span>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              {profile.preferredCategory}
            </p>
          </div>

          {/* Qualification */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              <span>Highest Qualification</span>
            </span>
            <p className="text-sm font-bold text-slate-900 leading-snug truncate">
              {profile.qualification}
            </p>
          </div>
        </div>

        {/* Member Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span>Member since {profile.memberSince}</span>
          </span>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            Account Status: Active
          </span>
        </div>
      </Card>
    </section>
  );
};

ProfileSummary.displayName = "ProfileSummary";
