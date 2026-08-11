import { JobPosting, JobCategory, JobSearchParams, PaginatedResponse } from "@/types";
import { MOCK_JOB_POSTINGS } from "./jobs.mock";

/**
 * NEXTVACANCY Job Service Layer
 * Clean async service boundary designed to switch from local mock dataset
 * to backend Spring Boot REST API (`fetch(`${process.env.API_BASE_URL}/api/v1/jobs`)...`)
 */

export async function getLatestJobs(limit: number = 8): Promise<JobPosting[]> {
  // In production with Spring Boot: fetch from API endpoint
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

export async function searchJobs(
  params: JobSearchParams
): Promise<PaginatedResponse<JobPosting>> {
  let results = [...MOCK_JOB_POSTINGS];

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

  if (params.category && params.category !== "all") {
    results = results.filter((job) => job.category === params.category);
  }

  if (params.status) {
    results = results.filter((job) => job.status === params.status);
  }

  const page = params.page || 1;
  const pageSize = params.limit || 10;
  const total = results.length;
  const totalPages = Math.ceil(total / pageSize);
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
