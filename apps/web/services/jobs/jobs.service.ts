import {
  JobPosting,
  JobCategory,
  JobSearchParams,
  PaginatedResponse,
} from "@/types";
import { MOCK_JOB_POSTINGS } from "./jobs.mock";

/**
 * NEXTVACANCY Job Service Layer
 * Clean async service boundary designed to switch from local mock dataset
 * to backend Spring Boot REST API (`fetch(`${process.env.API_BASE_URL}/api/v1/jobs`)...`)
 */

export async function getLatestJobs(limit: number = 8): Promise<JobPosting[]> {
  const sorted = [...MOCK_JOB_POSTINGS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return sorted.slice(0, limit);
}

export async function getEndingSoonJobs(limit: number = 4): Promise<JobPosting[]> {
  const endingSoon = MOCK_JOB_POSTINGS.filter(
    (job) => job.status === "ENDING_SOON"
  );
  return endingSoon.slice(0, limit);
}

export async function getFeaturedJobs(limit: number = 4): Promise<JobPosting[]> {
  const featured = MOCK_JOB_POSTINGS.filter((job) => job.isFeatured);
  return featured.slice(0, limit);
}

export async function getTrendingJobs(limit: number = 6): Promise<JobPosting[]> {
  const trending = MOCK_JOB_POSTINGS.filter((job) => job.isTrending);
  return trending.slice(0, limit);
}

export async function getJobsByCategory(
  category: JobCategory,
  limit: number = 6
): Promise<JobPosting[]> {
  const filtered = MOCK_JOB_POSTINGS.filter((job) => job.category === category);
  return filtered.slice(0, limit);
}

export async function getJobBySlug(slug: string): Promise<JobPosting | null> {
  const job = MOCK_JOB_POSTINGS.find((item) => item.slug === slug);
  return job || null;
}

export async function getRelatedJobs(
  category: JobCategory,
  currentSlug: string,
  limit: number = 4
): Promise<JobPosting[]> {
  const sameCategory = MOCK_JOB_POSTINGS.filter(
    (job) => job.category === category && job.slug !== currentSlug
  );
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }
  const remaining = MOCK_JOB_POSTINGS.filter(
    (job) => job.slug !== currentSlug && !sameCategory.some((j) => j.id === job.id)
  );
  return [...sameCategory, ...remaining].slice(0, limit);
}

export async function searchJobs(
  params: JobSearchParams
): Promise<PaginatedResponse<JobPosting>> {
  let results = [...MOCK_JOB_POSTINGS];

  // 1. Text Search Query
  if (params.query) {
    const q = params.query.toLowerCase().trim();
    results = results.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.organization.toLowerCase().includes(q) ||
        job.shortSummary.toLowerCase().includes(q) ||
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

  // 4. Qualification Filter
  if (params.qualification && params.qualification !== "all") {
    const qual = params.qualification.toLowerCase();
    results = results.filter((job) => {
      const qSummary = job.qualificationSummary.toLowerCase();
      if (qual === "10th" || qual === "matric") {
        return qSummary.includes("10th") || qSummary.includes("matric");
      }
      if (qual === "12th" || qual === "inter" || qual === "10+2") {
        return (
          qSummary.includes("12th") ||
          qSummary.includes("10+2") ||
          qSummary.includes("intermediate") ||
          qSummary.includes("senior secondary")
        );
      }
      if (qual === "graduate" || qual === "degree") {
        return (
          qSummary.includes("graduate") ||
          qSummary.includes("degree") ||
          qSummary.includes("bachelor") ||
          qSummary.includes("b.tech") ||
          qSummary.includes("b.e") ||
          qSummary.includes("b.sc") ||
          qSummary.includes("b.com") ||
          qSummary.includes("ba")
        );
      }
      if (qual === "diploma" || qual === "polytechnic") {
        return qSummary.includes("diploma") || qSummary.includes("polytechnic");
      }
      if (qual === "iti") {
        return qSummary.includes("iti");
      }
      if (qual === "post-graduate" || qual === "master") {
        return (
          qSummary.includes("master") ||
          qSummary.includes("post-graduate") ||
          qSummary.includes("m.tech") ||
          qSummary.includes("mca") ||
          qSummary.includes("m.sc")
        );
      }
      return qSummary.includes(qual);
    });
  }

  // 5. Location Filter
  if (params.location && params.location !== "all") {
    const loc = params.location.toLowerCase();
    results = results.filter((job) => {
      const jLoc = job.location.toLowerCase();
      if (loc === "all india") {
        return jLoc.includes("all india") || jLoc.includes("pan india");
      }
      return jLoc.includes(loc);
    });
  }

  // 6. Sorting
  const sortBy = params.sortBy || "latest";
  const isAsc = params.sortOrder === "asc";

  results.sort((a, b) => {
    if (sortBy === "deadline" || sortBy === "applicationEndDate") {
      const dateA = a.importantDates.applicationEndDate || "9999-12-31";
      const dateB = b.importantDates.applicationEndDate || "9999-12-31";
      return isAsc
        ? dateA.localeCompare(dateB)
        : dateB.localeCompare(dateA);
    }

    if (sortBy === "views" || sortBy === "viewsCount") {
      return isAsc ? a.viewsCount - b.viewsCount : b.viewsCount - a.viewsCount;
    }

    if (sortBy === "alphabetical") {
      return isAsc
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }

    // Default: latest / createdAt
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return isAsc ? timeA - timeB : timeB - timeA;
  });

  // 7. Pagination
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.limit || 8);
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
