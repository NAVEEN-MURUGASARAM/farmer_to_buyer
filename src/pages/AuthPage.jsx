// src/pages/AuthPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, UserPlus, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">F</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to FarmerToBuyer
          </h1>
          <p className="text-lg text-gray-600">
            Connect farmers with buyers, fresh produce delivered to your door
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setAuthMode("login")}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                authMode === "login"
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <LogIn size={18} />
                Login
              </div>
            </button>
            <button
              onClick={() => setAuthMode("signup")}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                authMode === "signup"
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <UserPlus size={18} />
                Sign Up
              </div>
            </button>
          </div>
        </div>

        {/* Auth Form Card */}
        <Card className="shadow-xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-center text-green-700">
              {authMode === "login" ? "Welcome Back" : "Create Your Account"}
            </CardTitle>
            <CardDescription className="text-center">
              {authMode === "login"
                ? "Sign in to your FarmerToBuyer account"
                : "Join our community and start trading fresh produce"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {authMode === "login" ? (
              <LoginForm onSwitchMode={() => setAuthMode("signup")} />
            ) : (
              <RegisterForm onSwitchMode={() => setAuthMode("login")} />
            )}
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
