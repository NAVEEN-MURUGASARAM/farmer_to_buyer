// src/components/products/FilterSection.jsx
export default function FilterSection() {
  return (
    <div className="space-y-6">
      {/* Price Filter */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
        <input type="range" min="0" max="500" className="w-full" />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>₹0</span>
          <span>₹500</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Category</h3>
        <div className="space-y-2">
          {['Vegetables', 'Fruits', 'Dairy', 'Grains'].map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-700">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Rating</h3>
        <div className="space-y-2">
          {['4★ & up', '3★ & up', '2★ & up', '1★ & up'].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-700">{rating}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}