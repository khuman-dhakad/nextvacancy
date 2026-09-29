const placeholderHostnames = new Set([
  "localhost",
  "0.0.0.0",
  "127.0.0.1",
  "[::1]",
  "example.com",
]);

export function parseApiBaseUrl(value, production = false) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("VITE_API_BASE_URL must be configured before starting the frontend.");
  }

  let apiBaseUrl;
  try {
    apiBaseUrl = new URL(value.trim());
  } catch {
    throw new Error("VITE_API_BASE_URL must be an absolute HTTPS URL.");
  }
  if (apiBaseUrl.username || apiBaseUrl.password) {
    throw new Error("API URLs must not contain embedded credentials.");
  }
  if (production && apiBaseUrl.protocol !== "https:") {
    throw new Error("VITE_API_BASE_URL must use HTTPS in production.");
  }

  if (production) {
    const hostname = apiBaseUrl.hostname.toLowerCase();
    const isLoopback = hostname.endsWith(".localhost")
      || hostname.startsWith("127.")
      || hostname.endsWith(".invalid")
      || hostname.endsWith(".example")
      || hostname.endsWith(".example.com")
      || hostname.endsWith(".test");
    if (placeholderHostnames.has(hostname) || isLoopback) {
      throw new Error("VITE_API_BASE_URL must identify the provisioned public Spring API host.");
    }
  }

  return apiBaseUrl;
}
