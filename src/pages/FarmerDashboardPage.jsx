import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { orderService } from '@/services/orderService';
import { BarChart3, Plus, Package, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatsCards from '@/components/farmer/StatsCards';
import RecentOrders from '@/components/farmer/RecentOrders';
import MyListings from '@/components/farmer/MyListings';
import AddProductForm from '@/components/farmer/AddProductForm';

export default function FarmerDashboardPage() {
  const { user, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
        try {
            if (token) {
                const data = await orderService.getFarmerOrders(token);
                setOrders(data);
            }
        } catch (error) {
            console.error("Failed to fetch farmer orders:", error);
        }
    };
    fetchOrders();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {user?.name}! 👨‍🌾</p>
            </div>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setActiveTab('add-product')}
            >
              <Plus size={18} className="mr-2" />
              Add New Product
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <BarChart3 className="inline mr-2" size={18} />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'listings'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="inline mr-2" size={18} />
            My Listings
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'orders'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="inline mr-2" size={18} />
            Orders
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <StatsCards />
            <RecentOrders orders={orders} />
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && <MyListings />}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>Manage and track all your orders</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Orders list coming soon...</p>
            </CardContent>
          </Card>
        )}

        {/* Add Product Tab */}
        {activeTab === 'add-product' && (
           <AddProductForm setCurrentScreen={setActiveTab} />
        )}
      </div>
    </div>
  );
}