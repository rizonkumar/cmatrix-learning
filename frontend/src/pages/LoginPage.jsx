import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  BookOpen,
  ArrowLeft,
  Shield,
  Sparkles,
  Star,
  Check,
  Loader2,
  KeyRound,
  UserCheck,
} from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Loader from "../components/common/Loader";
import AdminLogin from "../components/AdminLogin";
import { toast } from "react-hot-toast";
import useAuthStore from "../store/authStore";
import authService from "../services/authService";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🏗️ LoginPage component mounted");
    setMounted(true);
  }, []);

  // Debug state changes
  useEffect(() => {
    console.log("📊 LoginPage state changed:", {
      formData,
      errors,
      loading,
      isFormValid,
      showAdminLogin,
    });
  }, [formData, errors, loading, isFormValid, showAdminLogin]);

  useEffect(() => {
    const isValid =
      /\S+@\S+\.\S+/.test(formData.email) && formData.password.length >= 6;
    setIsFormValid(isValid);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("✏️ Input changed:", { name, value });
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    console.log("🔍 Validating form with data:", formData);
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    console.log("🔍 Validation errors:", newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log("🔍 Form is valid:", isValid);
    return isValid;
  };

  const handleSubmit = async (e) => {
    console.log("🔥 handleSubmit called!");
    console.log("📋 Event object:", e);
    console.log("🎯 Event type:", e.type);
    console.log("📊 Form data:", formData);

    // Prevent default form submission
    e.preventDefault();
    console.log("✅ Default prevented");

    // Check if form is valid
    if (!validateForm()) {
      console.log("❌ Form validation failed");
      return;
    }
    console.log("✅ Form validation passed");

    setLoading(true);
    console.log("⏳ Loading state set to true");

    try {
      console.log("🚀 Making API call to authService.login...");
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });
      console.log("✅ API Response received:", response);

      const { user, accessToken, refreshToken } = response.data;
      console.log("👤 User data:", user);

      console.log("🔐 Calling login function...");
      login({
        user: {
          id: user._id,
          name: user.fullName || user.username,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      });
      console.log("✅ Login function completed");

      toast.success("Login successful! Welcome back!", {
        duration: 4000,
        icon: "🚀",
      });

      console.log("⏳ Waiting before navigation...");
      setTimeout(() => {
        console.log("🧭 Navigating based on role:", user.role);
        if (user.role === "admin") {
          console.log("👑 Navigating to admin dashboard");
          navigate("/admin");
        } else {
          console.log("📊 Navigating to student dashboard");
          navigate("/dashboard");
        }
      }, 100);
    } catch (error) {
      console.error("❌ Login error:", error);
      console.error("❌ Error details:", error.response?.data || error.message);
      toast.error("Login failed. Please check your credentials.", {
        duration: 3000,
      });
    } finally {
      console.log("🔄 Setting loading to false");
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: "test@example.com",
      password: "Password123!",
    });

    toast.success("Demo credentials filled!", {
      duration: 2000,
      icon: "✨",
    });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Loader size="lg" className="animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 dark:bg-blue-600/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-cyan-300 dark:bg-cyan-600/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl mb-6 shadow-2xl shadow-blue-500/25 dark:shadow-blue-500/10 transform hover:scale-105 transition-all duration-300">
            <BookOpen className="w-10 h-10 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl blur-sm opacity-50"></div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            {showAdminLogin ? "Admin Access" : "Welcome Back"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {showAdminLogin
              ? "Access the administrative panel"
              : "Sign in to your C-Matrix Learning account"}
          </p>
        </div>

        {/* Login Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-1.5 flex shadow-lg border border-white/20 dark:border-gray-700/50">
            <button
              onClick={() => setShowAdminLogin(false)}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                !showAdminLogin
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:scale-105"
              }`}
            >
              <UserCheck className="w-4 h-4 inline mr-2" />
              Student Login
            </button>
            <button
              onClick={() => setShowAdminLogin(true)}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                showAdminLogin
                  ? "bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg scale-105"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:scale-105"
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Admin Login
            </button>
          </div>
        </div>

        {/* Conditional Login Form */}
        {showAdminLogin ? (
          <AdminLogin onClose={() => setShowAdminLogin(false)} />
        ) : (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/5 border border-white/20 dark:border-gray-700/50 p-8 transform hover:shadow-3xl transition-all duration-300">
            <form
              onSubmit={(e) => {
                console.log("📝 Form onSubmit triggered!");
                handleSubmit(e);
              }}
              className="space-y-6"
            >
              {/* Email Field */}
              <div className="relative">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  error={errors.email}
                  required
                  className="text-left transition-all duration-200 focus:shadow-lg"
                />
                {formData.email &&
                  /\S+@\S+\.\S+/.test(formData.email) &&
                  !errors.email && (
                    <Check className="absolute right-3 top-9 w-5 h-5 text-green-500" />
                  )}
              </div>

              {/* Password Field */}
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  error={errors.password}
                  required
                  className="text-left pr-12 transition-all duration-200 focus:shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 hover:scale-110"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                {formData.password &&
                  formData.password.length >= 6 &&
                  !errors.password && (
                    <Check className="absolute right-12 top-9 w-5 h-5 text-green-500" />
                  )}
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-200 hover:underline font-medium"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className={`w-full py-4 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                  isFormValid && !loading
                    ? "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!isFormValid || loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <KeyRound className="w-5 h-5 mr-2" />
                    Sign In
                    <Sparkles className="w-4 h-4 ml-2" />
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Login */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 flex items-center justify-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                Try our demo account
              </p>
              <Button
                onClick={handleDemoLogin}
                variant="outline"
                className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Use Demo Credentials
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-semibold transition-all duration-200 hover:underline inline-flex items-center"
                >
                  Sign up for free
                  <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Features Preview */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">50+ Courses</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Secure Login</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Free Access for Limited Time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
