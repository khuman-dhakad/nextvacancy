"use client";

import React, { useState, useMemo } from "react";
import {
  PlusCircle,
  Search,
  Building2,
  Edit3,
  Trash2,
  Globe,
  CheckCircle2,
  CheckSquare,
  Square,
  RotateCcw,
  ExternalLink,
  MapPin,
  Layers,
} from "lucide-react";
import { Card, Input, Button, Badge } from "@/components/ui";

import { OrganizationMaster } from "@/types";
import {
  createOrganizationAction,
  updateOrganizationAction,
  deleteOrganizationAction,
  toggleOrganizationActiveAction,
  bulkDeleteOrganizationsAction,
  bulkUpdateOrganizationStatusAction,
} from "@/app/admin/actions";
import { AdminOrganizationModal } from "./AdminOrganizationModal";
import { AdminDeleteModal } from "./AdminDeleteModal";

export interface AdminOrganizationManagerProps {
  initialOrganizations: OrganizationMaster[];
  className?: string;
}

export const AdminOrganizationManager: React.FC<AdminOrganizationManagerProps> = ({
  initialOrganizations = [],
  className = "",
}) => {
  const [organizations, setOrganizations] = useState<OrganizationMaster[]>(initialOrganizations);
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<OrganizationMaster | null>(null);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    id?: string;
    name?: string;
    isBulk?: boolean;
  }>({ isOpen: false });

  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered & Sorted items
  const processedItems = useMemo(() => {
    let list = [...organizations];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.shortName.toLowerCase().includes(q) ||
          o.slug.toLowerCase().includes(q) ||
          o.state.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q)
      );
    }

    if (stateFilter !== "all") {
      list = list.filter((o) => o.state.toLowerCase().includes(stateFilter.toLowerCase()));
    }

    if (typeFilter !== "all") {
      list = list.filter((o) => o.categoryType === typeFilter);
    }

    if (statusFilter !== "all") {
      list = list.filter((o) => (statusFilter === "active" ? o.isActive : !o.isActive));
    }

    list.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "shortName") return a.shortName.localeCompare(b.shortName);
      if (sortBy === "jobs") return b.jobCount - a.jobCount;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return list;
  }, [organizations, searchQuery, stateFilter, typeFilter, statusFilter, sortBy]);

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
      setSelectedIds(paginatedItems.map((o) => o.id));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSaveModal = async (data: Partial<OrganizationMaster>) => {
    setIsProcessing(true);
    if (editingOrg) {
      const res = await updateOrganizationAction(editingOrg.id, data);
      if (res.success && res.data) {
        setOrganizations((prev) =>
          prev.map((o) => (o.id === editingOrg.id ? res.data! : o))
        );
        showToast("Organization updated successfully.");
      }
    } else {
      const res = await createOrganizationAction(data);
      if (res.success && res.data) {
        setOrganizations((prev) => [res.data!, ...prev]);
        showToast("New organization created successfully.");
      }
    }
    setIsProcessing(false);
    setIsModalOpen(false);
    setEditingOrg(null);
  };

  const handleToggleActive = async (id: string) => {
    setIsProcessing(true);
    const res = await toggleOrganizationActiveAction(id);
    if (res.success && res.data) {
      setOrganizations((prev) =>
        prev.map((o) => (o.id === id ? res.data! : o))
      );
      showToast(res.message || "Organization status toggled.");
    }
    setIsProcessing(false);
  };

  const handleDeleteConfirm = async () => {
    setIsProcessing(true);
    if (deleteModalState.isBulk) {
      const res = await bulkDeleteOrganizationsAction(selectedIds);
      if (res.success) {
        setOrganizations((prev) => prev.filter((o) => !selectedIds.includes(o.id)));
        setSelectedIds([]);
        showToast(res.message || "Bulk deletion complete.");
      }
    } else if (deleteModalState.id) {
      const res = await deleteOrganizationAction(deleteModalState.id);
      if (res.success) {
        setOrganizations((prev) => prev.filter((o) => o.id !== deleteModalState.id));
        showToast("Organization deleted.");
      }
    }
    setIsProcessing(false);
    setDeleteModalState({ isOpen: false });
  };

  const handleBulkStatus = async (isActive: boolean) => {
    if (selectedIds.length === 0) return;
    setIsProcessing(true);
    const res = await bulkUpdateOrganizationStatusAction(selectedIds, isActive);
    if (res.success) {
      setOrganizations((prev) =>
        prev.map((o) =>
          selectedIds.includes(o.id)
            ? { ...o, isActive, updatedAt: new Date().toISOString() }
            : o
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
            <Building2 className="h-5 w-5 text-emerald-700" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Recruiting Organizations Master
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Standardized commission authorities, ministries, banks, and state bodies linked to all recruitment notices.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={() => {
            setEditingOrg(null);
            setIsModalOpen(true);
          }}
          className="bg-[#0F2744] hover:bg-[#183B66] text-white font-bold text-xs shadow-xs"
          leftIcon={<PlusCircle className="h-4 w-4" />}
        >
          Create Organization
        </Button>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Authorities
          </span>
          <span className="text-2xl font-black text-slate-900 font-mono">
            {organizations.length}
          </span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
            Central Commissions
          </span>
          <span className="text-2xl font-black text-emerald-600 font-mono">
            {organizations.filter((o) => o.categoryType === "Central Commission").length}
          </span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
          <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
            State PSCs
          </span>
          <span className="text-2xl font-black text-indigo-600 font-mono">
            {organizations.filter((o) => o.categoryType === "State PSC").length}
          </span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
            Total Active Notices
          </span>
          <span className="text-2xl font-black text-[var(--primary)] font-mono">
            {organizations.reduce((acc, curr) => acc + curr.jobCount, 0)}
          </span>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-4">
            <Input
              type="text"
              placeholder="Search by name, acronym, state, slug..."
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
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by organization category type"
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="all">All Category Types</option>
              <option value="Central Commission">Central Commission</option>
              <option value="Banking">Banking &amp; Insurance</option>
              <option value="Railways">Railways</option>
              <option value="Defence">Defence &amp; Police</option>
              <option value="State PSC">State PSC</option>
              <option value="PSU / Research">PSU &amp; Space Research</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <select
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by state jurisdiction"
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="all">All Jurisdictions / States</option>
              <option value="Central / New Delhi">Central / New Delhi</option>
              <option value="All India">All India</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Bihar">Bihar</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
            </select>
          </div>

          <div className="lg:col-span-2 flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort organizations"
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="latest">Latest</option>
              <option value="name">Name (A-Z)</option>
              <option value="shortName">Short Acronym</option>
              <option value="jobs">Most Postings</option>
            </select>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStateFilter("all");
                setTypeFilter("all");
                setStatusFilter("all");
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
            <span>{selectedIds.length} organizations selected</span>
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
                  name: `${selectedIds.length} selected organizations`,
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
                <th scope="col" className="py-3.5 px-4">Authority &amp; Acronym</th>
                <th scope="col" className="py-3.5 px-4">Jurisdiction &amp; Type</th>
                <th scope="col" className="py-3.5 px-4">Official Portal</th>
                <th scope="col" className="py-3.5 px-4 text-center">Notices</th>
                <th scope="col" className="py-3.5 px-4 text-center">Status</th>
                <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((org) => {
                  const isSelected = selectedIds.includes(org.id);

                  return (
                    <tr
                      key={org.id}
                      className={[
                        "hover:bg-slate-50/80 transition-colors group",
                        isSelected ? "bg-blue-50/40" : "",
                      ].join(" ")}
                    >
                      <td className="py-3.5 px-4 align-middle">
                        <button
                          type="button"
                          onClick={() => handleSelectOne(org.id)}
                          aria-label={`Select ${org.name}`}
                          className="text-slate-400 hover:text-slate-900"
                        >
                          {isSelected ? <CheckSquare className="h-4 w-4 text-[var(--primary)]" /> : <Square className="h-4 w-4" />}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 align-top max-w-xs">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center shrink-0 border border-slate-200">
                            {org.shortName.slice(0, 3)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-xs sm:text-sm block leading-tight">
                              {org.name}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">
                              Short: <strong className="text-slate-800">{org.shortName}</strong>
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span>{org.state}</span>
                        </div>
                        <span className="inline-block px-2 py-0.5 mt-1 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                          {org.categoryType}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <a
                          href={org.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--primary)] hover:underline"
                        >
                          <Globe className="h-3.5 w-3.5 text-slate-400" />
                          <span>{org.website.replace("https://", "")}</span>
                          <ExternalLink className="h-3 w-3 text-slate-400" />
                        </a>
                      </td>

                      <td className="py-3.5 px-4 align-top text-center font-mono">
                        <span className="inline-flex items-center gap-1 font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full text-[10px]">
                          <Layers className="h-3 w-3 text-slate-400" />
                          <span>{org.jobCount}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 align-top text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(org.id)}
                          className="cursor-pointer focus-visible:outline-none"
                        >
                          <Badge
                            variant={org.isActive ? "success" : "neutral"}
                            size="sm"
                            className="text-[9px] font-bold"
                          >
                            {org.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </button>
                      </td>

                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingOrg(org);
                              setIsModalOpen(true);
                            }}
                            title="Edit Organization"
                            className="p-1.5 text-slate-400 hover:text-[var(--primary)] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteModalState({
                                isOpen: true,
                                id: org.id,
                                name: org.name,
                                isBulk: false,
                              })
                            }
                            title="Delete Organization"
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
                    <Building2 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No organizations found</p>
                    <p className="text-xs text-slate-400 mt-1">Adjust search parameters or create a new recruiting authority.</p>
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
            <strong className="text-slate-900">{total}</strong> organizations (Page {page} of {totalPages})
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

      {/* Organization Create/Edit Modal */}
      <AdminOrganizationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOrg(null);
        }}
        onSave={handleSaveModal}
        initialData={editingOrg}
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

AdminOrganizationManager.displayName = "AdminOrganizationManager";
