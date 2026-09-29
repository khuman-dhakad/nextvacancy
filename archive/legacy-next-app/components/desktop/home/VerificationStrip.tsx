import React from "react";
import { ShieldCheck, FileDown, Lock, UserCheck } from "lucide-react";
import { Container } from "@/components/ui";

const VERIFICATION_ITEMS = [
  {
    id: "gazette",
    icon: ShieldCheck,
    title: "Listing details",
    description: "Review information provided per record",
  },
  {
    id: "pdf",
    icon: FileDown,
    title: "Recruiting links",
    description: "Confirm notices with the source",
  },
  {
    id: "free",
    icon: Lock,
    title: "Saved jobs",
    description: "Available to signed-in candidates",
  },
  {
    id: "privacy",
    icon: UserCheck,
    title: "Account access",
    description: "Candidate features require sign-in",
  },
];

export interface VerificationStripProps {
  className?: string;
}

export const VerificationStrip: React.FC<VerificationStripProps> = ({
  className = "",
}) => {
  return (
    <section
      aria-label="Platform Verification Standards"
      className={["py-4 bg-[#F8FAFC]", className].filter(Boolean).join(" ")}
    >
      <Container size="lg">
        <div className="bg-[#EDF5FD] border border-blue-100/90 rounded-[20px] px-6 py-5 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-center">
            {VERIFICATION_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.id} className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white text-[var(--secondary)] flex items-center justify-center shrink-0 shadow-2xs border border-blue-100">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium leading-tight">
                      {item.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};

VerificationStrip.displayName = "VerificationStrip";
