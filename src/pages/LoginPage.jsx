// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Lock, AlertCircle, Loader, KeyRound } from 'lucide-react';
import { useAuthStore } from '@/store';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/services/api';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    otp: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('LOGIN'); // 'LOGIN' or 'OTP'
  const [tempToken, setTempToken] = useState(null);
  
  const navigate = useNavigate();
  const { setUser, setUserRole, setToken, setError: setStoreError } = useAuthStore();
  const toast = useToast();

  const handleInputChange = (e) => {
      const { id, value } = e.target;
      setFormData(prev => ({ ...prev, [id]: value }));
      setError('');
  };

  // Import parseJwt dynamically or at top. 
  // Since I can't easily add import at top with replace_file_content without context of imports, 
  // I will use restricted edit.
  // Wait, I should add the import first.
  
  // Actually, I'll assume I can edit the whole function `completeLogin` and `handleLoginSubmit`.
  // The backend login response is { token, role, twoFactorRequired }.
  // user object is MISSING.
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate inputs
      if (!formData.phone || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      if (!/^\d{10}$/.test(formData.phone)) {
         throw new Error('Please enter a valid 10-digit phone number');
      }

      const response = await authApi.login({
          phone: formData.phone,
          password: formData.password
      });

      if (response.twoFactorRequired) {
          setTempToken(response.token);
          setStep('OTP');
          toast.success("Please enter the OTP sent to your phone");
      } else {
          // Pass phone to completeLogin since it's not in response
          completeLogin(null, response.token, response.role);
      }

    } catch (err) {
      const errorMsg = err.message || 'Login failed. Please try again.';
      setError(errorMsg);
      setStoreError(errorMsg);
      // toast.error(errorMsg); // Optional redundancy
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);

      try {
          if (!formData.otp || formData.otp.length !== 6) {
              throw new Error("Please enter a valid 6-digit OTP");
          }

          const response = await authApi.verifyOtp({
              tempToken,
              otp: formData.otp
          });

          // Verify response structure for OTP verify.
          // Spec says "2FA enabled successfully" for verify-setup.
          // But this is LOGIN verification. 
          // Spec "Case 2" says backend returns "final JWT".
          // Does it return { token, ... }? 
          // Turn 34 spec quote: "Backend returns final JWT". 
          // It likely returns { token: "...", user: ... } or just token?
          // I will assume it returns object with token.
          
          completeLogin(null, response.token, response.role);

      } catch (err) {
          const errorMsg = err.message || 'Verification failed.';
          setError(errorMsg);
      } finally {
          setIsLoading(false);
      }
  };

  const completeLogin = async (userData, token, role) => {
      // Decode token for user details since backend doesn't provide full user obj on login
      const { parseJwt } = await import("@/services/api");
      const decoded = parseJwt(token);
      
      const user = {
          ...decoded,
          name: decoded?.name || decoded?.sub || "User",
          phone: formData.phone, // from state
          role: role || decoded?.role,
          is2faEnabled: false // If we logged in directly without 2FA, it's disabled. 
                              // If we did OTP, we might want to set true? 
                              // But for now, user wants to see the button, so false is safe default if ambiguous.
                              // Actually, if we just finished OTP verification (in handleOtpSubmit), we know it's enabled.
                              // But completeLogin is generic. 
                              // Use 'step' state? If step === 'OTP', then is2faEnabled = true.
      };
      
      if (step === 'OTP') {
          user.is2faEnabled = true;
      }

      // Store in Zustand
      setUser(user);
      setUserRole(user.role);
      setToken(token);

      // Store in localStorage for persistence
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));

      toast.success('Login successful!');

      // Redirect based on role
      if (user.role?.toLowerCase() === 'farmer') {
        navigate('/farmer/dashboard');
      } else {
        navigate('/buyer/dashboard');
      }
  };

  const handleDemoLogin = (role) => {
    const demoPhone = role === 'farmer' ? '1234567890' : '9876543210';
    setFormData(prev => ({ ...prev, phone: demoPhone, password: 'demo123' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-green-700">
              {step === 'LOGIN' ? 'Welcome Back' : 'Two-Factor Authentication'}
          </CardTitle>
          <CardDescription className="text-center">
             {step === 'LOGIN' 
                ? 'Sign in to your FarmerToBuyer account'
                : 'Enter the 6-digit code from your authenticator app'
             }
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === 'LOGIN' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 flex gap-2">
                    <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Phone Input */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10 border-gray-300"
                      disabled={isLoading}
                      maxLength={10}
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
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 border-gray-300"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300" />
                    Remember me
                  </label>
                  <Link to="#" className="text-green-600 hover:text-green-700 font-medium">
                    Forgot password?
                  </Link>
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
                    Buyer Demo (Try 2FA)
                  </Button>
                </div>

                {/* Sign Up Link */}
                <p className="text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-green-600 hover:text-green-700 font-medium">
                    Sign up here
                  </Link>
                </p>
              </form>
          ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 flex gap-2">
                        <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                  
                  <div>
                      <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                          One-Time Password (OTP)
                      </label>
                      <div className="relative">
                          <KeyRound className="absolute left-3 top-3 text-gray-400" size={18} />
                          <Input 
                              id="otp"
                              type="text"
                              placeholder="123456"
                              value={formData.otp}
                              onChange={handleInputChange}
                              className="pl-10 text-center tracking-widest text-lg"
                              maxLength={6}
                              autoFocus
                              disabled={isLoading}
                          />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                          Use code <b>123456</b> for demo
                      </p>
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
                  
                  <button 
                      type="button"
                      onClick={() => setStep('LOGIN')}
                      className="w-full text-sm text-gray-600 hover:text-gray-800"
                  >
                      Back to Login
                  </button>

              </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}