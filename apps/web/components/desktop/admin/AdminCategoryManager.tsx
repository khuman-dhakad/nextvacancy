"use client";

import React, { useState, useMemo } from "react";
import {
  PlusCircle,
  Search,
  FolderTree,
  Edit3,
  Trash2,
  CheckCircle2,
  CheckSquare,
  Square,
  RotateCcw,
  Star,
  Layers,
} from "lucide-react";
import { Card, Input, Button, Badge } from "@/components/ui";

import { CategoryMaster } from "@/types";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  toggleCategoryActiveAction,
  toggleCategoryFeaturedAction,
  bulkDeleteCategoriesAction,
  bulkUpdateCategoryStatusAction,
} from "@/app/admin/actions";
import { AdminCategoryModal } from "./AdminCategoryModal";
import { AdminDeleteModal } from "./AdminDeleteModal";

export interface AdminCategoryManagerProps {
  initialCategories: CategoryMaster[];
  className?: string;
}

export const AdminCategoryManager: React.FC<AdminCategoryManagerProps> = ({
  initialCategories = [],
  className = "",
}) => {
  const [categories, setCategories] = useState<CategoryMaster[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured" | "standard">("all");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryMaster | null>(null);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    id?: string;
    name?: string;
    isBulk?: boolean;
  }>({ isOpen: false });

  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filtered & Sorted items
  const processedItems = useMemo(() => {
    let list = [...categories];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((c) => (statusFilter === "active" ? c.isActive : !c.isActive));
    }

    if (featuredFilter !== "all") {
      list = list.filter((c) => (featuredFilter === "featured" ? c.isFeatured : !c.isFeatured));
    }

    list.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "jobs") return b.jobCount - a.jobCount;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return list;
  }, [categories, searchQuery, statusFilter, featuredFilter, sortBy]);

  const total = processedItems.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const offset = (page - 1) * pageSize;
    return processedItems.slice(offset, offset + pageSize);
  }, [processedItems, page, pageSize]);

  // Handlers
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedItems.map((c) => c.id));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSaveModal = async (data: Partial<CategoryMaster>) => {
    setIsProcessing(true);
    if (editingCategory) {
      const res = await updateCategoryAction(editingCategory.id, data);
      if (res.success && res.data) {
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? res.data! : c))
        );
        showToast("Category updated successfully.");
      }
    } else {
      const res = await createCategoryAction(data);
      if (res.success && res.data) {
        setCategories((prev) => [res.data!, ...prev]);
        showToast("New category created successfully.");
      }
    }
    setIsProcessing(false);
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleToggleActive = async (id: string) => {
    setIsProcessing(true);
    const res = await toggleCategoryActiveAction(id);
    if (res.success && res.data) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? res.data! : c))
      );
      showToast(res.message || "Status toggled.");
    }
    setIsProcessing(false);
  };

  const handleToggleFeatured = async (id: string) => {
    setIsProcessing(true);
    const res = await toggleCategoryFeaturedAction(id);
    if (res.success && res.data) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? res.data! : c))
      );
      showToast(res.message || "Featured status toggled.");
    }
    setIsProcessing(false);
  };

  const handleDeleteConfirm = async () => {
    setIsProcessing(true);
    if (deleteModalState.isBulk) {
      const res = await bulkDeleteCategoriesAction(selectedIds);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
        setSelectedIds([]);
        showToast(res.message || "Bulk deletion complete.");
      }
    } else if (deleteModalState.id) {
      const res = await deleteCategoryAction(deleteModalState.id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== deleteModalState.id));
        showToast("Category removed.");
      }
    }
    setIsProcessing(false);
    setDeleteModalState({ isOpen: false });
  };

  const handleBulkStatus = async (isActive: boolean) => {
    if (selectedIds.length === 0) return;
    setIsProcessing(true);
    const res = await bulkUpdateCategoryStatusAction(selectedIds, isActive);
    if (res.success) {
      setCategories((prev) =>
        prev.map((c) =>
          selectedIds.includes(c.id)
            ? { ...c, isActive, updatedAt: new Date().toISOString() }
            : c
        )
      );
      showToast(res.message || "Bulk status updated.");
    }
    setIsProcessing(false);
  };

  const isAllSelected = paginatedItems.length > 0 && selectedIds.length === paginatedItems.length;

  return (
    <div className={["space-y-6", className].filter(Boolean).join(" ")}>
      {/* Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-[var(--primary)]" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Categories Master Taxonomy
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Centralized master category taxonomy referenced by all recruitment notices and search filters.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="bg-[#0F2744] hover:bg-[#183B66] text-white font-bold text-xs shadow-xs"
          leftIcon={<PlusCircle className="h-4 w-4" />}
        >
          Create Category
        </Button>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Categories
          </span>
          <span className="text-2xl font-black text-slate-900 font-mono">
            {categories.length}
          </span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
            Active in Portal
          </span>
          <span className="text-2xl font-black text-emerald-600 font-mono">
            {categories.filter((c) => c.isActive).length}
          </span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
            Featured on Hub
          </span>
          <span className="text-2xl font-black text-amber-600 font-mono">
            {categories.filter((c) => c.isFeatured).length}
          </span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
            Total Indexed Jobs
          </span>
          <span className="text-2xl font-black text-[var(--primary)] font-mono">
            {categories.reduce((acc, curr) => acc + curr.jobCount, 0).toLocaleString("en-IN")}
          </span>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-5">
            <Input
              type="text"
              placeholder="Search category name, slug, description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              leftIcon={<Search className="h-4 w-4 text-slate-400" />}
              fullWidth
            />
          </div>

          <div className="lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as "all" | "active" | "inactive");
                setPage(1);
              }}
              aria-label="Filter by category status"
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <select
              value={featuredFilter}
              onChange={(e) => {
                setFeaturedFilter(e.target.value as "all" | "featured" | "standard");
                setPage(1);
              }}
              aria-label="Filter by featured status"
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="all">All Visibility</option>
              <option value="featured">Featured on Hub</option>
              <option value="standard">Standard</option>
            </select>
          </div>

          <div className="lg:col-span-2 flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort categories"
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="latest">Latest Updated</option>
              <option value="name">Name (A-Z)</option>
              <option value="jobs">Most Postings</option>
            </select>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setFeaturedFilter("all");
                setSortBy("latest");
                setPage(1);
              }}
              title="Reset Filters"
              className="p-2 text-slate-400 hover:text-slate-700 shrink-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between gap-3 shadow-md animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold pl-2">
            <CheckSquare className="h-4 w-4 text-amber-400" />
            <span>{selectedIds.length} categories selected</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatus(true)}
              disabled={isProcessing}
              className="text-xs font-bold text-slate-900 bg-white hover:bg-slate-100"
            >
              Bulk Activate
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatus(false)}
              disabled={isProcessing}
              className="text-xs font-bold text-slate-900 bg-white hover:bg-slate-100"
            >
              Bulk Deactivate
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() =>
                setDeleteModalState({
                  isOpen: true,
                  isBulk: true,
                  name: `${selectedIds.length} selected categories`,
                })
              }
              disabled={isProcessing}
              className="text-xs font-bold"
              leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            >
              Bulk Delete
            </Button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th scope="col" className="py-3.5 px-4 w-10">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    aria-label={isAllSelected ? "Deselect all" : "Select all"}
                    className="text-slate-400 hover:text-slate-900"
                  >
                    {isAllSelected ? <CheckSquare className="h-4 w-4 text-[var(--primary)]" /> : <Square className="h-4 w-4" />}
                  </button>
                </th>
                <th scope="col" className="py-3.5 px-4">Category Name &amp; Slug</th>
                <th scope="col" className="py-3.5 px-4">Scope Description</th>
                <th scope="col" className="py-3.5 px-4 text-center">Postings</th>
                <th scope="col" className="py-3.5 px-4 text-center">Featured</th>
                <th scope="col" className="py-3.5 px-4 text-center">Status</th>
                <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((cat) => {
                  const isSelected = selectedIds.includes(cat.id);

                  return (
                    <tr
                      key={cat.id}
                      className={[
                        "hover:bg-slate-50/80 transition-colors group",
                        isSelected ? "bg-blue-50/40" : "",
                      ].join(" ")}
                    >
                      <td className="py-3.5 px-4 align-middle">
                        <button
                          type="button"
                          onClick={() => handleSelectOne(cat.id)}
                          aria-label={`Select category ${cat.name}`}
                          className="text-slate-400 hover:text-slate-900"
                        >
                          {isSelected ? <CheckSquare className="h-4 w-4 text-[var(--primary)]" /> : <Square className="h-4 w-4" />}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 align-top max-w-xs">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm block">
                          {cat.name}
                        </span>
                        <code className="text-[10px] text-slate-500 font-mono block mt-0.5 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
                          slug: {cat.slug}
                        </code>
                      </td>

                      <td className="py-3.5 px-4 align-top max-w-sm text-slate-600 text-[11px] leading-relaxed">
                        {cat.description || "No description provided."}
                      </td>

                      <td className="py-3.5 px-4 align-top text-center font-mono">
                        <span className="inline-flex items-center gap-1 font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full text-[10px]">
                          <Layers className="h-3 w-3 text-slate-400" />
                          <span>{cat.jobCount}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 align-top text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(cat.id)}
                          title={cat.isFeatured ? "Click to unfeature" : "Click to feature on Hub"}
                          className="p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          {cat.isFeatured ? (
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500 mx-auto" />
                          ) : (
                            <Star className="h-4 w-4 text-slate-300 mx-auto" />
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 align-top text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(cat.id)}
                          className="cursor-pointer focus-visible:outline-none"
                        >
                          <Badge
                            variant={cat.isActive ? "success" : "neutral"}
                            size="sm"
                            className="text-[9px] font-bold"
                          >
                            {cat.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </button>
                      </td>

                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCategory(cat);
                              setIsModalOpen(true);
                            }}
                            title="Edit Category"
                            className="p-1.5 text-slate-400 hover:text-[var(--primary)] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteModalState({
                                isOpen: true,
                                id: cat.id,
                                name: cat.name,
                                isBulk: false,
                              })
                            }
                            title="Delete Category"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                    <FolderTree className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No categories found</p>
                    <p className="text-xs text-slate-400 mt-1">Adjust search parameters or create a new master category.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing <strong className="text-slate-900">{paginatedItems.length}</strong> of{" "}
            <strong className="text-slate-900">{total}</strong> categories (Page {page} of {totalPages})
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1}
              className="font-bold text-xs"
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="font-bold text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Category Create/Edit Modal */}
      <AdminCategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveModal}
        initialData={editingCategory}
        isSaving={isProcessing}
      />

      {/* Delete Confirmation Modal */}
      <AdminDeleteModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false })}
        onConfirm={handleDeleteConfirm}
        title={deleteModalState.name || ""}
        itemCount={deleteModalState.isBulk ? selectedIds.length : 1}
        isDeleting={isProcessing}
      />
    </div>
  );
};

AdminCategoryManager.displayName = "AdminCategoryManager";
