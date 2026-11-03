import { expect, it } from "vitest";
import { parseApiBaseUrl } from "./apiConfiguration.js";

it("accepts a provisioned HTTPS host for production", () => {
  expect(parseApiBaseUrl("https://nextvacancy-api.onrender.com", true).origin)
    .toBe("https://nextvacancy-api.onrender.com");
});

it("rejects local and reserved placeholder hosts in production", () => {
  for (const value of [
    "http://nextvacancy-api.onrender.com",
    "https://localhost",
    "https://127.0.0.1",
    "https://api.example.invalid",
  ]) {
    expect(() => parseApiBaseUrl(value, true)).toThrow();
  }
});

it("requires production API configuration and accepts only an origin", () => {
  expect(() => parseApiBaseUrl(undefined, true)).toThrow("VITE_API_BASE_URL");
  expect(() => parseApiBaseUrl("https://nextvacancy-api.onrender.com/api", true))
    .toThrow("origin without a path");
  expect(parseApiBaseUrl("http://localhost:8080", false).origin)
    .toBe("http://localhost:8080");
});
