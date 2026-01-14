// Centralized API service for the frontend
// Support both Vite (import.meta.env) and Node-style (process.env) env vars.
const API_BASE_URL = import.meta.env.VITE_NEXT_PUBLIC_API_URL || "";


const jsonHeaders = {
  "Content-Type": "application/json",
};

async function fetchJson(path, { method = "GET", body, token } = {}) {
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    method,
    headers: {
      ...jsonHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = response.headers
    .get("content-type")
    ?.toLowerCase()
    .includes("application/json");

  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message = data?.message || data?.error || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const authApi = {
  async login({ phone, password }) {
    return fetchJson("/api/v1/auth/login", {
      method: "POST",
      body: { phone, password },
    });
  },
  async register({ name, phone, password, role }) {
    return fetchJson("/api/v1/auth/register", {
      method: "POST",
      body: { name, phone, password, role },
    });
  },
  async me(token) {
    return fetchJson("/api/v1/me", {
      method: "GET",
      token,
    });
  },
};

export function withAuthHeaders(token) {
  return token
    ? {
      Authorization: `Bearer ${token}`,
      ...jsonHeaders,
    }
    : jsonHeaders;
}

export { fetchJson };
