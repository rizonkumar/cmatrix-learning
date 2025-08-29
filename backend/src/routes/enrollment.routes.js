import { Router } from "express";
import { enrollmentController } from "../controllers/enrollment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { sanitizeInput } from "../middlewares/validation.middleware.js";

const router = Router();

// Apply input sanitization to all routes
router.use(sanitizeInput);

// Student routes (require authentication)
router.use(verifyJWT);

// Enrollment management
router
  .route("/courses/:courseId/enroll")
  .post(enrollmentController.enrollInCourse);

router
  .route("/courses/:courseId/unenroll")
  .delete(enrollmentController.unenrollFromCourse);

// Progress tracking
router
  .route("/courses/:courseId/lessons/:lessonId/progress")
  .patch(enrollmentController.updateLessonProgress);

// Get enrollments
router.route("/my-enrollments").get(enrollmentController.getMyEnrollments);

// Get specific enrollment
router.route("/:enrollmentId").get(enrollmentController.getEnrollmentDetails);

// Check enrollment status
router
  .route("/courses/:courseId/status")
  .get(enrollmentController.checkEnrollmentStatus);

// Get course progress
router
  .route("/courses/:courseId/progress")
  .get(enrollmentController.getCourseProgress);

// Admin/Teacher routes for course enrollments
router
  .route("/courses/:courseId/enrollments")
  .get(
    authorizeRoles("admin", "teacher"),
    enrollmentController.getCourseEnrollments
  );

export default router;
