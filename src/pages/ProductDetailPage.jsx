// src/pages/ProductDetailPage.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, Share2, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore, useWishlistStore } from '@/store';
import { useToast } from '@/contexts/ToastContext';
import RatingStars from '@/components/reviews/RatingStars';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import Modal from '@/components/common/Modal';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const toast = useToast();

  // Mock product data
  const product = {
    id,
    name: 'Fresh Organic Spinach',
    price: 120,
    originalPrice: 180,
    rating: 4.8,
    reviews: 234,
    image: '🥬',
    category: 'Vegetables',
    description: 'Fresh, organic spinach harvested today. Rich in iron and nutrients.',
    farmers: [
      { id: 1, name: 'Ram Sharma', location: 'Karnataka', rating: 4.9 },
      { id: 2, name: 'Priya Singh', location: 'Punjab', rating: 4.7 },
    ],
    certifications: ['Organic', 'Fair Trade', 'Pesticide Free'],
    storage: 'Keep in refrigerator, consume within 3 days',
    nutritionPer100g: {
      calories: 23,
      protein: '2.9g',
      carbs: '3.6g',
      fiber: '2.2g',
    },
  };

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      buyer_name: 'Rajesh Kumar',
      rating: 5,
      title: 'Excellent Quality',
      comment: 'Very fresh and organic. Highly recommended!',
      is_verified_purchase: true,
      created_at: '2024-12-20T10:00:00Z',
      helpful_count: 12,
    },
    {
      id: 2,
      buyer_name: 'Priya Singh',
      rating: 4,
      title: 'Good Product',
      comment: 'Good quality produce, delivered on time.',
      is_verified_purchase: true,
      created_at: '2024-12-19T14:30:00Z',
      helpful_count: 8,
    },
  ];

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success('Added to cart!');
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Review submitted successfully!');
    setShowReviewForm(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
            <span className="text-9xl">{product.image}</span>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <span className="text-sm text-green-600 font-semibold">{product.category}</span>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <RatingStars rating={product.rating} size={20} />
              <span className="text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
                <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                <span className="text-green-600 font-semibold">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded hover:bg-gray-100"
                >
                  −
                </button>
                <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 text-lg"
              >
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={`w-12 h-12 ${inWishlist ? 'text-red-600 border-red-300' : ''}`}
                onClick={handleWishlistToggle}
              >
                <Heart size={20} className={inWishlist ? 'fill-red-600' : ''} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-12 h-12"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: product.name,
                      text: `Check out ${product.name} on FarmerToBuyer!`,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copied to clipboard!');
                  }
                }}
              >
                <Share2 size={20} />
              </Button>
            </div>

            {/* Benefits */}
            <div className="space-y-3 border-t border-gray-200 pt-6">
              <div className="flex gap-3">
                <Truck className="text-green-600 flex-shrink-0" size={20} />
                <div>
                  <p className="font-medium text-gray-900">Fast Delivery</p>
                  <p className="text-sm text-gray-600">Same-day or next-day delivery</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Shield className="text-green-600 flex-shrink-0" size={20} />
                <div>
                  <p className="font-medium text-gray-900">Quality Guaranteed</p>
                  <p className="text-sm text-gray-600">100% fresh or money back</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Tabs */}
        <div className="border-t pt-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h3>
              <div className="space-y-2">
                {product.certifications.map((cert) => (
                  <div key={cert} className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <p className="text-gray-600">{cert}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage</h3>
              <p className="text-gray-600">{product.storage}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutrition (per 100g)</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">Calories: {product.nutritionPer100g.calories}</p>
                <p className="text-gray-600">Protein: {product.nutritionPer100g.protein}</p>
                <p className="text-gray-600">Carbs: {product.nutritionPer100g.carbs}</p>
                <p className="text-gray-600">Fiber: {product.nutritionPer100g.fiber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t pt-12 mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
              <p className="text-gray-600 mt-1">{reviews.length} reviews</p>
            </div>
            <Button onClick={() => setShowReviewForm(true)} className="bg-green-600 hover:bg-green-700">
              Write a Review
            </Button>
          </div>
          <ReviewList reviews={reviews} />
        </div>
      </div>

      {/* Review Form Modal */}
      <Modal
        isOpen={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        title="Write a Review"
        size="lg"
      >
        <ReviewForm
          productId={product.id}
          onSubmit={handleReviewSubmit}
          onCancel={() => setShowReviewForm(false)}
        />
      </Modal>
    </div>
  );
}