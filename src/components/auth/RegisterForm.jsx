// src/components/auth/RegisterForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RegisterForm({ onSwitchMode }) {
  const [step, setStep] = useState(1); // 1: Role Selection, 2: Form, 3: Success
  const [role, setRole] = useState(null); // 'farmer' or 'buyer'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setUserRole, setToken } = useAuthStore();
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock user data
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role,
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      // Store in Zustand
      setUser(newUser);
      setUserRole(role);
      setToken(mockToken);

      // Store in localStorage
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('authUser', JSON.stringify(newUser));

      toast.success('Account created successfully!');

      // Show success and redirect
      setStep(3);

      setTimeout(() => {
        // Redirect to Home page after successful signup
        navigate('/');
      }, 2000);
    } catch (err) {
      const errorMsg = err.message || 'Registration failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Step 1: Role Selection */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 text-center mb-6">
            Are you a farmer selling fresh produce or a buyer looking for quality products?
          </p>

          <button
            onClick={() => {
              setRole('farmer');
              setStep(2);
            }}
            className="w-full p-4 border-2 border-green-300 rounded-lg hover:bg-green-50 transition group"
          >
            <div className="text-2xl mb-2">👨‍🌾</div>
            <h3 className="font-semibold text-gray-800 group-hover:text-green-600">I'm a Farmer</h3>
            <p className="text-xs text-gray-600">Sell your fresh produce</p>
          </button>

          <button
            onClick={() => {
              setRole('buyer');
              setStep(2);
            }}
            className="w-full p-4 border-2 border-blue-300 rounded-lg hover:bg-blue-50 transition group"
          >
            <div className="text-2xl mb-2">🛒</div>
            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">I'm a Buyer</h3>
            <p className="text-xs text-gray-600">Find fresh products from farmers</p>
          </button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchMode}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      )}

      {/* Step 2: Registration Form */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-sm text-gray-600 hover:text-gray-800 mb-4"
          >
            ← Back to role selection
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex gap-2">
              <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="pl-10 border-gray-300"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 border-gray-300"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 border-gray-300"
                disabled={isLoading}
                required
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="pl-10 border-gray-300"
                disabled={isLoading}
                required
                minLength={6}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" className="rounded border-gray-300" required />
            I agree to the Terms of Service and Privacy Policy
          </label>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader size={18} className="animate-spin mr-2" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchMode}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Sign in
            </button>
          </p>
        </form>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center">
            <CheckCircle className="text-green-600" size={64} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Account Created Successfully!</h3>
          <p className="text-sm text-gray-600">
            Welcome to FarmerToBuyer, {formData.name}. Redirecting to home...
          </p>
        </div>
      )}
    </div>
  );
}
