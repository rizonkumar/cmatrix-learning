import { Router } from "express";
import { reviewController } from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { sanitizeInput } from "../middlewares/validation.middleware.js";

const router = Router();

// Apply input sanitization to all routes
router.use(sanitizeInput);

// Public routes
router
  .route("/courses/:courseId/reviews")
  .get(reviewController.getCourseReviews);

router.route("/courses/:courseId/stats").get(reviewController.getReviewStats);

// Protected routes (require authentication)
router.use(verifyJWT);

router.route("/courses/:courseId/reviews").post(reviewController.createReview);

router
  .route("/:reviewId")
  .get(reviewController.getReviewById)
  .put(reviewController.updateReview)
  .delete(reviewController.deleteReview);

// User-specific routes
router.route("/my-reviews").get(reviewController.getMyReviews);

// Interactive routes
router.route("/:reviewId/helpful").post(reviewController.markHelpful);

router.route("/:reviewId/report").post(reviewController.reportReview);

// Admin routes
router
  .route("/admin/all")
  .get(authorizeRoles("admin"), reviewController.getAllReviews);

router
  .route("/admin/:reviewId/approve")
  .patch(authorizeRoles("admin"), reviewController.approveReview);

router
  .route("/admin/:reviewId/reject")
  .patch(authorizeRoles("admin"), reviewController.rejectReview);

export default router;
