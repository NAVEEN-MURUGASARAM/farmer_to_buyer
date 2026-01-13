// src/components/home/Hero.jsx
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-green-50 via-white to-blue-50 pt-20 pb-24 sm:pt-32 sm:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Fresh Farm to Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
                  Table
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-lg">
                Connect directly with local farmers and get the freshest produce delivered to your doorstep. 
                Support agriculture, eat healthy.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/products">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                  Explore Products
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 w-full sm:w-auto"
                >
                  Join as Farmer
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-8 pt-8">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">5000+</p>
                <p className="text-sm text-gray-600">Active Farmers</p>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">50K+</p>
                <p className="text-sm text-gray-600">Happy Buyers</p>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">100%</p>
                <p className="text-sm text-gray-600">Fresh Produce</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-blue-200 rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 space-y-4">
              <div className="space-y-3">
                <div className="h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center text-4xl">
                  🥬
                </div>
                <h3 className="font-semibold text-gray-800">Fresh Organic Vegetables</h3>
                <p className="text-sm text-gray-600">Harvested today, delivered fresh</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-green-600">₹120</span>
                  <span className="text-sm text-gray-500 line-through">₹180</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl">🌾</p>
                  <p className="text-xs text-gray-600 mt-1">Organic</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl">🚚</p>
                  <p className="text-xs text-gray-600 mt-1">Fast Delivery</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl">⭐</p>
                  <p className="text-xs text-gray-600 mt-1">Rated 4.9</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}