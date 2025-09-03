import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Users,
  TrendingUp,
  Award,
  BookOpen,
  Clock,
  Target,
  BarChart3,
  Eye,
  UserCheck,
  Calendar,
  Star,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import adminService from "../services/adminService";

const StudentTrackingPage = () => {
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentProgress, setStudentProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadAnalytics();
    loadStudents();
  }, [currentPage]);

  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch();
    } else {
      loadStudents();
    }
  }, [currentPage, searchTerm]);

  const loadAnalytics = async () => {
    try {
      const response = await adminService.getStudentAnalytics();
      setAnalytics(response.data.data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    }
  };

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllStudentsProgress(
        currentPage,
        20
      );
      setStudents(response.data.data?.students || []);
      setTotalPages(response.data.data?.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Failed to load students:", error);
      setStudents([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      loadStudents();
      return;
    }

    try {
      setLoading(true);
      const response = await adminService.searchStudents(
        searchTerm.trim(),
        currentPage,
        20
      );
      setStudents(response.data.data?.students || []);
      setTotalPages(response.data.data?.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Search failed:", error);
      setStudents([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, currentPage, loadStudents]);

  const handleViewStudentProgress = async (studentId) => {
    try {
      const response = await adminService.getStudentProgressDetails(studentId);
      setStudentProgress(response.data.data);
      setSelectedStudent(response.data.data.student);
      setShowProgressModal(true);
    } catch (error) {
      console.error("Failed to load student progress:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getProgressTextColor = (progress) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 60) return "text-blue-600";
    if (progress >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800 rounded-2xl p-6 lg:p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              Student Tracking Dashboard
            </h1>
            <p className="text-blue-100 text-lg lg:text-xl mb-6 leading-relaxed">
              Monitor student progress, performance, and learning analytics
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Real-time Progress</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Analytics & Insights
                </span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Performance Tracking
                </span>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-6 shadow-2xl border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="font-bold text-xl">Student Analytics</div>
                  <div className="text-sm text-blue-100 font-medium">
                    Complete Overview
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Total Students
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {analytics.overview?.totalStudents || 0}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                    Active Platform
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Active Students
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {analytics.overview?.activeStudents || 0}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                    {analytics.overview?.activityRate || 0}% Activity Rate
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Completion Rate
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {analytics.enrollmentStats?.completionRate || 0}%
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
                    Course Completion
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Avg Progress
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {analytics.enrollmentStats?.averageProgress || 0}%
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold">
                    Learning Progress
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/20">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search students by name, email, or username..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              disabled={!searchTerm.trim() || loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
            <button
              onClick={() => {
                setSearchTerm("");
                loadStudents();
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  Enrollments
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  Completed
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  Progress
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  Current Streak
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {students.map((student) => (
                <tr
                  key={student._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          student.avatar ||
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
                        }
                        alt={student.fullName || "Student"}
                        className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {student.fullName || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {student.email || "No email"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {student.progress?.totalEnrollments || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {student.progress?.completedCourses || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-24">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                              student.progress?.averageProgress || 0
                            )}`}
                            style={{
                              width: `${
                                student.progress?.averageProgress || 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                      <span
                        className={`font-medium ${getProgressTextColor(
                          student.progress?.averageProgress || 0
                        )}`}
                      >
                        {student.progress?.averageProgress || 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {student.currentStreak || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewStudentProgress(student._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Progress
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {students.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No students found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm.trim()
                ? "Try adjusting your search criteria"
                : "Students will appear here once they enroll"}
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading students...
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex gap-2">
            {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Student Progress Modal */}
      {showProgressModal && studentProgress && selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6 lg:p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20"></div>
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <img
                        src={
                          selectedStudent?.avatar ||
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
                        }
                        alt={selectedStudent?.fullName || "Student"}
                        className="w-20 h-20 rounded-full border-4 border-white/30 shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                        {selectedStudent?.fullName || "Unknown Student"}
                      </h1>
                      <p className="text-blue-100 text-lg mb-3">
                        {selectedStudent?.email || "No email"}
                      </p>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                          <Star className="w-4 h-4 text-yellow-300 fill-current" />
                          <span className="text-sm font-medium">
                            {selectedStudent?.currentStreak || 0} Day Streak
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                          <Calendar className="w-4 h-4 text-blue-300" />
                          <span className="text-sm font-medium">
                            Joined{" "}
                            {selectedStudent?.joinedAt
                              ? new Date(
                                  selectedStudent.joinedAt
                                ).toLocaleDateString("en-US", {
                                  month: "long",
                                  year: "numeric",
                                })
                              : "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowProgressModal(false);
                      setStudentProgress(null);
                      setSelectedStudent(null);
                    }}
                    className="absolute top-6 right-6 text-white/70 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all duration-200"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 lg:p-8 max-h-[60vh] overflow-y-auto">
              {/* Progress Summary Cards */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  Learning Overview
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-2xl text-center border border-blue-200/50 dark:border-blue-800/50 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {studentProgress.progress?.totalEnrollments || 0}
                    </p>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Total Enrollments
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-2xl text-center border border-green-200/50 dark:border-green-800/50 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                      {studentProgress.progress?.completedCourses || 0}
                    </p>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      Completed Courses
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-6 rounded-2xl text-center border border-yellow-200/50 dark:border-yellow-800/50 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                      {studentProgress.progress?.inProgressCourses || 0}
                    </p>
                    <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                      In Progress
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-2xl text-center border border-purple-200/50 dark:border-purple-800/50 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                      {studentProgress.progress?.averageProgress || 0}%
                    </p>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      Average Progress
                    </p>
                  </div>
                </div>
              </div>

              {/* Course Enrollments */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                  Course Enrollments
                </h3>
                <div className="space-y-4">
                  {(studentProgress.enrollments || []).map((enrollment) => (
                    <div
                      key={enrollment._id}
                      className="bg-white dark:bg-gray-700/50 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                {enrollment.course.title}
                              </h4>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded-full">
                                  {enrollment.course.category}
                                </span>
                                <span className="flex items-center gap-1">
                                  <UserCheck className="w-4 h-4" />
                                  {enrollment.course.instructor.fullName}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Enrolled:{" "}
                                  {new Date(
                                    enrollment.enrolledAt
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                                {enrollment.completedAt && (
                                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                    <CheckCircle className="w-3 h-3" />
                                    Completed:{" "}
                                    {new Date(
                                      enrollment.completedAt
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                              enrollment.isCompleted
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}
                          >
                            {enrollment.isCompleted ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Clock className="w-4 h-4" />
                            )}
                            {enrollment.isCompleted
                              ? "Completed"
                              : "In Progress"}
                          </span>
                        </div>
                      </div>

                      {/* Enhanced Progress Bar */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">
                            Progress
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 dark:text-white">
                              {enrollment.progress}%
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ({enrollment.completedLessonsCount} lessons)
                            </span>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 shadow-inner">
                            <div
                              className={`h-4 rounded-full transition-all duration-500 ease-out shadow-sm ${
                                enrollment.progress >= 80
                                  ? "bg-gradient-to-r from-green-400 to-green-500"
                                  : enrollment.progress >= 60
                                  ? "bg-gradient-to-r from-blue-400 to-blue-500"
                                  : enrollment.progress >= 40
                                  ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                                  : "bg-gradient-to-r from-red-400 to-red-500"
                              }`}
                              style={{
                                width: `${enrollment.progress}%`,
                                boxShadow: `0 0 10px ${
                                  enrollment.progress >= 80
                                    ? "rgba(34, 197, 94, 0.3)"
                                    : enrollment.progress >= 60
                                    ? "rgba(59, 130, 246, 0.3)"
                                    : enrollment.progress >= 40
                                    ? "rgba(245, 158, 11, 0.3)"
                                    : "rgba(239, 68, 68, 0.3)"
                                }`,
                              }}
                            />
                          </div>
                          <div className="absolute top-0 left-0 w-full h-4 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                        </div>

                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                          <span>
                            {enrollment.completedLessonsCount} of{" "}
                            {enrollment.totalLessonsCount ||
                              enrollment.completedLessonsCount}{" "}
                            lessons completed
                          </span>
                          <span className="font-medium">
                            {enrollment.progress >= 80
                              ? "Excellent!"
                              : enrollment.progress >= 60
                              ? "Great progress!"
                              : enrollment.progress >= 40
                              ? "Keep going!"
                              : "Just started"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {(!studentProgress.enrollments ||
                  studentProgress.enrollments.length === 0) && (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No enrollments found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      This student hasn't enrolled in any courses yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Performers Section */}
      {analytics &&
        analytics.topStudents &&
        analytics.topStudents.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-yellow-500" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Top Performing Students
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(analytics.topStudents || [])
                .slice(0, 6)
                .map((student, index) => (
                  <div
                    key={student._id}
                    className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {student.fullName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {student.completionRate}% completion rate
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Enrollments
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {student.totalEnrollments}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Current Streak
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {student.currentStreak}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default StudentTrackingPage;
