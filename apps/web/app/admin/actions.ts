"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ADMIN_CONFIG,
  validateAdminCredentials,
  createSessionToken,
  getAdminSession,
} from "@/lib/auth/admin-auth";
import {
  createAdminJob,
  updateAdminJob,
  deleteAdminJob,
  duplicateAdminJob,
  toggleJobStatus,
  bulkUpdateJobsStatus,
  bulkDeleteJobs,
} from "@/services/admin/admin-jobs.service";
import { JobPosting, JobStatus } from "@/types";

export interface AdminActionResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Admin Login Server Action
 */
export async function loginAdminAction(formData: FormData): Promise<AdminActionResult> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { success: false, error: "Please provide both username and password." };
  }

  const isValid = await validateAdminCredentials(username, password);
  if (!isValid) {
    return { success: false, error: "Invalid administrator credentials. Access denied." };
  }

  const token = createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_CONFIG.sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_CONFIG.sessionMaxAge,
  });

  return { success: true, message: "Authentication successful." };
}

/**
 * Admin Logout Server Action
 */
export async function logoutAdminAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_CONFIG.sessionCookieName);
  redirect("/admin/login");
}

/**
 * Middleware verification helper for server actions
 */
async function requireAuth() {
  const session = await getAdminSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Unauthorized: Administrator privileges required.");
  }
  return session;
}

/**
 * Create Job Action
 */
export async function createJobAction(jobData: Partial<JobPosting>): Promise<AdminActionResult<JobPosting>> {
  await requireAuth();
  try {
    const created = await createAdminJob(jobData);
    revalidatePath("/admin/jobs");
    revalidatePath("/admin/dashboard");
    revalidatePath("/government-jobs");
    return { success: true, data: created, message: "Job circular created successfully." };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to create job circular.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Update Job Action
 */
export async function updateJobAction(id: string, updates: Partial<JobPosting>): Promise<AdminActionResult<JobPosting>> {
  await requireAuth();
  try {
    const updated = await updateAdminJob(id, updates);
    if (!updated) return { success: false, error: "Job record not found." };

    revalidatePath("/admin/jobs");
    revalidatePath(`/admin/jobs/${id}/edit`);
    revalidatePath("/admin/dashboard");
    return { success: true, data: updated, message: "Job circular updated successfully." };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update job circular.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Delete Job Action
 */
export async function deleteJobAction(id: string): Promise<AdminActionResult> {
  await requireAuth();
  try {
    const success = await deleteAdminJob(id);
    if (!success) return { success: false, error: "Job not found or already deleted." };

    revalidatePath("/admin/jobs");
    revalidatePath("/admin/dashboard");
    return { success: true, message: "Job circular deleted." };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to delete job.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Duplicate Job Action
 */
export async function duplicateJobAction(id: string): Promise<AdminActionResult<JobPosting>> {
  await requireAuth();
  try {
    const duplicated = await duplicateAdminJob(id);
    if (!duplicated) return { success: false, error: "Failed to clone job circular." };

    revalidatePath("/admin/jobs");
    revalidatePath("/admin/dashboard");
    return { success: true, data: duplicated, message: "Job circular cloned as draft." };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to duplicate job.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Toggle Publish Status Action
 */
export async function toggleJobStatusAction(id: string, newStatus: JobStatus): Promise<AdminActionResult<JobPosting>> {
  await requireAuth();
  try {
    const updated = await toggleJobStatus(id, newStatus);
    if (!updated) return { success: false, error: "Job not found." };

    revalidatePath("/admin/jobs");
    revalidatePath("/admin/dashboard");
    return { success: true, data: updated, message: `Status updated to ${newStatus}.` };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to toggle status.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Bulk Status Update Action
 */
export async function bulkUpdateStatusAction(ids: string[], status: JobStatus): Promise<AdminActionResult> {
  await requireAuth();
  try {
    const count = await bulkUpdateJobsStatus(ids, status);
    revalidatePath("/admin/jobs");
    revalidatePath("/admin/dashboard");
    return { success: true, message: `Updated ${count} job postings to ${status}.` };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to perform bulk update.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Bulk Delete Action
 */
export async function bulkDeleteAction(ids: string[]): Promise<AdminActionResult> {
  await requireAuth();
  try {
    const count = await bulkDeleteJobs(ids);
    revalidatePath("/admin/jobs");
    revalidatePath("/admin/dashboard");
    return { success: true, message: `Deleted ${count} job postings.` };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to perform bulk delete.";
    return { success: false, error: errorMsg };
  }
}

// ----------------------------------------------------
// Category Master Actions
// ----------------------------------------------------

import {
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryActive,
  toggleCategoryFeatured,
  bulkUpdateCategoryStatus,
  bulkDeleteCategories,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  toggleOrganizationActive,
  bulkUpdateOrganizationStatus,
  bulkDeleteOrganizations,
} from "@/services/admin/admin-master-data.service";
import { CategoryMaster, OrganizationMaster } from "@/types";

export async function createCategoryAction(data: Partial<CategoryMaster>): Promise<AdminActionResult<CategoryMaster>> {
  await requireAuth();
  try {
    const created = await createCategory(data);
    revalidatePath("/admin/categories");
    return { success: true, data: created, message: "Category created successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create category.";
    return { success: false, error: msg };
  }
}

export async function updateCategoryAction(id: string, data: Partial<CategoryMaster>): Promise<AdminActionResult<CategoryMaster>> {
  await requireAuth();
  try {
    const updated = await updateCategory(id, data);
    if (!updated) return { success: false, error: "Category not found." };
    revalidatePath("/admin/categories");
    return { success: true, data: updated, message: "Category updated successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update category.";
    return { success: false, error: msg };
  }
}

export async function deleteCategoryAction(id: string): Promise<AdminActionResult> {
  await requireAuth();
  try {
    const ok = await deleteCategory(id);
    if (!ok) return { success: false, error: "Category not found." };
    revalidatePath("/admin/categories");
    return { success: true, message: "Category deleted." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete category.";
    return { success: false, error: msg };
  }
}

export async function toggleCategoryActiveAction(id: string): Promise<AdminActionResult<CategoryMaster>> {
  await requireAuth();
  try {
    const updated = await toggleCategoryActive(id);
    if (!updated) return { success: false, error: "Category not found." };
    revalidatePath("/admin/categories");
    return { success: true, data: updated, message: `Category ${updated.isActive ? "activated" : "deactivated"}.` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to toggle category.";
    return { success: false, error: msg };
  }
}

export async function toggleCategoryFeaturedAction(id: string): Promise<AdminActionResult<CategoryMaster>> {
  await requireAuth();
  try {
    const updated = await toggleCategoryFeatured(id);
    if (!updated) return { success: false, error: "Category not found." };
    revalidatePath("/admin/categories");
    return { success: true, data: updated, message: `Category ${updated.isFeatured ? "featured" : "unfeatured"}.` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to toggle featured status.";
    return { success: false, error: msg };
  }
}

export async function bulkDeleteCategoriesAction(ids: string[]): Promise<AdminActionResult> {
  await requireAuth();
  try {
    const count = await bulkDeleteCategories(ids);
    revalidatePath("/admin/categories");
    return { success: true, message: `Deleted ${count} categories.` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete categories.";
    return { success: false, error: msg };
  }
}

export async function bulkUpdateCategoryStatusAction(ids: string[], isActive: boolean): Promise<AdminActionResult> {
  await requireAuth();
  try {
    const count = await bulkUpdateCategoryStatus(ids, isActive);
    revalidatePath("/admin/categories");
    return { success: true, message: `Updated ${count} categories to ${isActive ? "Active" : "Inactive"}.` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update category status.";
    return { success: false, error: msg };
  }
}

// ----------------------------------------------------
// Organization Master Actions
// ----------------------------------------------------

export async function createOrganizationAction(data: Partial<OrganizationMaster>): Promise<AdminActionResult<OrganizationMaster>> {
  await requireAuth();
  try {
    const created = await createOrganization(data);
    revalidatePath("/admin/organizations");
    return { success: true, data: created, message: "Organization created successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create organization.";
    return { success: false, error: msg };
  }
}

export async function updateOrganizationAction(id: string, data: Partial<OrganizationMaster>): Promise<AdminActionResult<OrganizationMaster>> {
  await requireAuth();
  try {
    const updated = await updateOrganization(id, data);
    if (!updated) return { success: false, error: "Organization not found." };
    revalidatePath("/admin/organizations");
    return { success: true, data: updated, message: "Organization updated successfully." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update organization.";
    return { success: false, error: msg };
  }
}

export async function deleteOrganizationAction(id: string): Promise<AdminActionResult> {
  await requireAuth();
  try {
    const ok = await deleteOrganization(id);
    if (!ok) return { success: false, error: "Organization not found." };
    revalidatePath("/admin/organizations");
    return { success: true, message: "Organization deleted." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete organization.";
    return { success: false, error: msg };
  }
}

export async function toggleOrganizationActiveAction(id: string): Promise<AdminActionResult<OrganizationMaster>> {
  await requireAuth();
  try {
    const updated = await toggleOrganizationActive(id);
    if (!updated) return { success: false, error: "Organization not found." };
    revalidatePath("/admin/organizations");
    return { success: true, data: updated, message: `Organization ${updated.isActive ? "activated" : "deactivated"}.` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to toggle organization.";
    return { success: false, error: msg };
  }
}

export async function bulkDeleteOrganizationsAction(ids: string[]): Promise<AdminActionResult> {
  await requireAuth();
  try {
    const count = await bulkDeleteOrganizations(ids);
    revalidatePath("/admin/organizations");
    return { success: true, message: `Deleted ${count} organizations.` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete organizations.";
    return { success: false, error: msg };
  }
}

export async function bulkUpdateOrganizationStatusAction(ids: string[], isActive: boolean): Promise<AdminActionResult> {
  await requireAuth();
  try {
    const count = await bulkUpdateOrganizationStatus(ids, isActive);
    revalidatePath("/admin/organizations");
    return { success: true, message: `Updated ${count} organizations to ${isActive ? "Active" : "Inactive"}.` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update organization status.";
    return { success: false, error: msg };
  }
}
