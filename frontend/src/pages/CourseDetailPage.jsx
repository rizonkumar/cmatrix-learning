import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Clock,
  Users,
  BookOpen,
  Play,
  CheckCircle,
  ShoppingCart,
  ArrowLeft,
  Share2,
  Heart,
} from "lucide-react";
import Button from "../components/common/Button";
import CourseReviews from "../components/reviews/CourseReviews";
import { courseService } from "../services/courseService";
import { enrollmentService } from "../services/enrollmentService";
import { wishlistService } from "../services/wishlistService";
import { toast } from "react-hot-toast";
import useAuthStore from "../store/authStore";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonPlayerOpen, setLessonPlayerOpen] = useState(false);

  // Handle lesson click
  const handleLessonClick = (lesson, module) => {
    setSelectedLesson({ ...lesson, moduleTitle: module.title });
    setLessonPlayerOpen(true);
    toast.success(`Starting lesson: ${lesson.title}`);
  };

  // Handle lesson completion
  const handleLessonComplete = async () => {
    if (!selectedLesson || !enrollment) return;

    try {
      await enrollmentService.updateLessonProgress(
        courseId,
        selectedLesson._id,
        { completed: true }
      );

      const updatedEnrollment = {
        ...enrollment,
        completedLessons: [
          ...(enrollment.completedLessons || []),
          selectedLesson._id,
        ],
        progress: Math.min(
          100,
          enrollment.progress + 100 / (course?.totalLessons || 1)
        ),
      };
      setEnrollment(updatedEnrollment);

      toast.success("Lesson completed! 🎉");

      // Reload course details to get updated progress
      loadCourseDetails();

      // Close lesson player after a short delay to show success message
      setTimeout(() => {
        setLessonPlayerOpen(false);
        setSelectedLesson(null);
      }, 1500);
    } catch (error) {
      console.error("Failed to mark lesson as complete:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to save lesson progress. Please try again."
      );
    }
  };

  const loadCourseDetails = useCallback(async () => {
    try {
      setLoading(true);
      const courseResponse = await courseService.getCourseById(courseId);
      setCourse(courseResponse.course);

      if (courseResponse.enrollmentDetails) {
        setEnrollment(courseResponse.enrollmentDetails);
      }

      if (isAuthenticated) {
        try {
          const enrollmentResponse =
            await enrollmentService.checkEnrollmentStatus(courseId);

          if (enrollmentResponse?.data?.enrolled) {
            setEnrollment(enrollmentResponse.data.enrollment);
          } else {
            // If not enrolled, make sure enrollment state is null
            setEnrollment(null);
          }
        } catch {
          // Reset enrollment state to null if check fails
          setEnrollment(null);
        }
      } else {
        // If not authenticated, ensure enrollment is null
        setEnrollment(null);
      }
    } catch (error) {
      console.error("Failed to load course details:", error);
      toast.error("Failed to load course details");
      navigate("/courses");
    } finally {
      setLoading(false);
    }
  }, [courseId, isAuthenticated, navigate]);

  useEffect(() => {
    loadCourseDetails();
  }, [loadCourseDetails]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to enroll in courses");
      navigate("/login");
      return;
    }

    setEnrolling(true);
    try {
      await enrollmentService.enrollInCourse(courseId);
      toast.success(`Successfully enrolled in ${course.title}! 🎉`);

      const enrollmentResponse = await enrollmentService.checkEnrollmentStatus(
        courseId
      );
      if (enrollmentResponse.data.enrolled) {
        setEnrollment(enrollmentResponse.data.enrollment);
      }

      loadCourseDetails();
    } catch (error) {
      console.error("Enrollment error:", error);

      // Handle specific enrollment errors
      if (error.response?.status === 409) {
        // User is already enrolled, refresh the status to show enrolled state
        toast.info("You're already enrolled in this course!");
        const enrollmentResponse =
          await enrollmentService.checkEnrollmentStatus(courseId);
        if (enrollmentResponse.data.enrolled) {
          setEnrollment(enrollmentResponse.data.enrollment);
        }
        loadCourseDetails();
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to enroll in course. Please try again.";
        toast.error(errorMessage);
      }
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartCourse = () => {
    navigate(`/my-courses/${courseId}`);
  };

  const renderStars = (rating, size = "text-yellow-400") => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`inline w-4 h-4 ${
            i <= rating ? `${size} fill-current` : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  const courseRating = course?.rating?.toFixed(1) || "N/A";

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button Skeleton */}
          <div className="mb-6">
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
          </div>

          <div className="animate-pulse space-y-6 md:space-y-8">
            {/* Hero Section Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 md:p-8">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                  {/* Course Image/Video Skeleton */}
                  <div className="lg:w-1/2">
                    <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-xl mb-6"></div>

                    {/* Course Stats Skeleton */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                      <div className="text-center">
                        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16 mx-auto"></div>
                      </div>
                      <div className="text-center">
                        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-12 mx-auto"></div>
                      </div>
                      <div className="text-center">
                        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-14 mx-auto"></div>
                      </div>
                    </div>
                  </div>

                  {/* Course Info Skeleton */}
                  <div className="lg:w-1/2 space-y-4 md:space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="h-8 md:h-10 bg-gray-300 dark:bg-gray-700 rounded w-4/5"></div>
                        <div className="flex gap-2">
                          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>

                    <div className="h-24 bg-gray-300 dark:bg-gray-700 rounded"></div>

                    {/* Instructor Info Skeleton */}
                    <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                      </div>
                    </div>

                    {/* Enrollment Section Skeleton */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-600 space-y-4">
                      <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Content Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                  >
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
                    <div className="space-y-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded flex-1"></div>
                          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 md:py-24">
            <div className="mb-6">
              <BookOpen className="w-16 h-16 md:w-20 md:h-20 text-gray-400 mx-auto mb-4" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Course Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg max-w-md mx-auto">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => navigate("/courses")}
                className="px-8 py-3"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Browse All Courses
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="px-8 py-3"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isEnrolled = !!enrollment;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-4 md:mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/courses")}
            className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Courses</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row">
            {/* Course Image/Video Preview */}
            <div className="lg:w-1/2 p-4 md:p-8">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm md:text-base">
                      Course Preview
                    </p>
                  </div>
                )}
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mr-1 md:mr-2" />
                    <span className="font-semibold text-sm md:text-base">
                      {course.enrolledStudents?.length || 0}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    Students
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <div className="flex items-center mr-1 md:mr-2">
                      {renderStars(
                        Math.round(course?.rating || 0),
                        "text-yellow-500"
                      )}
                    </div>
                    <span className="font-semibold text-sm md:text-base">
                      {courseRating}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    Rating
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-green-600 mr-1 md:mr-2" />
                    <span className="font-semibold text-sm md:text-base">
                      {course.duration || "N/A"}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    Duration
                  </p>
                </div>
              </div>
            </div>

            {/* Course Info */}
            <div className="lg:w-1/2 p-4 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    {course.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getDifficultyColor(
                        course.difficulty
                      )}`}
                    >
                      {course.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs md:text-sm font-medium">
                      {course.category}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 self-start">
                  <Button variant="outline" size="sm" className="p-2">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      if (!isAuthenticated) {
                        toast.error("Please login to add courses to wishlist");
                        navigate("/login");
                        return;
                      }

                      try {
                        const response = await wishlistService.toggleWishlist(
                          courseId
                        );
                        const newWishlistStatus = response.data.isWishlisted;
                        setIsWishlisted(newWishlistStatus);

                        toast.success(
                          newWishlistStatus
                            ? "Course added to wishlist! ❤️"
                            : "Course removed from wishlist"
                        );
                      } catch (error) {
                        console.error("Wishlist toggle failed:", error);
                        toast.error("Failed to update wishlist");
                      }
                    }}
                    className={`p-2 ${
                      isWishlisted
                        ? "text-red-600 border-red-300 dark:border-red-700"
                        : ""
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isWishlisted ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                {course.description}
              </p>

              {/* Instructor Info */}
              {course.instructor && (
                <div className="flex items-center gap-3 mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <img
                    src={course.instructor.avatar || "/default-avatar.png"}
                    alt={course.instructor.fullName}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm md:text-base truncate">
                      {course.instructor.fullName}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      Instructor
                    </p>
                  </div>
                </div>
              )}

              {/* Enrollment Section */}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                {isEnrolled ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">
                        Enrolled in this course
                      </span>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm">
                          {enrollment?.progress || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${enrollment?.progress || 0}%` }}
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleStartCourse}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Continue Learning
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ₹{course.price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{Math.round(course.price * 1.2)}
                      </span>
                    </div>
                    <Button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 disabled:opacity-50"
                    >
                      {enrolling ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Enrolling...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <ShoppingCart className="w-5 h-5" />
                          Enroll Now
                        </div>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Content Preview */}
        {course.modules && course.modules.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Course Content
              </h2>
              {enrollment && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="text-left sm:text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Progress: {enrollment.progress || 0}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {enrollment.completedLessons?.length || 0} of{" "}
                      {course.totalLessons || 0} lessons
                    </div>
                  </div>
                  <div className="w-full sm:w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${enrollment.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Continue Learning Button for Enrolled Users */}
              {enrollment && enrollment.progress < 100 && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                        Continue Learning
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Pick up where you left off
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        // Find the next incomplete lesson
                        let nextLesson = null;
                        for (const module of course.modules || []) {
                          for (const lesson of module.lessons || []) {
                            if (
                              !enrollment.completedLessons?.includes(lesson._id)
                            ) {
                              nextLesson = lesson;
                              break;
                            }
                          }
                          if (nextLesson) break;
                        }

                        if (nextLesson) {
                          // Find the module that contains this lesson
                          const moduleWithLesson = course.modules.find(
                            (module) =>
                              module.lessons.some(
                                (lesson) => lesson._id === nextLesson._id
                              )
                          );
                          handleLessonClick(nextLesson, moduleWithLesson);
                        } else {
                          toast.info("All lessons completed!");
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Continue
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {course.modules.slice(0, 3).map((module, moduleIndex) => (
                <div
                  key={moduleIndex}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Module {moduleIndex + 1}: {module.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {module.description}
                  </p>

                  <div className="space-y-2">
                    {module.lessons?.slice(0, 3).map((lesson, lessonIndex) => {
                      // Check if lesson is completed (if user is enrolled)
                      const isCompleted =
                        enrollment?.completedLessons?.includes(lesson._id);
                      const isEnrolled = !!enrollment;

                      return (
                        <button
                          key={lessonIndex}
                          onClick={() => {
                            if (isEnrolled) {
                              handleLessonClick(lesson, module);
                            } else {
                              toast.info(
                                "Please enroll in the course to access lessons"
                              );
                            }
                          }}
                          disabled={!isEnrolled}
                          className={`w-full flex items-center gap-3 p-2 rounded-lg text-sm transition-all duration-200 ${
                            isEnrolled
                              ? "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                              : "cursor-not-allowed opacity-60"
                          }`}
                        >
                          <div
                            className={`flex items-center justify-center w-6 h-6 rounded-full ${
                              isCompleted
                                ? "bg-green-100 dark:bg-green-900/30"
                                : isEnrolled
                                ? "bg-blue-100 dark:bg-blue-900/30"
                                : "bg-gray-100 dark:bg-gray-700"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Play
                                className={`w-3 h-3 ${
                                  isEnrolled ? "text-blue-600" : "text-gray-400"
                                }`}
                              />
                            )}
                          </div>
                          <span
                            className={`flex-1 text-left ${
                              isCompleted
                                ? "text-gray-500 line-through"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {lesson.title}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {lesson.duration || "N/A"} min
                          </span>
                        </button>
                      );
                    })}
                    {module.lessons?.length > 3 && (
                      <div className="text-sm text-gray-500">
                        +{module.lessons.length - 3} more lessons
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {course.modules.length > 3 && (
                <div className="text-center py-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    +{course.modules.length - 3} more modules available after
                    enrollment
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <CourseReviews courseId={courseId} />
      </div>

      {/* Lesson Player Modal */}
      {lessonPlayerOpen && selectedLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[95vh] md:max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="min-w-0 flex-1 mr-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {selectedLesson.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">
                  {selectedLesson.moduleTitle} • {selectedLesson.duration} min
                </p>
              </div>
              <button
                onClick={() => {
                  setLessonPlayerOpen(false);
                  setSelectedLesson(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>

            <div className="p-4 md:p-6">
              {selectedLesson.contentType === "video" ? (
                <div className="aspect-video bg-black rounded-xl mb-4 md:mb-6 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <Play className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 opacity-60" />
                    <p className="text-base md:text-lg">Video Player</p>
                    <p className="text-xs md:text-sm opacity-60 mt-2">
                      Content: {selectedLesson.content}
                    </p>
                  </div>
                </div>
              ) : selectedLesson.contentType === "text" ? (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
                  <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
                    Lesson Content
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                    {selectedLesson.content ||
                      "Lesson content would be displayed here."}
                  </p>
                </div>
              ) : (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 md:p-6 mb-4 md:mb-6 text-center">
                  <BookOpen className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-blue-600" />
                  <p className="text-blue-700 dark:text-blue-300 text-sm md:text-base">
                    Interactive {selectedLesson.contentType} content
                  </p>
                  <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 mt-2">
                    {selectedLesson.content}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Lesson {selectedLesson.order || 1}
                </div>
                <Button
                  onClick={handleLessonComplete}
                  className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Complete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;
