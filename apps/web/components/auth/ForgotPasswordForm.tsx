"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ForgotPasswordFormData, AuthFormErrors } from "@/types";
import { validateForgotPasswordForm } from "@/lib/validations/auth";
import { requestPasswordResetAction } from "@/app/auth/password-reset-actions";
import { Input, Button } from "@/components/ui";
import { Mail, Send, ArrowLeft, AlertCircle } from "lucide-react";
import { requestPasswordResetAction } from "@/app/auth/password-reset-actions";

export interface ForgotPasswordFormProps {
  className?: string;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  className = "",
}) => {

  // Forgot password state
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });

  // Reset password state (when token exists)
  const [resetData, setResetData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const isResetMode = Boolean(token);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isResetMode) {
      setResetData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

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

    if (isResetMode) {
      const validationErrors: AuthFormErrors = {};
      const pwdErr = validatePassword(resetData.password);
      if (pwdErr) validationErrors.password = pwdErr;

      const confirmErr = validateConfirmPassword(resetData.password, resetData.confirmPassword);
      if (confirmErr) validationErrors.confirmPassword = confirmErr;

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);

    try {
      const result = await requestPasswordResetAction(formData.email);
      if (!result.success) {
        setServerError(result.error || "Unable to send reset instructions right now.");
        return;
      }
      setIsSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
    } finally {
      setIsLoading(false);
    }
  };

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

      {isResetMode ? (
        <>
          <p className="text-xs text-slate-600 leading-relaxed">
            Please create a new strong password for your NEXTVACANCY account.
          </p>

          {/* New Password */}
          <div className="space-y-1.5">
            <Input
              id="reset-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              label="New Password"
              placeholder="Min. 8 characters"
              value={resetData.password}
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
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              required
            />
            <PasswordStrengthMeter password={resetData.password} />
          </div>

          {/* Confirm Password */}
          <Input
            id="reset-confirm-password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            label="Confirm New Password"
            placeholder="Re-enter your new password"
            value={resetData.confirmPassword}
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
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            required
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="font-bold shadow-md min-h-[46px] mt-2"
            leftIcon={!isLoading ? <KeyRound className="h-4 w-4" /> : undefined}
          >
            Update Password
          </Button>
        </>
      ) : (
        <>
          <p className="text-xs text-slate-600 leading-relaxed">
            Enter the email address associated with your NEXTVACANCY account and we will send you a secure link to reset your password.
          </p>

          {/* Email Input */}
          <Input
            id="forgot-email"
            name="email"
            type="email"
            autoComplete="email"
            label="Account Email Address"
            placeholder="candidate@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            leftIcon={<Mail className="h-4 w-4" aria-hidden="true" />}
            required
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="font-bold shadow-md min-h-[46px] mt-2"
            leftIcon={!isLoading ? <Send className="h-4 w-4" /> : undefined}
          >
            Send Reset Link
          </Button>
        </>
      )}

      {/* Back to Login Link */}
      <div className="pt-2 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded px-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </form>
  );
};

ForgotPasswordForm.displayName = "ForgotPasswordForm";
