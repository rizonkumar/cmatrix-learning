import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  ArrowLeft,
  Users,
  Clock,
  Eye,
  X,
  Save,
  AlertTriangle,
} from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { courseService } from "../services/courseService";
import { adminService } from "../services/adminService";
import { DataLoader } from "../components/common/LoadingSpinner";
import { toast } from "react-hot-toast";

const validateCourseData = (course) => {
  if (!course || typeof course !== "object") {
    console.warn("Invalid course data:", course);
    return null;
  }

  return {
    _id: course._id || course.id,
    title: course.title || "Untitled Course",
    description: course.description || "",
    instructor: course.instructor || null,
    category: course.category || "",
    level: course.level || "beginner",
    duration: course.duration || "",
    price: course.price || 0,
    isPublished: course.isPublished || false,
    thumbnail: course.thumbnail || null,
    enrollmentCount:
      course.enrollmentCount || course.enrolledStudents?.length || 0,
    syllabus: course.syllabus || [],
    createdAt: course.createdAt || new Date().toISOString(),
    updatedAt: course.updatedAt || new Date().toISOString(),
    ...course, // Keep any additional properties
  };
};

const CourseManagementPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    instructor: "",
    category: "",
    level: "beginner",
    duration: "",
    price: "",
    thumbnail: null,
    syllabus: [],
  });

  const [activeSyllabi, setActiveSyllabi] = useState([]);
  const [syllabiLoading, setSyllabiLoading] = useState(false);

  const categories = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Geography",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Economics",
  ];

  // Function to fetch active syllabi for category suggestions
  const fetchActiveSyllabi = async () => {
    try {
      setSyllabiLoading(true);
      const response = await adminService.getAllSyllabi({ isActive: true });
      setActiveSyllabi(response.data.syllabi || []);
    } catch (error) {
      console.error("Error fetching active syllabi:", error);
      // Don't show error for this optional feature
    } finally {
      setSyllabiLoading(false);
    }
  };

  // Extract unique subjects from active syllabi for category suggestions
  const suggestedCategories = [
    ...categories,
    ...activeSyllabi.reduce((acc, syllabus) => {
      syllabus.subjects?.forEach((subject) => {
        if (!acc.includes(subject.name)) {
          acc.push(subject.name);
        }
      });
      return acc;
    }, []),
  ];

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await courseService.getCoursesForAdmin({
        limit: 100,
      });

      const rawCourses = response.courses || [];

      const validatedCourses = rawCourses
        .map(validateCourseData)
        .filter((course) => course !== null);

      setCourses(validatedCourses);
    } catch (err) {
      console.error("Error message:", err.message);
      if (err.response?.status === 401) {
        setError("Authentication required. Please log in again.");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to view courses.");
      } else {
        setError("Failed to load courses. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
    fetchActiveSyllabi();
  }, []);

  const handleAddCourse = async () => {
    if (!validateCourseForm()) {
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(courseForm).forEach((key) => {
        if (courseForm[key] !== null && courseForm[key] !== "") {
          if (key === "thumbnail" && courseForm[key]) {
            formData.append(key, courseForm[key]);
          } else if (key === "syllabus") {
            formData.append(key, JSON.stringify(courseForm[key]));
          } else {
            formData.append(key, courseForm[key]);
          }
        }
      });

      await courseService.createCourse(formData);
      toast.success("Course created successfully!");
      setShowAddModal(false);
      resetForm();
      loadCourses();
    } catch (error) {
      toast.error("Failed to create course");
      console.error("Error creating course:", error);
    }
  };

  const handleEditCourse = async () => {
    if (!validateCourseForm()) {
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(courseForm).forEach((key) => {
        if (courseForm[key] !== null && courseForm[key] !== "") {
          if (key === "thumbnail" && courseForm[key]) {
            formData.append(key, courseForm[key]);
          } else if (key === "syllabus") {
            formData.append(key, JSON.stringify(courseForm[key]));
          } else {
            formData.append(key, courseForm[key]);
          }
        }
      });

      await courseService.updateCourse(selectedCourse._id, formData);
      toast.success("Course updated successfully!");
      setShowEditModal(false);
      resetForm();
      loadCourses();
    } catch (error) {
      toast.error("Failed to update course");
      console.error("Error updating course:", error);
    }
  };

  const openDeleteModal = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;

    try {
      await courseService.deleteCourse(selectedCourse._id);
      toast.success("Course deleted successfully!");
      setShowDeleteModal(false);
      setSelectedCourse(null);
      loadCourses();
    } catch (error) {
      toast.error("Failed to delete course");
      console.error("Error deleting course:", error);
    }
  };

  const resetForm = () => {
    setCourseForm({
      title: "",
      description: "",
      instructor: "",
      category: "",
      level: "beginner",
      duration: "",
      price: "",
      thumbnail: null,
      syllabus: [],
    });
    setSelectedCourse(null);
  };

  // Validate course form data before submission
  const validateCourseForm = () => {
    if (!courseForm.title?.trim()) {
      toast.error("Course title is required");
      return false;
    }
    if (!courseForm.description?.trim()) {
      toast.error("Course description is required");
      return false;
    }
    if (!courseForm.category) {
      toast.error("Course category is required");
      return false;
    }
    if (!courseForm.duration?.trim()) {
      toast.error("Course duration is required");
      return false;
    }
    return true;
  };

  const openEditModal = (course) => {
    setSelectedCourse(course);
    setCourseForm({
      title: course.title || "",
      description: course.description || "",
      instructor:
        course.instructor?.fullName ||
        course.instructor?.username ||
        course.instructor ||
        "",
      category: course.category || "",
      level: course.level || "beginner",
      duration: course.duration || "",
      price: course.price || "",
      thumbnail: null,
      syllabus: course.syllabus || [],
    });
    setShowEditModal(true);
  };

  const filteredCourses = courses.filter((course) => {
    const title = (course.title || "").toLowerCase();
    const description = (course.description || "").toLowerCase();
    const category = (course.category || "").toLowerCase();

    const matchesSearch =
      title.includes(searchTerm.toLowerCase()) ||
      description.includes(searchTerm.toLowerCase()) ||
      category.includes(searchTerm.toLowerCase());

    const isPublished =
      course.isPublished === true || course.isPublished === "true";
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "published" && isPublished) ||
      (filterStatus === "draft" && !isPublished);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: courses.length,
    published: courses.filter(
      (c) => c.isPublished === true || c.isPublished === "true"
    ).length,
    draft: courses.filter(
      (c) =>
        c.isPublished === false ||
        c.isPublished === "false" ||
        c.isPublished === undefined
    ).length,
    totalStudents: courses.reduce((sum, course) => {
      const count =
        course.enrollmentCount || course.enrolledStudents?.length || 0;
      return sum + count;
    }, 0),
  };

  return (
    <div className="min-h-screen dark:bg-gray-800 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Course Management
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300 mt-1">
              Create and manage course content
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/admin")}
          className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl px-6 py-3 w-fit cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 shadow-lg border border-blue-100 dark:border-blue-800/30 hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">
                Total Courses
              </p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {stats.total}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                All courses in system
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 shadow-lg border border-green-100 dark:border-green-800/30 hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">
                Published
              </p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                {stats.published}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Live and accessible
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <Eye className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 shadow-lg border border-orange-100 dark:border-orange-800/30 hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-1">
                Draft
              </p>
              <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                {stats.draft}
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                Work in progress
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <Edit className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-800/30 hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1">
                Total Students
              </p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {stats.totalStudents}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                Enrolled learners
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <Users className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-white dark:hover:bg-gray-600"
              />
            </div>

            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-5 py-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-white dark:hover:bg-gray-600 cursor-pointer"
              >
                <option value="all">All Courses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer px-6 py-4"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Course
          </Button>
        </div>
      </div>

      {/* Courses Grid */}
      <div>
        <DataLoader
          loading={loading}
          error={error}
          onRetry={loadCourses}
          emptyMessage="No courses found"
        >
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-2 group cursor-pointer overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={course.thumbnail || "/placeholder-course.jpg"}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />
                    <div className="absolute top-4 right-4">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          course.isPublished
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                        }`}
                      >
                        {course.isPublished ? "Published" : "Draft"}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {course.title || "Untitled Course"}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {course.category && course.level
                            ? `${course.category} • ${course.level}`
                            : "No category/level"}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {course.duration || "No duration"}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {course.enrollmentCount || 0}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {course.price === 0 || !course.price
                          ? "Free"
                          : `₹${course.price}`}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(course)}
                          className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                          title="Edit Course"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(course)}
                          className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !loading && !error ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No courses found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Start by creating your first course"}
              </p>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Course
              </Button>
            </div>
          ) : null}
        </DataLoader>
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Add New Course
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Create a new course for your platform
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Course Title"
                  value={courseForm.title}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, title: e.target.value })
                  }
                  placeholder="e.g., Advanced Mathematics for IIT-JEE"
                  required
                />

                <Input
                  label="Instructor"
                  value={courseForm.instructor}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, instructor: e.target.value })
                  }
                  placeholder="e.g., Dr. Rajesh Kumar"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Course description..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={courseForm.category}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  >
                    <option value="">Select Category</option>
                    {suggestedCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                        {activeSyllabi.some((s) =>
                          s.subjects?.some((sub) => sub.name === category)
                        ) && " (Active Syllabus)"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Level
                  </label>
                  <select
                    value={courseForm.level}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, level: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <Input
                  label="Duration"
                  value={courseForm.duration}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, duration: e.target.value })
                  }
                  placeholder="e.g., 8 weeks"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Price (₹)"
                  type="number"
                  value={courseForm.price}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, price: e.target.value })
                  }
                  placeholder="0 for free"
                  required
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Course Thumbnail
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        thumbnail: e.target.files[0],
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCourse}
                  disabled={
                    !courseForm.title ||
                    !courseForm.description ||
                    !courseForm.category
                  }
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Create Course
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center">
                  <Edit className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Edit Course
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Update course information
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Course Title"
                  value={courseForm.title}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, title: e.target.value })
                  }
                  placeholder="e.g., Advanced Mathematics for IIT-JEE"
                  required
                />

                <Input
                  label="Instructor"
                  value={courseForm.instructor}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, instructor: e.target.value })
                  }
                  placeholder="e.g., Dr. Rajesh Kumar"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Course description..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={courseForm.category}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  >
                    <option value="">Select Category</option>
                    {suggestedCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                        {activeSyllabi.some((s) =>
                          s.subjects?.some((sub) => sub.name === category)
                        ) && " (Active Syllabus)"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Level
                  </label>
                  <select
                    value={courseForm.level}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, level: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <Input
                  label="Duration"
                  value={courseForm.duration}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, duration: e.target.value })
                  }
                  placeholder="e.g., 8 weeks"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Price (₹)"
                  type="number"
                  value={courseForm.price}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, price: e.target.value })
                  }
                  placeholder="0 for free"
                  required
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Course Thumbnail (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        thumbnail: e.target.files[0],
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditCourse}
                  disabled={
                    !courseForm.title ||
                    !courseForm.description ||
                    !courseForm.category
                  }
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Update Course
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Delete Course
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCourse(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedCourse.title || "Untitled Course"}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Are you sure you want to delete this course? All associated
                  data will be permanently removed.
                </p>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedCourse(null);
                  }}
                  className="px-6 py-3 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteCourse}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Delete Course
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagementPage;
