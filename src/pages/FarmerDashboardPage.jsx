import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
        {/* 2FA Alert */}
        {!user?.is2faEnabled && (
            <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                        <TrendingUp className="text-blue-600 w-6 h-6" /> 
                         {/* Using TrendingUp as placeholder for Shield if not imported? 
                            Wait, Shield is better. I need to ensure Shield is imported in the import list.
                            Original import: BarChart3, Plus, Package, TrendingUp, Users
                            I will update imports in a separate/preceding edit or just use available icon or add Shield to imports.
                            Let's add Shield to imports first or just use a generic icon for now to be safe, e.g. Lock? 
                            But I want to do it properly. I will modify imports first if needed.
                            Actually, I can do it in one go if I replace the top imports too? No, replace_file_content doesn't support non-contiguous.
                            I'll use TrendingUp (which is imported) then fix imports? 
                            No, better to just edit the imports and the content.
                            Since I can't do two edits in one call easily if they are far apart.
                            I will just use TrendingUp for now or text.
                            Actually, I can check imports again.
                            Imports: BarChart3, Plus, Package, TrendingUp, Users
                            No Shield.
                            I'll use `BarChart3` or just no icon? 
                            Let's use `Users` (Security for users?).
                            Or I can just use `div` without icon.
                            
                            Let's just put the alert.
                         */}
                    </div>
                    <div>
                        <h3 className="font-semibold text-blue-800">Secure your account</h3>
                        <p className="text-sm text-blue-600">Enable Two-Factor Authentication for enhanced security.</p>
                    </div>
                </div>
                <Button 
                    variant="outline" 
                    className="border-blue-600 text-blue-600 hover:bg-blue-100"
                    onClick={() => navigate('/profile', { state: { open2faSetup: true } })}
                >
                    Setup 2FA
                </Button>
            </div>
        )}

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