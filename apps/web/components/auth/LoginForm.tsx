"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginFormData, AuthFormErrors } from "@/types";
import { validateLoginForm } from "@/lib/validations/auth";
import { loginCandidateAction } from "@/app/auth/actions";
import { Input, Button } from "@/components/ui";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export interface LoginFormProps {
  onSuccess?: () => void;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  className = "",
}) => {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field-level error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginCandidateAction({
        email: formData.email,
        password: formData.password,
      });
      if (!result.success) {
        setServerError(result.error || "Invalid email or password. Please try again.");
        return;
      }

      setIsSuccess(true);
      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    } catch {
      setServerError("Invalid email or password. Please verify your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-6 space-y-4 animate-in fade-in duration-300">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900">Signed In Successfully!</h2>
          <p className="text-xs text-slate-500">Redirecting to your recruitment dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={["space-y-4", className].filter(Boolean).join(" ")}>
      {/* Top Error Alert Banner */}
      {serverError && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" aria-hidden="true" />
          <span className="leading-relaxed font-medium">{serverError}</span>
        </div>
      )}

      {/* Email Input */}
      <Input
        id="login-email"
        name="email"
        type="email"
        autoComplete="email"
        label="Email Address"
        placeholder="candidate@example.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        leftIcon={<Mail className="h-4 w-4" aria-hidden="true" />}
        required
      />

      {/* Password Input */}
      <Input
        id="login-password"
        name="password"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        label="Password"
        placeholder="Enter your account password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        leftIcon={<Lock className="h-4 w-4" aria-hidden="true" />}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="p-1 text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-md cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        }
        required
      />

      {/* Remember Me & Forgot Password Row */}
      <div className="flex items-center justify-between text-xs pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium min-h-[36px]">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300 text-[var(--primary)] focus:ring-[var(--primary)]"
          />
          <span>Remember me</span>
        </label>

        <Link
          href="/forgot-password"
          className="font-bold text-[var(--primary)] hover:text-[var(--primary-hover)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded px-1"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
        className="font-bold shadow-md min-h-[46px]"
        leftIcon={!isLoading ? <LogIn className="h-4 w-4" /> : undefined}
      >
        Sign In to Account
      </Button>

      {/* Or Divider */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-slate-400 font-medium">or</span>
        </div>
      </div>

      {/* Continue as Guest Button */}
      <Link href="/search" className="block w-full">
        <Button
          type="button"
          variant="outline"
          size="md"
          fullWidth
          className="text-xs font-bold min-h-[44px]"
          rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
        >
          Continue as Guest Explorer
        </Button>
      </Link>
    </form>
  );
};

LoginForm.displayName = "LoginForm";
