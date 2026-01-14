import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import { productService } from '@/services/productService';

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const data = await productService.getMyProducts(token);
      setListings(data);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const token = localStorage.getItem('authToken');
      await productService.deleteProduct(id, token);
      setListings(listings.filter(item => item.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Product Listings</CardTitle>
        <CardDescription>Manage your products and inventory</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading products...</div>
        ) : (
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
                {listings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No products found. Start adding some!
                    </td>
                  </tr>
                ) : (
                  listings.map((listing) => (
                    <tr key={listing.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 text-gray-900">{listing.crop_name || listing.name}</td>
                      <td className="py-3 text-gray-600">₹{listing.price_per_unit || listing.price}/{listing.unit || 'kg'}</td>
                      <td className="py-3 text-gray-600">{listing.quantity} {listing.unit || 'kg'}</td>
                      <td className="py-3">
                        <span className="text-yellow-500">⭐ {listing.rating || 'New'}</span>
                      </td>
                      <td className="py-3 text-gray-600">{listing.sales || 0}</td>
                      <td className="py-3 flex gap-2">
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-green-600">
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDelete(listing.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}