// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const { apiGet } = vi.hoisted(() => ({ apiGet: vi.fn() }));

vi.mock("../api.js", () => ({ apiGet }));

import { OrganizationDirectoryPage, OrganizationProfilePage } from "./OrganizationPages.jsx";

describe("Organization pages", () => {
  afterEach(() => {
    cleanup();
    apiGet.mockReset();
  });

  describe("OrganizationDirectoryPage", () => {
    it("loads real API records and filters by authority and category", async () => {
      apiGet.mockResolvedValue([{
        id: "org-1",
        slug: "public-service-board",
        name: "Public Service Board",
        shortName: "PSB",
        categoryType: "Commission",
        headquarters: "New Delhi",
        state: "All India",
        tagline: "Recruitment information",
        stats: { activeVacanciesCount: 2 },
      }, {
        id: "org-2",
        slug: "state-bank",
        name: "State Bank",
        shortName: "SB",
        categoryType: "Banking",
        headquarters: "Mumbai",
        state: "Maharashtra",
        tagline: "Bank recruitment",
        stats: { activeVacanciesCount: 0 },
      }]);

      render(<MemoryRouter><OrganizationDirectoryPage /></MemoryRouter>);

      expect(await screen.findByRole("link", { name: "Public Service Board" })).toBeTruthy();
      expect(screen.getByRole("link", { name: "State Bank" })).toBeTruthy();
      fireEvent.change(screen.getByRole("textbox", { name: "Search organizations" }), { target: { value: "Mumbai" } });
      expect(screen.getByRole("link", { name: "State Bank" })).toBeTruthy();
      expect(screen.queryByRole("link", { name: "Public Service Board" })).toBeNull();
      expect(apiGet).toHaveBeenCalledWith("/api/v1/organizations");
    });
  });

  describe("OrganizationProfilePage", () => {
    it("loads the profile and related API resources", async () => {
      apiGet.mockImplementation((path) => {
        if (path === "/api/v1/organizations/public-service-board") {
          return Promise.resolve({
            id: "org-1",
            slug: "public-service-board",
            name: "Public Service Board",
            shortName: "PSB",
            categoryType: "Commission",
            headquarters: "New Delhi",
            establishedYear: 1950,
            state: "All India",
            website: "https://example.invalid",
            verified: true,
            tagline: "Recruitment information",
            description: "Official recruitment body.",
            aboutDetails: [],
            selectionProcess: [],
            keyDepartments: [],
            faqs: [{ question: "Where can I apply?", answer: "Use the official portal." }],
            stats: { activeVacanciesCount: 1, totalPostsCount: 1, admitCardsCount: 0, resultsCount: 0 },
          });
        }
        if (path.endsWith("/jobs")) return Promise.resolve({ content: [{
          id: "job-1",
          slug: "officer-post",
          title: "Officer Post",
          shortSummary: "Recruitment notice",
          status: "OPEN",
          location: "All India",
        }] });
        if (path.endsWith("/related")) return Promise.resolve([]);
        return Promise.reject(new Error(`Unexpected API call: ${path}`));
      });

      render(
        <MemoryRouter initialEntries={["/organizations/public-service-board"]}>
          <Routes>
            <Route path="/organizations/:slug" element={<OrganizationProfilePage />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(await screen.findByRole("heading", { name: "Public Service Board" })).toBeTruthy();
      expect(screen.getByRole("link", { name: "Officer Post" })).toBeTruthy();
      expect(screen.getByText("Where can I apply?")).toBeTruthy();
      expect(apiGet).toHaveBeenCalledTimes(3);
    });

    it("renders a not-found state for an organization missing from the API", async () => {
      const notFound = Object.assign(new Error("Organization not found."), { status: 404 });
      apiGet.mockImplementation((path) => path.endsWith("/jobs") || path.endsWith("/related")
        ? Promise.resolve({ content: [] })
        : Promise.reject(notFound));

      render(
        <MemoryRouter initialEntries={["/organizations/missing"]}>
          <Routes>
            <Route path="/organizations/:slug" element={<OrganizationProfilePage />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(await screen.findByRole("heading", { name: "Organization not found" })).toBeTruthy();
      expect(screen.getByRole("link", { name: "Browse all organizations" })).toBeTruthy();
    });
  });
});
