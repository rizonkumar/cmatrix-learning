import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff } from "lucide-react";
import Button from "./common/Button";
import Input from "./common/Input";
import { toast } from "react-hot-toast";
import useAuthStore from "../store/authStore";

const AdminLogin = ({ onClose }) => {
  const [credentials, setCredentials] = useState({
    email: "admin@c-matrix.com",
    password: "admin123",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Simulate admin authentication
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (
        credentials.email === "admin@c-matrix.com" &&
        credentials.password === "admin123"
      ) {
        const adminUser = {
          id: "admin-1",
          name: "Admin User",
          email: credentials.email,
          role: "admin",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
        };

        const mockToken = "admin-jwt-token-" + Date.now();

        login({
          user: adminUser,
          accessToken: mockToken,
          refreshToken: null,
        });

        toast.success("Admin login successful!");
        navigate("/admin");

        if (onClose) onClose();
      } else {
        toast.error("Invalid admin credentials");
      }
    } catch (error) {
      toast.error("Admin login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      {/* Admin Login Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Login
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Access the administrative panel
        </p>
      </div>

      {/* Admin Login Form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <Input
            label="Admin Email"
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
            placeholder="admin@c-matrix.com"
            required
            className="text-left"
          />

          {/* Password Field */}
          <div className="relative">
            <Input
              label="Admin Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Enter admin password"
              required
              className="text-left pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Demo Credentials Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Demo Admin Credentials
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Email: admin@c-matrix.com
                  <br />
                  Password: admin123
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-3"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Authenticating...
              </div>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" />
                Login as Admin
              </>
            )}
          </Button>
        </form>

        {/* Back to User Login */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            ← Back to User Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
