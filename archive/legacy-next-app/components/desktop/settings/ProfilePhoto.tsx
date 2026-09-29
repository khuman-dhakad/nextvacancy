import React from "react";
import {
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { Card, Button } from "@/components/ui";

export interface ProfilePhotoProps {
  fullName: string;
  avatarUrl?: string;
  className?: string;
}

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  fullName,
  className = "",
}) => {
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <section aria-label="Profile Photograph Management" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Camera className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Avatar &amp; Identity
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Profile Photo
            </h2>
          </div>
        </div>

        {/* Photo Upload & Guidelines Area */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar Preview */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#0F2744] to-[#183B66] text-white flex items-center justify-center font-black text-2xl shadow-sm border-2 border-slate-200 shrink-0">
            {initials || <ImageIcon className="h-10 w-10 text-slate-400" />}
          </div>

          {/* Action Buttons & Specs */}
          <div className="space-y-3 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="font-bold text-xs shadow-xs"
                leftIcon={<Upload className="h-3.5 w-3.5" />}
              >
                Upload New Photo
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-rose-600 hover:bg-rose-50 font-bold text-xs"
                leftIcon={<Trash2 className="h-3.5 w-3.5" />}
              >
                Remove Photo
              </Button>
            </div>

            {/* Specifications Guideline */}
            <div className="text-xs text-slate-500 font-medium space-y-1">
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>Recommended format: JPEG or PNG with 1:1 square aspect ratio.</span>
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>Maximum file size: 2 MB. Clear face with plain white/light background.</span>
              </p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};

ProfilePhoto.displayName = "ProfilePhoto";
