"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ForgotPasswordFormData, AuthFormErrors } from "@/types";
import { validateForgotPasswordForm } from "@/lib/validations/auth";
import { Input, Button } from "@/components/ui";
import { Mail, Send, CheckCircle2, ArrowLeft, AlertCircle } from "lucide-react";

export interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  className?: string;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSuccess,
  className = "",
}) => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });

  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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

    const validationErrors = validateForgotPasswordForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call (ready for Spring Boot /api/v1/auth/forgot-password)
      await new Promise((resolve) => setTimeout(resolve, 800));

      setIsSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch {
      setServerError("Unable to send reset email. Please verify your address and try again.");
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
          <h2 className="text-lg font-bold text-slate-900">Password Reset Link Sent</h2>
          <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
            We have sent password recovery instructions to{" "}
            <strong>{formData.email}</strong>. Please check your inbox and spam folder.
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
