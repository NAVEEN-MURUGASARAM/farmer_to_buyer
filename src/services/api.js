// Centralized API service for the frontend
// Support both Vite (import.meta.env) and Node-style (process.env) env vars.
import { MOCK_USERS, MOCK_PRODUCTS, MOCK_ORDERS } from "../data/mockData";

const API_BASE_URL = import.meta.env.VITE_NEXT_PUBLIC_API_URL || "";


const jsonHeaders = {
  "Content-Type": "application/json",
};

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(path, { method = "GET", body, token } = {}) {
  // const url = `${API_BASE_URL}${path}`;

  console.log(`[MOCK API] ${method} ${path}`, body);
  await delay(500); // Simulate latency

  // --- Auth Routes ---
  if (path === "/api/v1/auth/login") {
    // Allow any login, but if it matches mock data returns specific role
    // For demo, if 9876543210 -> Buyer, else Farmer (default)
    if (body.phone === "9876543210") return MOCK_USERS.buyer;
    return MOCK_USERS.farmer;
  }

  if (path === "/api/v1/auth/register") {
    if (body.role === 'buyer') return MOCK_USERS.buyer;
    return MOCK_USERS.farmer;
  }

  if (path === "/api/v1/me") {
    // Return based on token if we wanted to be strict, but for demo just return based on some heuristics or stored mock
    // logic: checking token to decide which user to return
    if (token === MOCK_USERS.buyer.token) return MOCK_USERS.buyer;
    if (token === MOCK_USERS.farmer.token) return MOCK_USERS.farmer;
    return MOCK_USERS.farmer; // Default fallback
  }

  // --- Product Routes ---
  if (path === "/api/v1/products" && method === "GET") {
    return MOCK_PRODUCTS;
  }

  if (path.startsWith("/api/v1/products/") && method === "GET") {
    const id = path.split("/").pop();
    if (id === 'me') { // /api/v1/products/me is for farmer's products
      return MOCK_PRODUCTS.filter(p => p.farmer === "farmer-123");
    }
    return MOCK_PRODUCTS.find(p => p._id === id);
  }

  // Handle POST/PUT/DELETE for products (Mock success)
  if (path === "/api/v1/products" && method === "POST") {
    const newProduct = { ...body, _id: `new-${Date.now()}`, createdAt: new Date().toISOString() };
    MOCK_PRODUCTS.push(newProduct); // In-memory update
    return newProduct;
  }

  if (path.startsWith("/api/v1/products/") && method === "DELETE") {
    return { message: "Product deleted" };
  }

  if (path.startsWith("/api/v1/products/") && method === "PUT") {
    return { ...body, _id: path.split("/").pop() };
  }


  // --- Order Routes ---
  if (path === "/api/v1/orders" && method === "POST") {
    // Create Order
    const newOrder = {
      _id: `order-${Date.now()}`,
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    MOCK_ORDERS.push(newOrder);
    return newOrder;
  }

  if (path === "/api/v1/orders/buyer/me") {
    return MOCK_ORDERS;
  }

  if (path === "/api/v1/orders/farmer/me") {
    return MOCK_ORDERS; // Return all for now or filter if needed
  }

  if (path.startsWith("/api/v1/orders/") && method === "GET") {
    const id = path.split('/')[4]; // /api/v1/orders/:id
    return MOCK_ORDERS.find(o => o._id === id);
  }

  if (path.startsWith("/api/v1/orders/") && path.endsWith("/status") && method === "PUT") {
    return { message: "Order updated" };
  }


  // Default fallback
  console.warn("Unhandled Mock Path:", path);
  return null;
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
