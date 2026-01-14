// src/components/farmer/AddProductForm.jsx
import React, { useState } from 'react';
import { productService } from '@/services/productService';

const AddProductForm = ({ setCurrentScreen }) => {
  const [formData, setFormData] = useState({
    crop_name: '',
    unit: '',
    quantity: '',
    price_per_unit: '',
    state: '',
    city: '',
    pincode: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      // Construct payload strictly matching backend requirement
      const payload = {
        crop_name: formData.crop_name,
        unit: formData.unit,
        price_per_unit: parseFloat(formData.price_per_unit),
        quantity: parseInt(formData.quantity),
        state: formData.state,
        city: formData.city,
        pincode: formData.pincode
      };

      await productService.createProduct(payload, token);
      
      setCurrentScreen('listings'); 
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Failed to create product. Please check your inputs.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Crop Name</label>
          <input
            type="text"
            placeholder="e.g., Tomato"
            value={formData.crop_name}
            onChange={(e) => setFormData({...formData, crop_name: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Unit</label>
            <select 
              value={formData.unit}
              onChange={(e) => setFormData({...formData, unit: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select Unit</option>
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="dozen">dozen</option>
              <option value="pcs">pcs</option>
              <option value="quintal">quintal</option>
              <option value="ton">ton</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
            <input
              type="number"
              placeholder="e.g., 100"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Price Per Unit (₹)</label>
          <input
            type="number"
            placeholder="e.g., 45"
            value={formData.price_per_unit}
            onChange={(e) => setFormData({...formData, price_per_unit: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">State</label>
            <input
              type="text"
              placeholder="e.g., Karnataka"
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">City</label>
            <input
              type="text"
              placeholder="e.g., Bangalore"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Pincode</label>
            <input
              type="text"
              placeholder="e.g., 560001"
              value={formData.pincode}
              onChange={(e) => setFormData({...formData, pincode: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => setCurrentScreen('farmer-dashboard')}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
          >
            {isLoading ? 'Publishing...' : 'Publish Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;