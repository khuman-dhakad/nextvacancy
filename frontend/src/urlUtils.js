/**
 * Sanitizes external URLs to ensure they only use http: or https: protocols.
 * Returns the normalized URL string if valid, or null if invalid or unsafe.
 *
 * @param {unknown} value
 * @returns {string | null}
 */
export function sanitizeUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }
  const trimmed = value.trim();
  // Must explicitly start with http:// or https:// (prevents protocol-relative // or javascript:)
  if (!/^https?:\/\//i.test(trimmed)) {
    return null;
  }
  try {
    const parsed = new URL(trimmed);
    if ((parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.hostname) {
      return parsed.toString();
    }
  } catch {
    return null;
  }
  return null;
}
