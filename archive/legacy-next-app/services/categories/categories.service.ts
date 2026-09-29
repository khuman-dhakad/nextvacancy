import { desc, eq } from "drizzle-orm";
import { db, categories } from "@/lib/db";
import { handleDatabaseError } from "@/lib/db/errors";
import { CategoryMaster } from "@/types";
import { mapCategoryRecord } from "@/services/admin/admin-master-data.service";

export async function getAllCategories(): Promise<CategoryMaster[]> {
  try {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(desc(categories.createdAt));
    return rows.map(mapCategoryRecord);
  } catch (error) {
    handleDatabaseError("getAllCategories", error);
    throw error;
  }
}

export async function getFeaturedCategories(): Promise<CategoryMaster[]> {
  try {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.isFeatured, true))
      .orderBy(desc(categories.jobCount));
    return rows.map(mapCategoryRecord);
  } catch (error) {
    handleDatabaseError("getFeaturedCategories", error);
    throw error;
  }
}

export async function getCategoryBySlug(slug: string): Promise<CategoryMaster | null> {
  const clean = slug.toLowerCase().trim();
  try {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, clean))
      .limit(1);
    return rows.length ? mapCategoryRecord(rows[0]) : null;
  } catch (error) {
    handleDatabaseError("getCategoryBySlug", error);
    throw error;
  }
}
