// src/components/farmer/StatsCards.jsx
import { TrendingUp, Package, Users, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function StatsCards() {
  const stats = [
    { icon: Package, label: 'Active Listings', value: 24, color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Users, label: 'Total Buyers', value: 156, color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: DollarSign, label: 'Total Revenue', value: '₹24,500', color: 'text-orange-600', bg: 'bg-orange-50' },
    { icon: TrendingUp, label: 'Monthly Growth', value: '+12%', color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition">
            <CardContent className="pt-6">
              <div className={`inline-block p-3 ${stat.bg} rounded-lg mb-4`}>
                <Icon className={`${stat.color} w-6 h-6`} />
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// src/components/farmer/RecentOrders.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RecentOrders() {
  const orders = [
    { id: 'ORD001', buyer: 'Rajesh Kumar', amount: '₹1,200', status: 'Delivered', date: '2024-12-20' },
    { id: 'ORD002', buyer: 'Priya Singh', amount: '₹850', status: 'Shipped', date: '2024-12-19' },
    { id: 'ORD003', buyer: 'Amit Patel', amount: '₹2,100', status: 'Pending', date: '2024-12-18' },
    { id: 'ORD004', buyer: 'Sneha Desai', amount: '₹650', status: 'Delivered', date: '2024-12-17' },
  ];

  const statusColor = {
    Delivered: 'bg-green-100 text-green-800',
    Shipped: 'bg-blue-100 text-blue-800',
    Pending: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Your latest orders from buyers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex justify-between items-center border-b pb-4 last:border-0">
              <div>
                <p className="font-medium text-gray-900">{order.id}</p>
                <p className="text-sm text-gray-600">{order.buyer}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{order.amount}</p>
                <span className={`text-xs font-medium px-2 py-1 rounded ${statusColor[order.status]}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// src/components/farmer/MyListings.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';

export default function MyListings() {
  const listings = [
    { id: 1, name: 'Organic Spinach', price: '₹120', stock: 25, rating: 4.8, sales: 156 },
    { id: 2, name: 'Fresh Tomatoes', price: '₹60', stock: 40, rating: 4.7, sales: 234 },
    { id: 3, name: 'Carrots Bundle', price: '₹50', stock: 15, rating: 4.9, sales: 189 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Product Listings</CardTitle>
        <CardDescription>Manage your products and inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left py-3 font-semibold text-gray-900">Product</th>
                <th className="text-left py-3 font-semibold text-gray-900">Price</th>
                <th className="text-left py-3 font-semibold text-gray-900">Stock</th>
                <th className="text-left py-3 font-semibold text-gray-900">Rating</th>
                <th className="text-left py-3 font-semibold text-gray-900">Sales</th>
                <th className="text-left py-3 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 text-gray-900">{listing.name}</td>
                  <td className="py-3 text-gray-600">{listing.price}</td>
                  <td className="py-3 text-gray-600">{listing.stock}</td>
                  <td className="py-3">
                    <span className="text-yellow-500">⭐ {listing.rating}</span>
                  </td>
                  <td className="py-3 text-gray-600">{listing.sales}</td>
                  <td className="py-3 flex gap-2">
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      <Eye size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-green-600">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}