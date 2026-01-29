// src/components/products/ProductDetail.jsx
import React, { useState } from 'react';
import { Star, Phone, Trash2, Edit, ShoppingCart } from 'lucide-react';
import { useAuthStore, useCartStore } from '@/store';
import { productService } from '@/services/productService';
import { useToast } from '@/contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

const ProductDetail = ({ product }) => {
  const [quantity, setQuantity] = useState(10);
  const { userRole, token } = useAuthStore();
  const { addToCart } = useCartStore();
  const toast = useToast();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success('Added to cart!');
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.deleteProduct(product.id, token);
      toast.success("Product deleted successfully");
      navigate('/farmer/dashboard'); // Redirect to dashboard after delete
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleEdit = () => {
    // For now, alert or placeholder since we don't have a dedicated edit page yet
    // In a real app, strict navigation to /edit-product/:id
    alert("Edit functionality coming soon!");
  };

  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="grid md:grid-cols-2 gap-8 p-8">
        <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-16 flex items-center justify-center relative overflow-hidden">
          {!imgError && product.image && product.image.startsWith('http') ? (
             <img 
               src={product.image} 
               alt={product.name} 
               className="absolute inset-0 w-full h-full object-cover"
               onError={() => setImgError(true)} 
             />
          ) : (
             <div className="text-9xl">{product.image && !product.image.startsWith('http') ? product.image : "🥬"}</div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">{product.crop_name || product.name}</h1>
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(star => (
                <Star 
                  key={star} 
                  size={20} 
                  className={star <= (product.rating || 4) ? "text-yellow-500 fill-current" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-gray-600">({product.rating || "New"} rating)</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">City / Location:</span>
              <span className="font-semibold">{product.city}, {product.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available Stock:</span>
              <span className="font-semibold">{product.quantity} {product.unit || 'kg'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pincode:</span>
              <span className="font-semibold">{product.pincode}</span>
            </div>
          </div>

          {/* Quantity Selector - Show only for buyers or if viewing details generally, but maybe hide for farmer if they can't buy? 
              The prompt implies hiding "Add to Cart", doesn't explicitly say hide quantity selector, but it makes sense to hide it if they can't buy.
              However, keeping it simple.
          */} 
          {userRole !== 'farmer' && (
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Quantity ({product.unit || 'kg'})</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                min="1"
                max={product.quantity}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          )}

          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between text-lg mb-2">
              <span>Price per {product.unit || 'kg'}:</span>
              <span className="font-semibold">₹{product.price_per_unit || product.price}</span>
            </div>
            {userRole !== 'farmer' && (
              <div className="flex justify-between text-2xl font-bold text-green-600">
                <span>Total:</span>
                <span>₹{(product.price_per_unit || product.price) * quantity}</span>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {userRole === 'farmer' ? (
              <>
                <button 
                  onClick={handleEdit}
                  className="flex-1 px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition font-semibold flex items-center justify-center gap-2"
                >
                  <Edit size={20} /> Edit Product
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center justify-center gap-2"
                >
                  <Trash2 size={20} /> Delete Product
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} /> Add to Cart
                </button>
                <button className="px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition font-semibold">
                  <Phone size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Product Details</h2>
        <p className="text-gray-600 leading-relaxed">
          {product.description || "Fresh, high-quality produce directly from the farm. Grown using sustainable farming practices."}
        </p>
      </div>
    </div>
  );
};

export default ProductDetail;