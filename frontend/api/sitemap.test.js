import { afterEach, expect, it, vi } from "vitest";
import sitemap from "./sitemap.js";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

it("generates dynamic sitemap entries from paginated API data", async () => {
  vi.stubEnv("VITE_API_BASE_URL", "https://api.nextvacancy.com");
  const fetchMock = vi.fn(async (input) => {
    const url = new URL(input);
    if (url.pathname.endsWith("/jobs")) {
      const page = Number(url.searchParams.get("page"));
      return Response.json({
        content: [page === 0 ? {
          slug: "officer-role",
          status: "ENDING_SOON",
          isFeatured: true,
          updatedAt: "2026-09-20T00:00:00Z",
        } : {
          slug: "assistant-role",
          status: "OPEN",
          isFeatured: false,
          updatedAt: "2026-09-19T00:00:00Z",
        }],
        totalPages: 2,
      });
    }
    if (url.pathname.endsWith("/categories")) {
      return Response.json([{ slug: "public-service", updatedAt: "2026-09-18T00:00:00Z" }]);
    }
    if (url.pathname.endsWith("/organizations")) {
      return Response.json([{ slug: "service-board", updatedAt: "2026-09-17T00:00:00Z" }]);
    }
    return new Response(null, { status: 404 });
  });
  vi.stubGlobal("fetch", fetchMock);

  const response = await sitemap();
  const xml = await response.text();

  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Type")).toContain("application/xml");
  expect(xml).toContain("https://nextvacancy.com/jobs/officer-role");
  expect(xml).toContain("https://nextvacancy.com/jobs/assistant-role");
  expect(xml).toContain("https://nextvacancy.com/category/public-service");
  expect(xml).toContain("https://nextvacancy.com/organizations/service-board");
  expect(xml).toContain("<changefreq>hourly</changefreq>");
  expect(fetchMock).toHaveBeenCalledTimes(4);
});

it("returns an explicit error when the catalog API is not configured", async () => {
  vi.stubEnv("VITE_API_BASE_URL", "");
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);

  const response = await sitemap();

  expect(response.status).toBe(500);
  expect(await response.text()).toContain("VITE_API_BASE_URL");
  expect(fetchMock).not.toHaveBeenCalled();
});
