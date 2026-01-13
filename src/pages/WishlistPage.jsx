// src/pages/WishlistPage.jsx
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useWishlistStore, useCartStore } from '@/store';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { items, removeFromWishlist, clearWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const toast = useToast();

  const handleAddToCart = (item) => {
    addToCart(
      {
        id: item.productId,
        name: item.name,
        price: item.price,
      },
      1
    );
    toast.success('Added to cart!');
  };

  const handleRemove = (productId) => {
    removeFromWishlist(productId);
    toast.success('Removed from wishlist');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      clearWishlist();
      toast.success('Wishlist cleared');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-1">{items.length} items saved</p>
          </div>
          {items.length > 0 && (
            <Button variant="outline" onClick={handleClearAll}>
              Clear All
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Heart className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">Start adding products you love!</p>
              <Button onClick={() => navigate('/products')} className="bg-green-600 hover:bg-green-700">
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <Card key={item.productId} className="group hover:shadow-lg transition">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
                    <span className="text-6xl">{item.image || '📦'}</span>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                    >
                      <Heart className="text-red-600 fill-red-600" size={18} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                    <p className="text-xl font-bold text-gray-900 mb-4">₹{item.price}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <ShoppingCart size={16} className="mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/products/${item.productId}`)}
                        size="sm"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

