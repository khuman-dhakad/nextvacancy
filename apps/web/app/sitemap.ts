import { MetadataRoute } from "next";
import { searchJobs } from "@/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nextvacancy.com";
  const generatedAt = new Date("2026-01-01T00:00:00.000Z");

  // Static core routes
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
      url: `${siteUrl}/category/scholarship`,
      lastModified: generatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/category/internship`,
      lastModified: generatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/category/answer-key`,
      lastModified: generatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/category/apprenticeship`,
      lastModified: generatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Dynamic job detail routes from service layer
  const { items: allJobs } = await searchJobs({ limit: 1000 });

  const dynamicJobRoutes: MetadataRoute.Sitemap = allJobs.map((job) => ({
    url: `${siteUrl}/jobs/${job.slug}`,
    lastModified: new Date(job.updatedAt || job.createdAt || generatedAt),
    changeFrequency: job.status === "ENDING_SOON" ? "hourly" : "daily",
    priority: job.isFeatured ? 0.9 : 0.8,
  }));

  return [...staticRoutes, ...dynamicJobRoutes];
}
