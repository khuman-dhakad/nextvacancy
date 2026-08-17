"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { Card, Input } from "@/components/ui";
import { UserProfileData } from "@/services/settings/settings.service";

export interface ProfileInformationProps {
  initialProfile: UserProfileData;
  className?: string;
}

export const ProfileInformation: React.FC<ProfileInformationProps> = ({
  initialProfile,
  className = "",
}) => {
  const [profile, setProfile] = useState<UserProfileData>(initialProfile);

  const handleChange = (field: keyof UserProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section aria-label="Personal Information Settings" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <User className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Personal Credentials
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Profile Information
            </h2>
          </div>
        </div>

        {/* 2-Column Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="text-xs font-bold text-slate-700 block">
              Full Legal Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={profile.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Enter your full name as per matriculation certificate"
              leftIcon={<User className="h-4 w-4 text-slate-400" />}
              fullWidth
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="email" className="text-xs font-bold text-slate-700 block">
                Registered Email Address
              </label>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Verified
              </span>
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="candidate@example.com"
              leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
              fullWidth
            />
          </div>

          {/* Mobile / Phone Number */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-xs font-bold text-slate-700 block">
              WhatsApp &amp; SMS Mobile Number
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={profile.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+91 98765 43210"
              leftIcon={<Phone className="h-4 w-4 text-slate-400" />}
              fullWidth
            />
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label htmlFor="city" className="text-xs font-bold text-slate-700 block">
              City / District
            </label>
            <Input
              id="city"
              name="city"
              type="text"
              value={profile.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="e.g. New Delhi, Patna, Jaipur"
              leftIcon={<MapPin className="h-4 w-4 text-slate-400" />}
              fullWidth
            />
          </div>

          {/* State */}
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="state" className="text-xs font-bold text-slate-700 block">
              State / Union Territory
            </label>
            <Input
              id="state"
              name="state"
              type="text"
              value={profile.state}
              onChange={(e) => handleChange("state", e.target.value)}
              placeholder="e.g. Delhi NCR, Uttar Pradesh, Rajasthan"
              leftIcon={<MapPin className="h-4 w-4 text-slate-400" />}
              fullWidth
            />
          </div>
        </div>
      </Card>
    </section>
  );
};

ProfileInformation.displayName = "ProfileInformation";
