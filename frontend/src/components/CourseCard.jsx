import React, { useState } from "react";
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

      // Call parent callback if provided
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer">
        {/* Course Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
              {course.level}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
              {course.category}
            </span>
          </div>
        </div>

        {/* Course Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {course.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
            {course.description}
          </p>

          {/* Instructor */}
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {course.instructor}
            </span>
          </div>

          {/* Course Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-blue-500" />
              <span>{course.duration}</span>
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

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {course.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Price and Enroll Button */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{course.price}
            </div>

            {isEnrolled ? (
              <div className="flex flex-col items-end">
                <div className="text-green-600 dark:text-green-400 font-medium text-sm">
                  ✓ Enrolled
                </div>
                {enrollmentProgress > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {enrollmentProgress}% complete
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={handleEnroll}
                disabled={enrolling}
                size="sm"
                className="px-6"
              >
                {enrolling ? (
                  <InlineLoader message="Enrolling..." />
                ) : (
                  "Enroll Now"
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
