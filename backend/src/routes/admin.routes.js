import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { sanitizeInput } from "../middlewares/validation.middleware.js";

const router = Router();

// Apply authentication to all admin routes (temporarily allow all authenticated users for development)
router.use(verifyJWT);
// router.use(authorizeRoles("admin")); // Temporarily disabled for development

// Apply input sanitization to all routes
router.use(sanitizeInput);

// Course management routes
router
  .route("/courses")
  .get(adminController.getAllCourses)
  .post(adminController.createCourse);

router
  .route("/courses/:courseId")
  .put(adminController.updateCourse)
  .delete(adminController.deleteCourse);

router
  .route("/courses/:courseId/publish")
  .patch(adminController.toggleCoursePublish);

// Bulk operations
router.route("/courses/bulk-update").patch(adminController.bulkUpdateCourses);

// Statistics and analytics
router.route("/stats/courses").get(adminController.getCourseStats);

// Teacher management
router.route("/teachers").get(adminController.getTeachers);

// Student tracking and analytics
router.route("/students/search").get(adminController.searchStudents);
router.route("/students/progress").get(adminController.getAllStudentsProgress);
router
  .route("/students/:studentId/progress")
  .get(adminController.getStudentProgress);
router
  .route("/students/:studentId/kanban")
  .get(adminController.getStudentKanbanBoards);
router.route("/analytics/students").get(adminController.getStudentAnalytics);

// Recent activities
router.route("/activities/recent").get(adminController.getRecentActivities);

// Comprehensive analytics
router.route("/analytics").get(adminController.getAnalytics);

// System Settings
router
  .route("/settings")
  .get(adminController.getSystemSettings)
  .put(adminController.updateSystemSettings);

router.route("/settings/test-email").post(adminController.testEmailSettings);

export default router;
