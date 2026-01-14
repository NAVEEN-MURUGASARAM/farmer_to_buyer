// src/components/products/ProductDetail.jsx
import React, { useState } from 'react';
import { Star, Phone } from 'lucide-react';

const ProductDetail = ({ product }) => {
  const [quantity, setQuantity] = useState(10);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="grid md:grid-cols-2 gap-8 p-8">
        <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-16 flex items-center justify-center">
          <div className="text-9xl">{product.image || "🥬"}</div>
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

          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between text-lg mb-2">
              <span>Price per {product.unit || 'kg'}:</span>
              <span className="font-semibold">₹{product.price_per_unit || product.price}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-green-600">
              <span>Total:</span>
              <span>₹{(product.price_per_unit || product.price) * quantity}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg">
              Buy Now
            </button>
            <button className="px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition font-semibold">
              <Phone size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Product Details</h2>
        <p className="text-gray-600 leading-relaxed">
          Fresh, high-quality produce directly from the farm. 
          Grown using sustainable farming practices. Perfect for cooking, salads, and daily use. 
          Available for immediate delivery or pickup.
        </p>
      </div>
    </div>
  );
};

export default ProductDetail;