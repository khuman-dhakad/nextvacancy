import React from "react";
import { evaluatePasswordStrength } from "@/lib/validations/auth";
import { Check, X } from "lucide-react";

export interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  className = "",
}) => {
  if (!password) return null;

  const strength = evaluatePasswordStrength(password);

  const getBarColor = (score: number) => {
    switch (score) {
      case 1:
        return "bg-rose-500";
      case 2:
        return "bg-amber-500";
      case 3:
        return "bg-blue-500";
      case 4:
        return "bg-emerald-500";
      default:
        return "bg-slate-200";
    }
  };

  const getLabelColor = (score: number) => {
    switch (score) {
      case 1:
        return "text-rose-600";
      case 2:
        return "text-amber-600";
      case 3:
        return "text-blue-600";
      case 4:
        return "text-emerald-600";
      default:
        return "text-slate-400";
    }
  };

  return (
    <div
      className={["space-y-2.5 pt-1", className].filter(Boolean).join(" ")}
      role="progressbar"
      aria-label="Password strength score"
      aria-valuenow={strength.score}
      aria-valuemin={0}
      aria-valuemax={4}
      aria-valuetext={strength.label}
    >
      {/* Visual Strength Bars */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-slate-600">
          Password Strength:{" "}
          <strong className={getLabelColor(strength.score)}>
            {strength.label}
          </strong>
        </span>
        <div className="flex items-center gap-1.5 w-28">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={[
                "h-1.5 flex-1 rounded-full transition-all duration-300",
                step <= strength.score ? getBarColor(strength.score) : "bg-slate-200",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      {/* Rules Checklist */}
      <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-500">
        <div className="flex items-center gap-1">
          {strength.checks.minLength ? (
            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
          ) : (
            <X className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          )}
          <span className={strength.checks.minLength ? "text-slate-900 font-medium" : ""}>
            8+ characters
          </span>
        </div>

        <div className="flex items-center gap-1">
          {strength.checks.hasUppercase && strength.checks.hasLowercase ? (
            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
          ) : (
            <X className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          )}
          <span className={strength.checks.hasUppercase && strength.checks.hasLowercase ? "text-slate-900 font-medium" : ""}>
            Upper & lower case
          </span>
        </div>

        <div className="flex items-center gap-1">
          {strength.checks.hasNumber ? (
            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
          ) : (
            <X className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          )}
          <span className={strength.checks.hasNumber ? "text-slate-900 font-medium" : ""}>
            At least 1 number
          </span>
        </div>

        <div className="flex items-center gap-1">
          {strength.checks.hasSpecialChar ? (
            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
          ) : (
            <X className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          )}
          <span className={strength.checks.hasSpecialChar ? "text-slate-900 font-medium" : ""}>
            Special character (@#$)
          </span>
        </div>
      </div>
    </div>
  );
};

PasswordStrengthMeter.displayName = "PasswordStrengthMeter";
