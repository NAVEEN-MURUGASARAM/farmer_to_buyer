// src/components/auth/LoginForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Lock, AlertCircle, Loader } from "lucide-react";
import { useAuthStore } from "@/store";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/services/api";

export default function LoginForm({ onSwitchMode }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // 2FA State
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [otp, setOtp] = useState("");
  
  const navigate = useNavigate();
  const { setUser, setUserRole, setToken, setError: setStoreError, logout } =
    useAuthStore();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Basic validation
      if (!phone || !password) {
        setError("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      if (!/^[0-9]{8,15}$/.test(phone)) {
        setError("Please enter a valid phone number");
        setIsLoading(false);
        return;
      }

      // Call backend login
      const loginRes = await authApi.login({ phone, password });
      
      // Check if 2FA is required
      if (loginRes?.twoFactorRequired) {
        setTempToken(loginRes.token);
        setRequires2FA(true);
        setIsLoading(false);
        toast.info("Please enter your 6-digit OTP code");
        return;
      }
      
      const token = loginRes?.token;

      if (!token) {
        throw new Error("No token returned from server");
      }

      // Decode token to get any available info
      const { parseJwt } = await import("@/services/api");
      const decoded = parseJwt(token);
      
      const profile = {
        ...decoded,
        role: loginRes.role || decoded?.role,
        phone: phone,
        name: decoded?.name || decoded?.sub || "User",
        is2faEnabled: false, // If we're here without OTP, 2FA is not enabled
      };      

      // Store in Zustand
      setUser(profile);
      setUserRole(profile?.role);
      setToken(token);

      // Store in localStorage for persistence
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(profile));

      toast.success("Login successful!");

      // Redirect based on role
      const role = profile.role?.trim().toUpperCase();
      
      if (role === 'FARMER') {
        navigate('/farmer/dashboard');
      } else if (role === 'BUYER') {
        navigate('/buyer/dashboard');
      } else {
        console.warn("Unknown role:", role);
        navigate('/');
      }
    } catch (err) {
      const errorMsg = err.message || "Login failed. Please try again.";
      setError(errorMsg);
      setStoreError(errorMsg);
      toast.error(errorMsg);

      if (err.status === 401) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!otp || otp.length !== 6) {
        setError("Please enter a valid 6-digit code");
        setIsLoading(false);
        return;
      }

      // Verify OTP by re-authenticating with OTP code
      // This bypasses potential 404/400 errors on dedicated verify endpoints by using the standard login flow
      const verifyRes = await authApi.login({ phone, password, otp });
      const token = verifyRes?.token;

      if (!token) {
        throw new Error("Verification failed: Valid token not received");
      }

      // Decode token
      const { parseJwt } = await import("@/services/api");
      const decoded = parseJwt(token);
      
      const profile = {
        ...decoded,
        role: verifyRes.role || decoded?.role,
        phone: phone,
        name: decoded?.name || decoded?.sub || "User",
        is2faEnabled: true, // User just verified with OTP, so 2FA is enabled
      };

      // Store in Zustand
      setUser(profile);
      setUserRole(profile?.role);
      setToken(token);

      // Store in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(profile));

      toast.success("Login successful!");

      // Redirect based on role
      const role = profile.role?.trim().toUpperCase();
      
      if (role === 'FARMER') {
        navigate('/farmer/dashboard');
      } else if (role === 'BUYER') {
        navigate('/buyer/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      const errorMsg = err.message || "OTP verification failed";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoPhone = role === "farmer" ? "9999999999" : "8888888888";
    setPhone(demoPhone);
    setPassword("Password@123");
  };

  // If 2FA is required, show OTP input form
  if (requires2FA) {
    return (
      <form onSubmit={handleOtpSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 flex gap-2">
            <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            A 6-digit code has been sent to your authenticator app.
          </p>
          <p className="text-sm font-medium text-gray-900 mt-1">
            Enter the code to complete login
          </p>
        </div>

        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
            6-Digit Code
          </label>
          <Input
            id="otp"
            type="text"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            maxLength={6}
            className="text-center tracking-widest text-lg"
            disabled={isLoading}
            required
            autoFocus
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader size={18} className="animate-spin mr-2" />
              Verifying...
            </>
          ) : (
            'Verify & Login'
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setRequires2FA(false);
            setOtp("");
            setTempToken("");
            setError("");
          }}
          className="w-full"
        >
          Back to Login
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 flex gap-2">
          <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Phone Input */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
          <Input
            id="phone"
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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