"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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
  await setAdminSessionCookie(token);

  return { success: true, message: "Authentication successful." };
}

/**
 * Admin Logout Server Action
 */
export async function logoutAdminAction(): Promise<void> {
  await clearAdminSessionCookie();
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
