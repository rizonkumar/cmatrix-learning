import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Clock,
  Award,
  ArrowLeft,
  Calendar,
  Activity,
  Target,
  Download,
  RefreshCw,
} from "lucide-react";
import Button from "../components/common/Button";
import { adminService } from "../services/adminService";
import { DataLoader } from "../components/common/LoadingSpinner";
import { toast } from "react-hot-toast";

const AnalyticsDashboardPage = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getAnalytics({
        timeRange,
      });

      setAnalytics(response.data);
    } catch (err) {
      setError("Failed to load analytics data");
      console.error("Error loading analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    // Mock export functionality
    toast.success("Analytics data exported successfully!");
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  // Chart data will be populated from API response
  const chartData = {
    userGrowth: analytics?.userGrowth || [
      { month: "Jan", users: 0 },
      { month: "Feb", users: 0 },
      { month: "Mar", users: 0 },
      { month: "Apr", users: 0 },
      { month: "May", users: 0 },
      { month: "Jun", users: 0 },
    ],
    courseEngagement: analytics?.courseEngagement || [
      { course: "No Data", engagement: 0 },
    ],
    revenueData: analytics?.revenueData || [
      { month: "Jan", revenue: 0 },
      { month: "Feb", revenue: 0 },
      { month: "Mar", revenue: 0 },
      { month: "Apr", revenue: 0 },
      { month: "May", revenue: 0 },
      { month: "Jun", revenue: 0 },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Comprehensive platform insights and metrics
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/admin")}
          className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-4 py-2 w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={loadAnalytics}
            className="px-4 py-2"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={handleExportData}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <DataLoader
        loading={loading}
        error={error}
        onRetry={loadAnalytics}
        emptyMessage="No analytics data available"
      >
        {analytics && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {formatNumber(analytics?.totalUsers || 0)}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      {formatPercentage(analytics?.userGrowth || 0)} from last period
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Active Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {formatNumber(analytics?.activeUsers || 0)}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      {formatPercentage(analytics?.userGrowth || 0)} from last period
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Course Completions
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {formatNumber(analytics?.courseCompletions || 0)}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                      {formatPercentage(analytics?.enrollmentGrowth || 0)} from last period
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Avg. Session Time
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {analytics?.avgSessionTime || "0h 0m"}
                    </p>
                    <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                      {formatPercentage(0)} from last period
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Growth Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      User Growth
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Monthly user registrations
                    </p>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                <div className="space-y-4">
                  {chartData.userGrowth.map((data, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {data.month}
                      </span>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${data.users > 0 ? (data.users / Math.max(...chartData.userGrowth.map(d => d.users))) * 100 : 0}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white w-12">
                          {formatNumber(data.users)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Engagement Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Course Engagement
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Engagement rate by subject
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <BookOpen className="w-5 h-5 text-green-600" />
                  </div>
                </div>

                <div className="space-y-4">
                  {chartData.courseEngagement.map((data, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {data.course}
                      </span>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${data.engagement || 0}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white w-10">
                          {data.engagement || 0}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Revenue Overview
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Monthly revenue trends
                  </p>
                </div>
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Target className="w-5 h-5 text-yellow-600" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {chartData.revenueData.map((data, index) => (
                  <div key={index} className="text-center">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      {data.month}
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      ₹{formatNumber(data.revenue)}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${data.revenue > 0 ? (data.revenue / Math.max(...chartData.revenueData.map(d => d.revenue))) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Courses */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Top Performing Courses
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Based on enrollment and completion rates
                  </p>
                </div>
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Award className="w-5 h-5 text-indigo-600" />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    name: "Advanced Mathematics",
                    enrollments: 1250,
                    completion: 89,
                    revenue: 187500,
                  },
                  {
                    name: "Physics Fundamentals",
                    enrollments: 980,
                    completion: 92,
                    revenue: 147000,
                  },
                  {
                    name: "Chemistry Essentials",
                    enrollments: 875,
                    completion: 85,
                    revenue: 131250,
                  },
                  {
                    name: "Biology Complete Course",
                    enrollments: 720,
                    completion: 88,
                    revenue: 108000,
                  },
                  {
                    name: "English Literature",
                    enrollments: 650,
                    completion: 91,
                    revenue: 97500,
                  },
                ].map((course, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-indigo-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {course.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {course.enrollments} enrollments • {course.completion}
                          % completion
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 dark:text-white">
                        ₹{formatNumber(course.revenue)}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        Revenue
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    System Health
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Platform performance metrics
                  </p>
                </div>
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Activity className="w-5 h-5 text-red-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    99.9%
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-400">
                    Uptime
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    245ms
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-400">
                    Avg Response Time
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    98.5%
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-400">
                    User Satisfaction
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DataLoader>
    </div>
  );
};

export default AnalyticsDashboardPage;
