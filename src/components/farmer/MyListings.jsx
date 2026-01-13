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