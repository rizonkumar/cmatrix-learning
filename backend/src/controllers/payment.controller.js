import { paymentService } from "../services/payment.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class PaymentController {
  getAllUsersWithPayments = asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 20,
      search,
      paymentStatus,
      subscriptionType,
      subscriptionStatus,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filters = {
      search: search?.trim(),
      paymentStatus,
      subscriptionType,
      subscriptionStatus,
      sortBy,
      sortOrder,
    };

    const result = await paymentService.getAllUsersWithPayments(
      filters,
      parseInt(page),
      parseInt(limit)
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result,
          "Users with payment information retrieved successfully"
        )
      );
  });

  // Get specific user's subscription details
  getUserSubscriptionDetails = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const subscriptionDetails = await paymentService.getUserSubscriptionDetails(
      userId
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          subscriptionDetails,
          "User subscription details retrieved successfully"
        )
      );
  });

  // Create or update subscription for a user
  createOrUpdateSubscription = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const subscriptionData = req.body;

    // Validate required fields
    if (
      !subscriptionData.subscriptionType ||
      !subscriptionData.amount ||
      !subscriptionData.startDate
    ) {
      throw new ApiError(
        400,
        "Subscription type, amount, and start date are required"
      );
    }

    const subscription = await paymentService.createOrUpdateSubscription(
      userId,
      subscriptionData,
      req.user._id
    );

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { subscription },
          "Subscription created/updated successfully"
        )
      );
  });

  // Update payment status for a subscription
  updatePaymentStatus = asyncHandler(async (req, res) => {
    const { subscriptionId } = req.params;
    const { paymentStatus, amount, paymentMethod, transactionId, notes } =
      req.body;

    if (!paymentStatus) {
      throw new ApiError(400, "Payment status is required");
    }

    const subscription = await paymentService.updatePaymentStatus(
      subscriptionId,
      {
        paymentStatus,
        amount: amount || 0,
        paymentMethod,
        transactionId,
        notes,
      },
      req.user._id
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { subscription },
          "Payment status updated successfully"
        )
      );
  });

  // Mark subscription as paid
  markAsPaid = asyncHandler(async (req, res) => {
    const { subscriptionId } = req.params;
    const { paymentMethod, transactionId, notes } = req.body;

    const subscription = await paymentService.markAsPaid(
      subscriptionId,
      {
        paymentMethod,
        transactionId,
        notes,
      },
      req.user._id
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { subscription },
          "Subscription marked as paid successfully"
        )
      );
  });

  // Update pending amount for a subscription
  updatePendingAmount = asyncHandler(async (req, res) => {
    const { subscriptionId } = req.params;
    const { pendingAmount } = req.body;

    if (pendingAmount === undefined || pendingAmount < 0) {
      throw new ApiError(400, "Valid pending amount is required");
    }

    const subscription = await paymentService.updatePendingAmount(
      subscriptionId,
      pendingAmount,
      req.user._id
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { subscription },
          "Pending amount updated successfully"
        )
      );
  });

  // Get payment statistics
  getPaymentStats = asyncHandler(async (req, res) => {
    const { timeRange = "30d" } = req.query;

    const stats = await paymentService.getPaymentStats(timeRange);

    res
      .status(200)
      .json(
        new ApiResponse(200, stats, "Payment statistics retrieved successfully")
      );
  });

  // Get overdue subscriptions
  getOverdueSubscriptions = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;

    const result = await paymentService.getOverdueSubscriptions(
      parseInt(page),
      parseInt(limit)
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result,
          "Overdue subscriptions retrieved successfully"
        )
      );
  });

  // Get active subscriptions
  getActiveSubscriptions = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;

    const result = await paymentService.getActiveSubscriptions(
      parseInt(page),
      parseInt(limit)
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result,
          "Active subscriptions retrieved successfully"
        )
      );
  });

  // Bulk update payment statuses
  bulkUpdatePaymentStatus = asyncHandler(async (req, res) => {
    const { subscriptionIds, updates } = req.body;

    if (
      !subscriptionIds ||
      !Array.isArray(subscriptionIds) ||
      subscriptionIds.length === 0
    ) {
      throw new ApiError(400, "Subscription IDs array is required");
    }

    const result = await paymentService.bulkUpdatePaymentStatus(
      subscriptionIds,
      updates,
      req.user._id
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, result, "Payment statuses updated successfully")
      );
  });

  // Delete subscription
  deleteSubscription = asyncHandler(async (req, res) => {
    const { subscriptionId } = req.params;

    await paymentService.deleteSubscription(subscriptionId);

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Subscription deleted successfully"));
  });

  // Get subscription by ID
  getSubscriptionById = asyncHandler(async (req, res) => {
    const { subscriptionId } = req.params;

    const subscription = await paymentService.getSubscriptionById(
      subscriptionId
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { subscription },
          "Subscription retrieved successfully"
        )
      );
  });

  // Add payment to subscription history
  addPaymentToHistory = asyncHandler(async (req, res) => {
    const { subscriptionId } = req.params;
    const { amount, paymentMethod, transactionId, notes } = req.body;

    if (!amount || amount <= 0) {
      throw new ApiError(400, "Valid payment amount is required");
    }

    const subscription = await paymentService.addPaymentToHistory(
      subscriptionId,
      {
        amount,
        paymentMethod,
        transactionId,
        notes,
      },
      req.user._id
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { subscription },
          "Payment added to history successfully"
        )
      );
  });

  // Get payment history for a subscription
  getPaymentHistory = asyncHandler(async (req, res) => {
    const { subscriptionId } = req.params;

    const history = await paymentService.getPaymentHistory(subscriptionId);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { history },
          "Payment history retrieved successfully"
        )
      );
  });

  // Edit individual payment history entry
  editPaymentHistory = asyncHandler(async (req, res) => {
    const { subscriptionId, paymentId } = req.params;
    const { amount, paymentMethod, transactionId, notes, paymentDate } =
      req.body;

    if (!amount || amount <= 0) {
      throw new ApiError(400, "Valid payment amount is required");
    }

    const subscription = await paymentService.editPaymentHistory(
      subscriptionId,
      paymentId,
      {
        amount,
        paymentMethod,
        transactionId,
        notes,
        paymentDate,
      },
      req.user._id
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { subscription },
          "Payment history updated successfully"
        )
      );
  });

  // Delete individual payment history entry
  deletePaymentHistory = asyncHandler(async (req, res) => {
    const { subscriptionId, paymentId } = req.params;

    const subscription = await paymentService.deletePaymentHistory(
      subscriptionId,
      paymentId,
      req.user._id
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { subscription },
          "Payment history entry deleted successfully"
        )
      );
  });
}

export const paymentController = new PaymentController();
