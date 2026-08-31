import { MetadataRoute } from "next";
import { searchJobs, getAllCategories, getAllOrganizationSlugs } from "@/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nextvacancy.com";
  const generatedAt = new Date("2026-01-01T00:00:00.000Z");

  // 1. Static core authority routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: generatedAt,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/government-jobs`,
      lastModified: generatedAt,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/private-jobs`,
      lastModified: generatedAt,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/admit-cards`,
      lastModified: generatedAt,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/results`,
      lastModified: generatedAt,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/search`,
      lastModified: generatedAt,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/organizations`,
      lastModified: generatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: generatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: generatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: generatedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: generatedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/disclaimer`,
      lastModified: generatedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // 2. Dynamic Categories from database
  const categoriesList = await getAllCategories();
  const dynamicCategoryRoutes: MetadataRoute.Sitemap = categoriesList.map((cat) => ({
    url: `${siteUrl}/category/${cat.slug}`,
    lastModified: new Date(cat.updatedAt || generatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // 3. Dynamic Organizations from database
  const orgSlugs = await getAllOrganizationSlugs();
  const dynamicOrgRoutes: MetadataRoute.Sitemap = orgSlugs.map((slug) => ({
    url: `${siteUrl}/organizations/${slug}`,
    lastModified: generatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // 4. Dynamic job detail routes from database
  const { items: allJobs } = await searchJobs({ limit: 1000 });
  const dynamicJobRoutes: MetadataRoute.Sitemap = allJobs.map((job) => ({
    url: `${siteUrl}/jobs/${job.slug}`,
    lastModified: new Date(job.updatedAt || job.createdAt || generatedAt),
    changeFrequency: job.status === "ENDING_SOON" ? "hourly" : "daily",
    priority: job.isFeatured ? 0.9 : 0.8,
  }));

  return [
    ...staticRoutes,
    ...dynamicCategoryRoutes,
    ...dynamicOrgRoutes,
    ...dynamicJobRoutes,
  ];
}
