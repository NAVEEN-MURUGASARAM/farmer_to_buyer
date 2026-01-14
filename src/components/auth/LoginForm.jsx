// src/components/auth/LoginForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';
import { useAuthStore } from '@/store';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginForm({ onSwitchMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setUserRole, setToken, setError: setStoreError } = useAuthStore();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate inputs
      if (!email || !password) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email');
        setIsLoading(false);
        return;
      }

      // Simulate API call - Replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data - In production, this comes from backend
      const mockUser = {
        id: '1',
        name: email.split('@')[0],
        email,
        role: email.includes('farmer') ? 'farmer' : 'buyer',
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      // Store in Zustand
      setUser(mockUser);
      setUserRole(mockUser.role);
      setToken(mockToken);

      // Store in localStorage for persistence
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('authUser', JSON.stringify(mockUser));

      toast.success('Login successful!');

      // Redirect to Home page after successful login
      navigate('/');
    } catch (err) {
      const errorMsg = err.message || 'Login failed. Please try again.';
      setError(errorMsg);
      setStoreError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoEmail = role === 'farmer' ? 'farmer@demo.com' : 'buyer@demo.com';
    setEmail(demoEmail);
    setPassword('demo123');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 flex gap-2">
          <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Email Input */}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 border-gray-300"
            disabled={isLoading}
            required
          />
        </div>
      </div>

      {/* Password Input */}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 border-gray-300"
            disabled={isLoading}
            required
          />
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-gray-700">
          <input type="checkbox" className="rounded border-gray-300" />
          Remember me
        </label>
        <button type="button" className="text-green-600 hover:text-green-700 font-medium">
          Forgot password?
        </button>
      </div>

      {/* Login Button */}
      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader size={18} className="animate-spin mr-2" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
        </div>
      </div>

      {/* Demo Login Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleDemoLogin('farmer')}
          disabled={isLoading}
          className="text-xs"
        >
          Farmer Demo
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleDemoLogin('buyer')}
          disabled={isLoading}
          className="text-xs"
        >
          Buyer Demo
        </Button>
      </div>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchMode}
          className="text-green-600 hover:text-green-700 font-medium"
        >
          Sign up here
        </button>
      </p>
    </form>
  );
}