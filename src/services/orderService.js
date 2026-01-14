import { fetchJson } from "./api";

export const orderService = {
    // Create order (Buyer only)
    async createOrder(orderData, token) {
        return fetchJson("/api/v1/orders", {
            method: "POST",
            body: orderData,
            token,
        });
    },

    // Get order by ID
    async getOrderById(id, token) {
        return fetchJson(`/api/v1/orders/${id}`, {
            method: "GET",
            token,
        });
    },

    // Get my orders (Buyer)
    async getBuyerOrders(token) {
        return fetchJson("/api/v1/orders/buyer/me", {
            method: "GET",
            token,
        });
    },

    // Get my orders (Farmer)
    async getFarmerOrders(token) {
        return fetchJson("/api/v1/orders/farmer/me", {
            method: "GET",
            token,
        });
    },

    // Update order status (Farmer only)
    async updateOrderStatus(id, status, token) {
        return fetchJson(`/api/v1/orders/${id}/status`, {
            method: "PUT",
            body: { status },
            token,
        });
    },
};
