import React from "react";
import {
  FileCheck,
  Camera,
  PenTool,
  FileText,
  Award,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, Badge } from "@/components/ui";

export interface DocumentsChecklistProps {
  documents?: string[];
  className?: string;
}

const DEFAULT_DOCUMENTS = [
  {
    title: "Recent Passport Size Color Photograph",
    spec: "20 KB to 50 KB (JPEG/JPG) — White background, live capture or taken within 3 months, without spectacles or caps.",
    icon: Camera,
    mandatory: true,
  },
  {
    title: "Scanned Signature on White Paper",
    spec: "10 KB to 20 KB (JPEG/JPG) — Running hand signature in black/blue ink. Capital letters not accepted.",
    icon: PenTool,
    mandatory: true,
  },
  {
    title: "Class 10th (Matriculation) Certificate & Marksheet",
    spec: "PDF / JPG (100–300 KB) — Mandatory proof of candidate Date of Birth (DOB) and parentage.",
    icon: FileText,
    mandatory: true,
  },
  {
    title: "Essential Educational Qualification Degree / Diploma",
    spec: "PDF (100–500 KB) — All semester marksheets, provisional/original degree certificate from recognized University.",
    icon: Award,
    mandatory: true,
  },
  {
    title: "Valid Photo Identity Proof (Aadhaar / Voter ID / PAN)",
    spec: "Original to be produced at examination centre and uploaded during One Time Registration (OTR).",
    icon: CreditCard,
    mandatory: true,
  },
  {
    title: "Caste / EWS / PwBD Certificate (if claiming reservation)",
    spec: "Issued in prescribed Central Govt format by competent authority within valid crucial financial year.",
    icon: FileCheck,
    mandatory: false,
  },
];

export const DocumentsChecklist: React.FC<DocumentsChecklistProps> = ({
  documents = [],
  className = "",
}) => {
  return (
    <section aria-label="Required Documents Checklist" className={className}>
      <Card className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <FileCheck className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Application Readiness
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Documents Required for Online Application
            </h2>
          </div>

          <Badge variant="info" size="md" className="font-bold uppercase tracking-wider">
            Checklist Guide
          </Badge>
        </div>

        {/* 2-Column Document Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEFAULT_DOCUMENTS.map((doc, idx) => {
            const Icon = doc.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 hover:bg-slate-100/60 transition-colors flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-[var(--primary-subtle)] text-[var(--primary)] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {doc.title}
                    </h3>
                    <span
                      className={[
                        "text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0",
                        doc.mandatory
                          ? "bg-red-50 text-red-700 border border-red-200/60"
                          : "bg-slate-200 text-slate-700",
                      ].join(" ")}
                    >
                      {doc.mandatory ? "Mandatory" : "If Applicable"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    {doc.spec}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Document List if provided */}
        {documents.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 space-y-2">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
              <span>Special Enclosures &amp; Attestation Notes</span>
            </span>
            <ul className="space-y-1 text-xs text-amber-950 list-none p-0 m-0 font-medium">
              {documents.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </section>
  );
};

DocumentsChecklist.displayName = "DocumentsChecklist";
