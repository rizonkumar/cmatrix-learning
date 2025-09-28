import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BookOpen,
  BarChart3,
  LogOut,
  GraduationCap,
  FileText,
  Menu,
  Home,
  Users,
  CreditCard,
  X,
} from "lucide-react";
import Button from "../components/common/Button";
import ThemeToggle from "../components/ThemeToggle";
import useAuthStore from "../store/authStore";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const adminNavItems = [
    {
      name: "Dashboard",
      icon: BookOpen,
      path: "/admin",
      description: "Overview & Statistics",
    },
    {
      name: "Student Tracking",
      icon: Users,
      path: "/admin/students",
      description: "Monitor Student Progress",
    },
    {
      name: "Syllabus Management",
      icon: GraduationCap,
      path: "/admin/syllabus",
      description: "Manage Course Content",
    },
    {
      name: "Course Management",
      icon: FileText,
      path: "/admin/courses",
      description: "Create & Edit Courses",
    },
    {
      name: "Finance",
      icon: CreditCard,
      path: "/admin/finance",
      description: "Payment Management",
    },
    {
      name: "Student Analytics",
      icon: BarChart3,
      path: "/admin/analytics",
      description: "Performance & Reports",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/30 via-orange-50/20 to-pink-50/30 dark:from-gray-900 dark:via-red-900/10 dark:to-pink-900/10 transition-colors">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Section - Admin Branding */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Admin Panel
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Welcome back, {user?.name || "Admin"}
                  </p>
                </div>
              </div>
            </div>

            {/* Center Section - Navigation (Desktop) */}
            <div className="hidden lg:flex items-center space-x-1">
              {adminNavItems.slice(0, 5).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const displayName = isActive
                  ? item.name
                  : item.name.split(" ")[0];

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm transition-all duration-200 rounded-lg font-medium ${
                      isActive
                        ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30"
                        : "text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    title={item.name}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{displayName}</span>
                  </button>
                );
              })}

              {/* More Menu for remaining items */}
              {adminNavItems.length > 5 && (
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 rounded-lg font-medium">
                    <span>More</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      {adminNavItems.slice(5).map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                          <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center space-x-3 px-4 py-3 text-sm w-full text-left transition-colors duration-200 ${
                              isActive
                                ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30"
                                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                            title={item.name}
                          >
                            <Icon className="w-4 h-4" />
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {item.description}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-3">
              {/* Mobile menu button */}
              <div className="lg:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="p-2"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </div>

              {/* Back to Home */}
              <button
                onClick={() => navigate("/")}
                className="hidden sm:flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
              >
                <Home className="w-4 h-4" />
                <span className="hidden md:inline">Home</span>
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Logout */}
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 px-3 py-3 text-sm w-full text-left rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-800">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
