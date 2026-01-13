// src/components/farmer/QuickActions.jsx
import React from 'react';

const QuickActions = ({ setCurrentScreen }) => {
  return (
    <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
      <div className="space-y-3">
        <button 
          onClick={() => setCurrentScreen('add-product')}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
        >
          + Add New Listing
        </button>
        <button className="w-full px-4 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition font-semibold">
          View Orders
        </button>
        <button className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold">
          My Profile
        </button>
      </div>
    </div>
  );
};

export default QuickActions;