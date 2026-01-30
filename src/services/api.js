// Centralized API service for the frontend
const API_BASE_URL = import.meta.env.VITE_NEXT_PUBLIC_API_URL || "https://farmer-buyer-backend-geda.onrender.com";

const jsonHeaders = {
  "Content-Type": "application/json",
};

async function fetchJson(path, { method = "GET", body, token } = {}) {
  const url = `${API_BASE_URL}${path}`;

  const headers = { ...jsonHeaders };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(url, options);

    // Handle empty responses (like 204 No Content)
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json().catch(() => null);
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Create a more descriptive error message by stringifying data if it's an object
      let errorMessage;
      if (typeof data === 'object') {
        errorMessage = JSON.stringify(data); // Force show all data
      } else {
        errorMessage = typeof data === 'string' ? data : `Request failed with status ${response.status}`;
      }

      console.error("API Error Details:", { status: response.status, url, data, errorMessage });
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export const authApi = {
  async login({ phone, password, otp }) { // Accept OTP
    return fetchJson("/auth/login", {
      method: "POST",
      body: { phone, password, otp }, // send OTP if provided
    });
  },
  async verifyOtp({ tempToken, otp }) {
    // During login, we use the temporary token from the login response
    // Pass it as Authorization header, similar to other authenticated requests
    return fetchJson("/auth/2fa/verify", {
      method: "POST",
      body: { otp },
      token: tempToken
    });
  },
  async register({ name, phone, password, role }) {
    return fetchJson("/auth/register", {
      method: "POST",
      body: { name, phone, password, role },
    });
  },
  // async me(token) {
  //   return fetchJson("/me", {
  //     method: "GET",
  //     token,
  //   });
  // },
  async me(token) {
    // Endpoint broken/missing. Return null or throw. 
    // For now, throwing prevents usage, but let's just return null so caller handles it?
    // Actually, better to just error or let the caller rely on token decoding.
    // We'll throw to ensure we don't use it.
    throw new Error("User profile endpoint not available");
  },
  async generate2faSecret(token) {
    // Typically needs auth token to identify user
    // But if we use 'me' endpoint or similar, we need token
    // The calling code (ProfilePage) should pass token or we use stored token
    // Wait, earlier I assumed `fetchJson` handles token if passed. 
    // I should update calls to pass token if needed.
    // Or rely on a global token getter? 
    // The `fetchJson` takes a token arg.
    // Let's assume the component extracts token from store and passes it 
    // OR we import store here (circular dependency risk).
    // Best to let `fetchJson` accept token, and `authApi` methods accept token or wrapper does.

    // Checking ProfilePage usage.. it calls `authApi.generate2faSecret()`. 
    // Use logic: The user is logged in. Use `localStorage` or pass token.

    const storedToken = localStorage.getItem('authToken');
    return fetchJson("/auth/2fa/setup", {
      method: "POST",
      token: token || storedToken
    });
  },
  async enable2fa(otp) {
    const token = localStorage.getItem('authToken');
    return fetchJson("/auth/2fa/verify", {
      method: "POST",
      body: { otp },
      token
    });
  },
  async disable2fa() {
    const token = localStorage.getItem('authToken');
    return fetchJson("/auth/2fa/disable", {
      method: "POST",
      token
    });
  }
};

export function withAuthHeaders(token) {
  return token
    ? {
      Authorization: `Bearer ${token}`,
      ...jsonHeaders,
    }
    : jsonHeaders;
}

export function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export { fetchJson };
