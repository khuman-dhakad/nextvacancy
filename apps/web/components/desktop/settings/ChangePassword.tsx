"use client";

import React, { useState } from "react";
import {
  Lock,
  KeyRound,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, Input, Button } from "@/components/ui";


export interface ChangePasswordProps {
  lastChanged?: string;
  className?: string;
}

export const ChangePassword: React.FC<ChangePasswordProps> = ({
  lastChanged = "3 months ago",
  className = "",
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Simple password strength calculation
  const getStrength = (pass: string) => {
    if (!pass) return { label: "None", percent: 0, color: "bg-slate-200" };
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;

    if (score <= 25) return { label: "Weak", percent: 25, color: "bg-rose-500" };
    if (score <= 50) return { label: "Fair", percent: 50, color: "bg-amber-500" };
    if (score <= 75) return { label: "Good", percent: 75, color: "bg-blue-500" };
    return { label: "Strong", percent: 100, color: "bg-emerald-500" };
  };

  const strength = getStrength(newPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <section aria-label="Change Password Credentials" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <KeyRound className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Authentication
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Change Account Password
            </h2>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Last changed: <strong className="text-slate-700">{lastChanged}</strong>
          </span>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div className="space-y-1.5">
            <label htmlFor="currentPassword" className="text-xs font-bold text-slate-700 block">
              Current Password
            </label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
                fullWidth
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                aria-label={showCurrent ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus-visible:outline-none"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label htmlFor="newPassword" className="text-xs font-bold text-slate-700 block">
              New Password
            </label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters with letters & numbers"
                leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
                fullWidth
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                aria-label={showNew ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus-visible:outline-none"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Strength Meter Bar */}
            {newPassword && (
              <div className="pt-1.5 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-500">Password Strength:</span>
                  <span className="text-slate-900">{strength.label}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={["h-full transition-all duration-300", strength.color].join(" ")}
                    style={{ width: `${strength.percent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700 block">
              Confirm New Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your new password"
              leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
              fullWidth
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!newPassword || newPassword !== confirmPassword}
              className="bg-[#0F2744] hover:bg-[#183B66] text-white font-bold text-xs shadow-xs"
            >
              Update Password
            </Button>

            {isSaved && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Password Changed Successfully
              </span>
            )}
          </div>
        </form>
      </Card>
    </section>
  );
};

ChangePassword.displayName = "ChangePassword";
