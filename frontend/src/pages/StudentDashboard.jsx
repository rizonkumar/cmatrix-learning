import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Award,
  Flame,
  Calendar,
  CheckCircle,
  PlayCircle,
} from "lucide-react";
import { userService } from "../services/userService";
import { enrollmentService } from "../services/enrollmentService";
import { DataLoader } from "../components/common/LoadingSpinner";
import { StatsCardSkeleton } from "../components/common/SkeletonLoader";
import useAuthStore from "../store/authStore";
import { toast } from "react-hot-toast";

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [navigatingCourse, setNavigatingCourse] = useState(null);
  const [navigatingAction, setNavigatingAction] = useState(null);

  const handleCourseClick = async (course) => {
    setNavigatingCourse(course._id);
    toast.success(`Opening ${course.title}...`);

    navigate(`/courses/${course._id}`);
    setNavigatingCourse(null);
  };

  const handleQuickAction = async (action, path, message) => {
    setNavigatingAction(action);
    toast.success(message);

    navigate(path);
    setNavigatingAction(null);
  };

  // API state
  const [userStats, setUserStats] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recentLessons, setRecentLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load user stats and enrolled courses in parallel
      const [statsResponse, enrollmentsResponse] = await Promise.all([
        userService.getUserStats(),
        enrollmentService
          .getMyEnrollments({ limit: 3 })
          .catch(() => ({ enrollments: [] })),
      ]);

      setUserStats(statsResponse.data.stats);

      // Transform enrolled courses data
      const enrollmentsArray = enrollmentsResponse?.enrollments || [];
      const courses =
        (Array.isArray(enrollmentsArray)
          ? enrollmentsArray.slice(0, 3)
          : []
        ).map((enrollment) => ({
          ...enrollment.course,
          enrollmentId: enrollment._id,
          progress: enrollment.progress || 0,
          lastAccessed: enrollment.lastAccessed
            ? new Date(enrollment.lastAccessed).toLocaleDateString()
            : "Never accessed",
        })) || [];

      setEnrolledCourses(courses);

      // Set recent lessons from the first enrolled course
      if (courses.length > 0 && courses[0].modules?.[0]?.lessons) {
        setRecentLessons(courses[0].modules[0].lessons.slice(0, 3));
      }
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Generate stats from API data
  const stats = userStats
    ? [
        {
          title: "Current Streak",
          value: userStats.currentStreak || 0,
          unit: "days",
          icon: Flame,
          color: "text-orange-600",
          bgColor: "bg-orange-100 dark:bg-orange-900/20",
        },
        {
          title: "Study Time",
          value: userStats.totalLearningHours
            ? `${userStats.totalLearningHours}h`
            : "0h",
          unit: "this week",
          icon: Clock,
          color: "text-blue-600",
          bgColor: "bg-blue-100 dark:bg-blue-900/20",
        },
        {
          title: "Courses Completed",
          value: userStats.completedCourses || 0,
          unit: "courses",
          icon: Award,
          color: "text-green-600",
          bgColor: "bg-green-100 dark:bg-green-900/20",
        },
        {
          title: "Certificates Earned",
          value: userStats.certificatesEarned || 0,
          unit: "certificates",
          icon: CheckCircle,
          color: "text-purple-600",
          bgColor: "bg-purple-100 dark:bg-purple-900/20",
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.fullName || user?.name || "Student"}! 👋
            </h1>
            <p className="text-blue-100">
              {userStats?.currentStreak > 0
                ? `You're on a ${userStats.currentStreak}-day learning streak! Keep it up!`
                : "Start your learning journey today!"}
            </p>
          </div>
          <div className="hidden md:block">
            {userStats && (
              <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2">
                <Flame className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">
                  {userStats.currentStreak || 0} Day Streak
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Show loading skeletons
          [...Array(4)].map((_, index) => (
            <StatsCardSkeleton key={index} count={1} />
          ))
        ) : error ? (
          // Show error state
          <div className="col-span-full">
            <DataLoader
              loading={false}
              error={error}
              onRetry={loadDashboardData}
              emptyMessage="Failed to load statistics"
            />
          </div>
        ) : (
          // Show actual stats
          stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stat.unit}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Enrolled Courses */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Continue Learning
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Pick up where you left off
              </p>
            </div>
            <div className="p-6">
              {loading ? (
                // Show loading skeletons
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                      </div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <DataLoader
                  loading={false}
                  error={error}
                  onRetry={loadDashboardData}
                  emptyMessage="Failed to load courses"
                />
              ) : enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course._id || course.id}
                      className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {course.instructor?.fullName ||
                            course.instructor?.username ||
                            "Unknown Instructor"}{" "}
                          • {course.totalLessons || 0} lessons
                        </p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress || 0}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {course.progress || 0}% complete
                        </p>
                      </div>
                      <button
                        onClick={() => handleCourseClick(course)}
                        disabled={navigatingCourse === course._id}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                          navigatingCourse === course._id
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
                        } text-white`}
                      >
                        {navigatingCourse === course._id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-4 h-4" />
                            <span>
                              {course.progress === 0 ? "Start" : "Continue"}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No courses enrolled
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start your learning journey by enrolling in a course.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="space-y-6">
          {/* Recent Lessons */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Lessons
              </h3>
            </div>
            <div className="p-6">
              {recentLessons.length > 0 ? (
                <div className="space-y-3">
                  {recentLessons.slice(0, 3).map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            lesson.completed ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <span
                          className={`text-sm ${
                            lesson.completed
                              ? "text-gray-600 dark:text-gray-400 line-through"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {lesson.title}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {lesson.duration}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  No recent lessons
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button
                  onClick={() =>
                    handleQuickAction(
                      "browse",
                      "/courses",
                      "Browsing courses..."
                    )
                  }
                  disabled={navigatingAction === "browse"}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
                    navigatingAction === "browse"
                      ? "bg-blue-100 dark:bg-blue-900/30 cursor-not-allowed"
                      : "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  }`}
                >
                  {navigatingAction === "browse" ? (
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  )}
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Browse Courses
                  </span>
                </button>
                <button
                  onClick={() =>
                    handleQuickAction(
                      "my-courses",
                      "/my-courses",
                      "Opening My Courses..."
                    )
                  }
                  disabled={navigatingAction === "my-courses"}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
                    navigatingAction === "my-courses"
                      ? "bg-indigo-100 dark:bg-indigo-900/30 cursor-not-allowed"
                      : "bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                  }`}
                >
                  {navigatingAction === "my-courses" ? (
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <PlayCircle className="w-5 h-5 text-indigo-600" />
                  )}
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    My Courses
                  </span>
                </button>
                <button
                  onClick={() =>
                    handleQuickAction("todo", "/todo", "Opening TODO List...")
                  }
                  disabled={navigatingAction === "todo"}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
                    navigatingAction === "todo"
                      ? "bg-green-100 dark:bg-green-900/30 cursor-not-allowed"
                      : "bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30"
                  }`}
                >
                  {navigatingAction === "todo" ? (
                    <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    TODO List
                  </span>
                </button>
                <button
                  onClick={() =>
                    handleQuickAction(
                      "kanban",
                      "/kanban",
                      "Opening Study Planner..."
                    )
                  }
                  disabled={navigatingAction === "kanban"}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
                    navigatingAction === "kanban"
                      ? "bg-purple-100 dark:bg-purple-900/30 cursor-not-allowed"
                      : "bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                  }`}
                >
                  {navigatingAction === "kanban" ? (
                    <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Calendar className="w-5 h-5 text-purple-600" />
                  )}
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    Study Planner
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Achievement Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Weekly Goal
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Study hours this week
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  8 / 10 hours
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: "80%" }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                2 hours remaining to reach your goal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
