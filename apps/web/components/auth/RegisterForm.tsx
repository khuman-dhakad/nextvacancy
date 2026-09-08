"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RegisterFormData, AuthFormErrors } from "@/types";
import { validateRegisterForm } from "@/lib/validations/auth";
import { registerCandidateAction } from "@/app/auth/actions";
import { Input, Button } from "@/components/ui";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export interface RegisterFormProps {
  onSuccess?: () => void;
  className?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  className = "",
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

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

    const validationErrors = validateRegisterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerCandidateAction({
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      });
      if (!result.success) {
        setServerError(result.error || "Registration failed. Please try again.");
        return;
      }

      setIsSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch {
      setServerError("An account with this email address already exists. Please sign in instead.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-6 space-y-4 animate-in fade-in duration-300">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
          <CheckCircle2 className="h-10 w-10" aria-hidden="true" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-slate-900">Registration Successful!</h2>
          <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
            Your NEXTVACANCY account has been created. A verification link has been sent to{" "}
            <strong>{formData.email}</strong>.
          </p>
        </div>
        <div className="pt-3">
          <Link href="/login">
            <Button
              variant="accent"
              size="md"
              fullWidth
              className="font-bold shadow-md min-h-[44px]"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Continue to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={["space-y-4", className].filter(Boolean).join(" ")}>
      {/* Server Error Alert */}
      {serverError && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" aria-hidden="true" />
          <span className="leading-relaxed font-medium">{serverError}</span>
        </div>
      )}

      {/* Full Name */}
      <Input
        id="register-name"
        name="fullName"
        type="text"
        autoComplete="name"
        label="Full Name (as per Govt ID)"
        placeholder="e.g. Rahul Sharma"
        value={formData.fullName}
        onChange={handleChange}
        error={errors.fullName}
        leftIcon={<User className="h-4 w-4" aria-hidden="true" />}
        required
      />

      {/* Email Address */}
      <Input
        id="register-email"
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

      {/* Mobile Number */}
      <Input
        id="register-mobile"
        name="mobile"
        type="tel"
        autoComplete="tel"
        label="Indian Mobile Number"
        placeholder="9876543210"
        value={formData.mobile}
        onChange={handleChange}
        error={errors.mobile}
        leftIcon={<Phone className="h-4 w-4" aria-hidden="true" />}
        helperText="Used for critical exam admit card & result SMS alerts"
        required
      />

      {/* Password with Strength Meter */}
      <div className="space-y-1.5">
        <Input
          id="register-password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          label="Create Password"
          placeholder="Min. 8 characters"
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
        <PasswordStrengthMeter password={formData.password} />
      </div>

      {/* Confirm Password */}
      <Input
        id="register-confirm-password"
        name="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        autoComplete="new-password"
        label="Confirm Password"
        placeholder="Re-enter your password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        leftIcon={<Lock className="h-4 w-4" aria-hidden="true" />}
        rightElement={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            className="p-1 text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-md cursor-pointer"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        }
        required
      />

      {/* Terms & Conditions Checkbox */}
      <div className="space-y-1 pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-700 leading-snug">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[var(--primary)] focus:ring-[var(--primary)] shrink-0"
          />
          <span>
            I agree to the{" "}
            <Link
              href="/terms"
              className="text-[var(--primary)] font-bold hover:underline"
              target="_blank"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-[var(--primary)] font-bold hover:underline"
              target="_blank"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="text-xs font-medium text-[var(--danger)]" role="alert">
            {errors.acceptTerms}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
        className="font-bold shadow-md min-h-[46px] mt-2"
        leftIcon={!isLoading ? <UserPlus className="h-4 w-4" /> : undefined}
      >
        Create Free Account
      </Button>
    </form>
  );
};

RegisterForm.displayName = "RegisterForm";
