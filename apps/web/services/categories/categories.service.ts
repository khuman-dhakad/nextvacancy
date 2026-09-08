import { eq, desc } from "drizzle-orm";
import { db, categories } from "@/lib/db";
import { handleDatabaseError, isProduction } from "@/lib/db/errors";
import { CategoryMaster } from "@/types";
import { mapCategoryRecord } from "@/services/admin/admin-master-data.service";

export const FALLBACK_CATEGORIES: CategoryMaster[] = [
  {
    id: "cat-1",
    name: "Government Jobs",
    slug: "government",
    description: "Central, State, PSU, and Autonomous bodies public sector recruitment circulars.",
    icon: "Building2",
    isActive: true,
    isFeatured: true,
    jobCount: 14582,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "cat-2",
    name: "Private & IT Jobs",
    slug: "private",
    description: "Verified corporate vacancies across software engineering, analytics, fintech, and operations.",
    icon: "TrendingUp",
    isActive: true,
    isFeatured: true,
    jobCount: 4500,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "cat-3",
    name: "Admit Cards & Hall Tickets",
    slug: "admit-card",
    description: "Download official commission call letters, exam city intimations, and hall tickets.",
    icon: "FileCheck",
    isActive: true,
    isFeatured: true,
    jobCount: 320,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "cat-4",
    name: "Exam Results & Merit Lists",
    slug: "result",
    description: "Check final selection scorecards, cut-off marks, and provisional merit rankings.",
    icon: "Award",
    isActive: true,
    isFeatured: true,
    jobCount: 415,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "cat-5",
    name: "Official Answer Keys",
    slug: "answer-key",
    description: "Provisional and final answer key PDFs with objection raising window trackers.",
    icon: "Key",
    isActive: true,
    isFeatured: true,
    jobCount: 180,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "cat-6",
    name: "National Scholarships",
    slug: "scholarship",
    description: "Ministry-sponsored higher education grants, post-matric fellowships, and merit assistance programs.",
    icon: "GraduationCap",
    isActive: true,
    isFeatured: true,
    jobCount: 95,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "cat-7",
    name: "Internships & Schemes",
    slug: "internship",
    description: "Prime Minister Internship Scheme, NATS, and PSU trade apprenticeship circulars.",
    icon: "Sparkles",
    isActive: true,
    isFeatured: false,
    jobCount: 120,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "cat-8",
    name: "Trade Apprenticeships",
    slug: "apprenticeship",
    description: "ITI and Diploma trade apprenticeships across Indian Railways, DRDO, ISRO, and PSUs.",
    icon: "Users",
    isActive: true,
    isFeatured: false,
    jobCount: 65,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

/**
 * Returns all active categories from PostgreSQL
 */
export async function getAllCategories(): Promise<CategoryMaster[]> {
  try {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(desc(categories.createdAt));

    if (rows.length > 0) {
      return rows.map(mapCategoryRecord);
    }
  } catch (error) {
    handleDatabaseError("getAllCategories", error);
  }

  if (isProduction()) return [];

  return FALLBACK_CATEGORIES;
}

/**
 * Returns featured categories for homepage navigation chips from PostgreSQL
 */
export async function getFeaturedCategories(): Promise<CategoryMaster[]> {
  try {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.isFeatured, true))
      .orderBy(desc(categories.jobCount));

    if (rows.length > 0) {
      return rows.map(mapCategoryRecord);
    }
  } catch (error) {
    handleDatabaseError("getFeaturedCategories", error);
  }

  if (isProduction()) return [];

  return FALLBACK_CATEGORIES.filter((c) => c.isFeatured);
}

/**
 * Returns a category by slug from PostgreSQL
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryMaster | null> {
  const clean = slug.toLowerCase().trim();
  try {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, clean))
      .limit(1);

    if (rows.length > 0) {
      return mapCategoryRecord(rows[0]);
    }
  } catch (error) {
    handleDatabaseError("getCategoryBySlug", error);
  }

  if (isProduction()) return null;

  const found = FALLBACK_CATEGORIES.find((c) => c.slug === clean);
  return found || null;
}
