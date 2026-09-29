import { count } from "drizzle-orm";
import { db, categories, jobs, organizations, sessions, users, pool } from "../lib/db";
import { searchJobs, getJobBySlug } from "../services/jobs/jobs.service";
import { getAllCategories } from "../services/categories/categories.service";
import { getAllOrganizationSlugs } from "../services/organization/organization-profile.service";

async function main() {
  const [categoryCount, jobCount, organizationCount, userCount, sessionCount] = await Promise.all([
    db.select({ count: count() }).from(categories),
    db.select({ count: count() }).from(jobs),
    db.select({ count: count() }).from(organizations),
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(sessions),
  ]);
  const search = await searchJobs({ page: 1, limit: 2 });
  const firstJob = search.items[0];
  const detail = firstJob ? await getJobBySlug(firstJob.slug) : null;
  const categoryList = await getAllCategories();
  const organizationSlugs = await getAllOrganizationSlugs();

  if (!firstJob || !detail || categoryList.length === 0 || organizationSlugs.length === 0) {
    throw new Error("Database-backed service verification returned incomplete data");
  }

  console.log(JSON.stringify({
    database: "connected",
    counts: {
      categories: categoryCount[0].count,
      jobs: jobCount[0].count,
      organizations: organizationCount[0].count,
      users: userCount[0].count,
      sessions: sessionCount[0].count,
    },
    search: { total: search.total, pageSize: search.pageSize, returned: search.items.length },
    detail: "resolved",
    categories: categoryList.length,
    organizations: organizationSlugs.length,
  }));
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : "Database verification failed");
    process.exitCode = 1;
  })
  .finally(() => pool.end());