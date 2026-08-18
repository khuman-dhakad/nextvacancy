"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  User,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  KeyRound,
} from "lucide-react";
import { Card, Input, Button } from "@/components/ui";

import { loginAdminAction } from "@/app/admin/actions";
import { ADMIN_CONFIG } from "@/lib/auth/admin-config";


export interface AdminLoginFormProps {
  className?: string;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ className = "" }) => {
  const router = useRouter();
  const [username, setUsername] = useState("admin@nextvacancy.com");
  const [password, setPassword] = useState("NextVacancy@Admin2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const result = await loginAdminAction(formData);
    setIsLoading(false);

    if (result.success) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      setErrorMessage(result.error || "Authentication failed. Please verify your credentials.");
    }
  };

  const handleFillDemo = () => {
    setUsername(ADMIN_CONFIG.email);
    setPassword(ADMIN_CONFIG.passwordPlain);
    setErrorMessage(null);
  };

  return (
    <div className={["w-full max-w-md mx-auto space-y-6", className].filter(Boolean).join(" ")}>
      {/* Brand Icon & Heading */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-[#0F2744] text-amber-400 flex items-center justify-center font-black text-2xl mx-auto shadow-md border border-slate-700">
          N
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Admin Portal Login
        </h1>
        <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
          Single Administrator Access for NEXTVACANCY Recruitment CMS &amp; Content Governance.
        </p>
      </div>

      {/* Main Login Card */}
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 text-rose-900 border border-rose-200 text-xs font-bold flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-snug">{errorMessage}</div>
          </div>
        )}

        {/* Demo Credentials Auto-Fill Box */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-950 flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-amber-700" />
              <span>Admin Credentials</span>
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-bold text-amber-900 hover:text-amber-700 underline cursor-pointer"
            >
              Auto-Fill
            </button>
          </div>
          <div className="text-slate-700 font-mono text-[11px] space-y-0.5">
            <div>Username: <strong className="text-slate-950">admin@nextvacancy.com</strong></div>
            <div>Password: <strong className="text-slate-950">NextVacancy@Admin2026!</strong></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-xs font-bold text-slate-700 block">
              Administrator Username / Email
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@nextvacancy.com"
              leftIcon={<User className="h-4 w-4 text-slate-400" />}
              fullWidth
              autoComplete="username"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-bold text-slate-700 block">
              Admin Password
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
                fullWidth
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus-visible:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              disabled={isLoading}
              className="bg-[#0F2744] hover:bg-[#183B66] text-white font-bold text-xs shadow-xs"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {isLoading ? "Verifying Credentials..." : "Authenticate as Admin"}
            </Button>
          </div>
        </form>

        {/* Security Seal */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Restricted Area • Unauthorized Access Prohibited</span>
        </div>
      </Card>

      {/* Return to Public Portal */}
      <div className="text-center">
        <Link
          href="/"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          ← Back to Public Job Portal
        </Link>
      </div>
    </div>
  );
};

AdminLoginForm.displayName = "AdminLoginForm";
