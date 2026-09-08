import { eq, desc, asc, and, or, ilike, inArray, count } from "drizzle-orm";
import { db, categories, organizations, type Category, type Organization } from "@/lib/db";
import { handleDatabaseError } from "@/lib/db/errors";
import {
  CategoryMaster,
  OrganizationMaster,
  CategorySearchParams,
  OrganizationSearchParams,
  PaginatedResponse,
} from "@/types";

export function mapCategoryRecord(cat: Category): CategoryMaster {
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || "",
    icon: cat.icon || undefined,
    isActive: cat.isActive,
    isFeatured: cat.isFeatured,
    jobCount: cat.jobCount,
    createdAt: cat.createdAt instanceof Date ? cat.createdAt.toISOString() : String(cat.createdAt),
    updatedAt: cat.updatedAt instanceof Date ? cat.updatedAt.toISOString() : String(cat.updatedAt),
  };
}

export function mapOrganizationRecord(org: Organization): OrganizationMaster {
  return {
    id: org.id,
    name: org.name,
    shortName: org.shortName,
    slug: org.slug,
    logoUrl: org.logoUrl || undefined,
    website: org.website || "",
    description: org.description || "",
    state: org.state || "",
    categoryType: org.categoryType || "",
    isActive: org.isActive,
    jobCount: org.jobCount,
    createdAt: org.createdAt instanceof Date ? org.createdAt.toISOString() : String(org.createdAt),
    updatedAt: org.updatedAt instanceof Date ? org.updatedAt.toISOString() : String(org.updatedAt),
  };
}

export function generateUniqueSlug(text: string, existingSlugs: string[] = []): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!existingSlugs.includes(base)) {
    return base;
  }

  let counter = 2;
  while (existingSlugs.includes(`${base}-${counter}`)) {
    counter++;
  }
  return `${base}-${counter}`;
}

// ----------------------------------------------------
// Category Master Services (PostgreSQL)
// ----------------------------------------------------

export async function getAdminCategories(
  params: CategorySearchParams = {}
): Promise<PaginatedResponse<CategoryMaster>> {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.limit || 10);
  const offset = (page - 1) * pageSize;

  try {
    const conditions = [];

    if (params.query && params.query.trim()) {
      const q = `%${params.query.trim()}%`;
      conditions.push(
        or(
          ilike(categories.name, q),
          ilike(categories.slug, q),
          ilike(categories.description, q)
        )
      );
    }

    if (params.status && params.status !== "all") {
      conditions.push(eq(categories.isActive, params.status === "active"));
    }

    if (params.featured && params.featured !== "all") {
      conditions.push(eq(categories.isFeatured, params.featured === "featured"));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const sortBy = params.sortBy || "latest";
    const isAsc = params.sortOrder === "asc";

    let orderExpr;
    if (sortBy === "name") {
      orderExpr = isAsc ? asc(categories.name) : desc(categories.name);
    } else if (sortBy === "jobs") {
      orderExpr = isAsc ? asc(categories.jobCount) : desc(categories.jobCount);
    } else if (sortBy === "createdAt") {
      orderExpr = isAsc ? asc(categories.createdAt) : desc(categories.createdAt);
    } else {
      orderExpr = isAsc ? asc(categories.updatedAt) : desc(categories.updatedAt);
    }

    const [countResult, rows] = await Promise.all([
      db.select({ total: count() }).from(categories).where(whereClause),
      db
        .select()
        .from(categories)
        .where(whereClause)
        .orderBy(orderExpr)
        .limit(pageSize)
        .offset(offset),
    ]);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / pageSize) || 1;

    return {
      items: rows.map(mapCategoryRecord),
      total,
      page,
      pageSize,
      totalPages,
    };
  } catch (error) {
    handleDatabaseError("getAdminCategories", error);
    return { items: [], total: 0, page, pageSize, totalPages: 1 };
  }
}

export async function getCategoryById(id: string): Promise<CategoryMaster | null> {
  try {
    const rows = await db
      .select()
      .from(categories)
      .where(or(eq(categories.id, id), eq(categories.slug, id)))
      .limit(1);

    if (rows.length > 0) {
      return mapCategoryRecord(rows[0]);
    }
  } catch (error) {
    handleDatabaseError("getCategoryById", error);
  }
  return null;
}

export async function createCategory(
  data: Partial<CategoryMaster>
): Promise<CategoryMaster> {
  const allCats = await db.select({ slug: categories.slug }).from(categories);
  const existingSlugs = allCats.map((c) => c.slug);
  const slug =
    data.slug?.trim() || generateUniqueSlug(data.name || "new-category", existingSlugs);
  const now = new Date();

  const [inserted] = await db
    .insert(categories)
    .values({
      id: `cat-${Date.now()}`,
      name: data.name?.trim() || "Untitled Category",
      slug,
      description: data.description?.trim() || "",
      icon: data.icon || "Briefcase",
      isActive: data.isActive !== undefined ? data.isActive : true,
      isFeatured: data.isFeatured !== undefined ? data.isFeatured : false,
      jobCount: 0,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return mapCategoryRecord(inserted);
}

export async function updateCategory(
  id: string,
  updates: Partial<CategoryMaster>
): Promise<CategoryMaster | null> {
  const updateValues: Partial<typeof categories.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (updates.name !== undefined) updateValues.name = updates.name.trim();
  if (updates.slug !== undefined) updateValues.slug = updates.slug.trim();
  if (updates.description !== undefined) updateValues.description = updates.description.trim();
  if (updates.icon !== undefined) updateValues.icon = updates.icon;
  if (updates.isActive !== undefined) updateValues.isActive = updates.isActive;
  if (updates.isFeatured !== undefined) updateValues.isFeatured = updates.isFeatured;

  const [updated] = await db
    .update(categories)
    .set(updateValues)
    .where(eq(categories.id, id))
    .returning();

  return updated ? mapCategoryRecord(updated) : null;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const [deleted] = await db
    .delete(categories)
    .where(eq(categories.id, id))
    .returning({ id: categories.id });

  return Boolean(deleted);
}

export async function toggleCategoryActive(id: string): Promise<CategoryMaster | null> {
  const current = await getCategoryById(id);
  if (!current) return null;

  const [updated] = await db
    .update(categories)
    .set({ isActive: !current.isActive, updatedAt: new Date() })
    .where(eq(categories.id, id))
    .returning();

  return updated ? mapCategoryRecord(updated) : null;
}

export async function toggleCategoryFeatured(id: string): Promise<CategoryMaster | null> {
  const current = await getCategoryById(id);
  if (!current) return null;

  const [updated] = await db
    .update(categories)
    .set({ isFeatured: !current.isFeatured, updatedAt: new Date() })
    .where(eq(categories.id, id))
    .returning();

  return updated ? mapCategoryRecord(updated) : null;
}

export async function bulkUpdateCategoryStatus(ids: string[], isActive: boolean): Promise<number> {
  if (ids.length === 0) return 0;
  const updatedRows = await db
    .update(categories)
    .set({ isActive, updatedAt: new Date() })
    .where(inArray(categories.id, ids))
    .returning({ id: categories.id });
  return updatedRows.length;
}

export async function bulkDeleteCategories(ids: string[]): Promise<number> {
  if (ids.length === 0) return 0;
  const deletedRows = await db
    .delete(categories)
    .where(inArray(categories.id, ids))
    .returning({ id: categories.id });
  return deletedRows.length;
}

// ----------------------------------------------------
// Organization Master Services (PostgreSQL)
// ----------------------------------------------------

export async function getAdminOrganizations(
  params: OrganizationSearchParams = {}
): Promise<PaginatedResponse<OrganizationMaster>> {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.limit || 10);
  const offset = (page - 1) * pageSize;

  try {
    const conditions = [];

    if (params.query && params.query.trim()) {
      const q = `%${params.query.trim()}%`;
      conditions.push(
        or(
          ilike(organizations.name, q),
          ilike(organizations.shortName, q),
          ilike(organizations.slug, q),
          ilike(organizations.state, q),
          ilike(organizations.description, q)
        )
      );
    }

    if (params.state && params.state !== "all") {
      conditions.push(ilike(organizations.state, `%${params.state}%`));
    }

    if (params.categoryType && params.categoryType !== "all") {
      conditions.push(eq(organizations.categoryType, params.categoryType));
    }

    if (params.status && params.status !== "all") {
      conditions.push(eq(organizations.isActive, params.status === "active"));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const sortBy = params.sortBy || "latest";
    const isAsc = params.sortOrder === "asc";

    let orderExpr;
    if (sortBy === "name") {
      orderExpr = isAsc ? asc(organizations.name) : desc(organizations.name);
    } else if (sortBy === "shortName") {
      orderExpr = isAsc ? asc(organizations.shortName) : desc(organizations.shortName);
    } else if (sortBy === "jobs") {
      orderExpr = isAsc ? asc(organizations.jobCount) : desc(organizations.jobCount);
    } else if (sortBy === "createdAt") {
      orderExpr = isAsc ? asc(organizations.createdAt) : desc(organizations.createdAt);
    } else {
      orderExpr = isAsc ? asc(organizations.updatedAt) : desc(organizations.updatedAt);
    }

    const [countResult, rows] = await Promise.all([
      db.select({ total: count() }).from(organizations).where(whereClause),
      db
        .select()
        .from(organizations)
        .where(whereClause)
        .orderBy(orderExpr)
        .limit(pageSize)
        .offset(offset),
    ]);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / pageSize) || 1;

    return {
      items: rows.map(mapOrganizationRecord),
      total,
      page,
      pageSize,
      totalPages,
    };
  } catch (error) {
    handleDatabaseError("getAdminOrganizations", error);
    return { items: [], total: 0, page, pageSize, totalPages: 1 };
  }
}

export async function getOrganizationById(id: string): Promise<OrganizationMaster | null> {
  try {
    const rows = await db
      .select()
      .from(organizations)
      .where(or(eq(organizations.id, id), eq(organizations.slug, id)))
      .limit(1);

    if (rows.length > 0) {
      return mapOrganizationRecord(rows[0]);
    }
  } catch (error) {
    handleDatabaseError("getOrganizationById", error);
  }
  return null;
}

export async function createOrganization(
  data: Partial<OrganizationMaster>
): Promise<OrganizationMaster> {
  const allOrgs = await db.select({ slug: organizations.slug }).from(organizations);
  const existingSlugs = allOrgs.map((o) => o.slug);
  const slug =
    data.slug?.trim() || generateUniqueSlug(data.name || "new-org", existingSlugs);
  const now = new Date();

  const [inserted] = await db
    .insert(organizations)
    .values({
      id: `org-${Date.now()}`,
      name: data.name?.trim() || "Untitled Organization",
      shortName:
        data.shortName?.trim() || (data.name?.slice(0, 5).toUpperCase() || "ORG"),
      slug,
      website: data.website?.trim() || "https://gov.in",
      description: data.description?.trim() || "",
      state: data.state?.trim() || "Central / New Delhi",
      categoryType: data.categoryType || "Central Commission",
      logoUrl: data.logoUrl || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
      jobCount: 0,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return mapOrganizationRecord(inserted);
}

export async function updateOrganization(
  id: string,
  updates: Partial<OrganizationMaster>
): Promise<OrganizationMaster | null> {
  const updateValues: Partial<typeof organizations.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (updates.name !== undefined) updateValues.name = updates.name.trim();
  if (updates.shortName !== undefined) updateValues.shortName = updates.shortName.trim();
  if (updates.slug !== undefined) updateValues.slug = updates.slug.trim();
  if (updates.website !== undefined) updateValues.website = updates.website.trim();
  if (updates.description !== undefined) updateValues.description = updates.description.trim();
  if (updates.state !== undefined) updateValues.state = updates.state.trim();
  if (updates.categoryType !== undefined) updateValues.categoryType = updates.categoryType;
  if (updates.logoUrl !== undefined) updateValues.logoUrl = updates.logoUrl;
  if (updates.isActive !== undefined) updateValues.isActive = updates.isActive;

  const [updated] = await db
    .update(organizations)
    .set(updateValues)
    .where(eq(organizations.id, id))
    .returning();

  return updated ? mapOrganizationRecord(updated) : null;
}

export async function deleteOrganization(id: string): Promise<boolean> {
  const [deleted] = await db
    .delete(organizations)
    .where(eq(organizations.id, id))
    .returning({ id: organizations.id });

  return Boolean(deleted);
}

export async function toggleOrganizationActive(id: string): Promise<OrganizationMaster | null> {
  const current = await getOrganizationById(id);
  if (!current) return null;

  const [updated] = await db
    .update(organizations)
    .set({ isActive: !current.isActive, updatedAt: new Date() })
    .where(eq(organizations.id, id))
    .returning();

  return updated ? mapOrganizationRecord(updated) : null;
}

export async function bulkUpdateOrganizationStatus(
  ids: string[],
  isActive: boolean
): Promise<number> {
  if (ids.length === 0) return 0;
  const updatedRows = await db
    .update(organizations)
    .set({ isActive, updatedAt: new Date() })
    .where(inArray(organizations.id, ids))
    .returning({ id: organizations.id });
  return updatedRows.length;
}

export async function bulkDeleteOrganizations(ids: string[]): Promise<number> {
  if (ids.length === 0) return 0;
  const deletedRows = await db
    .delete(organizations)
    .where(inArray(organizations.id, ids))
    .returning({ id: organizations.id });
  return deletedRows.length;
}
