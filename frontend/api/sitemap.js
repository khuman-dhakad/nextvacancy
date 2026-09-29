import { parseApiBaseUrl } from "../src/apiConfiguration.js";

const siteOrigin = "https://nextvacancy.com";
const staticPaths = [
  "/",
  "/government-jobs",
  "/private-jobs",
  "/admit-cards",
  "/results",
  "/search",
  "/organizations",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/disclaimer",
];
const staticMetadata = {
  "/": { changeFrequency: "daily", priority: 1.0 },
  "/government-jobs": { changeFrequency: "daily", priority: 0.9 },
  "/private-jobs": { changeFrequency: "daily", priority: 0.9 },
  "/admit-cards": { changeFrequency: "daily", priority: 0.9 },
  "/results": { changeFrequency: "daily", priority: 0.9 },
  "/search": { changeFrequency: "daily", priority: 0.8 },
  "/organizations": { changeFrequency: "weekly", priority: 0.8 },
  "/about": { changeFrequency: "monthly", priority: 0.6 },
  "/contact": { changeFrequency: "monthly", priority: 0.6 },
  "/privacy-policy": { changeFrequency: "monthly", priority: 0.5 },
  "/terms": { changeFrequency: "monthly", priority: 0.5 },
  "/disclaimer": { changeFrequency: "monthly", priority: 0.5 },
};

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function sitemapUrl(path) {
  return new URL(path, siteOrigin).toString();
}

function validLastModified(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function appendUrl(xml, path, { lastModified, changeFrequency, priority } = {}) {
  xml.push("<url>", `<loc>${escapeXml(sitemapUrl(path))}</loc>`);
  const lastmod = validLastModified(lastModified);
  if (lastmod) xml.push(`<lastmod>${lastmod}</lastmod>`);
  if (changeFrequency) xml.push(`<changefreq>${changeFrequency}</changefreq>`);
  if (priority !== undefined) xml.push(`<priority>${priority}</priority>`);
  xml.push("</url>");
}

function createApiUrl(baseUrl, path, params) {
  const url = new URL(path.replace(/^\/+/, ""), `${baseUrl.replace(/\/+$/, "")}/`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  return url;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Catalog API returned ${response.status}.`);
  return response.json();
}

async function fetchAllJobs(baseUrl) {
  const firstPage = await fetchJson(createApiUrl(baseUrl, "/api/v1/jobs", {
    page: 0,
    size: 100,
    sort: "latest",
    direction: "desc",
  }));
  if (!Array.isArray(firstPage.content) || !Number.isInteger(firstPage.totalPages)) {
    throw new Error("Catalog API returned an invalid job page.");
  }
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(0, firstPage.totalPages - 1) }, (_, index) =>
      fetchJson(createApiUrl(baseUrl, "/api/v1/jobs", {
        page: index + 1,
        size: 100,
        sort: "latest",
        direction: "desc",
      })),
    ),
  );
  return [firstPage, ...remainingPages].flatMap((page) => page.content);
}

export default async function sitemap() {
  let apiUrl;
  try {
    apiUrl = parseApiBaseUrl(process.env.VITE_API_BASE_URL, true);
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }

  try {
    const baseUrl = apiUrl.href.replace(/\/+$/, "");
    const [categories, organizations, jobs] = await Promise.all([
      fetchJson(createApiUrl(baseUrl, "/api/v1/categories", {})),
      fetchJson(createApiUrl(baseUrl, "/api/v1/organizations", {})),
      fetchAllJobs(baseUrl),
    ]);
    if (!Array.isArray(categories) || !Array.isArray(organizations)) {
      throw new Error("Catalog API returned invalid sitemap data.");
    }

    const xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
    for (const path of staticPaths) {
      appendUrl(xml, path, staticMetadata[path]);
    }
    for (const category of categories) {
      appendUrl(xml, `/category/${encodeURIComponent(category.slug)}`, {
        lastModified: category.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
    for (const organization of organizations) {
      appendUrl(xml, `/organizations/${encodeURIComponent(organization.slug)}`, {
        lastModified: organization.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
    for (const job of jobs) {
      appendUrl(xml, `/jobs/${encodeURIComponent(job.slug)}`, {
        lastModified: job.updatedAt || job.createdAt,
        changeFrequency: job.status === "ENDING_SOON" ? "hourly" : "daily",
        priority: job.isFeatured ? 0.9 : 0.8,
      });
    }
    xml.push("</urlset>");

    return new Response(xml.join(""), {
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=60",
        "Content-Type": "application/xml; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Unable to generate the current database-backed sitemap.", error);
    return new Response("Unable to generate the current sitemap from the catalog API.", { status: 502 });
  }
}
