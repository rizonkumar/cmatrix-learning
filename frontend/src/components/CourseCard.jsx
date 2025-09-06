import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Star, Play, User, BookOpen, Award } from "lucide-react";
import Button from "./common/Button";
import { enrollmentService } from "../services/enrollmentService";
import { InlineLoader } from "./common/LoadingSpinner";
import { toast } from "react-hot-toast";

const CourseCard = ({
  course,
  onEnroll,
  isEnrolled = false,
  enrollmentProgress = 0,
}) => {
  const [enrolling, setEnrolling] = useState(false);

  const handleEnroll = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isEnrolled) return;

    try {
      setEnrolling(true);
      await enrollmentService.enrollInCourse(course.id || course._id);

      toast.success(`Successfully enrolled in ${course.title}!`);

      if (onEnroll) {
        onEnroll(course);
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error("Failed to enroll in course. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  // Format duration
  const formatDuration = (totalDuration) => {
    if (!totalDuration || totalDuration === 0) return "TBD";
    const hours = Math.floor(totalDuration / 60);
    const minutes = totalDuration % 60;
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "bg-green-500/90";
      case "intermediate":
        return "bg-yellow-500/90";
      case "advanced":
        return "bg-red-500/90";
      default:
        return "bg-blue-500/90";
    }
  };

  return (
    <Link to={`/courses/${course.id || course._id}`} className="block group">
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
        {/* Course Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Difficulty Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-2 py-1 ${getDifficultyColor(
                course.difficulty
              )} backdrop-blur-sm text-white text-xs font-medium rounded-full shadow-lg`}
            >
              {course.difficulty || "Beginner"}
            </span>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-white/10 backdrop-blur-sm text-white text-xs font-medium rounded-full shadow-lg border border-white/20">
              {course.category}
            </span>
          </div>

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors">
              <Play className="w-6 h-6 text-white ml-0.5" />
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
            {course.description}
          </p>

          {/* Instructor */}
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3 shadow-sm">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {course.instructor?.fullName ||
                  course.instructor?.username ||
                  "Instructor"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Instructor
              </p>
            </div>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              <span className="font-medium">
                {formatDuration(course.totalDuration)}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <BookOpen className="w-4 h-4 mr-2 text-green-500" />
              <span className="font-medium">
                {course.totalLessons || 0} lessons
              </span>
            </div>
          </div>

          {/* Rating and Students */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="flex items-center mr-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-bold text-gray-900 dark:text-white ml-1">
                  {course.rating || 0}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({course.enrolledStudents?.length || 0} students)
              </span>
            </div>
            {course.rating > 0 && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Award className="w-3 h-3 mr-1" />
                Rated
              </div>
            )}
          </div>

          {/* Price and Enroll Button */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                ₹{course.price}
              </span>
              {course.price > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  One-time payment
                </span>
              )}
            </div>

            {isEnrolled ? (
              <div className="flex flex-col items-end">
                <div className="flex items-center text-green-600 dark:text-green-400 font-semibold text-sm mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Enrolled
                </div>
                {enrollmentProgress > 0 && (
                  <div className="w-20">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-400 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${enrollmentProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                      {enrollmentProgress}% complete
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={handleEnroll}
                disabled={enrolling}
                size="sm"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-lg"
              >
                {enrolling ? (
                  <InlineLoader message="Enrolling..." />
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1.5" />
                    Enroll Now
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
