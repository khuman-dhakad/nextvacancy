// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const { apiGet, apiRequest } = vi.hoisted(() => ({ apiGet: vi.fn(), apiRequest: vi.fn() }));
vi.mock("../api.js", () => ({ apiGet, apiRequest }));

import { PublicCatalogPage } from "./PublicCatalogPages.jsx";

describe("Public category pages", () => {
  afterEach(() => {
    cleanup();
    apiGet.mockReset();
    apiRequest.mockReset();
  });

  it("renders the not-found state when the category is absent from the API", async () => {
    apiGet.mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={["/category/missing"]}>
        <Routes>
          <Route path="/category/:category" element={<PublicCatalogPage mode="category" />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "Category not found" })).toBeTruthy();
  });

  it("shows a retryable error when category loading fails", async () => {
    apiGet.mockRejectedValue(new Error("Category service unavailable"));

    render(
      <MemoryRouter initialEntries={["/category/government"]}>
        <Routes>
          <Route path="/category/:category" element={<PublicCatalogPage mode="category" />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "Unable to load this category" })).toBeTruthy();
    expect(screen.getByRole("alert").textContent).toContain("Category service unavailable");
  });
});
