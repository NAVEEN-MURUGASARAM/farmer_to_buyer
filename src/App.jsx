// src/App.jsx
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "@/store";

// Pages
import HomePage from "@/pages/HomePage";
import AuthPage from "@/pages/AuthPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import FarmerDashboardPage from "@/pages/FarmerDashboardPage";
import BuyerDashboardPage from "@/pages/BuyerDashboardPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderDetailsPage from "@/pages/OrderDetailsPage";
import AddressManagementPage from "@/pages/AddressManagementPage";
import WishlistPage from "@/pages/WishlistPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFoundPage from "@/pages/NotFoundPage";

// Layout
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/common/Footer";

// Protected Route Component
function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, userRole } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const { isAuthenticated, setUser, setUserRole, setToken } = useAuthStore();

  useEffect(() => {
    // Initialize auth state from localStorage on app load
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Restore auth state from localStorage
        setUser(user);
        setUserRole(user.role);
        setToken(storedToken);
      } catch (error) {
        // If parsing fails, clear invalid data
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
      }
    }
  }, [setUser, setUserRole, setToken]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        {/* Only show Navbar and Footer for authenticated users */}
        {isAuthenticated && <Navbar />}

        <main className="flex-grow">
          <Routes>
            {/* Auth Route - Redirect if already logged in */}
            <Route
              path="/auth"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />
              }
            />

            {/* Legacy auth routes - redirect to /auth */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />

            {/* Protected Routes - All internal pages require authentication */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id"
              element={
                <ProtectedRoute>
                  <ProductDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <AboutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <ProtectedRoute>
                  <ContactPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Farmer */}
            <Route
              path="/farmer/dashboard"
              element={
                <ProtectedRoute requiredRole="farmer">
                  <FarmerDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Buyer */}
            <Route
              path="/buyer/dashboard"
              element={
                <ProtectedRoute requiredRole="buyer">
                  <BuyerDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute requiredRole="buyer">
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addresses"
              element={
                <ProtectedRoute requiredRole="buyer">
                  <AddressManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute requiredRole="buyer">
                  <WishlistPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Catch all - 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Only show Footer for authenticated users */}
        {isAuthenticated && <Footer />}
      </div>
    </Router>
  );
}
