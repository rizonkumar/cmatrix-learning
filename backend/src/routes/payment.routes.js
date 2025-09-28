import { Router } from "express";
import { paymentController } from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { sanitizeInput } from "../middlewares/validation.middleware.js";

const router = Router();

// Apply authentication to all payment routes (temporarily allow all authenticated users for development)
router.use(verifyJWT);
// router.use(authorizeRoles("admin")); // Temporarily disabled for development

// Apply input sanitization to all routes
router.use(sanitizeInput);

// User payment management routes
router.route("/users").get(paymentController.getAllUsersWithPayments);

router
  .route("/users/:userId/subscription")
  .get(paymentController.getUserSubscriptionDetails)
  .post(paymentController.createOrUpdateSubscription);

// Subscription management routes
router
  .route("/subscriptions/:subscriptionId")
  .get(paymentController.getSubscriptionById)
  .put(paymentController.updatePaymentStatus)
  .delete(paymentController.deleteSubscription);

// Payment status update routes
router
  .route("/subscriptions/:subscriptionId/mark-paid")
  .patch(paymentController.markAsPaid);

router
  .route("/subscriptions/:subscriptionId/pending-amount")
  .patch(paymentController.updatePendingAmount);

// Payment history routes
router
  .route("/subscriptions/:subscriptionId/payment-history")
  .get(paymentController.getPaymentHistory)
  .post(paymentController.addPaymentToHistory);

router
  .route("/subscriptions/:subscriptionId/payment-history/:paymentId")
  .put(paymentController.editPaymentHistory)
  .delete(paymentController.deletePaymentHistory);

// Statistics and reports
router.route("/stats").get(paymentController.getPaymentStats);

// Specialized subscription lists
router
  .route("/subscriptions/overdue")
  .get(paymentController.getOverdueSubscriptions);
router
  .route("/subscriptions/active")
  .get(paymentController.getActiveSubscriptions);

// Bulk operations
router.route("/bulk-update").patch(paymentController.bulkUpdatePaymentStatus);

export default router;
