// src/components/products/ProductCard.jsx
import { ShoppingCart, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCartStore, useWishlistStore } from '@/store';
import { useToast } from '@/contexts/ToastContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const toast = useToast();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success('Added to cart!');
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition overflow-hidden group">
      {/* Image */}
      <div className="bg-gray-100 h-48 flex items-center justify-center relative overflow-hidden">
        <span className="text-6xl group-hover:scale-110 transition">{product.image}</span>
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition ${
            inWishlist ? 'text-red-600' : 'text-gray-600'
          }`}
        >
          <Heart size={18} className={inWishlist ? 'fill-red-600' : ''} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-green-600 font-semibold mb-1">{product.category}</p>
        <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 my-2">
          <span className="text-yellow-500">⭐ {product.rating}</span>
        </div>

        {/* Price */}
        <p className="text-xl font-bold text-gray-900 mb-3">₹{product.price}</p>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={(e) => {
              e.preventDefault();
              navigate(`/products/${product.id}`);
            }}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            View
          </Button>
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <ShoppingCart size={16} className="mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}