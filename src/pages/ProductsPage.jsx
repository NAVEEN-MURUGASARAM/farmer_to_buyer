// src/pages/ProductsPage.jsx
import { useState, useEffect } from 'react';
import { productService } from '@/services/productService';
import { useAuthStore } from '@/store';
import ProductList from '@/components/products/ProductList';
import FilterSection from '@/components/products/FilterSection';
import SearchBar from '@/components/products/SearchBar';

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(true);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userRole, token } = useAuthStore();

  useEffect(() => {
    fetchProducts();
  }, [userRole]); // Re-fetch if role changes

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let data;
      // Fetch based on role
      if (userRole === 'farmer') {
        data = await productService.getMyProducts(token);
      } else {
        // Buyers and guests see all products
        data = await productService.getAllProducts();
      }
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

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
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading fresh produce...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">
                <p>{error}</p>
                <button 
                  onClick={fetchProducts}
                  className="mt-4 text-green-600 underline hover:text-green-700"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <ProductList products={products} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}