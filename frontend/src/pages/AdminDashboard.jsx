import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  BarChart3,
  Settings,
  FileText,
  GraduationCap,
  TrendingUp,
  CheckCircle
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Statistics Data
  const statsData = [
    {
      title: "Total Courses",
      value: "156",
      change: "+12%",
      icon: BookOpen,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600"
    },
    {
      title: "Active Students",
      value: "8,942",
      change: "+8%",
      icon: Users,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600"
    },
    {
      title: "Revenue",
      value: "₹4.2L",
      change: "+15%",
      icon: BarChart3,
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600"
    },
    {
      title: "Syllabus Items",
      value: "1,234",
      change: "+5%",
      icon: FileText,
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600"
    },
  ];

  // Quick Actions Data
  const quickActions = [
    {
      title: "Manage Syllabus",
      description: "Add, edit, and organize syllabus content by class and subject",
      icon: GraduationCap,
      path: "/admin/syllabus",
      color: "bg-blue-500 hover:bg-blue-600",
      iconBg: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "Course Management",
      description: "Create and manage course content and materials",
      icon: BookOpen,
      path: "/admin/courses",
      color: "bg-green-500 hover:bg-green-600",
      iconBg: "bg-green-100 dark:bg-green-900/30"
    },
    {
      title: "Student Analytics",
      description: "View student progress and performance analytics",
      icon: BarChart3,
      path: "/admin/analytics",
      color: "bg-purple-500 hover:bg-purple-600",
      iconBg: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      title: "System Settings",
      description: "Configure system preferences and settings",
      icon: Settings,
      path: "/admin/settings",
      color: "bg-orange-500 hover:bg-orange-600",
      iconBg: "bg-orange-100 dark:bg-orange-900/30"
    },
  ];

  // Recent Activity Data
  const recentActivities = [
    {
      action: "Added new syllabus for Class 10 Mathematics",
      time: "2 hours ago",
      icon: BookOpen,
      color: "bg-blue-500"
    },
    {
      action: "Updated course content for Physics Class 9",
      time: "4 hours ago",
      icon: TrendingUp,
      color: "bg-green-500"
    },
    {
      action: "New student registered: Rahul Sharma",
      time: "6 hours ago",
      icon: Users,
      color: "bg-purple-500"
    },
    {
      action: "Published Chemistry Class 11 syllabus",
      time: "1 day ago",
      icon: CheckCircle,
      color: "bg-blue-500"
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 dark:from-red-800 dark:via-pink-800 dark:to-purple-800 rounded-xl p-6 lg:p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold mb-3">
              Welcome to Admin Dashboard! 👋
            </h1>
            <p className="text-red-100 text-base lg:text-lg mb-4">
              Manage your learning platform with ease and efficiency
            </p>
            <div className="flex flex-wrap gap-4 lg:gap-6">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Real-time Analytics</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>User Management</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Content Control</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex lg:items-center lg:justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-white" />
                <div>
                  <div className="font-semibold text-lg">Admin Panel</div>
                  <div className="text-sm text-red-100">Full Control</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 lg:p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 lg:p-4 rounded-xl ${stat.bgColor} ml-4`}>
                  <Icon className={`w-6 h-6 lg:w-7 lg:h-7 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6 text-left hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 w-full"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 lg:p-4 rounded-xl ${action.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                  <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                    <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
        <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Recent Activity
        </h3>
        <div className="space-y-4 lg:space-y-5">
          {recentActivities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className={`p-2 rounded-lg ${activity.color} flex-shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm lg:text-base text-gray-900 dark:text-white font-medium leading-relaxed">
                    {activity.action}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {activity.time}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
