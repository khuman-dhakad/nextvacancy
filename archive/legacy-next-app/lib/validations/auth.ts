import { z } from "zod";
import {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  PasswordStrength,
  AuthFormErrors,
} from "@/types";

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

// Zod Schemas for server actions and robust backend validation
export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Please enter a valid email address (e.g. name@example.com)"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});

export const RegisterSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name is too long")
      .regex(/^[a-zA-Z\s.'-]+$/, "Name can only contain alphabetic characters"),
    email: z
      .string()
      .trim()
      .min(1, "Email address is required")
      .email("Please enter a valid email address (e.g. name@example.com)"),
    mobile: z
      .string()
      .trim()
      .refine(
        (val) => !val || INDIAN_MOBILE_REGEX.test(val.replace(/\D/g, "")),
        "Enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9)"
      )
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(128, "Password is too long")
      .refine((p) => {
        const strength = evaluatePasswordStrength(p);
        return strength.score >= 3;
      }, "Password must include uppercase, lowercase, numbers, and special characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms of Service & Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Please enter a valid email address (e.g. name@example.com)"),
});

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(128, "Password is too long")
      .refine((p) => {
        const strength = evaluatePasswordStrength(p);
        return strength.score >= 3;
      }, "Password must include uppercase, lowercase, numbers, and special characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Legacy and Client Helper functions
export function validateEmail(email: string): string | undefined {
  if (!email || !email.trim()) {
    return "Email address is required";
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return "Please enter a valid email address (e.g. name@example.com)";
  }
  return undefined;
}

export function validateMobile(mobile: string): string | undefined {
  if (!mobile || !mobile.trim()) {
    return undefined; // Mobile is optional or empty
  }
  const cleanNumber = mobile.replace(/\D/g, "");
  if (!INDIAN_MOBILE_REGEX.test(cleanNumber)) {
    return "Enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9)";
  }
  return undefined;
}

export function validateFullName(name: string): string | undefined {
  if (!name || !name.trim()) {
    return "Full name is required";
  }
  if (name.trim().length < 2) {
    return "Full name must be at least 2 characters";
  }
  if (!/^[a-zA-Z\s.'-]+$/.test(name.trim())) {
    return "Name can only contain alphabetic characters";
  }
  return undefined;
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      label: "Very Weak",
      checks: {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
      },
    };
  }

  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  };

  let count = 0;
  if (checks.minLength) count += 1;
  if (checks.hasUppercase && checks.hasLowercase) count += 1;
  if (checks.hasNumber) count += 1;
  if (checks.hasSpecialChar) count += 1;

  let label: PasswordStrength["label"] = "Very Weak";
  if (count === 1) label = "Weak";
  else if (count === 2) label = "Fair";
  else if (count === 3) label = "Good";
  else if (count === 4) label = "Strong";

  return {
    score: count,
    label,
    checks,
  };
}

export function validatePassword(password: string): string | undefined {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  const strength = evaluatePasswordStrength(password);
  if (strength.score < 3) {
    return "Password must include uppercase, lowercase, numbers, and special characters";
  }
  return undefined;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string | undefined {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return undefined;
}

export function validateLoginForm(data: LoginFormData): AuthFormErrors {
  const errors: AuthFormErrors = {};

  const emailErr = validateEmail(data.email);
  if (emailErr) errors.email = emailErr;

  if (!data.password) {
    errors.password = "Password is required";
  }

  return errors;
}

export function validateRegisterForm(data: RegisterFormData): AuthFormErrors {
  const errors: AuthFormErrors = {};

  const nameErr = validateFullName(data.fullName);
  if (nameErr) errors.fullName = nameErr;

  const emailErr = validateEmail(data.email);
  if (emailErr) errors.email = emailErr;

  if (data.mobile && data.mobile.trim()) {
    const mobileErr = validateMobile(data.mobile);
    if (mobileErr) errors.mobile = mobileErr;
  }

  const passwordErr = validatePassword(data.password);
  if (passwordErr) errors.password = passwordErr;

  const confirmErr = validateConfirmPassword(
    data.password,
    data.confirmPassword
  );
  if (confirmErr) errors.confirmPassword = confirmErr;

  if (!data.acceptTerms) {
    errors.acceptTerms = "You must agree to the Terms of Service & Privacy Policy";
  }

  return errors;
}

export function validateForgotPasswordForm(
  data: ForgotPasswordFormData
): AuthFormErrors {
  const errors: AuthFormErrors = {};

  const emailErr = validateEmail(data.email);
  if (emailErr) errors.email = emailErr;

  return errors;
}
