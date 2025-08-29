import api from "./api";

/**
 * User Service
 * Handles user-related API calls like streaks, profile, etc.
 */

export const userService = {
  /**
   * Get user dashboard data
   * @returns {Promise} API response with dashboard data
   */
  async getDashboardData() {
    const response = await api.get("/user/dashboard");
    return response.data;
  },

  /**
   * Get user learning streaks
   * @returns {Promise} API response with streak data
   */
  async getLearningStreaks() {
    const response = await api.get("/user/streaks");
    return response.data;
  },

  /**
   * Update learning streak
   * @param {Object} streakData - Streak data
   * @param {Date} streakData.lastActivityDate - Last activity date
   * @param {number} streakData.currentStreak - Current streak count
   * @returns {Promise} API response
   */
  async updateStreak(streakData) {
    const response = await api.put("/user/streaks", streakData);
    return response.data;
  },

  /**
   * Get user learning statistics
   * @param {Object} params - Query parameters
   * @param {string} params.period - Time period (week, month, year)
   * @returns {Promise} API response with statistics
   */
  async getLearningStats(params = {}) {
    const response = await api.get("/user/stats", { params });
    return response.data;
  },

  /**
   * Get user achievements/badges
   * @returns {Promise} API response with achievements
   */
  async getAchievements() {
    const response = await api.get("/user/achievements");
    return response.data;
  },

  /**
   * Get user certificates
   * @returns {Promise} API response with certificates
   */
  async getCertificates() {
    const response = await api.get("/user/certificates");
    return response.data;
  },

  /**
   * Download certificate
   * @param {string} certificateId - Certificate ID
   * @returns {Promise} API response with certificate file
   */
  async downloadCertificate(certificateId) {
    const response = await api.get(
      `/user/certificates/${certificateId}/download`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  },

  /**
   * Get user preferences
   * @returns {Promise} API response with user preferences
   */
  async getPreferences() {
    const response = await api.get("/user/preferences");
    return response.data;
  },

  /**
   * Update user preferences
   * @param {Object} preferences - User preferences
   * @returns {Promise} API response with updated preferences
   */
  async updatePreferences(preferences) {
    const response = await api.put("/user/preferences", preferences);
    return response.data;
  },

  /**
   * Get user notifications
   * @param {Object} params - Query parameters
   * @param {boolean} params.unreadOnly - Get only unread notifications
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} API response with notifications
   */
  async getNotifications(params = {}) {
    const response = await api.get("/user/notifications", { params });
    return response.data;
  },

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise} API response
   */
  async markNotificationRead(notificationId) {
    const response = await api.patch(
      `/user/notifications/${notificationId}/read`
    );
    return response.data;
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} API response
   */
  async markAllNotificationsRead() {
    const response = await api.patch("/user/notifications/read-all");
    return response.data;
  },

  /**
   * Delete notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise} API response
   */
  async deleteNotification(notificationId) {
    const response = await api.delete(`/user/notifications/${notificationId}`);
    return response.data;
  },

  /**
   * Get user activity log
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.type - Activity type filter
   * @returns {Promise} API response with activity log
   */
  async getActivityLog(params = {}) {
    const response = await api.get("/user/activity", { params });
    return response.data;
  },

  /**
   * Get user study time analytics
   * @param {Object} params - Query parameters
   * @param {string} params.period - Time period (week, month, year)
   * @param {string} params.groupBy - Group by (day, week, month)
   * @returns {Promise} API response with study time data
   */
  async getStudyTimeAnalytics(params = {}) {
    const response = await api.get("/user/analytics/study-time", { params });
    return response.data;
  },

  /**
   * Get user course completion analytics
   * @param {Object} params - Query parameters
   * @param {string} params.period - Time period (week, month, year)
   * @returns {Promise} API response with completion data
   */
  async getCompletionAnalytics(params = {}) {
    const response = await api.get("/user/analytics/completion", { params });
    return response.data;
  },

  /**
   * Update user avatar
   * @param {FormData} formData - Form data with image file
   * @returns {Promise} API response with updated user data
   */
  async updateAvatar(formData) {
    const response = await api.put("/user/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Delete user account
   * @param {Object} deleteData - Account deletion data
   * @param {string} deleteData.password - User password for confirmation
   * @param {string} deleteData.reason - Reason for deletion (optional)
   * @returns {Promise} API response
   */
  async deleteAccount(deleteData) {
    const response = await api.delete("/user/account", { data: deleteData });
    return response.data;
  },

  /**
   * Export user data
   * @param {string} format - Export format (json, csv)
   * @returns {Promise} API response with user data export
   */
  async exportUserData(format = "json") {
    const response = await api.get("/user/export", {
      params: { format },
      responseType: "blob",
    });
    return response.data;
  },
};

export default userService;
