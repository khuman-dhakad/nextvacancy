import { afterEach, describe, expect, it, vi } from "vitest";

vi.stubEnv("VITE_API_BASE_URL", "https://api.invalid");
const { apiRequest } = await import("./api.js");

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockResponse(status, body, contentType = "application/json") {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => contentType },
    text: async () => body,
  };
}

describe("API transport", () => {
  it("sends admin access tokens as bearer authorization", async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse(200, '{"accepted":true}'));
    vi.stubGlobal("fetch", fetchMock);

    await apiRequest("/api/v1/admin/dashboard", { accessToken: "unit-test-token" });

    const authorization = fetchMock.mock.calls[0][1].headers.Authorization;
    expect(authorization).toBe("Bearer unit-test-token");
  });

  it("serializes JSON bodies, query parameters, credentials, and CSRF token", async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse(200, '{"saved":true}'));
    vi.stubGlobal("fetch", fetchMock);

    await apiRequest("/api/v1/jobs", {
      method: "PATCH",
      params: { page: 0, ignored: "", absent: null },
      body: { title: "Updated" },
      csrfToken: "csrf-token",
    });

    const [url, options] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("https://api.invalid/api/v1/jobs?page=0");
    expect(options.method).toBe("PATCH");
    expect(options.credentials).toBe("include");
    expect(options.headers).toMatchObject({
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRF-Token": "csrf-token",
    });
    expect(options.body).toBe('{"title":"Updated"}');
  });

  it.each(["GET", "POST", "PUT", "PATCH", "DELETE"])("passes %s through to fetch", async (method) => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse(204, ""));
    vi.stubGlobal("fetch", fetchMock);

    await apiRequest("/api/v1/resource", { method });

    expect(fetchMock.mock.calls[0][1].method).toBe(method);
  });

  it.each([401, 403, 404, 409, 422, 500])("preserves HTTP %i and API error details", async (status) => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse(status, '{"error":"API rejected request"}'));
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiRequest("/api/v1/resource")).rejects.toMatchObject({
      message: "API rejected request",
      status,
    });
  });

  it("surfaces a non-JSON error response instead of hiding it", async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse(500, "upstream unavailable", "text/plain"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiRequest("/api/v1/resource")).rejects.toMatchObject({
      message: "upstream unavailable",
      status: 500,
    });
  });
});
