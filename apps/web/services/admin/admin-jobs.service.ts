import {
  JobPosting,
  JobCategory,
  JobStatus,
  AdminAnalyticsStats,
  AdminActivityLog,
  AdminJobSearchParams,
  PaginatedResponse,
} from "@/types";
import { MOCK_JOB_POSTINGS } from "@/services/jobs/jobs.mock";

/**
 * NEXTVACANCY Admin CMS & Recruitment Job Management Service
 * Full CRUD, search, filter, status toggles, duplication, and audit logging.
 * Ready for direct binding to Spring Boot `/api/v1/admin/jobs/*`.
 */

// In-memory runtime store initialized from mock dataset
let adminJobsStore: JobPosting[] = [...MOCK_JOB_POSTINGS];

const activityLogsStore: AdminActivityLog[] = [
  {
    id: "act-1",
    action: "LOGIN",
    entityTitle: "Administrator Session Started",
    timestamp: "Just now",
    adminUser: "admin@nextvacancy.com",
    details: "Authenticated from recognized IP 49.36.120.45",
  },
  {
    id: "act-2",
    action: "PUBLISH",
    entityTitle: "SSC CGL 2026 Recruitment",
    timestamp: "2 hours ago",
    adminUser: "admin@nextvacancy.com",
    details: "Published 14,582 Group B & C Vacancies notification",
  },
  {
    id: "act-3",
    action: "UPDATE",
    entityTitle: "RRB NTPC 2026 Centralized Notification",
    timestamp: "5 hours ago",
    adminUser: "admin@nextvacancy.com",
    details: "Updated application deadline and payment instructions",
  },
  {
    id: "act-4",
    action: "CREATE",
    entityTitle: "IBPS PO / MT XV 2026 Recruitment",
    timestamp: "Yesterday",
    adminUser: "admin@nextvacancy.com",
    details: "Created new 4,455 Bank PO vacancy article with fee matrix",
  },
];

/**
 * Computes live analytics metrics across all recruitment categories
 */
export async function getAdminDashboardStats(): Promise<AdminAnalyticsStats> {
  const total = adminJobsStore.length;
  const govtJobs = adminJobsStore.filter((j) => j.category === "government").length;
  const privateJobs = adminJobsStore.filter((j) => j.category === "private").length;
  const admitCards = adminJobsStore.filter((j) => j.category === "admit-card" || j.status === "ADMIT_CARD_OUT").length;
  const results = adminJobsStore.filter((j) => j.category === "result" || j.status === "RESULT_OUT").length;
  const scholarships = adminJobsStore.filter((j) => j.category === "scholarship").length;
  const internships = adminJobsStore.filter((j) => j.category === "internship" || j.category === "apprenticeship").length;
  const draftsCount = adminJobsStore.filter((j) => j.status === "CLOSED").length;
  const totalViews = adminJobsStore.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);

  return {
    totalJobs: total,
    govtJobs,
    privateJobs,
    admitCards,
    results,
    scholarships,
    internships,
    draftsCount,
    totalViews,
  };
}

/**
 * Searches and paginates through the CMS job inventory
 */
export async function getAdminJobs(
  params: AdminJobSearchParams = {}
): Promise<PaginatedResponse<JobPosting>> {
  let results = [...adminJobsStore];

  // 1. Text Search Query (Title, Org, Location, Qualification)
  if (params.query && params.query.trim()) {
    const q = params.query.toLowerCase().trim();
    results = results.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.organization.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.qualificationSummary.toLowerCase().includes(q)
    );
  }

  // 2. Category Filter
  if (params.category && params.category !== "all") {
    results = results.filter((job) => job.category === params.category);
  }

  // 3. Status Filter
  if (params.status && params.status !== "all") {
    results = results.filter((job) => job.status === params.status);
  }

  // 4. Sorting
  const sortBy = params.sortBy || "latest";
  const isAsc = params.sortOrder === "asc";

  results.sort((a, b) => {
    if (sortBy === "title") {
      return isAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    }
    if (sortBy === "organization") {
      return isAsc
        ? a.organization.localeCompare(b.organization)
        : b.organization.localeCompare(a.organization);
    }
    if (sortBy === "deadline") {
      const dateA = a.importantDates.applicationEndDate || "9999-12-31";
      const dateB = b.importantDates.applicationEndDate || "9999-12-31";
      return isAsc ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA);
    }
    if (sortBy === "views") {
      return isAsc ? a.viewsCount - b.viewsCount : b.viewsCount - a.viewsCount;
    }
    // Default: latest created
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return isAsc ? timeA - timeB : timeB - timeA;
  });

  // 5. Pagination
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.limit || 10);
  const total = results.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const offset = (page - 1) * pageSize;
  const items = results.slice(offset, offset + pageSize);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Retrieves a single job by ID or slug for the edit CMS form
 */
export async function getAdminJobById(id: string): Promise<JobPosting | null> {
  const job = adminJobsStore.find((j) => j.id === id || j.slug === id);
  return job ? JSON.parse(JSON.stringify(job)) : null;
}

/**
 * Helper to generate URL-safe slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Creates a new job posting with automated slug and timestamp assignment
 */
export async function createAdminJob(
  jobData: Partial<JobPosting>
): Promise<JobPosting> {
  const id = `job-${Date.now()}`;
  const now = new Date().toISOString();
  const slug = jobData.slug?.trim() || generateSlug(jobData.title || "new-job") + `-${Date.now().toString().slice(-4)}`;

  const newJob: JobPosting = {
    id,
    slug,
    title: jobData.title || "Untitled Recruitment",
    shortSummary: jobData.shortSummary || "",
    organization: jobData.organization || "Govt Authority",
    department: jobData.department || "",
    category: (jobData.category as JobCategory) || "government",
    status: (jobData.status as JobStatus) || "OPEN",
    location: jobData.location || "All India",
    totalVacancies: jobData.totalVacancies || "Check Notification",
    salaryOrStipend: jobData.salaryOrStipend || "Pay Matrix Level",
    jobType: jobData.jobType || "Full Time",
    applicationMode: jobData.applicationMode || "Online",
    qualificationSummary: jobData.qualificationSummary || "Graduate / 12th Pass",
    qualificationsList: jobData.qualificationsList || [],
    importantDates: jobData.importantDates || {
      applicationStartDate: now.split("T")[0],
      applicationEndDate: now.split("T")[0],
    },
    feeStructure: jobData.feeStructure || { general: "₹100", sc: "₹0", female: "₹0" },
    ageLimit: jobData.ageLimit || { minAge: 18, maxAge: 32 },
    vacancyBreakdown: jobData.vacancyBreakdown || [],
    selectionProcess: jobData.selectionProcess || ["Written Examination", "Document Verification"],
    howToApplySteps: jobData.howToApplySteps || [],
    requiredDocuments: jobData.requiredDocuments || ["Photograph", "Signature", "Marksheet"],
    importantLinks: jobData.importantLinks || [
      { label: "Apply Online", url: "https://ssc.gov.in", linkType: "apply_online" },
      { label: "Official Notification PDF", url: "https://ssc.gov.in", linkType: "official_notification_pdf" },
      { label: "Official Website", url: "https://ssc.gov.in", linkType: "official_website" },
    ],
    faqs: jobData.faqs || [],
    viewsCount: 0,
    isFeatured: Boolean(jobData.isFeatured),
    isTrending: Boolean(jobData.isTrending),
    isVerified: true,
    createdAt: now,
    updatedAt: now,
  };

  adminJobsStore.unshift(newJob);

  // Log activity
  activityLogsStore.unshift({
    id: `act-${Date.now()}`,
    action: "CREATE",
    entityTitle: newJob.title,
    timestamp: "Just now",
    adminUser: "admin@nextvacancy.com",
    details: `Created new ${newJob.category} vacancy with ID ${newJob.id}`,
  });

  return newJob;
}

/**
 * Updates an existing job posting by ID
 */
export async function updateAdminJob(
  id: string,
  updates: Partial<JobPosting>
): Promise<JobPosting | null> {
  const index = adminJobsStore.findIndex((j) => j.id === id);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const existing = adminJobsStore[index];

  const updated: JobPosting = {
    ...existing,
    ...updates,
    id: existing.id, // preserve ID
    slug: updates.slug?.trim() || existing.slug,
    updatedAt: now,
  };

  adminJobsStore[index] = updated;

  // Log activity
  activityLogsStore.unshift({
    id: `act-${Date.now()}`,
    action: "UPDATE",
    entityTitle: updated.title,
    timestamp: "Just now",
    adminUser: "admin@nextvacancy.com",
    details: `Updated circular details for ${updated.organization}`,
  });

  return updated;
}

/**
 * Deletes a job posting by ID
 */
export async function deleteAdminJob(id: string): Promise<boolean> {
  const index = adminJobsStore.findIndex((j) => j.id === id);
  if (index === -1) return false;

  const deletedTitle = adminJobsStore[index].title;
  adminJobsStore.splice(index, 1);

  // Log activity
  activityLogsStore.unshift({
    id: `act-${Date.now()}`,
    action: "DELETE",
    entityTitle: deletedTitle,
    timestamp: "Just now",
    adminUser: "admin@nextvacancy.com",
    details: `Deleted job posting record ${id}`,
  });

  return true;
}

/**
 * Duplicates a job posting to draft
 */
export async function duplicateAdminJob(id: string): Promise<JobPosting | null> {
  const original = adminJobsStore.find((j) => j.id === id);
  if (!original) return null;

  const copy = JSON.parse(JSON.stringify(original)) as JobPosting;
  const now = new Date().toISOString();

  copy.id = `job-${Date.now()}`;
  copy.title = `${original.title} (Copy)`;
  copy.slug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;
  copy.status = "CLOSED"; // Draft mode
  copy.viewsCount = 0;
  copy.createdAt = now;
  copy.updatedAt = now;

  adminJobsStore.unshift(copy);

  // Log activity
  activityLogsStore.unshift({
    id: `act-${Date.now()}`,
    action: "DUPLICATE",
    entityTitle: copy.title,
    timestamp: "Just now",
    adminUser: "admin@nextvacancy.com",
    details: `Cloned from ${original.title} as draft`,
  });

  return copy;
}

/**
 * Quick toggles status between OPEN and CLOSED (Draft)
 */
export async function toggleJobStatus(
  id: string,
  newStatus: JobStatus
): Promise<JobPosting | null> {
  const index = adminJobsStore.findIndex((j) => j.id === id);
  if (index === -1) return null;

  adminJobsStore[index].status = newStatus;
  adminJobsStore[index].updatedAt = new Date().toISOString();

  activityLogsStore.unshift({
    id: `act-${Date.now()}`,
    action: newStatus === "OPEN" ? "PUBLISH" : "UNPUBLISH",
    entityTitle: adminJobsStore[index].title,
    timestamp: "Just now",
    adminUser: "admin@nextvacancy.com",
    details: `Changed publication status to ${newStatus}`,
  });

  return adminJobsStore[index];
}

/**
 * Bulk updates status for multiple jobs
 */
export async function bulkUpdateJobsStatus(
  ids: string[],
  status: JobStatus
): Promise<number> {
  let updatedCount = 0;
  for (const id of ids) {
    const job = adminJobsStore.find((j) => j.id === id);
    if (job) {
      job.status = status;
      job.updatedAt = new Date().toISOString();
      updatedCount++;
    }
  }

  if (updatedCount > 0) {
    activityLogsStore.unshift({
      id: `act-${Date.now()}`,
      action: "PUBLISH",
      entityTitle: `${updatedCount} Job Postings`,
      timestamp: "Just now",
      adminUser: "admin@nextvacancy.com",
      details: `Bulk status update to ${status}`,
    });
  }

  return updatedCount;
}

/**
 * Bulk deletes multiple jobs
 */
export async function bulkDeleteJobs(ids: string[]): Promise<number> {
  const initialLength = adminJobsStore.length;
  adminJobsStore = adminJobsStore.filter((j) => !ids.includes(j.id));
  const deletedCount = initialLength - adminJobsStore.length;

  if (deletedCount > 0) {
    activityLogsStore.unshift({
      id: `act-${Date.now()}`,
      action: "DELETE",
      entityTitle: `${deletedCount} Job Postings`,
      timestamp: "Just now",
      adminUser: "admin@nextvacancy.com",
      details: `Bulk deletion of ${deletedCount} records`,
    });
  }

  return deletedCount;
}

/**
 * Returns latest administrator activity audit logs
 */
export async function getAdminActivityLogs(limit: number = 10): Promise<AdminActivityLog[]> {
  return activityLogsStore.slice(0, limit);
}
