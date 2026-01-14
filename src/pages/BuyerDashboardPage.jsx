import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useOrderStore, useCartStore, useAddressStore, useWishlistStore } from '@/store';
import { orderService } from '@/services/orderService';
import { ShoppingCart, Package, Heart, Settings, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/contexts/ToastContext';

export default function BuyerDashboardPage() {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const { items: cartItems, totalPrice, removeFromCart, updateQuantity: updateCartQuantity } = useCartStore();
  const { orders, setOrders } = useOrderStore();
  const { addresses } = useAddressStore();
  const { items: wishlistItems } = useWishlistStore();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (token) {
          const data = await orderService.getBuyerOrders(token);
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    fetchOrders();
  }, [token, setOrders]);

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: '📦' },
    { label: 'Cart Items', value: cartItems.length, icon: '🛒' },
    { label: 'Saved Addresses', value: addresses.length, icon: '📍' },
    { label: 'Wishlist Items', value: wishlistItems.length, icon: '❤️' },
  ];

  const handleUpdateQuantity = (productId, newQuantity) => {
    updateCartQuantity(productId, newQuantity);
    if (newQuantity <= 0) {
      toast.success('Item removed from cart');
    } else {
      toast.success('Quantity updated');
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    toast.success('Item removed from cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}! 🛒</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl mb-2">{stat.icon}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'overview'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'orders'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="inline mr-2" size={18} />
            My Orders
          </button>
          <button
            onClick={() => setActiveTab('cart')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'cart'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingCart className="inline mr-2" size={18} />
            Cart ({cartItems.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'settings'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="inline mr-2" size={18} />
            Settings
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest purchases</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-gray-600">No orders yet. Start shopping!</p>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(-3).map((order) => (
                      <div
                        key={order.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">Order #{order.order_number || order.id}</p>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              order.order_status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.order_status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {order.order_status || order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">₹{order.total_amount || order.totalAmount}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(order.ordered_at || order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get started with your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  📍 Manage Addresses
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  💳 Payment Methods
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  ❤️ Wishlist
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🛍️ Browse Products
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>All your orders and their status</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">No orders found</p>
                  <Button
                    onClick={() => navigate('/products')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Order #{order.order_number || order.id}</p>
                          {order.items && order.items.length > 0 ? (
                            <div className="mt-2 space-y-1">
                              {order.items.map((item, idx) => (
                                <p key={idx} className="text-sm text-gray-600">
                                  • {item.product_name || item.name || item.crop_name || `Item ${idx + 1}`} x {item.quantity}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600">No items</p>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.order_status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.order_status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.order_status || order.status}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <p className="text-sm text-gray-600">
                          {new Date(order.ordered_at || order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="font-semibold">₹{order.total_amount || order.totalAmount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <Card>
            <CardHeader>
              <CardTitle>Shopping Cart</CardTitle>
              <CardDescription>Items in your cart</CardDescription>
            </CardHeader>
            <CardContent>
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">Your cart is empty</p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="space-y-4 mb-4">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="flex justify-between items-center border-b pb-4">
                        <div className="flex-1">
                          <p className="font-medium">{item.name || 'Product'}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center border rounded">
                              <button
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                                className="px-2 py-1 hover:bg-gray-100"
                              >
                                −
                              </button>
                              <span className="px-3 py-1 min-w-[3rem] text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                className="px-2 py-1 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.productId)}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-500">₹{item.price} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 flex justify-between mb-4">
                    <p className="font-semibold">Total:</p>
                    <p className="text-xl font-bold text-green-600">₹{totalPrice.toFixed(2)}</p>
                  </div>
                  <Button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/profile')}
              >
                <Settings size={18} className="mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/addresses')}
              >
                <MapPin size={18} className="mr-2" />
                Manage Addresses
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/wishlist')}
              >
                <Heart size={18} className="mr-2" />
                View Wishlist
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}