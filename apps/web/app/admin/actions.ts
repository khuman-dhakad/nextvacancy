"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { ADMIN_CONFIG } from "@/lib/auth/admin-config";
import {
  validateAdminCredentials,
  createSessionToken,
  getAdminSession,
  setAdminSessionCookie,
  clearAdminSessionCookie,
} from "@/lib/auth/admin-auth.server";

import {
  createAdminJob,
  updateAdminJob,
  deleteAdminJob,
  duplicateAdminJob,
  toggleJobStatus,
  bulkUpdateJobsStatus,
  bulkDeleteJobs,
} from "@/services/admin/admin-jobs.service";

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

import {
  JobPosting,
  JobStatus,
  CategoryMaster,
  OrganizationMaster,
} from "@/types";

export interface AdminActionResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/* -------------------------------------------------------------------------- */
/*                                  AUTH                                      */
/* -------------------------------------------------------------------------- */

export async function loginAdminAction(
  formData: FormData
): Promise<AdminActionResult> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return {
      success: false,
      error: "Please provide both username and password.",
    };
  }

  const isValid = await validateAdminCredentials(username, password);

  if (!isValid) {
    return {
      success: false,
      error: "Invalid administrator credentials. Access denied.",
    };
  }

  const token = createSessionToken();
  await setAdminSessionCookie(token);

  return {
    success: true,
    message: "Authentication successful.",
  };
}

export async function logoutAdminAction(): Promise<void> {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}

async function requireAuth() {
  const session = await getAdminSession();

  if (!session || session.role !== "ADMIN") {
    throw new Error("Unauthorized: Administrator privileges required.");
  }

  return session;
}

/* -------------------------------------------------------------------------- */
/*                                  JOBS                                      */
/* -------------------------------------------------------------------------- */

export async function createJobAction(
  jobData: Partial<JobPosting>
): Promise<AdminActionResult<JobPosting>> {
  await requireAuth();

  try {
    const created = await createAdminJob(jobData);

    revalidatePath("/admin/jobs");
    revalidatePath("/admin/dashboard");
    revalidatePath("/government-jobs");

    return {
      success: true,
      data: created,
      message: "Job circular created successfully.",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create job.",
    };
  }
}

export async function updateJobAction(
  id: string,
  updates: Partial<JobPosting>
): Promise<AdminActionResult<JobPosting>> {
  await requireAuth();

  try {
    const updated = await updateAdminJob(id, updates);

    if (!updated) {
      return { success: false, error: "Job not found." };
    }

    revalidatePath("/admin/jobs");
    revalidatePath(`/admin/jobs/${id}/edit`);
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      data: updated,
      message: "Job updated successfully.",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Update failed.",
    };
  }
}

export async function deleteJobAction(
  id: string
): Promise<AdminActionResult> {
  await requireAuth();

  try {
    const ok = await deleteAdminJob(id);

    if (!ok) {
      return { success: false, error: "Job not found." };
    }

    revalidatePath("/admin/jobs");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Job deleted successfully.",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Delete failed.",
    };
  }
}

export async function duplicateJobAction(
  id: string
): Promise<AdminActionResult<JobPosting>> {
  await requireAuth();

  try {
    const job = await duplicateAdminJob(id);

    if (!job) {
      return { success: false, error: "Unable to duplicate job." };
    }

    revalidatePath("/admin/jobs");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      data: job,
      message: "Draft duplicated successfully.",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Duplicate failed.",
    };
  }
}

export async function toggleJobStatusAction(
  id: string,
  status: JobStatus
): Promise<AdminActionResult<JobPosting>> {
  await requireAuth();

  try {
    const job = await toggleJobStatus(id, status);

    if (!job) {
      return { success: false, error: "Job not found." };
    }

    revalidatePath("/admin/jobs");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      data: job,
      message: `Status updated to ${status}.`,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Status update failed.",
    };
  }
}

export async function bulkUpdateStatusAction(
  ids: string[],
  status: JobStatus
): Promise<AdminActionResult> {
  await requireAuth();

  try {
    const count = await bulkUpdateJobsStatus(ids, status);

    revalidatePath("/admin/jobs");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: `${count} jobs updated.`,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Bulk update failed.",
    };
  }
}

export async function bulkDeleteAction(
  ids: string[]
): Promise<AdminActionResult> {
  await requireAuth();

  try {
    const count = await bulkDeleteJobs(ids);

    revalidatePath("/admin/jobs");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: `${count} jobs deleted.`,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Bulk delete failed.",
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                                CATEGORIES                                  */
/* -------------------------------------------------------------------------- */

export async function createCategoryAction(
  data: Partial<CategoryMaster>
): Promise<AdminActionResult<CategoryMaster>> {
  await requireAuth();

  try {
    const created = await createCategory(data);

    revalidatePath("/admin/categories");

    return {
      success: true,
      data: created,
      message: "Category created successfully.",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Create failed.",
    };
  }
}

export async function updateCategoryAction(
  id: string,
  data: Partial<CategoryMaster>
): Promise<AdminActionResult<CategoryMaster>> {
  await requireAuth();

  try {
    const updated = await updateCategory(id, data);

    if (!updated) {
      return { success: false, error: "Category not found." };
    }

    revalidatePath("/admin/categories");

    return {
      success: true,
      data: updated,
      message: "Category updated successfully.",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Update failed.",
    };
  }
}

export async function deleteCategoryAction(
  id: string
): Promise<AdminActionResult> {
  await requireAuth();

  try {
    const ok = await deleteCategory(id);

    if (!ok) {
      return { success: false, error: "Category not found." };
    }

    revalidatePath("/admin/categories");

    return {
      success: true,
      message: "Category deleted successfully.",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Delete failed.",
    };
  }
}

export async function toggleCategoryActiveAction(
  id: string
): Promise<AdminActionResult<CategoryMaster>> {
  await requireAuth();

  try {
    const updated = await toggleCategoryActive(id);

    if (!updated) {
      return { success: false, error: "Category not found." };
    }

    revalidatePath("/admin/categories");

    return {
      success: true,
      data: updated,
      message: "Category status updated.",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Toggle failed.",
    };
  }
}

export async function toggleCategoryFeaturedAction(
  id: string
): Promise<AdminActionResult<CategoryMaster>> {
  await requireAuth();

  try {
    const updated = await toggleCategoryFeatured(id);

    if (!updated) {
      return { success: false, error: "Category not found." };
    }

    revalidatePath("/admin/categories");

    return {
      success: true,
      data: updated,
      message: "Featured status updated.",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Toggle failed.",
    };
  }
}

export async function bulkDeleteCategoriesAction(
  ids: string[]
): Promise<AdminActionResult> {
  await requireAuth();

  try {
    const count = await bulkDeleteCategories(ids);

    revalidatePath("/admin/categories");

    return {
      success: true,
      message: `${count} categories deleted.`,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Bulk delete failed.",
    };
  }
}

export async function bulkUpdateCategoryStatusAction(
  ids: string[],
  isActive: boolean
): Promise<AdminActionResult> {
  await requireAuth();

  try {
    const count = await bulkUpdateCategoryStatus(ids, isActive);

    revalidatePath("/admin/categories");

    return {
      success: true,
      message: `${count} categories updated.`,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Bulk update failed.",
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                              ORGANIZATIONS                                 */
/* -------------------------------------------------------------------------- */

export async function createOrganizationAction(
  data: Partial<OrganizationMaster>
): Promise<AdminActionResult<OrganizationMaster>> {
  await requireAuth();

  try {
    const created = await createOrganization(data);

    revalidatePath("/admin/organizations");

    return {
      success: true,
      data: created,
      message: "Organization created successfully.",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Create failed.",
    };
  }
}

export async function updateOrganizationAction(
  id: string,
  data: Partial<OrganizationMaster>
): Promise<AdminActionResult<OrganizationMaster>> {
  await requireAuth();

  try {
    const updated = await updateOrganization(id, data);

    if (!updated) {
      return { success: false, error: "Organization not found." };
    }

    revalidatePath("/admin/organizations");

    return {
      success: true,
      data: updated,
      message: "Organization updated successfully.",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Update failed.",
    };
  }
}

export async function deleteOrganizationAction(
  id: string
): Promise<AdminActionResult> {
  await requireAuth();

  try {
    const ok = await deleteOrganization(id);

    if (!ok) {
      return { success: false, error: "Organization not found." };
    }

    revalidatePath("/admin/organizations");

    return {
      success: true,
      message: "Organization deleted successfully.",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Delete failed.",
    };
  }
}

export async function toggleOrganizationActiveAction(
  id: string
): Promise<AdminActionResult<OrganizationMaster>> {
  await requireAuth();

  try {
    const updated = await toggleOrganizationActive(id);

    if (!updated) {
      return { success: false, error: "Organization not found." };
    }

    revalidatePath("/admin/organizations");

    return {
      success: true,
      data: updated,
      message: "Organization status updated.",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Toggle failed.",
    };
  }
}

export async function bulkDeleteOrganizationsAction(
  ids: string[]
): Promise<AdminActionResult> {
  await requireAuth();

  try {
    const count = await bulkDeleteOrganizations(ids);

    revalidatePath("/admin/organizations");

    return {
      success: true,
      message: `${count} organizations deleted.`,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Bulk delete failed.",
    };
  }
}

export async function bulkUpdateOrganizationStatusAction(
  ids: string[],
  isActive: boolean
): Promise<AdminActionResult> {
  await requireAuth();

  try {
    const count = await bulkUpdateOrganizationStatus(ids, isActive);

    revalidatePath("/admin/organizations");

    return {
      success: true,
      message: `${count} organizations updated.`,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Bulk update failed.",
    };
  }
}