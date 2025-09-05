import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Star, Play, User } from "lucide-react";
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

  return (
    <Link to={`/courses/${course.id || course._id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover-lift gradient-border overflow-hidden cursor-pointer transform-3d group">
        {/* Course Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="absolute top-4 left-4 animate-float">
            <span className="px-3 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full shadow-lg">
              {course.difficulty}
            </span>
          </div>
          <div
            className="absolute top-4 right-4 animate-float"
            style={{ animationDelay: "1s" }}
          >
            <span className="px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full shadow-lg">
              {course.category}
            </span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {course.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
            {course.description}
          </p>

          {/* Instructor */}
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3 animate-float group-hover:scale-110 transition-transform duration-300">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {course.instructor?.fullName || course.instructor?.username}
            </span>
          </div>

          {/* Course Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-blue-500" />
              <span>{course.totalDuration || "TBD"}h</span>
            </div>
            <div className="flex items-center">
              <Play className="w-4 h-4 mr-1 text-green-500" />
              <span>{course.totalLessons} lessons</span>
            </div>
          </div>

          {/* Rating and Students */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {course.rating}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                ({course.enrolledStudents} students)
              </span>
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-wrap gap-2 mb-4">
            {course.category && (
              <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 text-xs text-blue-600 dark:text-blue-400 rounded-full">
                {course.category}
              </span>
            )}
          </div>

          {/* Price and Enroll Button */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              ₹{course.price}
            </div>

            {isEnrolled ? (
              <div className="flex flex-col items-end">
                <div className="text-green-600 dark:text-green-400 font-medium text-sm animate-pulse">
                  ✓ Enrolled
                </div>
                {enrollmentProgress > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
                      <div
                        className="bg-green-600 h-1 rounded-full transition-all duration-500 animate-shimmer"
                        style={{ width: `${enrollmentProgress}%` }}
                      ></div>
                    </div>
                    <span className="mt-1 block">
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
                className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover-lift focus-ring-enhanced"
              >
                {enrolling ? (
                  <InlineLoader message="Enrolling..." />
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1" />
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
