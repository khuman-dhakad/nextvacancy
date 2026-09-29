import { eq, desc, asc, and, or, ilike, sql, count } from "drizzle-orm";
import { db, jobs, type Job } from "@/lib/db";
import { handleDatabaseError } from "@/lib/db/errors";
import {
  JobPosting,
  JobCategory,
  JobSearchParams,
  PaginatedResponse,
} from "@/types";

/**
 * Maps a Drizzle database Job record to the application's domain JobPosting interface
 */
export function mapJobRecordToPosting(job: Job): JobPosting {
  return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    shortSummary: job.shortSummary,
    organization: job.organization,
    organizationLogo: job.organizationLogo || undefined,
    department: job.department || undefined,
    category: job.category as JobCategory,
    status: job.status as JobPosting["status"],
    location: job.location,
    totalVacancies: job.totalVacancies,
    salaryOrStipend: job.salaryOrStipend,
    jobType: job.jobType || undefined,
    applicationMode: job.applicationMode || undefined,
    qualificationSummary: job.qualificationSummary,
    qualificationsList: job.qualificationsList || undefined,
    importantDates: job.importantDates,
    feeStructure: job.feeStructure || undefined,
    ageLimit: job.ageLimit || undefined,
    vacancyBreakdown: job.vacancyBreakdown || undefined,
    selectionProcess: job.selectionProcess || undefined,
    howToApplySteps: job.howToApplySteps || undefined,
    requiredDocuments: job.requiredDocuments || undefined,
    importantLinks: job.importantLinks,
    faqs: job.faqs || undefined,
    viewsCount: job.viewsCount,
    isFeatured: job.isFeatured,
    isTrending: job.isTrending,
    isVerified: job.isVerified,
    createdAt: job.createdAt instanceof Date ? job.createdAt.toISOString() : String(job.createdAt),
    updatedAt: job.updatedAt instanceof Date ? job.updatedAt.toISOString() : String(job.updatedAt),
  };
}

export async function getLatestJobs(limit: number = 8): Promise<JobPosting[]> {
  try {
    const rows = await db
      .select()
      .from(jobs)
      .where(or(eq(jobs.status, "OPEN"), eq(jobs.status, "ENDING_SOON")))
      .orderBy(desc(jobs.createdAt))
      .limit(limit);
    return rows.map(mapJobRecordToPosting);
  } catch (error) {
    handleDatabaseError("getLatestJobs", error);
    throw error;
  }
}

export async function getEndingSoonJobs(limit: number = 4): Promise<JobPosting[]> {
  try {
    const rows = await db
      .select()
      .from(jobs)
      .where(eq(jobs.status, "ENDING_SOON"))
      .orderBy(asc(sql`(${jobs.importantDates}->>'applicationEndDate')`))
      .limit(limit);
    return rows.map(mapJobRecordToPosting);
  } catch (error) {
    handleDatabaseError("getEndingSoonJobs", error);
    throw error;
  }
}

export async function getFeaturedJobs(limit: number = 4): Promise<JobPosting[]> {
  try {
    const rows = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.isFeatured, true), or(eq(jobs.status, "OPEN"), eq(jobs.status, "ENDING_SOON"))))
      .orderBy(desc(jobs.createdAt))
      .limit(limit);
    return rows.map(mapJobRecordToPosting);
  } catch (error) {
    handleDatabaseError("getFeaturedJobs", error);
    throw error;
  }
}

export async function getTrendingJobs(limit: number = 6): Promise<JobPosting[]> {
  try {
    const rows = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.isTrending, true), or(eq(jobs.status, "OPEN"), eq(jobs.status, "ENDING_SOON"))))
      .orderBy(desc(jobs.viewsCount), desc(jobs.createdAt))
      .limit(limit);
    return rows.map(mapJobRecordToPosting);
  } catch (error) {
    handleDatabaseError("getTrendingJobs", error);
    throw error;
  }
}

export async function getJobsByCategory(
  category: JobCategory,
  limit: number = 6
): Promise<JobPosting[]> {
  try {
    const rows = await db
      .select()
      .from(jobs)
      .where(eq(jobs.category, category))
      .orderBy(desc(jobs.createdAt))
      .limit(limit);
    return rows.map(mapJobRecordToPosting);
  } catch (error) {
    handleDatabaseError("getJobsByCategory", error);
    throw error;
  }
}

export async function getJobBySlug(slug: string): Promise<JobPosting | null> {
  const cleanSlug = slug.toLowerCase().trim();
  try {
    const rows = await db
      .select()
      .from(jobs)
      .where(eq(jobs.slug, cleanSlug))
      .limit(1);

    return rows.length > 0 ? mapJobRecordToPosting(rows[0]) : null;
  } catch (error) {
    handleDatabaseError("getJobBySlug", error);
    throw error;
  }
}

export async function getRelatedJobs(
  category: JobCategory,
  currentSlug: string,
  limit: number = 4
): Promise<JobPosting[]> {
  try {
    const rows = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.category, category), sql`${jobs.slug} != ${currentSlug}`))
      .orderBy(desc(jobs.createdAt))
      .limit(limit);
    return rows.map(mapJobRecordToPosting);
  } catch (error) {
    handleDatabaseError("getRelatedJobs", error);
    throw error;
  }
}

export async function searchJobs(
  params: JobSearchParams
): Promise<PaginatedResponse<JobPosting>> {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.limit || 8);
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
          ilike(jobs.shortSummary, q),
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

    // 4. Qualification Filter
    if (params.qualification && params.qualification !== "all") {
      const qualPattern = `%${params.qualification}%`;
      conditions.push(ilike(jobs.qualificationSummary, qualPattern));
    }

    // 5. Location Filter
    if (params.location && params.location !== "all") {
      const locPattern = `%${params.location}%`;
      conditions.push(ilike(jobs.location, locPattern));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Sorting
    const sortBy = params.sortBy || "latest";
    const isAsc = params.sortOrder === "asc";

    let orderExpr;
    if (sortBy === "deadline" || sortBy === "applicationEndDate") {
      orderExpr = isAsc
        ? asc(sql`(${jobs.importantDates}->>'applicationEndDate')`)
        : desc(sql`(${jobs.importantDates}->>'applicationEndDate')`);
    } else if (sortBy === "views" || sortBy === "viewsCount") {
      orderExpr = isAsc ? asc(jobs.viewsCount) : desc(jobs.viewsCount);
    } else if (sortBy === "alphabetical") {
      orderExpr = isAsc ? asc(jobs.title) : desc(jobs.title);
    } else {
      orderExpr = isAsc ? asc(jobs.createdAt) : desc(jobs.createdAt);
    }

    // Run count and query in parallel
    const [countResult, rows] = await Promise.all([
      db
        .select({ total: count() })
        .from(jobs)
        .where(whereClause),
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

    return {
      items: rows.map(mapJobRecordToPosting),
      total,
      page,
      pageSize,
      totalPages,
    };
  } catch (error) {
    handleDatabaseError("searchJobs", error);
    throw error;
  }
}
