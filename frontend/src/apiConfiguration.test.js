import { expect, it } from "vitest";
import { parseApiBaseUrl } from "./apiConfiguration.js";

it("accepts a provisioned HTTPS host for production", () => {
  expect(parseApiBaseUrl("https://api.nextvacancy.com", true).origin)
    .toBe("https://api.nextvacancy.com");
});

it("rejects local and reserved placeholder hosts in production", () => {
  for (const value of [
    "http://api.nextvacancy.com",
    "https://localhost",
    "https://127.0.0.1",
    "https://api.example.invalid",
  ]) {
    expect(() => parseApiBaseUrl(value, true)).toThrow();
  }
});
