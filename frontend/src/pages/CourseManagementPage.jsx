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
} from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { courseService } from "../services/courseService";
import { DataLoader } from "../components/common/LoadingSpinner";
import { toast } from "react-hot-toast";

const CourseManagementPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await courseService.getCourses({
        limit: 100,
        includeUnpublished: true,
      });
      setCourses(response.data.courses || []);
    } catch (err) {
      setError("Failed to load courses");
      console.error("Error loading courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleAddCourse = async () => {
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

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await courseService.deleteCourse(courseId);
      toast.success("Course deleted successfully!");
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

  const openEditModal = (course) => {
    setSelectedCourse(course);
    setCourseForm({
      title: course.title || "",
      description: course.description || "",
      instructor:
        course.instructor?.fullName || course.instructor?.username || "",
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
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "published" && course.isPublished) ||
      (filterStatus === "draft" && !course.isPublished);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: courses.length,
    published: courses.filter((c) => c.isPublished).length,
    draft: courses.filter((c) => !c.isPublished).length,
    totalStudents: courses.reduce(
      (sum, course) => sum + (course.enrollmentCount || 0),
      0
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-4 py-2 w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Course Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create and manage course content
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Courses
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Published
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.published}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Draft
              </p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {stats.draft}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <Edit className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Students
              </p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {stats.totalStudents}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="all">All Courses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 group"
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
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {course.category} • {course.level}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {course.duration}
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
                        {course.price === 0 ? "Free" : `₹${course.price}`}
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
                          onClick={() => handleDeleteCourse(course._id)}
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
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
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
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
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
    </div>
  );
};

export default CourseManagementPage;
