// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, Share2, Truck, Shield, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore, useCartStore, useWishlistStore } from '@/store';
import { useToast } from '@/contexts/ToastContext';
import { productService } from '@/services/productService';
import RatingStars from '@/components/reviews/RatingStars';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import Modal from '@/components/common/Modal';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { userRole, token } = useAuthStore();
  const toast = useToast();

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (err) {
      console.error("Failed to load product:", err);
      setError("Product not found or failed to load.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    // Map backend fields to cart item structure if needed, or pass full object
    const cartItem = {
      id: product.id,
      name: product.crop_name || product.name,
      price: product.price_per_unit || product.price,
      image: product.image,
      ...product
    };
    addToCart(cartItem, quantity);
    toast.success('Added to cart!');
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.deleteProduct(product.id, token);
      toast.success("Product deleted successfully");
      navigate('/farmer/dashboard'); 
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleEdit = () => {
    navigate(`/farmer/edit-product/${product.id}`);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    const item = {
      id: product.id,
      name: product.crop_name || product.name,
      price: product.price_per_unit || product.price,
      image: product.image,
      ...product
    };

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(item);
      toast.success('Added to wishlist');
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Review submitted successfully!');
    setShowReviewForm(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error || "Product not found"}</p>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  // Derived / Fallback data
  const productName = product.crop_name || product.name || "Unknown Product";
  const productPrice = product.price_per_unit || product.price || 0;
  const productUnit = product.unit || 'kg';
  const displayImage = product.image || "🥬";
  const rating = product.rating || 4.5;
  const reviewCount = product.reviews || 0;
  const inWishlist = isInWishlist(product.id);

  // Fallback for missing backend fields
  const nutrition = product.nutritionPer100g || {
    calories: '23',
    protein: '2.9g',
    carbs: '3.6g',
    fiber: '2.2g',
  };
  const certifications = product.certifications || ['Organic', 'Farm Fresh'];
  const storageInfo = product.storage || 'Keep in simple storage';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
            <span className="text-9xl">{displayImage}</span>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <span className="text-sm text-green-600 font-semibold">{product.category || "Fresh Produce"}</span>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{productName}</h1>
              <p className="text-gray-500 text-sm mt-1">
                From: {product.city}, {product.state} ({product.pincode})
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <RatingStars rating={rating} size={20} />
              <span className="text-gray-600">
                {rating} ({reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-gray-900">₹{productPrice}</span>
                <span className="text-lg text-gray-500">/{productUnit}</span>
              </div>
              <p className="text-sm text-gray-600">Available Stock: {product.quantity} {productUnit}</p>
            </div>

            {/* Quantity Selector - HIDE for Farmers */}
            {userRole !== 'farmer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity ({productUnit})</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className="w-10 h-10 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {userRole === 'farmer' ? (
                /* Farmer Actions */
                <>
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="flex-1 h-12 text-lg border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <Edit size={20} className="mr-2" /> Edit Product
                  </Button>
                  <Button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white h-12 text-lg"
                  >
                    <Trash2 size={20} className="mr-2" /> Delete Product
                  </Button>
                </>
              ) : (
                /* Buyer Actions */
                <>
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
                </>
              )}
              
              <Button
                variant="outline"
                size="lg"
                className="w-12 h-12"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard!');
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
                {certifications.map((cert) => (
                  <div key={cert} className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <p className="text-gray-600">{cert}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage</h3>
              <p className="text-gray-600">{storageInfo}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutrition (per 100g)</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">Calories: {nutrition.calories}</p>
                <p className="text-gray-600">Protein: {nutrition.protein}</p>
                <p className="text-gray-600">Carbs: {nutrition.carbs}</p>
                <p className="text-gray-600">Fiber: {nutrition.fiber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t pt-12 mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
              <p className="text-gray-600 mt-1">{reviewCount} reviews</p>
            </div>
            {userRole !== 'farmer' && (
              <Button onClick={() => setShowReviewForm(true)} className="bg-green-600 hover:bg-green-700">
                Write a Review
              </Button>
            )}
          </div>
          <ReviewList reviews={[]} /> {/* Using empty reviews for now as backend doesn't support them */}
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