// src/components/products/FilterSection.jsx
export default function FilterSection({ filters, setFilters }) {
  const handlePriceChange = (e) => {
    setFilters(prev => ({ ...prev, priceRange: parseInt(e.target.value) }));
  };

  const handleCategoryChange = (cat) => {
    setFilters(prev => {
      const newCategories = prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat];
      return { ...prev, categories: newCategories };
    });
  };

  const handleRatingChange = (rating) => {
    // If clicking same rating, maybe toggle off? Or just set. Let's set.
    // Or if currently set, unset (0).
    setFilters(prev => ({
      ...prev,
      minRating: prev.minRating === rating ? 0 : rating
    }));
  };

  return (
    <div className="space-y-6">
      {/* Price Filter */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Max Price: ₹{filters.priceRange}</h3>
        <input 
          type="range" 
          min="0" 
          max="1000" 
          step="10"
          value={filters.priceRange}
          onChange={handlePriceChange}
          className="w-full" 
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>₹0</span>
          <span>₹1000</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Category</h3>
        <div className="space-y-2">
          {['Vegetables', 'Fruits', 'Dairy', 'Grains'].map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.categories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
                className="rounded" 
              />
              <span className="text-gray-700">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" // Logic acts like radio for min rating
                checked={filters.minRating === rating}
                onChange={() => handleRatingChange(rating)}
                className="rounded" 
              />
              <span className="text-gray-700">{rating}★ & up</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}