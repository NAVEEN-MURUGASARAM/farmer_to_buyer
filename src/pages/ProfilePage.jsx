// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Phone, MapPin, ArrowLeft, Save, Lock, Shield } from 'lucide-react';
import { useAuthStore } from '@/store';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { authApi } from '@/services/api';

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuthStore();
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  // 2FA State
  const [show2faSetup, setShow2faSetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [otp, setOtp] = useState('');

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Check if we should auto-open 2FA setup
    if (location.state?.open2faSetup && !user?.is2faEnabled && !show2faSetup) {
        start2faSetup();
        // Clear state to prevent re-triggering on refresh/updates
        navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, user, show2faSetup, navigate]); // Added dependencies for safety

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedUser = {
        ...user,
        ...profileData,
      };

      setUser(updatedUser);
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const start2faSetup = async () => {
    setIsSaving(true);
    try {
        const response = await authApi.generate2faSecret();
        setQrCodeUrl(response);
        setShow2faSetup(true);
        setOtp('');
    } catch(err) {
        toast.error("Failed to start 2FA setup");
    } finally {
        setIsSaving(false);
    }
  };

  const verifyAndEnable2fa = async () => {
      if(!otp || otp.length !== 6) {
          toast.error("Please enter a valid 6-digit code");
          return;
      }
      setIsSaving(true);
      try {
          await authApi.enable2fa(otp);
          // Update user state locally to reflect 2FA enabled
          // In real app we might fetch user again, but here manual update
          const updatedUser = { ...user, is2faEnabled: true };
          setUser(updatedUser);
          localStorage.setItem('authUser', JSON.stringify(updatedUser));
          
          toast.success("Two-Factor Authentication Enabled!");
          setShow2faSetup(false);
      } catch(err) {
          toast.error(err.message || "Verification failed");
      } finally {
          setIsSaving(false);
      }
  };

  const handleDisable2fa = async () => {
      if(!window.confirm("Are you sure you want to disable 2FA? Your account will be less secure.")) return;
      
      setIsSaving(true);
      try {
          await authApi.disable2fa();
           const updatedUser = { ...user, is2faEnabled: false };
          setUser(updatedUser);
          localStorage.setItem('authUser', JSON.stringify(updatedUser));
          toast.success("Two-Factor Authentication Disabled");
      } catch(err) {
           toast.error("Failed to disable 2FA");
      } finally {
          setIsSaving(false);
      }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
    } catch (error) {
      toast.error('Failed to change password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="text-green-600" size={20} />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                      <Input
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                    <Input
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      type="tel"
                      placeholder="9876543210"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                    <Input
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      placeholder="Street address"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <Input
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <Input
                      value={profileData.state}
                      onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <Input
                      value={profileData.pincode}
                      onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
                      placeholder="560001"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSaving ? (
                      <>
                        <LoadingSpinner size={18} className="mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="text-green-600" size={20} />
                Two-Factor Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                   <div className="flex items-center justify-between">
                       <div>
                           <p className="font-medium text-gray-700">
                               status: {' '}
                               <span className={user?.is2faEnabled ? "text-green-600" : "text-gray-500"}>
                                   {user?.is2faEnabled ? "Enabled" : "Disabled"}
                               </span>
                           </p>
                           <p className="text-sm text-gray-500 mt-1">
                               Adds an extra layer of security to your account using an authenticator app.
                           </p>
                       </div>
                       
                       {!user?.is2faEnabled ? (
                           <Button onClick={start2faSetup} variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                               Enable 2FA
                           </Button>
                       ) : (
                           <Button onClick={handleDisable2fa} variant="destructive">
                               Disable 2FA
                           </Button>
                       )}
                   </div>

                   {/* 2FA Setup Section */}
                   {show2faSetup && (
                       <div className="mt-6 border-t pt-6">
                           <h4 className="font-semibold mb-4">Set up Authenticator App</h4>
                           <div className="flex flex-col md:flex-row gap-6 items-center">
                               {qrCodeUrl && (
                                   <div className="bg-white p-4 border rounded-lg flex justify-center">
                                       <QRCodeSVG value={qrCodeUrl} size={180} level="M" includeMargin={true} />
                                   </div>
                               )}
                               <div className="space-y-4 flex-1">
                                    <p className="text-sm text-gray-600">
                                        1. Install Microsoft Authenticator or Google Authenticator.<br/>
                                        2. Scan the QR code.<br/>
                                        3. Enter the 6-digit code below.
                                    </p>
                                    
                                    <div className="flex gap-2">
                                        <Input 
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="Enter 6-digit code" 
                                            maxLength={6}
                                            className="w-48 tracking-widest text-center"
                                        />
                                        <Button onClick={verifyAndEnable2fa} disabled={isSaving}>
                                            {isSaving ? "Verifying..." : "Verify & Enable"}
                                        </Button>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setShow2faSetup(false)}>
                                        Cancel
                                    </Button>
                               </div>
                           </div>
                       </div>
                   )}
               </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="text-green-600" size={20} />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!showPasswordForm ? (
                <Button variant="outline" onClick={() => setShowPasswordForm(true)}>
                  Change Password
                </Button>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password *
                    </label>
                    <Input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password *
                    </label>
                    <Input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      placeholder="Enter new password (min 6 characters)"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password *
                    </label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                      {isSaving ? (
                        <>
                          <LoadingSpinner size={18} className="mr-2" />
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


