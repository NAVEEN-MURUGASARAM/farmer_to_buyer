// src/pages/ProductsPage.jsx
import { useState } from 'react';
import ProductList from '@/components/products/ProductList';
import FilterSection from '@/components/products/FilterSection';
import SearchBar from '@/components/products/SearchBar';

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(true);

  // Mock products data
  const mockProducts = [
    { id: 1, name: 'Organic Spinach', price: 45, image: '🥬', category: 'Vegetables', rating: 4.8 },
    { id: 2, name: 'Fresh Tomatoes', price: 60, image: '🍅', category: 'Vegetables', rating: 4.7 },
    { id: 3, name: 'Carrots Bundle', price: 50, image: '🥕', category: 'Vegetables', rating: 4.9 },
    { id: 4, name: 'Fresh Apples', price: 80, image: '🍎', category: 'Fruits', rating: 4.8 },
    { id: 5, name: 'Bananas', price: 40, image: '🍌', category: 'Fruits', rating: 4.6 },
    { id: 6, name: 'Fresh Milk', price: 65, image: '🥛', category: 'Dairy', rating: 4.9 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop Fresh Produce</h1>
          <SearchBar />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <FilterSection />
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            <ProductList products={mockProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}