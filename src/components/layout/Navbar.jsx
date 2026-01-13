// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, LogOut, Heart } from 'lucide-react';
import { useAuthStore, useCartStore, useWishlistStore } from '@/store';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, userRole, logout } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white border-b border-green-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-green-700 hidden sm:inline">FarmerToBuyer</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/products" className="text-gray-700 hover:text-green-600 transition">
              Products
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600 transition">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-green-600 transition">
              Contact
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Wishlist Icon - Only for Buyers */}
                {userRole === 'buyer' && (
                  <button
                    onClick={() => navigate('/wishlist')}
                    className="relative p-2 text-gray-700 hover:text-green-600 transition"
                  >
                    <Heart size={24} />
                    {wishlistItems.length > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {wishlistItems.length}
                      </span>
                    )}
                  </button>
                )}

                {/* Cart Icon - Only for Buyers */}
                {userRole === 'buyer' && (
                  <button
                    onClick={() => navigate('/buyer/dashboard?tab=cart')}
                    className="relative p-2 text-gray-700 hover:text-green-600 transition"
                  >
                    <ShoppingCart size={24} />
                    {cartItems.length > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </button>
                )}

                {/* User Menu */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 hidden sm:inline">
                    {user?.name || 'User'}
                  </span>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-700 font-semibold text-sm">
                      {user?.name?.[0] || 'U'}
                    </span>
                  </div>
                </div>

                {/* Dashboard Link */}
                <Link
                  to={userRole === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard'}
                  className="hidden sm:inline text-sm text-gray-700 hover:text-green-600 transition"
                >
                  Dashboard
                </Link>

                {/* Logout Button */}
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:text-red-600"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register" className="hidden sm:inline">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-700 hover:text-green-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-green-200">
            <Link
              to="/products"
              className="block py-2 text-gray-700 hover:text-green-600 transition"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/about"
              className="block py-2 text-gray-700 hover:text-green-600 transition"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-gray-700 hover:text-green-600 transition"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to={userRole === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard'}
                  className="block py-2 text-gray-700 hover:text-green-600 transition sm:hidden"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}