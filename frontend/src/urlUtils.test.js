import { describe, expect, it } from "vitest";
import { sanitizeUrl } from "./urlUtils.js";

describe("sanitizeUrl", () => {
  it("allows valid https and http URLs", () => {
    expect(sanitizeUrl("https://example.com/apply")).toBe("https://example.com/apply");
    expect(sanitizeUrl("http://upsc.gov.in")).toBe("http://upsc.gov.in/");
    expect(sanitizeUrl("  https://secure.site.org/path?a=1&b=2  ")).toBe("https://secure.site.org/path?a=1&b=2");
  });

  it("rejects javascript:, data:, and dangerous protocol URLs", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBeNull();
    expect(sanitizeUrl("JAVASCRIPT:alert('xss')")).toBeNull();
    expect(sanitizeUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(sanitizeUrl("vbscript:msgbox(1)")).toBeNull();
    expect(sanitizeUrl("file:///etc/passwd")).toBeNull();
  });

  it("rejects relative, protocol-relative, and malformed inputs", () => {
    expect(sanitizeUrl("//evil.com")).toBeNull();
    expect(sanitizeUrl("/relative/path")).toBeNull();
    expect(sanitizeUrl("not a url")).toBeNull();
    expect(sanitizeUrl("")).toBeNull();
    expect(sanitizeUrl(null)).toBeNull();
    expect(sanitizeUrl(undefined)).toBeNull();
    expect(sanitizeUrl(12345)).toBeNull();
  });
});
