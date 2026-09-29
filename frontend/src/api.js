import { parseApiBaseUrl } from "./apiConfiguration.js";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

const apiBaseUrl = parseApiBaseUrl(configuredBaseUrl, import.meta.env.PROD);

export async function apiGet(path, params, options = {}) {
  return apiRequest(path, { ...options, params });
}

export async function apiRequest(path, { method = "GET", params, body, accessToken, csrfToken } = {}) {
  const url = new URL(path.replace(/^\/+/, ""), `${apiBaseUrl.href.replace(/\/+$/, "")}/`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== "" && value !== null && value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (accessToken) headers.Authorization = "Bearer " + accessToken;
  if (csrfToken) headers["X-CSRF-Token"] = csrfToken;

  const response = await fetch(url, {
    method,
    credentials: "include",
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const responseText = await response.text();
  let payload;
  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
    }
  }
  if (!response.ok) {
    const message = payload?.error || responseText || `The API request failed (${response.status}).`;
    const failure = new Error(message);
    failure.status = response.status;
    throw failure;
  }

  return payload;
}
