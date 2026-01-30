import { fetchJson } from "./api";

export const orderService = {
    // Create order (Buyer only)
    async createOrder(orderData, token) {
        return fetchJson("/orders", {
            method: "POST",
            body: orderData,
            token,
        });
    },

    // Get order by ID
    async getOrderById(id, token) {
        return fetchJson(`/orders/${id}`, {
            method: "GET",
            token,
        });
    },

    // Get my orders (Buyer)
    async getBuyerOrders(token) {
        return fetchJson("/orders/buyer/me", {
            method: "GET",
            token,
        });
    },

    // Get my orders (Farmer)
    async getFarmerOrders(token) {
        return fetchJson("/orders/farmer/me", {
            method: "GET",
            token,
        });
    },

    // Update order status (Farmer only)
    async updateOrderStatus(id, status, token) {
        return fetchJson(`/orders/${id}/status`, {
            method: "PUT",
            body: { status },
            token,
        });
    },
};
