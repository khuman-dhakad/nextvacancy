"use client";

import React, { useState } from "react";
import {
  Briefcase,
  MapPin,
  Award,
  GraduationCap,
  IndianRupee,
  Layers,
} from "lucide-react";
import { Card, Input } from "@/components/ui";
import { UserJobPreferences } from "@/services/settings/settings.service";

export interface JobPreferencesProps {
  initialPreferences: UserJobPreferences;
  className?: string;
}

export const JobPreferences: React.FC<JobPreferencesProps> = ({
  initialPreferences,
  className = "",
}) => {
  const [prefs, setPrefs] = useState<UserJobPreferences>(initialPreferences);

  const handleChange = (field: keyof UserJobPreferences, value: string) => {
    setPrefs((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section aria-label="Career and Job Alert Preferences" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Briefcase className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Career Filters
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Job &amp; Recruitment Preferences
            </h2>
          </div>
        </div>

        {/* 2-Column Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Preferred State */}
          <div className="space-y-1.5">
            <label htmlFor="preferredState" className="text-xs font-bold text-slate-700 block">
              Target State / Region
            </label>
            <Input
              id="preferredState"
              name="preferredState"
              type="text"
              value={prefs.preferredState}
              onChange={(e) => handleChange("preferredState", e.target.value)}
              placeholder="e.g. All India, Delhi NCR, UP"
              leftIcon={<MapPin className="h-4 w-4 text-slate-400" />}
              fullWidth
            />
          </div>

          {/* Preferred Category */}
          <div className="space-y-1.5">
            <label htmlFor="preferredCategory" className="text-xs font-bold text-slate-700 block">
              Primary Exam Category
            </label>
            <Input
              id="preferredCategory"
              name="preferredCategory"
              type="text"
              value={prefs.preferredCategory}
              onChange={(e) => handleChange("preferredCategory", e.target.value)}
              placeholder="e.g. SSC CGL, UPSC, Railways, Banking"
              leftIcon={<Award className="h-4 w-4 text-slate-400" />}
              fullWidth
            />
          </div>

          {/* Qualification */}
          <div className="space-y-1.5">
            <label htmlFor="qualification" className="text-xs font-bold text-slate-700 block">
              Highest Educational Qualification
            </label>
            <Input
              id="qualification"
              name="qualification"
              type="text"
              value={prefs.qualification}
              onChange={(e) => handleChange("qualification", e.target.value)}
              placeholder="e.g. Graduate, Post Graduate, B.Tech, 12th Pass"
              leftIcon={<GraduationCap className="h-4 w-4 text-slate-400" />}
              fullWidth
            />
          </div>

          {/* Experience Level */}
          <div className="space-y-1.5">
            <label htmlFor="experienceLevel" className="text-xs font-bold text-slate-700 block">
              Experience Level
            </label>
            <Input
              id="experienceLevel"
              name="experienceLevel"
              type="text"
              value={prefs.experienceLevel}
              onChange={(e) => handleChange("experienceLevel", e.target.value)}
              placeholder="e.g. Fresher (0-2 Yrs), Mid-Level"
              leftIcon={<Layers className="h-4 w-4 text-slate-400" />}
              fullWidth
            />
          </div>

          {/* Salary Expectation */}
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="salaryExpectation" className="text-xs font-bold text-slate-700 block">
              Target Pay Matrix / Salary Range
            </label>
            <Input
              id="salaryExpectation"
              name="salaryExpectation"
              type="text"
              value={prefs.salaryExpectation}
              onChange={(e) => handleChange("salaryExpectation", e.target.value)}
              placeholder="e.g. ₹50,000 - ₹1,00,000 / month (Pay Level 6-8)"
              leftIcon={<IndianRupee className="h-4 w-4 text-slate-400" />}
              fullWidth
            />
          </div>
        </div>
      </Card>
    </section>
  );
};

JobPreferences.displayName = "JobPreferences";
