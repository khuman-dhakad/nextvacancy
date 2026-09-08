import { eq, or, and, ilike, desc, sql } from "drizzle-orm";
import { db, organizations, jobs, type Organization } from "@/lib/db";
import { handleDatabaseError, isProduction } from "@/lib/db/errors";
import { OrganizationProfile, JobPosting } from "@/types";
import { mapJobRecordToPosting } from "@/services/jobs/jobs.service";
import { MOCK_ORGANIZATION_PROFILES } from "./organization-profile.mock";

export { MOCK_ORGANIZATION_PROFILES };

export function mapOrgRecordToProfile(
  org: Organization,
  stats?: OrganizationProfile["stats"]
): OrganizationProfile {
  return {
    id: org.id,
    slug: org.slug,
    name: org.name,
    shortName: org.shortName,
    categoryType: org.categoryType || "Public Sector",
    headquarters: org.headquarters || "New Delhi, India",
    establishedYear: org.establishedYear || 1950,
    state: org.state || "All India",
    website: org.website || "https://gov.in",
    verified: org.verified,
    logoUrl: org.logoUrl || undefined,
    tagline: org.tagline || `${org.name} Recruitment & Career Portal.`,
    description: org.description || "",
    aboutDetails: org.aboutDetails || [],
    selectionProcess: org.selectionProcess || [],
    keyDepartments: org.keyDepartments || [],
    faqs: org.faqs || [],
    stats: stats || {
      activeVacanciesCount: 0,
      totalPostsCount: 0,
      admitCardsCount: 0,
      resultsCount: 0,
    },
  };
}

/**
 * Returns all organization profiles from PostgreSQL
 */
export async function getAllOrganizationProfiles(): Promise<OrganizationProfile[]> {
  try {
    const rows = await db
      .select()
      .from(organizations)
      .where(eq(organizations.isActive, true))
      .orderBy(desc(organizations.createdAt));

    if (rows.length > 0) {
      return rows.map((row) => mapOrgRecordToProfile(row));
    }
  } catch (error) {
    handleDatabaseError("getAllOrganizationProfiles", error);
  }

  if (isProduction()) return [];

  return MOCK_ORGANIZATION_PROFILES;
}

/**
 * Returns all organization slugs for dynamic route validation
 */
export async function getAllOrganizationSlugs(): Promise<string[]> {
  try {
    const rows = await db
      .select({ slug: organizations.slug })
      .from(organizations)
      .where(eq(organizations.isActive, true));

    if (rows.length > 0) {
      return rows.map((r) => r.slug);
    }
  } catch (error) {
    handleDatabaseError("getAllOrganizationSlugs", error);
  }

  if (isProduction()) return [];

  return MOCK_ORGANIZATION_PROFILES.map((org) => org.slug);
}

/**
 * Returns single organization profile by slug with real-time job counts from PostgreSQL
 */
export async function getOrganizationProfileBySlug(
  slug: string
): Promise<OrganizationProfile | null> {
  const clean = slug.toLowerCase().trim();

  try {
    const rows = await db
      .select()
      .from(organizations)
      .where(
        or(
          ilike(organizations.slug, clean),
          ilike(organizations.shortName, clean)
        )
      )
      .limit(1);

    if (rows.length > 0) {
      const org = rows[0];

      // Calculate live recruitment statistics from the jobs table
      const orgPattern = `%${org.shortName}%`;
      const orgNamePattern = `%${org.name}%`;

      const orgJobs = await db
        .select()
        .from(jobs)
        .where(
          or(
            ilike(jobs.organization, orgPattern),
            ilike(jobs.organization, orgNamePattern),
            ilike(jobs.title, orgPattern)
          )
        );

      const activeVacancies = orgJobs.filter(
        (j) => j.status === "OPEN" || j.status === "ENDING_SOON"
      ).length;
      const admitCards = orgJobs.filter(
        (j) => j.status === "ADMIT_CARD_OUT" || j.category === "admit-card"
      ).length;
      const results = orgJobs.filter(
        (j) => j.status === "RESULT_OUT" || j.category === "result"
      ).length;

      return mapOrgRecordToProfile(org, {
        activeVacanciesCount: activeVacancies,
        totalPostsCount: orgJobs.length,
        admitCardsCount: admitCards,
        resultsCount: results,
      });
    }
  } catch (error) {
    handleDatabaseError("getOrganizationProfileBySlug", error);
  }

  if (isProduction()) return null;

  const profile = MOCK_ORGANIZATION_PROFILES.find(
    (org) => org.slug.toLowerCase() === clean || org.shortName.toLowerCase() === clean
  );
  return profile || null;
}

/**
 * Returns all recruitment posts matching the organization name or acronym from PostgreSQL
 */
export async function getOrganizationJobs(
  orgSlugOrShortName: string
): Promise<JobPosting[]> {
  const clean = orgSlugOrShortName.toLowerCase().trim();

  try {
    const pattern = `%${clean}%`;
    const rows = await db
      .select()
      .from(jobs)
      .where(
        or(
          ilike(jobs.organization, pattern),
          ilike(jobs.title, pattern),
          ilike(jobs.shortSummary, pattern)
        )
      )
      .orderBy(desc(jobs.createdAt));

    if (rows.length > 0) {
      return rows.map(mapJobRecordToPosting);
    }
  } catch (error) {
    handleDatabaseError("getOrganizationJobs", error);
  }

  if (isProduction()) return [];

  const profile = MOCK_ORGANIZATION_PROFILES.find(
    (org) => org.slug.toLowerCase() === clean || org.shortName.toLowerCase() === clean
  );

  const mockJobs = await import("@/services/jobs/jobs.mock").then((m) => m.MOCK_JOB_POSTINGS);
  return mockJobs.filter((job) => {
    const orgField = job.organization.toLowerCase();
    const titleField = job.title.toLowerCase();

    if (profile) {
      if (orgField.includes(profile.shortName.toLowerCase())) return true;
      if (orgField.includes(profile.name.toLowerCase())) return true;
      if (titleField.includes(profile.shortName.toLowerCase())) return true;
    }

    return orgField.includes(clean) || titleField.includes(clean);
  });
}

/**
 * Returns related recruitment bodies in the same sector or type
 */
export async function getRelatedOrganizations(
  currentSlug: string,
  categoryType: string,
  limit: number = 3
): Promise<OrganizationProfile[]> {
  try {
    const rows = await db
      .select()
      .from(organizations)
      .where(
        and(
          sql`${organizations.slug} != ${currentSlug}`,
          eq(organizations.categoryType, categoryType),
          eq(organizations.isActive, true)
        )
      )
      .limit(limit);

    if (rows.length >= limit) {
      return rows.map((r) => mapOrgRecordToProfile(r));
    }

    // If fewer than limit, fetch other active organizations
    const otherRows = await db
      .select()
      .from(organizations)
      .where(
        and(
          sql`${organizations.slug} != ${currentSlug}`,
          eq(organizations.isActive, true)
        )
      )
      .limit(limit);

    return otherRows.map((r) => mapOrgRecordToProfile(r));
  } catch (error) {
    handleDatabaseError("getRelatedOrganizations", error);
  }

  if (isProduction()) return [];

  const related = MOCK_ORGANIZATION_PROFILES.filter(
    (org) => org.slug !== currentSlug && org.categoryType === categoryType
  );

  if (related.length >= limit) {
    return related.slice(0, limit);
  }

  const others = MOCK_ORGANIZATION_PROFILES.filter(
    (org) => org.slug !== currentSlug && org.categoryType !== categoryType
  );

  return [...related, ...others].slice(0, limit);
}
