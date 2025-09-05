import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, Grid, List } from "lucide-react";
import CourseCard from "../components/CourseCard";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { courseService } from "../services/courseService";
import { enrollmentService } from "../services/enrollmentService";
import { DataLoader } from "../components/common/LoadingSpinner";
import { CourseCardSkeleton } from "../components/common/SkeletonLoader";
import { toast } from "react-hot-toast";

const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [viewMode, setViewMode] = useState("grid");

  // API state
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const levels = [
    "All",
    "Class 8th",
    "Class 9th",
    "Class 10th",
    "Class 11th",
    "Class 12th",
    "IIT-JEE",
    "NEET",
  ];

  // Load courses from API
  const loadCourses = async (page = 1, append = false) => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        page,
        limit: 12,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== "All" && { category: selectedCategory }),
        ...(selectedLevel !== "All" && { subject: selectedLevel }),
      };

      const response = await courseService.getCourses(filters);

      if (append) {
        setCourses((prev) => [...prev, ...response.courses]);
      } else {
        setCourses(response.courses);
      }

      setPagination(response.pagination);
      setHasMore(response.pagination.hasNext);
      setCurrentPage(page);
    } catch (err) {
      setError("Failed to load courses");
      console.error("Error loading courses:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load user's enrolled courses
  const loadEnrolledCourses = async () => {
    try {
      const response = await enrollmentService.getMyEnrollments();
      const enrolledSet = new Set(
        response.enrollments.map((enrollment) => enrollment.course._id)
      );
      setEnrolledCourses(enrolledSet);
    } catch (err) {
      console.error("Error loading enrolled courses:", err);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const response = await courseService.getCategories();
      // Extract category names from the {name, count} objects
      const categoryNames = response.categories.map((cat) => cat.name);
      setCategories(["All", ...categoryNames]);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  // Initialize component
  useEffect(() => {
    const initialize = async () => {
      await Promise.all([loadCategories(), loadEnrolledCourses()]);
      await loadCourses();
    };

    initialize();
  }, []);

  // Initialize filters from URL params
  useEffect(() => {
    const classParam = searchParams.get("class");
    const examParam = searchParams.get("exam");

    if (classParam) {
      const classLevelMap = {
        8: "Class 8th",
        9: "Class 9th",
        10: "Class 10th",
        11: "Class 11th",
        12: "Class 12th",
      };
      setSelectedLevel(classLevelMap[classParam] || "All");
    }

    if (examParam) {
      const examMap = {
        jee: "IIT-JEE",
        neet: "NEET",
      };
      setSelectedLevel(examMap[examParam] || "All");
    }
  }, [searchParams]);

  // Reload courses when filters change
  useEffect(() => {
    if (courses.length > 0 || error) {
      // Only reload if we've already loaded data
      loadCourses();
    }
  }, [searchTerm, selectedCategory, selectedLevel]);

  const handleEnroll = async (course) => {
    try {
      await enrollmentService.enrollInCourse(course.id || course._id);
      setEnrolledCourses((prev) => new Set([...prev, course.id || course._id]));
      toast.success(`Successfully enrolled in ${course.title}!`);
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error("Failed to enroll in course. Please try again.");
    }
  };

  const loadMoreCourses = () => {
    if (hasMore && !loading) {
      loadCourses(currentPage + 1, true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Our Courses
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover courses designed to help you excel in your academic journey
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search courses, instructors, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading && categories.length === 0}
              >
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))
                ) : (
                  <option>Loading...</option>
                )}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
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
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {loading && courses.length === 0
              ? "Loading courses..."
              : courses.length > 0
              ? `Showing ${courses.length} courses${
                  pagination ? ` (${pagination.totalCourses} total)` : ""
                }`
              : "No courses available"}
          </p>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
        </div>

        {/* Courses Grid/List */}
        <DataLoader
          loading={loading && courses.length === 0}
          error={error}
          onRetry={loadCourses}
          emptyMessage="No courses found"
        >
          {courses.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-6"
              }
            >
              {courses.map((course, index) => (
                <CourseCard
                  key={course._id || course.id || `course-${index}`}
                  course={course}
                  isEnrolled={enrolledCourses.has(course._id || course.id)}
                  onEnroll={handleEnroll}
                />
              ))}
            </div>
          ) : !loading && !error ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No courses found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search criteria or browse all courses.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedLevel("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : null}
        </DataLoader>

        {/* Loading skeletons for pagination */}
        {loading && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {[...Array(6)].map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {courses.length > 0 && hasMore && !loading && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" onClick={loadMoreCourses}>
              Load More Courses
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
