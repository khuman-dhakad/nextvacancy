// @vitest-environment jsdom
import { StrictMode } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

const { apiGet, apiRequest, authState, signIn } = vi.hoisted(() => ({
  apiGet: vi.fn(),
  apiRequest: vi.fn(),
  authState: { current: { session: null, signIn: vi.fn(), signOut: vi.fn() } },
  signIn: vi.fn(),
}));

vi.mock("../api.js", () => ({ apiGet, apiRequest }));
vi.mock("./AuthContext.jsx", () => ({
  useAuth: () => authState.current,
}));

import { AccountPage, LoginPage, VerifyEmailPage } from "./AuthPages.jsx";

describe("Auth pages", () => {
  afterEach(() => {
    cleanup();
    apiGet.mockReset();
    apiRequest.mockReset();
    authState.current = { session: null, signIn, signOut: vi.fn() };
  });

  describe("VerifyEmailPage", () => {
    it("submits a one-use token only once in React StrictMode", async () => {
      apiRequest.mockResolvedValue({});

      render(
        <StrictMode>
          <MemoryRouter initialEntries={["/verify-email?token=single-use-token"]}>
            <VerifyEmailPage />
          </MemoryRouter>
        </StrictMode>,
      );

      expect(await screen.findByText("Email verified. Your account is ready to use.")).toBeTruthy();
      expect(apiRequest).toHaveBeenCalledTimes(1);
      expect(apiRequest).toHaveBeenCalledWith("/api/v1/auth/email-verification/confirm", {
        method: "POST",
        body: { token: "single-use-token" },
      });
    });
  });

  describe("LoginPage", () => {
    it("renders without requiring a reset-link token", () => {
      render(
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>,
      );

      expect(screen.getByRole("heading", { name: "Welcome back" })).toBeTruthy();
    });
  });

  describe("AccountPage", () => {
    it("loads candidate saved jobs from the API", async () => {
      authState.current.session = { accessToken: "access-token", role: "CANDIDATE" };
      apiRequest.mockImplementation((path) => {
        if (path === "/api/v1/auth/me") {
          return Promise.resolve({ profile: { fullName: "Candidate", email: "candidate@example.invalid", isEmailVerified: true } });
        }
        if (path === "/api/v1/candidate/saved-jobs") {
          return Promise.resolve([{
            id: "saved-1",
            savedAt: "2026-09-28T10:00:00Z",
            job: { id: "job-1", slug: "saved-role", title: "Saved Role", organization: "Real Organization" },
          }]);
        }
        return Promise.reject(new Error(`Unexpected API call: ${path}`));
      });

      render(
        <MemoryRouter>
          <AccountPage />
        </MemoryRouter>,
      );

      expect(await screen.findByRole("link", { name: "Saved Role" })).toBeTruthy();
      expect(apiRequest).toHaveBeenCalledWith("/api/v1/candidate/saved-jobs", { accessToken: "access-token" });
    });
  });
});
