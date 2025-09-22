import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  BarChart3,
  GraduationCap,
  TrendingUp,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import { adminService } from "../services/adminService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const analyticsResponse = await adminService.getStudentAnalytics();
        setAnalytics(analyticsResponse.data.data);

        const activitiesResponse = await adminService.getRecentActivities();
        setRecentActivities(activitiesResponse.data.activities || []);

        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statsData = [
    {
      title: "Total Students",
      value: analytics?.overview?.totalStudents || 0,
      change: analytics?.overview?.activityRate
        ? `${analytics.overview.activityRate}% Active`
        : "0% Active",
      icon: Users,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Students",
      value: analytics?.overview?.activeStudents || 0,
      change: analytics?.overview?.activityRate
        ? `${analytics.overview.activityRate}% Activity Rate`
        : "0% Activity",
      icon: TrendingUp,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600",
    },
    {
      title: "Completion Rate",
      value: `${analytics?.enrollmentStats?.completionRate || 0}%`,
      change: `${
        analytics?.enrollmentStats?.completedEnrollments || 0
      } Completed`,
      icon: CheckCircle,
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600",
    },
    {
      title: "Avg Progress",
      value: `${analytics?.enrollmentStats?.averageProgress || 0}%`,
      change: `${
        analytics?.enrollmentStats?.totalEnrollments || 0
      } Total Enrollments`,
      icon: BarChart3,
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600",
    },
  ];

  const quickActions = [
    {
      title: "Manage Syllabus",
      description:
        "Add, edit, and organize syllabus content by class and subject",
      icon: GraduationCap,
      path: "/admin/syllabus",
      color: "bg-blue-500 hover:bg-blue-600",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Course Management",
      description: "Create and manage course content and materials",
      icon: BookOpen,
      path: "/admin/courses",
      color: "bg-green-500 hover:bg-green-600",
      iconBg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Finance",
      description: "Manage student payments and subscription tracking",
      icon: CreditCard,
      path: "/admin/finance",
      color: "bg-emerald-500 hover:bg-emerald-600",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: "Student Analytics",
      description: "View student progress and performance analytics",
      icon: BarChart3,
      path: "/admin/analytics",
      color: "bg-purple-500 hover:bg-purple-600",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
    },
  ];

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 dark:from-red-800 dark:via-pink-800 dark:to-purple-800 rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Background Pattern */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 relative">
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              Welcome to Admin Dashboard! 👋
            </h1>
            <p className="text-red-100 text-lg lg:text-xl mb-6 leading-relaxed">
              Manage your learning platform with ease and efficiency
            </p>
            <div className="flex flex-wrap gap-4 lg:gap-6">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Real-time Analytics</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">User Management</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Content Control</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex lg:items-center lg:justify-center">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-6 shadow-2xl border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="font-bold text-xl">Admin Panel</div>
                  <div className="text-sm text-red-100 font-medium">
                    Full Control
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-600 rounded-2xl"></div>
              </div>
            </div>
          ))
        ) : error ? (
          // Error state
          <div className="col-span-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
            <p className="text-red-600 dark:text-red-400 font-medium">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                      {stat.value}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                        {stat.change} from last month
                      </p>
                    </div>
                  </div>
                  <div
                    className={`p-4 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-8 h-8 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 p-6 text-left hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 w-full hover:-translate-y-1"
              >
                <div className="flex items-start space-x-5">
                  <div
                    className={`p-4 rounded-2xl ${action.iconBg} group-hover:scale-110 transition-all duration-300 shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                  <div className="text-gray-400 group-hover:text-blue-500 transition-all duration-300 group-hover:translate-x-1">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Live Updates
          </div>
        </div>
        <div className="space-y-6">
          {loading ? (
            Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="flex items-start space-x-5 p-4 rounded-xl"
              >
                <div className="p-3 rounded-xl bg-gray-200 dark:bg-gray-600 animate-pulse w-12 h-12 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 animate-pulse"></div>
                </div>
                <div className="w-3 h-3 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse flex-shrink-0"></div>
              </div>
            ))
          ) : recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => {
              const getIconComponent = (iconName) => {
                switch (iconName) {
                  case "Users":
                    return Users;
                  case "CheckCircle":
                    return CheckCircle;
                  case "BookOpen":
                    return BookOpen;
                  case "TrendingUp":
                    return TrendingUp;
                  default:
                    return Users;
                }
              };

              const IconComponent = getIconComponent(activity.icon);

              return (
                <div
                  key={activity.id || index}
                  className="flex items-start space-x-5 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 hover:shadow-md group"
                >
                  <div
                    className={`p-3 rounded-xl ${activity.color} flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base lg:text-lg text-gray-900 dark:text-white font-semibold leading-relaxed mb-2">
                      {activity.action}
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span>{activity.timeAgo}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No recent activities found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
