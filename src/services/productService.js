import { fetchJson } from "./api";

export const productService = {
    // Get all products
    async getAllProducts() {
        return fetchJson("/api/v1/products", {
            method: "GET",
        });
    },

    // Get single product
    async getProductById(id) {
        return fetchJson(`/api/v1/products/${id}`, {
            method: "GET",
        });
    },

    // Create product (Farmer only)
    async createProduct(productData, token) {
        return fetchJson("/api/v1/products", {
            method: "POST",
            body: productData,
            token,
        });
    },

    // Update product (Farmer only)
    async updateProduct(id, productData, token) {
        return fetchJson(`/api/v1/products/${id}`, {
            method: "PUT",
            body: productData,
            token,
        });
    },

    // Delete product (Farmer only)
    async deleteProduct(id, token) {
        return fetchJson(`/api/v1/products/${id}`, {
            method: "DELETE",
            token,
        });
    },

    // Get my products (Farmer only)
    async getMyProducts(token) {
        return fetchJson("/api/v1/products/me", {
            method: "GET",
            token,
        });
    },
};
