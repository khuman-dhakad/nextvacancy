"use client";

import React, { useState } from "react";
import { X, Save, FolderTree, Sparkles } from "lucide-react";
import { Card, Input, Button } from "@/components/ui";
import { CategoryMaster } from "@/types";
import { generateUniqueSlug } from "@/lib/slug";

export interface AdminCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<CategoryMaster>) => Promise<void>;
  initialData?: CategoryMaster | null;
  isSaving?: boolean;
}

interface CategoryFormInnerProps {
  initialData?: CategoryMaster | null;
  onClose: () => void;
  onSave: (data: Partial<CategoryMaster>) => Promise<void>;
  isSaving: boolean;
}

const CategoryFormInner: React.FC<CategoryFormInnerProps> = ({
  initialData,
  onClose,
  onSave,
  isSaving,
}) => {
  const isEditing = Boolean(initialData);

  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [icon, setIcon] = useState(initialData?.icon || "Briefcase");
  const [isActive, setIsActive] = useState(initialData?.isActive !== undefined ? initialData.isActive : true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(generateUniqueSlug(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Please enter a category title.");
      return;
    }

    const payload: Partial<CategoryMaster> = {
      name: name.trim(),
      slug: slug.trim() || generateUniqueSlug(name),
      description: description.trim(),
      icon: icon.trim() || "Briefcase",
      isActive,
      isFeatured,
    };

    try {
      await onSave(payload);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save category.");
    }
  };

  return (
    <Card className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[var(--primary)] flex items-center justify-center border border-blue-200">
            <FolderTree className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="category-modal-title" className="text-base font-black text-slate-900 leading-snug">
              {isEditing ? "Edit Category Master" : "Create Master Category"}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Normalized taxonomy for recruitment circulars
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
        <div className="space-y-1.5">
          <label htmlFor="cat-name" className="font-bold text-slate-800 block">
            Category Name *
          </label>
          <Input
            id="cat-name"
            type="text"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Railway (RRB & RRC)"
            fullWidth
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="cat-slug" className="font-bold text-slate-800 block">
            URL Slug (SEO-optimized) *
          </label>
          <Input
            id="cat-slug"
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. railway"
            fullWidth
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="cat-icon" className="font-bold text-slate-800 block">
            Icon Key / Name
          </label>
          <Input
            id="cat-icon"
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="e.g. Briefcase, Building2, Train, Award"
            fullWidth
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="cat-desc" className="font-bold text-slate-800 block">
            Description &amp; Editorial Scope
          </label>
          <textarea
            id="cat-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of which notifications fall under this category..."
            className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        {/* Toggles */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <span className="font-bold text-slate-900">Active in Portal Navigation &amp; Search</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
            />
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span className="font-bold text-slate-900">Feature on Homepage Hub</span>
            </div>
          </label>
        </div>

        {/* Footer Actions */}
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
            {isSaving ? "Saving..." : isEditing ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export const AdminCategoryModal: React.FC<AdminCategoryModalProps> = ({
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
      aria-labelledby="category-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
    >
      <CategoryFormInner
        key={initialData?.id || "new-cat"}
        initialData={initialData}
        onClose={onClose}
        onSave={onSave}
        isSaving={isSaving}
      />
    </div>
  );
};

AdminCategoryModal.displayName = "AdminCategoryModal";
