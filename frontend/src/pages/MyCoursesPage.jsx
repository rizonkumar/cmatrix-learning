import React, { useState, useEffect } from "react";
import {
  BookOpen,
  PlayCircle,
  Clock,
  Users,
  Star,
  Search,
  Grid,
  List,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { enrollmentService } from "../services/enrollmentService";
import { DataLoader } from "../components/common/LoadingSpinner";
import { CourseListSkeleton } from "../components/common/SkeletonLoader";

const MyCoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recent");

  // API state
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load enrolled courses from API
  const loadEnrolledCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await enrollmentService.getMyEnrollments({
        page: 1,
        limit: 50, // Load more courses for filtering
      });

      // Transform the data to include course information with enrollment details
      const coursesWithProgress = response.data.map((enrollment) => ({
        ...enrollment.course,
        enrollmentId: enrollment._id,
        enrolledDate: new Date(enrollment.enrolledAt).toLocaleDateString(),
        progress: enrollment.progress || 0,
        lastAccessed: enrollment.lastAccessed
          ? new Date(enrollment.lastAccessed).toLocaleDateString()
          : "Never",
        totalLessons:
          enrollment.course.modules?.reduce(
            (total, module) => total + (module.lessons?.length || 0),
            0
          ) || 0,
        completedLessons: enrollment.completedLessons?.length || 0,
        timeSpent: enrollment.timeSpent
          ? `${Math.floor(enrollment.timeSpent / 3600)}h ${Math.floor(
              (enrollment.timeSpent % 3600) / 60
            )}m`
          : "0h 0m",
        nextLesson: enrollment.nextLesson || "Start Course",
      }));

      setEnrolledCourses(coursesWithProgress);
    } catch (err) {
      setError("Failed to load your courses");
      console.error("Error loading enrolled courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnrolledCourses();
  }, []);

  const categories = [
    "All",
    "Mathematics",
    "Science",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
  ];

  // Filter and sort courses
  const filteredCourses = enrolledCourses
    .filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.enrolledDate) - new Date(a.enrolledDate);
        case "progress":
          return b.progress - a.progress;
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Calculate statistics from real data
  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(
    (course) => course.progress === 100
  ).length;
  const inProgressCourses = enrolledCourses.filter(
    (course) => course.progress > 0 && course.progress < 100
  ).length;
  const totalProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce((sum, course) => sum + course.progress, 0) /
            enrolledCourses.length
        )
      : 0;

  const CourseCard = ({ course }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      {/* Course Header */}
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between text-white">
            <span className="text-sm bg-black/50 px-2 py-1 rounded">
              {course.category}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{course.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {course.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          by {course.instructor}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {course.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
            <BookOpen className="w-4 h-4" />
            <span>
              {course.completedLessons}/{course.totalLessons} lessons
            </span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{course.timeSpent}</span>
          </div>
        </div>

        {/* Next Lesson */}
        {course.progress < 100 && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <span className="font-medium">Next:</span> {course.nextLesson}
            </p>
          </div>
        )}

        {/* Last Accessed */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
          <span>Last accessed: {course.lastAccessed}</span>
          <span>Enrolled: {course.enrolledDate}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <PlayCircle className="w-4 h-4 mr-1" />
            {course.progress === 0 ? "Start Course" : "Continue"}
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            <BookOpen className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const CourseListItem = ({ course }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                by {course.instructor} • {course.category}
              </p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {course.rating}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">
                Progress: {course.progress}%
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {course.completedLessons}/{course.totalLessons} lessons
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <span>⏰ {course.timeSpent}</span>
              <span>📅 Last: {course.lastAccessed}</span>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <PlayCircle className="w-4 h-4 mr-1" />
              {course.progress === 0 ? "Start" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Courses
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your learning progress and continue where you left off
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Courses
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalCourses}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                In Progress
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {inProgressCourses}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedCourses}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg Progress
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalProgress}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Category Filter */}
          <div className="w-full lg:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="w-full lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="recent">Recently Enrolled</option>
              <option value="progress">By Progress</option>
              <option value="name">By Name</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-md">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid"
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Courses Grid/List */}
      <DataLoader
        loading={loading}
        error={error}
        onRetry={loadEnrolledCourses}
        emptyMessage="No courses found"
      >
        {filteredCourses.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
                : "space-y-6"
            }
          >
            {filteredCourses.map((course) =>
              viewMode === "grid" ? (
                <CourseCard key={course._id || course.id} course={course} />
              ) : (
                <CourseListItem key={course._id || course.id} course={course} />
              )
            )}
          </div>
        ) : !loading && !error ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || selectedCategory !== "All"
                ? "Try adjusting your search or filters"
                : "You haven't enrolled in any courses yet"}
            </p>
            {!searchTerm && selectedCategory === "All" && (
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Browse Courses
              </Button>
            )}
          </div>
        ) : null}
      </DataLoader>

      {/* Loading skeletons for better UX */}
      {loading && (
        <div className="space-y-6 mt-8">
          {[...Array(6)].map((_, i) => (
            <CourseListSkeleton key={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
