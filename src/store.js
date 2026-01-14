// src/store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth Store
const useAuthStoreBase = create(
    persist(
        (set) => ({
            // State
            user: null,
            userRole: null,
            token: null,
            error: null,

            // Actions
            setUser: (user) => set({ user }),
            setUserRole: (role) => set({ userRole: role }),
            setToken: (token) => set({ token }),
            setError: (error) => set({ error }),

            logout: () => {
                set({
                    user: null,
                    userRole: null,
                    token: null,
                    error: null,
                });
                // Clear all auth-related localStorage items
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');
                // Clear zustand persisted storage
                localStorage.removeItem('auth-storage');
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                userRole: state.userRole,
                token: state.token,
            }),
        }
    )
);

// Export hook with computed isAuthenticated
export const useAuthStore = () => {
    const state = useAuthStoreBase();
    return {
        ...state,
        isAuthenticated: !!state.token && !!state.user,
    };
};

// Cart Store
const useCartStoreBase = create(
    persist(
        (set, get) => ({
            items: [],

            addToCart: (product, quantity = 1) => {
                const items = get().items;
                const existingItem = items.find(item => item.productId === product.id);

                if (existingItem) {
                    set({
                        items: items.map(item =>
                            item.productId === product.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        ),
                    });
                } else {
                    set({
                        items: [
                            ...items,
                            {
                                productId: product.id,
                                name: product.name || product.crop_name,
                                price: parseFloat(product.price || product.price_per_unit || 0),
                                quantity,
                            },
                        ],
                    });
                }
            },

            removeFromCart: (productId) => {
                set({
                    items: get().items.filter(item => item.productId !== productId),
                });
            },

            updateQuantity: (productId, quantity) => {
                const items = get().items;
                if (quantity <= 0) {
                    set({
                        items: items.filter(item => item.productId !== productId),
                    });
                } else {
                    set({
                        items: items.map(item =>
                            item.productId === productId
                                ? { ...item, quantity }
                                : item
                        ),
                    });
                }
            },

            clearCart: () => {
                set({ items: [] });
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);

// Export cart store with computed totalPrice
export const useCartStore = () => {
    const store = useCartStoreBase();
    return {
        ...store,
        totalPrice: store.items.reduce((total, item) => total + (item.price * item.quantity), 0),
    };
};

// Order Store
export const useOrderStore = create(
    persist(
        (set, get) => ({
            orders: [],

            setOrders: (orders) => set({ orders }),

            addOrder: (order) => {
                set((state) => ({
                    orders: [...state.orders, order],
                }));
            },

            updateOrderStatus: (orderId, status) => {
                set((state) => ({
                    orders: state.orders.map((order) =>
                        order.id === orderId ? { ...order, order_status: status } : order
                    ),
                }));
            },

            cancelOrder: (orderId) => {
                set((state) => ({
                    orders: state.orders.map((order) =>
                        order.id === orderId ? { ...order, order_status: 'cancelled' } : order
                    ),
                }));
            },
        }),
        {
            name: 'order-storage',
        }
    )
);

// Address Store
export const useAddressStore = create(
    persist(
        (set, get) => ({
            addresses: [],

            addAddress: (address) => {
                const addresses = get().addresses;
                // If this is the first address or marked as default, set as default
                const isDefault = addresses.length === 0 || address.is_default;
                if (isDefault) {
                    // Unset other defaults
                    const updated = addresses.map((addr) => ({ ...addr, is_default: false }));
                    set({ addresses: [...updated, { ...address, is_default: true }] });
                } else {
                    set({ addresses: [...addresses, address] });
                }
            },

            updateAddress: (id, updates) => {
                const addresses = get().addresses;
                set({
                    addresses: addresses.map((addr) =>
                        addr.id === id ? { ...addr, ...updates } : addr
                    ),
                });
            },

            deleteAddress: (id) => {
                set({
                    addresses: get().addresses.filter((addr) => addr.id !== id),
                });
            },

            setDefaultAddress: (id) => {
                const addresses = get().addresses;
                set({
                    addresses: addresses.map((addr) => ({
                        ...addr,
                        is_default: addr.id === id,
                    })),
                });
            },
        }),
        {
            name: 'address-storage',
        }
    )
);

// Wishlist Store
export const useWishlistStore = create(
    persist(
        (set, get) => ({
            items: [],

            addToWishlist: (product) => {
                const items = get().items;
                if (!items.find((item) => item.productId === product.id)) {
                    set({
                        items: [
                            ...items,
                            {
                                productId: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.image,
                            },
                        ],
                    });
                }
            },

            removeFromWishlist: (productId) => {
                set({
                    items: get().items.filter((item) => item.productId !== productId),
                });
            },

            isInWishlist: (productId) => {
                return get().items.some((item) => item.productId === productId);
            },

            clearWishlist: () => {
                set({ items: [] });
            },
        }),
        {
            name: 'wishlist-storage',
        }
    )
);

// Toast Store
export const useToastStore = create((set) => ({
    toasts: [],

    addToast: (toast) => {
        const id = Date.now() + Math.random();
        set((state) => ({
            toasts: [...state.toasts, { ...toast, id }],
        }));
        return id;
    },

    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
    },
}));

