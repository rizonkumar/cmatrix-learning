import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { sanitizeInput } from "../middlewares/validation.middleware.js";

const router = Router();

// Apply authentication and admin authorization to all admin routes
router.use(verifyJWT);
router.use(authorizeRoles("admin"));

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
router.route("/students/:studentId/progress").get(adminController.getStudentProgress);
router.route("/students/:studentId/kanban").get(adminController.getStudentKanbanBoards);
router.route("/analytics/students").get(adminController.getStudentAnalytics);

export default router;
