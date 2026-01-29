export const MOCK_USERS = {
    buyer: {
        _id: "buyer-123",
        name: "John Buyer",
        email: "buyer@example.com",
        phone: "9876543210",
        role: "buyer",
        token: "mock-buyer-token",
    },
    farmer: {
        _id: "farmer-123",
        name: "Jane Farmer",
        email: "farmer@example.com",
        phone: "1234567890",
        role: "farmer",
        token: "mock-farmer-token",
    },
};

export const MOCK_PRODUCTS = [
    {
        _id: "prod-1",
        name: "Organic Tomatoes",
        description: "Fresh red organic tomatoes directly from the farm.",
        price: 40,
        quantity: 100,
        category: "Vegetables",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1000&auto=format&fit=crop",
        farmer: "farmer-123",
        createdAt: "2024-01-01T10:00:00Z",
    },
    {
        _id: "prod-2",
        name: "Fresh Potatoes",
        description: "High quality potatoes suitable for chips and curry.",
        price: 30,
        quantity: 500,
        category: "Vegetables",
        image: "https://images.unsplash.com/photo-1518977676605-61b23f55e046?q=80&w=1000&auto=format&fit=crop",
        farmer: "farmer-123",
        createdAt: "2024-01-02T10:00:00Z",
    },
    {
        _id: "prod-3",
        name: "Sweet Bananas",
        description: "Naturally ripened sweet bananas.",
        price: 60,
        quantity: 50,
        category: "Fruits",
        image: "https://images.unsplash.com/photo-1603833665858-e61d17a86279?q=80&w=1000&auto=format&fit=crop",
        farmer: "farmer-456",
        createdAt: "2024-01-03T10:00:00Z",
    },
    {
        _id: "prod-4",
        name: "Red Apples",
        description: "Crisp and sweet red apples.",
        price: 120,
        quantity: 80,
        category: "Fruits",
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=1000&auto=format&fit=crop",
        farmer: "farmer-456",
        createdAt: "2024-01-03T10:00:00Z",
    },
];

export const MOCK_ORDERS = [
    {
        _id: "order-1",
        buyer: "buyer-123",
        items: [
            {
                product: { ...MOCK_PRODUCTS[0], _id: "prod-1" },
                quantity: 2,
                price: 40,
            },
        ],
        totalAmount: 80,
        status: "pending",
        createdAt: "2024-01-20T10:00:00Z",
    },
    {
        _id: "order-2",
        buyer: "buyer-123",
        items: [
            {
                product: { ...MOCK_PRODUCTS[2], _id: "prod-3" },
                quantity: 1,
                price: 60,
            },
        ],
        totalAmount: 60,
        status: "completed",
        createdAt: "2024-01-18T10:00:00Z",
    },
];
