import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  BookOpen,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Shield,
  Star,
  Check,
  X,
  Loader2,
} from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Loader from "../components/common/Loader";
import { toast } from "react-hot-toast";
import useAuthStore from "../store/authStore";
import authService from "../services/authService";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const isValid =
      formData.name.trim().length >= 2 &&
      /\S+@\S+\.\S+/.test(formData.email) &&
      formData.password.length >= 6 &&
      formData.password === formData.confirmPassword &&
      agreedToTerms;
    setIsFormValid(isValid);
  }, [formData, agreedToTerms]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Call real API for registration
      const response = await authService.register({
        username: formData.name.toLowerCase().replace(/\s+/g, "_"), // Generate username from name
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
        role: "student",
      });

      // Extract user data and tokens from response
      const { user, accessToken, refreshToken } = response.data;

      // Login user with real data
      login({
        user: {
          id: user._id,
          name: user.fullName,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      });

      toast.success(
        "Account created successfully! Welcome to C-Matrix Learning!",
        {
          duration: 4000,
          icon: "🎉",
        }
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.", {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignup = () => {
    setFormData({
      name: "Demo User",
      email: "demo@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    setAgreedToTerms(true);

    toast.success("Demo credentials filled!", {
      duration: 2000,
      icon: "✨",
    });
  };

  const passwordStrength = formData.password
    ? formData.password.length >= 8
      ? "Strong"
      : formData.password.length >= 6
      ? "Medium"
      : "Weak"
    : "";

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "Strong":
        return "bg-green-500";
      case "Medium":
        return "bg-yellow-500";
      case "Weak":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  const getPasswordStrengthTextColor = () => {
    switch (passwordStrength) {
      case "Strong":
        return "text-green-600 dark:text-green-400";
      case "Medium":
        return "text-yellow-600 dark:text-yellow-400";
      case "Weak":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Loader size="lg" className="animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-600/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 dark:bg-pink-600/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Back to Home */}
        <Link
          to="/"
          onClick={() => {
            console.log("🏠 SignupPage Back to Home link clicked");
            console.log("🔗 Navigating to:", "/");
            console.log(
              "📍 Current location before navigation:",
              window.location.pathname
            );
            console.log("🔐 Is authenticated:", isAuthenticated);
            console.log("👤 User:", user);
          }}
          className="inline-flex items-center text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-300 mb-8 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-3xl mb-6 shadow-2xl shadow-purple-500/25 dark:shadow-purple-500/10 transform hover:scale-105 transition-all duration-300">
            <BookOpen className="w-10 h-10 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-3xl blur-sm opacity-50"></div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Join C-Matrix Learning
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Start your learning journey today
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/10 dark:shadow-purple-500/5 border border-white/20 dark:border-gray-700/50 p-8 transform hover:shadow-3xl transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="relative">
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                error={errors.name}
                required
                className="text-left transition-all duration-200 focus:shadow-lg"
              />
              {formData.name && !errors.name && (
                <Check className="absolute right-3 top-9 w-5 h-5 text-green-500" />
              )}
            </div>

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
                placeholder="Create a password"
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
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-2 animate-fade-in">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ease-out ${getPasswordStrengthColor()}`}
                      style={{
                        width:
                          passwordStrength === "Strong"
                            ? "100%"
                            : passwordStrength === "Medium"
                            ? "66%"
                            : "33%",
                      }}
                    ></div>
                  </div>
                  <span
                    className={`text-sm font-medium ${getPasswordStrengthTextColor()}`}
                  >
                    {passwordStrength}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Use at least 8 characters with numbers and symbols
                </div>
              </div>
            )}

            {/* Confirm Password Field */}
            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                error={errors.confirmPassword}
                required
                className="text-left pr-12 transition-all duration-200 focus:shadow-lg"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 hover:scale-110"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {formData.confirmPassword &&
                formData.password === formData.confirmPassword &&
                !errors.confirmPassword && (
                  <Check className="absolute right-12 top-9 w-5 h-5 text-green-500" />
                )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all duration-200"
              />
              <div className="flex-1">
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-all duration-200 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-all duration-200 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
                {errors.terms && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center">
                    <X className="w-4 h-4 mr-1" />
                    {errors.terms}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className={`w-full py-4 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                isFormValid && !loading
                  ? "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 shadow-lg shadow-purple-500/25"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <User className="w-5 h-5 mr-2" />
                  Create Account
                  <Sparkles className="w-4 h-4 ml-2" />
                </div>
              )}
            </Button>
          </form>

          {/* Demo Signup */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 flex items-center justify-center">
              <Star className="w-4 h-4 mr-1 text-yellow-500" />
              Try our demo account
            </p>
            <Button
              onClick={handleDemoSignup}
              variant="outline"
              className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Use Demo Credentials
            </Button>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-all duration-200 hover:underline inline-flex items-center"
              >
                Sign in here
                <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Free Forever</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">500+ Courses</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Secure & Safe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
