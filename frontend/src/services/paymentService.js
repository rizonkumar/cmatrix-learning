import api from "./api.js";

class PaymentService {
  // Get all users with their payment information
  async getAllUsersWithPayments(filters = {}, page = 1, limit = 20) {
    const params = {
      page,
      limit,
      ...filters,
    };

    return api.get("/admin/users", { params });
  }

  // Get specific user's subscription details
  async getUserSubscriptionDetails(userId) {
    console.log(
      "PaymentService: Getting subscription details for user:",
      userId
    );
    const response = await api.get(`/admin/users/${userId}/subscription`);
    return response;
  }

  // Create or update subscription for a user
  async createOrUpdateSubscription(userId, subscriptionData) {
    return api.post(`/admin/users/${userId}/subscription`, subscriptionData);
  }

  // Update payment status for a subscription
  async updatePaymentStatus(subscriptionId, updateData) {
    return api.put(`/admin/subscriptions/${subscriptionId}`, updateData);
  }

  // Mark subscription as paid
  async markAsPaid(subscriptionId, paymentData) {
    return api.patch(
      `/admin/subscriptions/${subscriptionId}/mark-paid`,
      paymentData
    );
  }

  // Update pending amount for a subscription
  async updatePendingAmount(subscriptionId, pendingAmount) {
    return api.patch(`/admin/subscriptions/${subscriptionId}/pending-amount`, {
      pendingAmount,
    });
  }

  // Get payment statistics
  async getPaymentStats(timeRange = "30d") {
    return api.get("/admin/stats", {
      params: { timeRange },
    });
  }

  // Get overdue subscriptions
  async getOverdueSubscriptions(page = 1, limit = 20) {
    return api.get("/admin/subscriptions/overdue", {
      params: { page, limit },
    });
  }

  // Get active subscriptions
  async getActiveSubscriptions(page = 1, limit = 20) {
    return api.get("/admin/subscriptions/active", {
      params: { page, limit },
    });
  }

  // Bulk update payment statuses
  async bulkUpdatePaymentStatus(subscriptionIds, updates) {
    return api.patch("/admin/bulk-update", {
      subscriptionIds,
      updates,
    });
  }

  // Delete subscription
  async deleteSubscription(subscriptionId) {
    return api.delete(`/admin/subscriptions/${subscriptionId}`);
  }

  // Get subscription by ID
  async getSubscriptionById(subscriptionId) {
    return api.get(`/admin/subscriptions/${subscriptionId}`);
  }

  // Add payment to subscription history
  async addPaymentToHistory(subscriptionId, paymentData) {
    return api.post(
      `/admin/subscriptions/${subscriptionId}/payment-history`,
      paymentData
    );
  }

  // Get payment history for a subscription
  async getPaymentHistory(subscriptionId) {
    return api.get(`/admin/subscriptions/${subscriptionId}/payment-history`);
  }
}

export default new PaymentService();
