import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";

class PaymentService {
  // Get all users with their subscription/payment information
  async getAllUsersWithPayments(filters, page = 1, limit = 20) {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build search filter
    let searchFilter = {};
    if (filters.search) {
      searchFilter = {
        $or: [
          { username: { $regex: filters.search, $options: "i" } },
          { email: { $regex: filters.search, $options: "i" } },
          { fullName: { $regex: filters.search, $options: "i" } },
        ],
      };
    }

    // Build main filter
    const mainFilter = {
      ...searchFilter,
      role: { $in: ["student", "teacher"] },
    };

    // Add subscription-specific filters
    const subscriptionFilter = {};
    if (filters.paymentStatus) {
      subscriptionFilter.paymentStatus = filters.paymentStatus;
    }
    if (filters.subscriptionType) {
      subscriptionFilter.subscriptionType = filters.subscriptionType;
    }
    if (filters.subscriptionStatus) {
      // This will be handled in aggregation
    }

    // Get users with their subscription data
    const users = await User.aggregate([
      {
        $match: mainFilter,
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "user",
          as: "subscriptions",
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "subscriptions.course",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      {
        $addFields: {
          activeSubscription: {
            $filter: {
              input: "$subscriptions",
              cond: {
                $and: [
                  { $eq: ["$$this.paymentStatus", "paid"] },
                  { $gte: ["$$this.endDate", new Date()] },
                ],
              },
            },
          },
          overdueSubscriptions: {
            $filter: {
              input: "$subscriptions",
              cond: {
                $and: [
                  {
                    $in: [
                      "$$this.paymentStatus",
                      ["pending", "partial", "overdue"],
                    ],
                  },
                  { $lt: ["$$this.endDate", new Date()] },
                ],
              },
            },
          },
          totalPendingAmount: {
            $sum: {
              $map: {
                input: "$subscriptions",
                as: "sub",
                in: { $ifNull: ["$$sub.pendingAmount", 0] },
              },
            },
          },
        },
      },
      {
        $addFields: {
          subscriptionStatus: {
            $cond: {
              if: { $gt: [{ $size: "$activeSubscription" }, 0] },
              then: "active",
              else: {
                $cond: {
                  if: { $gt: [{ $size: "$overdueSubscriptions" }, 0] },
                  then: "overdue",
                  else: "inactive",
                },
              },
            },
          },
        },
      },
      // Apply subscription status filter
      ...(filters.subscriptionStatus && {
        $match: { subscriptionStatus: filters.subscriptionStatus },
      }),
      // Sort
      {
        $sort: {
          [filters.sortBy || "createdAt"]: filters.sortOrder === "asc" ? 1 : -1,
        },
      },
      // Pagination
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);

    // Get total count for pagination
    const totalUsers = await User.aggregate([
      { $match: mainFilter },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "user",
          as: "subscriptions",
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "subscriptions.course",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      {
        $addFields: {
          subscriptionStatus: {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$subscriptions",
                        cond: {
                          $and: [
                            { $eq: ["$$this.paymentStatus", "paid"] },
                            { $gte: ["$$this.endDate", new Date()] },
                          ],
                        },
                      },
                    },
                  },
                  0,
                ],
              },
              then: "active",
              else: {
                $cond: {
                  if: {
                    $gt: [
                      {
                        $size: {
                          $filter: {
                            input: "$subscriptions",
                            cond: {
                              $and: [
                                {
                                  $in: [
                                    "$$this.paymentStatus",
                                    ["pending", "partial", "overdue"],
                                  ],
                                },
                                { $lt: ["$$this.endDate", new Date()] },
                              ],
                            },
                          },
                        },
                      },
                      0,
                    ],
                  },
                  then: "overdue",
                  else: "inactive",
                },
              },
            },
          },
        },
      },
      ...(filters.subscriptionStatus && {
        $match: { subscriptionStatus: filters.subscriptionStatus },
      }),
      { $count: "total" },
    ]);

    const totalCount = totalUsers.length > 0 ? totalUsers[0].total : 0;
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    return {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers: totalCount,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
      },
    };
  }

  // Get specific user's subscription details
  async getUserSubscriptionDetails(userId) {
    const user = await User.findById(userId).populate("subscriptions");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Get subscription statistics
    const subscriptions = await Subscription.find({ user: userId }).sort({
      createdAt: -1,
    });

    const activeSubscription = subscriptions.find(
      (sub) => sub.paymentStatus === "paid" && new Date() <= sub.endDate
    );

    const overdueSubscriptions = subscriptions.filter(
      (sub) =>
        ["pending", "partial", "overdue"].includes(sub.paymentStatus) &&
        new Date() > sub.endDate
    );

    const totalPendingAmount = subscriptions.reduce(
      (total, sub) => total + (sub.pendingAmount || 0),
      0
    );

    const totalPaidAmount = subscriptions.reduce(
      (total, sub) => total + sub.getTotalPaidAmount(),
      0
    );

    return {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        phoneNumber: user.phoneNumber,
        address: user.address,
      },
      subscriptions,
      summary: {
        totalSubscriptions: subscriptions.length,
        activeSubscription: activeSubscription || null,
        overdueSubscriptionsCount: overdueSubscriptions.length,
        totalPendingAmount,
        totalPaidAmount,
        subscriptionStatus: activeSubscription ? "active" : "inactive",
      },
    };
  }

  // Create or update subscription for a user
  async createOrUpdateSubscription(userId, subscriptionData, adminId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const {
      subscriptionType,
      amount,
      startDate,
      endDate,
      paymentStatus = "pending",
      paymentMethod = "cash",
      notes,
      transactionId,
    } = subscriptionData;

    // Calculate end date based on subscription type if not provided
    let calculatedEndDate = endDate;
    if (!calculatedEndDate && startDate) {
      const start = new Date(startDate);
      switch (subscriptionType) {
        case "monthly":
          calculatedEndDate = new Date(start.setMonth(start.getMonth() + 1));
          break;
        case "6-months":
          calculatedEndDate = new Date(start.setMonth(start.getMonth() + 6));
          break;
        case "yearly":
          calculatedEndDate = new Date(
            start.setFullYear(start.getFullYear() + 1)
          );
          break;
      }
    }

    // Check if there's an existing active subscription of the same type
    const existingSubscription = await Subscription.findOne({
      user: userId,
      subscriptionType,
      $or: [
        { endDate: { $gte: new Date() } },
        { paymentStatus: { $in: ["pending", "partial"] } },
      ],
    });

    let subscription;
    if (existingSubscription) {
      // Update existing subscription
      existingSubscription.amount = amount;
      existingSubscription.startDate = startDate;
      existingSubscription.endDate = calculatedEndDate;
      existingSubscription.paymentStatus = paymentStatus;
      existingSubscription.paymentMethod = paymentMethod;
      existingSubscription.notes = notes;
      existingSubscription.transactionId = transactionId;
      existingSubscription.updatedBy = adminId;
      existingSubscription.updatedAt = new Date();

      subscription = await existingSubscription.save();
    } else {
      // Create new subscription
      subscription = await Subscription.create({
        user: userId,
        subscriptionType,
        amount,
        startDate,
        endDate: calculatedEndDate,
        paymentStatus,
        paymentMethod,
        notes,
        transactionId,
        createdBy: adminId,
      });
    }

    // Update user's subscription status
    await this.updateUserSubscriptionStatus(userId);

    return subscription.populate("user", "username email fullName");
  }

  // Update payment status for a subscription
  async updatePaymentStatus(subscriptionId, updateData, adminId) {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      throw new ApiError(404, "Subscription not found");
    }

    const { paymentStatus, amount, paymentMethod, transactionId, notes } =
      updateData;

    subscription.paymentStatus = paymentStatus;
    subscription.updatedBy = adminId;
    subscription.updatedAt = new Date();

    // If payment is being made, add to payment history
    if (amount && amount > 0) {
      subscription.paymentHistory.push({
        amount,
        paymentMethod,
        transactionId,
        updatedBy: adminId,
        notes,
      });

      // Update pending amount
      subscription.pendingAmount = Math.max(
        0,
        subscription.amount - subscription.getTotalPaidAmount()
      );

      // If fully paid, update payment status
      if (subscription.pendingAmount === 0) {
        subscription.paymentStatus = "paid";
        subscription.lastPaymentDate = new Date();
      }
    }

    await subscription.save();

    // Update user's subscription status
    await this.updateUserSubscriptionStatus(subscription.user);

    return subscription.populate("user", "username email fullName");
  }

  // Mark subscription as paid
  async markAsPaid(subscriptionId, paymentData, adminId) {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      throw new ApiError(404, "Subscription not found");
    }

    const { paymentMethod, transactionId, notes } = paymentData;

    // Calculate remaining amount
    const remainingAmount = subscription.getRemainingAmount();

    // Add payment to history
    subscription.paymentHistory.push({
      amount: remainingAmount,
      paymentMethod,
      transactionId,
      updatedBy: adminId,
      notes,
    });

    // Update subscription status
    subscription.paymentStatus = "paid";
    subscription.pendingAmount = 0;
    subscription.lastPaymentDate = new Date();
    subscription.updatedBy = adminId;
    subscription.updatedAt = new Date();

    await subscription.save();

    // Update user's subscription status
    await this.updateUserSubscriptionStatus(subscription.user);

    return subscription.populate("user", "username email fullName");
  }

  // Update pending amount for a subscription
  async updatePendingAmount(subscriptionId, pendingAmount, adminId) {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      throw new ApiError(404, "Subscription not found");
    }

    subscription.pendingAmount = pendingAmount;
    subscription.updatedBy = adminId;
    subscription.updatedAt = new Date();

    // Update payment status based on pending amount
    if (pendingAmount === 0) {
      subscription.paymentStatus = "paid";
      subscription.lastPaymentDate = new Date();
    } else if (pendingAmount < subscription.amount) {
      subscription.paymentStatus = "partial";
    } else {
      subscription.paymentStatus = "pending";
    }

    await subscription.save();

    // Update user's subscription status
    await this.updateUserSubscriptionStatus(subscription.user);

    return subscription.populate("user", "username email fullName");
  }

  // Get payment statistics
  async getPaymentStats(timeRange = "30d") {
    const days = timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await Subscription.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalSubscriptions: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          totalPaidAmount: {
            $sum: {
              $sum: {
                $map: {
                  input: "$paymentHistory",
                  as: "payment",
                  in: "$$payment.amount",
                },
              },
            },
          },
          totalPendingAmount: { $sum: "$pendingAmount" },
          subscriptionsByType: {
            $push: "$subscriptionType",
          },
          subscriptionsByStatus: {
            $push: "$paymentStatus",
          },
        },
      },
      {
        $addFields: {
          subscriptionTypeBreakdown: {
            monthly: {
              $size: {
                $filter: {
                  input: "$subscriptionsByType",
                  cond: { $eq: ["$$this", "monthly"] },
                },
              },
            },
            "6-months": {
              $size: {
                $filter: {
                  input: "$subscriptionsByType",
                  cond: { $eq: ["$$this", "6-months"] },
                },
              },
            },
            yearly: {
              $size: {
                $filter: {
                  input: "$subscriptionsByType",
                  cond: { $eq: ["$$this", "yearly"] },
                },
              },
            },
          },
          subscriptionStatusBreakdown: {
            paid: {
              $size: {
                $filter: {
                  input: "$subscriptionsByStatus",
                  cond: { $eq: ["$$this", "paid"] },
                },
              },
            },
            pending: {
              $size: {
                $filter: {
                  input: "$subscriptionsByStatus",
                  cond: { $eq: ["$$this", "pending"] },
                },
              },
            },
            partial: {
              $size: {
                $filter: {
                  input: "$subscriptionsByStatus",
                  cond: { $eq: ["$$this", "partial"] },
                },
              },
            },
            overdue: {
              $size: {
                $filter: {
                  input: "$subscriptionsByStatus",
                  cond: { $eq: ["$$this", "overdue"] },
                },
              },
            },
          },
        },
      },
    ]);

    const result = stats[0] || {
      totalSubscriptions: 0,
      totalAmount: 0,
      totalPaidAmount: 0,
      totalPendingAmount: 0,
      subscriptionTypeBreakdown: { monthly: 0, "6-months": 0, yearly: 0 },
      subscriptionStatusBreakdown: {
        paid: 0,
        pending: 0,
        partial: 0,
        overdue: 0,
      },
    };

    return {
      period: `${days} days`,
      ...result,
    };
  }

  // Get overdue subscriptions
  async getOverdueSubscriptions(page = 1, limit = 20) {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const subscriptions = await Subscription.find({
      paymentStatus: { $in: ["pending", "partial", "overdue"] },
      endDate: { $lt: new Date() },
    })
      .populate("user", "username email fullName phoneNumber")
      .sort({ endDate: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Subscription.countDocuments({
      paymentStatus: { $in: ["pending", "partial", "overdue"] },
      endDate: { $lt: new Date() },
    });

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    return {
      subscriptions,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalSubscriptions: totalCount,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
      },
    };
  }

  // Get active subscriptions
  async getActiveSubscriptions(page = 1, limit = 20) {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const subscriptions = await Subscription.find({
      paymentStatus: "paid",
      endDate: { $gte: new Date() },
    })
      .populate("user", "username email fullName phoneNumber")
      .sort({ endDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Subscription.countDocuments({
      paymentStatus: "paid",
      endDate: { $gte: new Date() },
    });

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    return {
      subscriptions,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalSubscriptions: totalCount,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
      },
    };
  }

  // Bulk update payment statuses
  async bulkUpdatePaymentStatus(subscriptionIds, updates, adminId) {
    const { paymentStatus, amount, paymentMethod, notes } = updates;

    const result = {
      updated: 0,
      failed: 0,
      errors: [],
    };

    for (const subscriptionId of subscriptionIds) {
      try {
        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
          result.failed++;
          result.errors.push(`Subscription ${subscriptionId} not found`);
          continue;
        }

        subscription.paymentStatus = paymentStatus;
        subscription.updatedBy = adminId;
        subscription.updatedAt = new Date();

        if (amount && amount > 0) {
          subscription.paymentHistory.push({
            amount,
            paymentMethod,
            updatedBy: adminId,
            notes,
          });

          subscription.pendingAmount = Math.max(
            0,
            subscription.amount - subscription.getTotalPaidAmount()
          );

          if (subscription.pendingAmount === 0) {
            subscription.paymentStatus = "paid";
            subscription.lastPaymentDate = new Date();
          }
        }

        await subscription.save();

        // Update user's subscription status
        await this.updateUserSubscriptionStatus(subscription.user);

        result.updated++;
      } catch (error) {
        result.failed++;
        result.errors.push(`Subscription ${subscriptionId}: ${error.message}`);
      }
    }

    return result;
  }

  // Delete subscription
  async deleteSubscription(subscriptionId) {
    const subscription = await Subscription.findByIdAndDelete(subscriptionId);
    if (!subscription) {
      throw new ApiError(404, "Subscription not found");
    }

    // Update user's subscription status
    await this.updateUserSubscriptionStatus(subscription.user);

    return subscription;
  }

  // Get subscription by ID
  async getSubscriptionById(subscriptionId) {
    const subscription = await Subscription.findById(subscriptionId).populate(
      "user",
      "username email fullName phoneNumber"
    );

    if (!subscription) {
      throw new ApiError(404, "Subscription not found");
    }

    return subscription;
  }

  // Add payment to subscription history
  async addPaymentToHistory(subscriptionId, paymentData, adminId) {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      throw new ApiError(404, "Subscription not found");
    }

    const { amount, paymentMethod, transactionId, notes } = paymentData;

    subscription.paymentHistory.push({
      amount,
      paymentMethod,
      transactionId,
      updatedBy: adminId,
      notes,
    });

    // Update pending amount and payment status
    subscription.pendingAmount = Math.max(
      0,
      subscription.amount - subscription.getTotalPaidAmount()
    );

    if (subscription.pendingAmount === 0) {
      subscription.paymentStatus = "paid";
      subscription.lastPaymentDate = new Date();
    } else if (subscription.getTotalPaidAmount() > 0) {
      subscription.paymentStatus = "partial";
    }

    subscription.updatedBy = adminId;
    subscription.updatedAt = new Date();

    await subscription.save();

    // Update user's subscription status
    await this.updateUserSubscriptionStatus(subscription.user);

    return subscription.populate("user", "username email fullName");
  }

  // Get payment history for a subscription
  async getPaymentHistory(subscriptionId) {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      throw new ApiError(404, "Subscription not found");
    }

    return {
      subscription: {
        _id: subscription._id,
        subscriptionType: subscription.subscriptionType,
        amount: subscription.amount,
        pendingAmount: subscription.pendingAmount,
        paymentStatus: subscription.paymentStatus,
      },
      paymentHistory: subscription.paymentHistory,
      totalPaid: subscription.getTotalPaidAmount(),
    };
  }

  // Helper method to update user's subscription status
  async updateUserSubscriptionStatus(userId) {
    const subscriptions = await Subscription.find({ user: userId });

    const hasActiveSubscription = subscriptions.some(
      (sub) => sub.paymentStatus === "paid" && new Date() <= sub.endDate
    );

    const hasOverduePayments = subscriptions.some(
      (sub) =>
        ["pending", "partial", "overdue"].includes(sub.paymentStatus) &&
        new Date() > sub.endDate
    );

    let subscriptionStatus = "inactive";
    if (hasActiveSubscription) {
      subscriptionStatus = "active";
    } else if (hasOverduePayments) {
      subscriptionStatus = "suspended";
    }

    await User.findByIdAndUpdate(userId, {
      subscriptionStatus,
      updatedAt: new Date(),
    });
  }

  // Edit individual payment history entry
  async editPaymentHistory(subscriptionId, paymentId, updateData, updatedBy) {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      throw new ApiError(404, "Subscription not found");
    }

    // Find the payment in the payment history
    const paymentIndex = subscription.paymentHistory.findIndex(
      (payment) => payment._id.toString() === paymentId
    );

    if (paymentIndex === -1) {
      throw new ApiError(404, "Payment history entry not found");
    }

    // Update the payment
    const oldPayment = subscription.paymentHistory[paymentIndex];
    subscription.paymentHistory[paymentIndex] = {
      ...oldPayment.toObject(),
      ...updateData,
      paymentDate: updateData.paymentDate || oldPayment.paymentDate,
      updatedBy,
      updatedAt: new Date(),
    };

    // Recalculate totals
    subscription.pendingAmount = Math.max(
      subscription.amount - subscription.getTotalPaidAmount(),
      0
    );

    // Update payment status based on new totals
    if (subscription.pendingAmount === 0) {
      subscription.paymentStatus = "paid";
    } else if (subscription.getTotalPaidAmount() > 0) {
      subscription.paymentStatus = "partial";
    }

    await subscription.save();

    // Update user's subscription status
    await this.updateUserSubscriptionStatus(subscription.user);

    return subscription;
  }

  // Delete individual payment history entry
  async deletePaymentHistory(subscriptionId, paymentId, deletedBy) {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      throw new ApiError(404, "Subscription not found");
    }

    // Find the payment in the payment history
    const paymentIndex = subscription.paymentHistory.findIndex(
      (payment) => payment._id.toString() === paymentId
    );

    if (paymentIndex === -1) {
      throw new ApiError(404, "Payment history entry not found");
    }

    // Remove the payment
    const deletedPayment = subscription.paymentHistory.splice(paymentIndex, 1)[0];

    // Recalculate totals
    subscription.pendingAmount = Math.max(
      subscription.amount - subscription.getTotalPaidAmount(),
      0
    );

    // Update payment status based on new totals
    if (subscription.pendingAmount === 0) {
      subscription.paymentStatus = "paid";
    } else if (subscription.getTotalPaidAmount() > 0) {
      subscription.paymentStatus = "partial";
    } else {
      subscription.paymentStatus = "pending";
    }

    // Add deletion record to notes
    subscription.notes = `Payment of ₹${deletedPayment.amount} deleted by admin on ${new Date().toLocaleDateString()}. Original payment date: ${deletedPayment.paymentDate.toLocaleDateString()}`;

    await subscription.save();

    // Update user's subscription status
    await this.updateUserSubscriptionStatus(subscription.user);

    return subscription;
  }
}

export const paymentService = new PaymentService();
