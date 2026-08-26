"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ForgotPasswordFormData, AuthFormErrors } from "@/types";
import { validateForgotPasswordForm, validatePassword, validateConfirmPassword } from "@/lib/validations/auth";
import { forgotPasswordAction, resetPasswordAction } from "@/app/forgot-password/actions";
import { Input, Button } from "@/components/ui";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import { Mail, Lock, Eye, EyeOff, Send, CheckCircle2, ArrowLeft, AlertCircle, KeyRound } from "lucide-react";

export interface ForgotPasswordFormProps {
  token?: string;
  onSuccess?: () => void;
  className?: string;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  token,
  onSuccess,
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
  const [isSuccess, setIsSuccess] = useState(false);

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
        const result = await resetPasswordAction({
          token,
          password: resetData.password,
          confirmPassword: resetData.confirmPassword,
        });

        if (!result.success) {
          setServerError(result.error || "Password reset failed.");
          if (result.fieldErrors) {
            setErrors(result.fieldErrors);
          }
          return;
        }

        setIsSuccess(true);
        if (onSuccess) {
          onSuccess();
        }
      } catch {
        setServerError("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      const validationErrors = validateForgotPasswordForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);

      try {
        const result = await forgotPasswordAction(formData);

        if (!result.success) {
          setServerError(result.error || "Unable to send reset email.");
          if (result.fieldErrors) {
            setErrors(result.fieldErrors);
          }
          return;
        }

        setIsSuccess(true);
        if (onSuccess) {
          onSuccess();
        }
      } catch {
        setServerError("Unable to send reset email. Please verify your address and try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isSuccess) {
    if (isResetMode) {
      return (
        <div className="text-center py-6 space-y-4 animate-in fade-in duration-300">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
            <CheckCircle2 className="h-10 w-10" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-slate-900">Password Reset Successful!</h2>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              Your password has been updated. You can now sign in with your new credentials.
            </p>
          </div>
          <div className="pt-3">
            <Link href="/login">
              <Button variant="primary" size="md" fullWidth className="font-bold min-h-[44px]">
                Sign In Now
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-6 space-y-4 animate-in fade-in duration-300">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
          <CheckCircle2 className="h-10 w-10" aria-hidden="true" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-slate-900">Password Recovery Email Dispatched</h2>
          <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
            If an account exists for <strong>{formData.email}</strong>, a secure password reset link has been sent. Please check your inbox and spam folder.
          </p>
        </div>
        <div className="pt-3">
          <Link href="/login">
            <Button
              variant="outline"
              size="md"
              fullWidth
              className="font-bold min-h-[44px]"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Sign In
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
