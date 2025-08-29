import { enrollmentService } from "../services/enrollment.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class EnrollmentController {
  // Enroll in a course
  enrollInCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const enrollment = await enrollmentService.enrollInCourse(
      studentId,
      courseId
    );

    res
      .status(201)
      .json(
        new ApiResponse(201, { enrollment }, "Successfully enrolled in course")
      );
  });

  // Unenroll from a course
  unenrollFromCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user._id;

    await enrollmentService.unenrollFromCourse(studentId, courseId);

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Successfully unenrolled from course"));
  });

  // Update lesson progress
  updateLessonProgress = asyncHandler(async (req, res) => {
    const { courseId, lessonId } = req.params;
    const { completed = true } = req.body;
    const studentId = req.user._id;

    const enrollment = await enrollmentService.updateProgress(
      studentId,
      courseId,
      lessonId,
      completed
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { enrollment },
          "Lesson progress updated successfully"
        )
      );
  });

  // Get student's enrollments
  getMyEnrollments = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const studentId = req.user._id;

    const result = await enrollmentService.getStudentEnrollments(
      studentId,
      page,
      limit
    );

    res
      .status(200)
      .json(new ApiResponse(200, result, "Enrollments retrieved successfully"));
  });

  // Get course enrollments (for teachers/admins)
  getCourseEnrollments = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const result = await enrollmentService.getCourseEnrollments(
      courseId,
      page,
      limit
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result,
          "Course enrollments retrieved successfully"
        )
      );
  });

  // Get enrollment details
  getEnrollmentDetails = asyncHandler(async (req, res) => {
    const { enrollmentId } = req.params;

    const enrollment = await enrollmentService.getEnrollmentById(enrollmentId);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { enrollment },
          "Enrollment details retrieved successfully"
        )
      );
  });

  // Get student's progress in a course
  getCourseProgress = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const progress = await enrollmentService.getStudentProgress(
      studentId,
      courseId
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { progress },
          "Course progress retrieved successfully"
        )
      );
  });

  // Check enrollment status
  checkEnrollmentStatus = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user._id;

    try {
      const progress = await enrollmentService.getStudentProgress(
        studentId,
        courseId
      );
      res.status(200).json(
        new ApiResponse(
          200,
          {
            isEnrolled: true,
            progress: progress.progress,
            isCompleted: progress.isCompleted,
          },
          "Enrollment status retrieved successfully"
        )
      );
    } catch (error) {
      if (error.statusCode === 404) {
        res.status(200).json(
          new ApiResponse(
            200,
            {
              isEnrolled: false,
              progress: 0,
              isCompleted: false,
            },
            "Student is not enrolled in this course"
          )
        );
      } else {
        throw error;
      }
    }
  });
}

export const enrollmentController = new EnrollmentController();
