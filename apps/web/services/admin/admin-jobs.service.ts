import { eq, desc, asc, and, or, ilike, inArray, count, sql } from "drizzle-orm";
import { db, jobs, auditLogs } from "@/lib/db";
import { handleDatabaseError, isProduction } from "@/lib/db/errors";
import {
  JobPosting,
  JobCategory,
  JobStatus,
  AdminAnalyticsStats,
  AdminActivityLog,
  AdminJobSearchParams,
  PaginatedResponse,
} from "@/types";
import { mapJobRecordToPosting } from "@/services/jobs/jobs.service";
import { MOCK_JOB_POSTINGS } from "@/services/jobs/jobs.mock";

function getAuditActor(): string {
  return process.env.ADMIN_EMAIL || "system";
}

/**
 * Computes live analytics metrics across all recruitment categories from the database
 */
export async function getAdminDashboardStats(): Promise<AdminAnalyticsStats> {
  try {
    const allJobs = await db.select().from(jobs);

    if (allJobs.length > 0) {
      const total = allJobs.length;
      const govtJobs = allJobs.filter((j) => j.category === "government").length;
      const privateJobs = allJobs.filter((j) => j.category === "private").length;
      const admitCards = allJobs.filter(
        (j) => j.category === "admit-card" || j.status === "ADMIT_CARD_OUT"
      ).length;
      const results = allJobs.filter(
        (j) => j.category === "result" || j.status === "RESULT_OUT"
      ).length;
      const scholarships = allJobs.filter((j) => j.category === "scholarship").length;
      const internships = allJobs.filter(
        (j) => j.category === "internship" || j.category === "apprenticeship"
      ).length;
      const draftsCount = allJobs.filter((j) => j.status === "CLOSED").length;
      const totalViews = allJobs.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);

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

    if (isProduction()) {
      return {
        totalJobs: 0,
        govtJobs: 0,
        privateJobs: 0,
        admitCards: 0,
        results: 0,
        scholarships: 0,
        internships: 0,
        draftsCount: 0,
        totalViews: 0,
      };
    }
  } catch (error) {
    handleDatabaseError("getAdminDashboardStats", error);
  }

  // Fallback
  const total = MOCK_JOB_POSTINGS.length;
  return {
    totalJobs: total,
    govtJobs: MOCK_JOB_POSTINGS.filter((j) => j.category === "government").length,
    privateJobs: MOCK_JOB_POSTINGS.filter((j) => j.category === "private").length,
    admitCards: MOCK_JOB_POSTINGS.filter((j) => j.category === "admit-card").length,
    results: MOCK_JOB_POSTINGS.filter((j) => j.category === "result").length,
    scholarships: MOCK_JOB_POSTINGS.filter((j) => j.category === "scholarship").length,
    internships: MOCK_JOB_POSTINGS.filter((j) => j.category === "internship").length,
    draftsCount: MOCK_JOB_POSTINGS.filter((j) => j.status === "CLOSED").length,
    totalViews: MOCK_JOB_POSTINGS.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0),
  };
}

/**
 * Searches and paginates through the CMS job inventory with database queries
 */
export async function getAdminJobs(
  params: AdminJobSearchParams = {}
): Promise<PaginatedResponse<JobPosting>> {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.limit || 10);
  const offset = (page - 1) * pageSize;

  try {
    const conditions = [];

    // 1. Text Search Query
    if (params.query && params.query.trim()) {
      const q = `%${params.query.trim()}%`;
      conditions.push(
        or(
          ilike(jobs.title, q),
          ilike(jobs.organization, q),
          ilike(jobs.location, q),
          ilike(jobs.qualificationSummary, q)
        )
      );
    }

    // 2. Category Filter
    if (params.category && params.category !== "all") {
      conditions.push(eq(jobs.category, params.category));
    }

    // 3. Status Filter
    if (params.status && params.status !== "all") {
      conditions.push(eq(jobs.status, params.status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 4. Sorting
    const sortBy = params.sortBy || "latest";
    const isAsc = params.sortOrder === "asc";

    let orderExpr;
    if (sortBy === "title") {
      orderExpr = isAsc ? asc(jobs.title) : desc(jobs.title);
    } else if (sortBy === "organization") {
      orderExpr = isAsc ? asc(jobs.organization) : desc(jobs.organization);
    } else if (sortBy === "deadline") {
      orderExpr = isAsc
        ? asc(sql`(${jobs.importantDates}->>'applicationEndDate')`)
        : desc(sql`(${jobs.importantDates}->>'applicationEndDate')`);
    } else if (sortBy === "views") {
      orderExpr = isAsc ? asc(jobs.viewsCount) : desc(jobs.viewsCount);
    } else {
      orderExpr = isAsc ? asc(jobs.createdAt) : desc(jobs.createdAt);
    }

    const [countResult, rows] = await Promise.all([
      db.select({ total: count() }).from(jobs).where(whereClause),
      db
        .select()
        .from(jobs)
        .where(whereClause)
        .orderBy(orderExpr)
        .limit(pageSize)
        .offset(offset),
    ]);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / pageSize) || 1;

    if (total > 0) {
      return {
        items: rows.map(mapJobRecordToPosting),
        total,
        page,
        pageSize,
        totalPages,
      };
    }

    if (isProduction()) {
      return { items: [], total: 0, page, pageSize, totalPages: 1 };
    }
  } catch (error) {
    handleDatabaseError("getAdminJobs", error);
  }

  if (isProduction()) return { items: [], total: 0, page, pageSize, totalPages: 1 };

  // Fallback
  let results = [...MOCK_JOB_POSTINGS];
  if (params.query) {
    const q = params.query.toLowerCase();
    results = results.filter(
      (j) => j.title.toLowerCase().includes(q) || j.organization.toLowerCase().includes(q)
    );
  }
  const total = results.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  return {
    items: results.slice(offset, offset + pageSize),
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
  try {
    const rows = await db
      .select()
      .from(jobs)
      .where(or(eq(jobs.id, id), eq(jobs.slug, id)))
      .limit(1);

    if (rows.length > 0) {
      return mapJobRecordToPosting(rows[0]);
    }
  } catch (error) {
    handleDatabaseError("getAdminJobById", error);
  }

  if (isProduction()) return null;

  const job = MOCK_JOB_POSTINGS.find((j) => j.id === id || j.slug === id);
  return job ? JSON.parse(JSON.stringify(job)) : null;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Creates a new job posting in PostgreSQL and writes an audit log
 */
export async function createAdminJob(
  jobData: Partial<JobPosting>
): Promise<JobPosting> {
  const id = `job-${Date.now()}`;
  const now = new Date();
  const slug =
    jobData.slug?.trim() ||
    generateSlug(jobData.title || "new-job") + `-${Date.now().toString().slice(-4)}`;

  const newJobRecord: typeof jobs.$inferInsert = {
    id,
    slug,
    title: jobData.title || "Untitled Recruitment",
    shortSummary: jobData.shortSummary || "",
    organization: jobData.organization || "Govt Authority",
    organizationLogo: jobData.organizationLogo || null,
    department: jobData.department || null,
    category: (jobData.category as JobCategory) || "government",
    status: (jobData.status as JobStatus) || "OPEN",
    location: jobData.location || "All India",
    totalVacancies: String(jobData.totalVacancies || "Check Notification"),
    salaryOrStipend: jobData.salaryOrStipend || "Pay Matrix Level",
    jobType: jobData.jobType || "Full Time",
    applicationMode: jobData.applicationMode || "Online",
    qualificationSummary: jobData.qualificationSummary || "Graduate / 12th Pass",
    qualificationsList: jobData.qualificationsList || [],
    importantDates: jobData.importantDates || {
      applicationStartDate: now.toISOString().split("T")[0],
      applicationEndDate: now.toISOString().split("T")[0],
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

  const [inserted] = await db.insert(jobs).values(newJobRecord).returning();

  // Log activity
  await db
    .insert(auditLogs)
    .values({
      id: `act-${Date.now()}`,
      actor: getAuditActor(),
      action: "CREATE",
      entity: "JOB",
      entityId: inserted.id,
      entityTitle: inserted.title,
      details: `Created new ${inserted.category} vacancy with ID ${inserted.id}`,
    })
    ;

  return mapJobRecordToPosting(inserted);
}

/**
 * Updates an existing job posting in PostgreSQL by ID
 */
export async function updateAdminJob(
  id: string,
  updates: Partial<JobPosting>
): Promise<JobPosting | null> {
  const now = new Date();

  const updateValues: Partial<typeof jobs.$inferInsert> = {
    updatedAt: now,
  };

  if (updates.title !== undefined) updateValues.title = updates.title;
  if (updates.slug !== undefined) updateValues.slug = updates.slug;
  if (updates.shortSummary !== undefined) updateValues.shortSummary = updates.shortSummary;
  if (updates.organization !== undefined) updateValues.organization = updates.organization;
  if (updates.organizationLogo !== undefined) updateValues.organizationLogo = updates.organizationLogo;
  if (updates.department !== undefined) updateValues.department = updates.department;
  if (updates.category !== undefined) updateValues.category = updates.category;
  if (updates.status !== undefined) updateValues.status = updates.status;
  if (updates.location !== undefined) updateValues.location = updates.location;
  if (updates.totalVacancies !== undefined) updateValues.totalVacancies = String(updates.totalVacancies);
  if (updates.salaryOrStipend !== undefined) updateValues.salaryOrStipend = updates.salaryOrStipend;
  if (updates.jobType !== undefined) updateValues.jobType = updates.jobType;
  if (updates.applicationMode !== undefined) updateValues.applicationMode = updates.applicationMode;
  if (updates.qualificationSummary !== undefined) updateValues.qualificationSummary = updates.qualificationSummary;
  if (updates.qualificationsList !== undefined) updateValues.qualificationsList = updates.qualificationsList;
  if (updates.importantDates !== undefined) updateValues.importantDates = updates.importantDates;
  if (updates.feeStructure !== undefined) updateValues.feeStructure = updates.feeStructure;
  if (updates.ageLimit !== undefined) updateValues.ageLimit = updates.ageLimit;
  if (updates.vacancyBreakdown !== undefined) updateValues.vacancyBreakdown = updates.vacancyBreakdown;
  if (updates.selectionProcess !== undefined) updateValues.selectionProcess = updates.selectionProcess;
  if (updates.howToApplySteps !== undefined) updateValues.howToApplySteps = updates.howToApplySteps;
  if (updates.requiredDocuments !== undefined) updateValues.requiredDocuments = updates.requiredDocuments;
  if (updates.importantLinks !== undefined) updateValues.importantLinks = updates.importantLinks;
  if (updates.faqs !== undefined) updateValues.faqs = updates.faqs;
  if (updates.isFeatured !== undefined) updateValues.isFeatured = updates.isFeatured;
  if (updates.isTrending !== undefined) updateValues.isTrending = updates.isTrending;
  if (updates.isVerified !== undefined) updateValues.isVerified = updates.isVerified;

  const [updated] = await db
    .update(jobs)
    .set(updateValues)
    .where(eq(jobs.id, id))
    .returning();

  if (!updated) return null;

  // Log activity
  await db
    .insert(auditLogs)
    .values({
      id: `act-${Date.now()}`,
      actor: getAuditActor(),
      action: "UPDATE",
      entity: "JOB",
      entityId: updated.id,
      entityTitle: updated.title,
      details: `Updated circular details for ${updated.organization}`,
    })
    ;

  return mapJobRecordToPosting(updated);
}

/**
 * Deletes a job posting from PostgreSQL by ID
 */
export async function deleteAdminJob(id: string): Promise<boolean> {
  const [deleted] = await db
    .delete(jobs)
    .where(eq(jobs.id, id))
    .returning({ id: jobs.id, title: jobs.title });

  if (!deleted) return false;

  // Log activity
  await db
    .insert(auditLogs)
    .values({
      id: `act-${Date.now()}`,
      actor: getAuditActor(),
      action: "DELETE",
      entity: "JOB",
      entityId: deleted.id,
      entityTitle: deleted.title,
      details: `Deleted job posting record ${id}`,
    })
    ;

  return true;
}

/**
 * Duplicates a job posting to draft
 */
export async function duplicateAdminJob(id: string): Promise<JobPosting | null> {
  const original = await getAdminJobById(id);
  if (!original) return null;

  const now = new Date();
  const copyId = `job-${Date.now()}`;
  const copySlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;
  const copyTitle = `${original.title} (Copy)`;

  const [inserted] = await db
    .insert(jobs)
    .values({
      id: copyId,
      slug: copySlug,
      title: copyTitle,
      shortSummary: original.shortSummary,
      organization: original.organization,
      organizationLogo: original.organizationLogo || null,
      department: original.department || null,
      category: original.category,
      status: "CLOSED", // Draft mode
      location: original.location,
      totalVacancies: String(original.totalVacancies),
      salaryOrStipend: original.salaryOrStipend,
      jobType: original.jobType || "Full Time",
      applicationMode: original.applicationMode || "Online",
      qualificationSummary: original.qualificationSummary,
      qualificationsList: original.qualificationsList || [],
      importantDates: original.importantDates,
      feeStructure: original.feeStructure || null,
      ageLimit: original.ageLimit || null,
      vacancyBreakdown: original.vacancyBreakdown || [],
      selectionProcess: original.selectionProcess || [],
      howToApplySteps: original.howToApplySteps || [],
      requiredDocuments: original.requiredDocuments || [],
      importantLinks: original.importantLinks,
      faqs: original.faqs || [],
      viewsCount: 0,
      isFeatured: false,
      isTrending: false,
      isVerified: original.isVerified ?? true,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!inserted) return null;

  await db
    .insert(auditLogs)
    .values({
      id: `act-${Date.now()}`,
      actor: getAuditActor(),
      action: "DUPLICATE",
      entity: "JOB",
      entityId: inserted.id,
      entityTitle: inserted.title,
      details: `Cloned from ${original.title} as draft`,
    })
    ;

  return mapJobRecordToPosting(inserted);
}

/**
 * Quick toggles status between OPEN and CLOSED (Draft)
 */
export async function toggleJobStatus(
  id: string,
  newStatus: JobStatus
): Promise<JobPosting | null> {
  const [updated] = await db
    .update(jobs)
    .set({ status: newStatus, updatedAt: new Date() })
    .where(eq(jobs.id, id))
    .returning();

  if (!updated) return null;

  await db
    .insert(auditLogs)
    .values({
      id: `act-${Date.now()}`,
      actor: getAuditActor(),
      action: newStatus === "OPEN" ? "PUBLISH" : "UNPUBLISH",
      entity: "JOB",
      entityId: updated.id,
      entityTitle: updated.title,
      details: `Changed publication status to ${newStatus}`,
    })
    ;

  return mapJobRecordToPosting(updated);
}

/**
 * Bulk updates status for multiple jobs
 */
export async function bulkUpdateJobsStatus(
  ids: string[],
  status: JobStatus
): Promise<number> {
  if (ids.length === 0) return 0;

  const updatedRows = await db
    .update(jobs)
    .set({ status, updatedAt: new Date() })
    .where(inArray(jobs.id, ids))
    .returning({ id: jobs.id });

  const updatedCount = updatedRows.length;

  if (updatedCount > 0) {
    await db
      .insert(auditLogs)
      .values({
        id: `act-${Date.now()}`,
        actor: getAuditActor(),
        action: "PUBLISH",
        entity: "JOB",
        entityTitle: `${updatedCount} Job Postings`,
        details: `Bulk status update to ${status}`,
      })
      ;
  }

  return updatedCount;
}

/**
 * Bulk deletes multiple jobs
 */
export async function bulkDeleteJobs(ids: string[]): Promise<number> {
  if (ids.length === 0) return 0;

  const deletedRows = await db
    .delete(jobs)
    .where(inArray(jobs.id, ids))
    .returning({ id: jobs.id });

  const deletedCount = deletedRows.length;

  if (deletedCount > 0) {
    await db
      .insert(auditLogs)
      .values({
        id: `act-${Date.now()}`,
        actor: getAuditActor(),
        action: "DELETE",
        entity: "JOB",
        entityTitle: `${deletedCount} Job Postings`,
        details: `Bulk deletion of ${deletedCount} records`,
      })
      ;
  }

  return deletedCount;
}

/**
 * Returns latest administrator activity audit logs from PostgreSQL
 */
export async function getAdminActivityLogs(limit: number = 10): Promise<AdminActivityLog[]> {
  try {
    const rows = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.timestamp))
      .limit(limit);

    if (rows.length > 0) {
      return rows.map((log) => ({
        id: log.id,
        action: log.action as AdminActivityLog["action"],
        entityTitle: log.entityTitle || log.entity,
        timestamp: log.timestamp instanceof Date ? log.timestamp.toISOString() : String(log.timestamp),
        adminUser: log.actor,
        details: log.details || "",
      }));
    }
  } catch (error) {
    handleDatabaseError("getAdminActivityLogs", error);
  }

  if (isProduction()) return [];

  return [
    {
      id: "act-1",
      action: "LOGIN",
      entityTitle: "Administrator Session Started",
      timestamp: "Just now",
      adminUser: "admin@nextvacancy.com",
      details: "Authenticated from recognized IP",
    },
  ];
}
