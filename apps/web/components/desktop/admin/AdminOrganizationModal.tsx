"use client";

import React, { useState } from "react";
import { X, Save, Building2, Globe } from "lucide-react";
import { Card, Input, Button } from "@/components/ui";
import { OrganizationMaster } from "@/types";
import { generateUniqueSlug } from "@/lib/slug";

export interface AdminOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<OrganizationMaster>) => Promise<void>;
  initialData?: OrganizationMaster | null;
  isSaving?: boolean;
}

const CATEGORY_TYPES = [
  "Central Commission",
  "Banking",
  "Railways",
  "Defence",
  "State PSC",
  "PSU / Research",
  "Education / Testing",
  "Judiciary",
  "Police / Paramilitary",
];

const STATES_LIST = [
  "Central / New Delhi",
  "All India",
  "Andhra Pradesh",
  "Bihar",
  "Delhi",
  "Gujarat",
  "Haryana",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
];

interface OrgFormInnerProps {
  initialData?: OrganizationMaster | null;
  onClose: () => void;
  onSave: (data: Partial<OrganizationMaster>) => Promise<void>;
  isSaving: boolean;
}

const OrganizationFormInner: React.FC<OrgFormInnerProps> = ({
  initialData,
  onClose,
  onSave,
  isSaving,
}) => {
  const isEditing = Boolean(initialData);

  const [name, setName] = useState(initialData?.name || "");
  const [shortName, setShortName] = useState(initialData?.shortName || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [website, setWebsite] = useState(initialData?.website || "https://");
  const [description, setDescription] = useState(initialData?.description || "");
  const [state, setState] = useState(initialData?.state || "Central / New Delhi");
  const [categoryType, setCategoryType] = useState(initialData?.categoryType || "Central Commission");
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || "");
  const [isActive, setIsActive] = useState(initialData?.isActive !== undefined ? initialData.isActive : true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(generateUniqueSlug(val));
      if (!shortName) {
        const words = val.trim().split(" ");
        if (words.length > 1) {
          setShortName(words.map((w) => w[0]?.toUpperCase()).join(""));
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Please enter an organization title.");
      return;
    }

    const payload: Partial<OrganizationMaster> = {
      name: name.trim(),
      shortName: shortName.trim() || name.slice(0, 5).toUpperCase(),
      slug: slug.trim() || generateUniqueSlug(name),
      website: website.trim() || "https://gov.in",
      description: description.trim(),
      state: state.trim(),
      categoryType: categoryType.trim(),
      logoUrl: logoUrl.trim() || undefined,
      isActive,
    };

    try {
      await onSave(payload);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save organization.");
    }
  };

  return (
    <Card className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="org-modal-title" className="text-base font-black text-slate-900 leading-snug">
              {isEditing ? "Edit Recruiting Organization" : "Create Master Organization"}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Normalized authority database for recruitment postings
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 text-rose-900 border border-rose-200 text-xs font-bold">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium text-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label htmlFor="org-name" className="font-bold text-slate-800 block">
              Organization Full Name *
            </label>
            <Input
              id="org-name"
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Staff Selection Commission"
              fullWidth
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="org-short" className="font-bold text-slate-800 block">
              Acronym / Short *
            </label>
            <Input
              id="org-short"
              type="text"
              required
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              placeholder="e.g. SSC"
              fullWidth
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="org-slug" className="font-bold text-slate-800 block">
              URL Slug *
            </label>
            <Input
              id="org-slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. staff-selection-commission"
              fullWidth
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="org-type" className="font-bold text-slate-800 block">
              Category Type
            </label>
            <select
              id="org-type"
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-[var(--primary)]"
            >
              {CATEGORY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="org-state" className="font-bold text-slate-800 block">
              State / Jurisdiction
            </label>
            <select
              id="org-state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-[var(--primary)]"
            >
              {STATES_LIST.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="org-web" className="font-bold text-slate-800 block">
              Official Website URL
            </label>
            <Input
              id="org-web"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://ssc.gov.in"
              leftIcon={<Globe className="h-4 w-4 text-slate-400" />}
              fullWidth
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="org-logo" className="font-bold text-slate-800 block">
            Logo Image URL (or upload UI)
          </label>
          <Input
            id="org-logo"
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://example.com/logo.png"
            fullWidth
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="org-desc" className="font-bold text-slate-800 block">
            Organization Scope &amp; Charter
          </label>
          <textarea
            id="org-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Official charter, ministry association, and recruitment mandates..."
            className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        {/* Active Toggle */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <span className="font-bold text-slate-900">Active Organization in Public Filters</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSaving}
            className="font-bold text-xs"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSaving}
            className="bg-[#0F2744] hover:bg-[#183B66] text-white font-bold text-xs shadow-xs"
            leftIcon={<Save className="h-3.5 w-3.5" />}
          >
            {isSaving ? "Saving..." : isEditing ? "Update Organization" : "Create Organization"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export const AdminOrganizationModal: React.FC<AdminOrganizationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSaving = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="org-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
    >
      <OrganizationFormInner
        key={initialData?.id || "new-org"}
        initialData={initialData}
        onClose={onClose}
        onSave={onSave}
        isSaving={isSaving}
      />
    </div>
  );
};

AdminOrganizationModal.displayName = "AdminOrganizationModal";
