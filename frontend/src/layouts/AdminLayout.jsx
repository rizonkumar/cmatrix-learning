import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
  FileText,
  ArrowLeft,
  Menu,
} from "lucide-react";
import Button from "../components/common/Button";
import useAuthStore from "../store/authStore";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

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
      name: "Student Analytics",
      icon: BarChart3,
      path: "/admin/analytics",
      description: "Performance & Reports",
    },
    {
      name: "System Settings",
      icon: Settings,
      path: "/admin/settings",
      description: "Configuration & Preferences",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/30 via-orange-50/20 to-pink-50/30 dark:from-gray-900 dark:via-red-900/10 dark:to-pink-900/10 transition-colors">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back to Home</span>
              </button>

              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

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

            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <div className="lg:hidden">
                <Button variant="outline" size="sm" className="p-2">
                  <Menu className="w-5 h-5" />
                </Button>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-2">
                {adminNavItems.slice(0, 3).map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
