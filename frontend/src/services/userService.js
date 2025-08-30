import api from "./api";

/**
 * User Service
 * Handles user-related API calls like streaks, profile, etc.
 */

export const userService = {
  /**
   * Get user profile
   * @returns {Promise} API response with user profile
   */
  async getProfile() {
    const response = await api.get("/users/profile");
    return response.data;
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile data
   * @returns {Promise} API response with updated profile
   */
  async updateProfile(profileData) {
    const response = await api.put("/users/profile", profileData);
    return response.data;
  },

  /**
   * Get user statistics
   * @returns {Promise} API response with user statistics
   */
  async getUserStats() {
    const response = await api.get("/users/stats");
    return response.data;
  },

  /**
   * Update learning streak
   * @param {Object} streakData - Streak data
   * @param {string} streakData.activityType - Activity type
   * @param {string} streakData.courseId - Course ID
   * @returns {Promise} API response
   */
  async updateStreak(streakData) {
    const response = await api.post("/users/streak", streakData);
    return response.data;
  },

  /**
   * Delete user account
   * @param {Object} deleteData - Account deletion data
   * @param {string} deleteData.reason - Reason for deletion
   * @param {string} deleteData.confirmPassword - Password confirmation
   * @returns {Promise} API response
   */
  async deleteAccount(deleteData) {
    const response = await api.delete("/users/delete-account", {
      data: deleteData,
    });
    return response.data;
  },

  /**
   * Upload user avatar
   * @param {FormData} formData - Form data with image file
   * @returns {Promise} API response with upload result
   */
  async uploadAvatar(formData) {
    const response = await api.post("/users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Get all users (Admin only)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.role - Filter by role
   * @param {string} params.search - Search term
   * @param {boolean} params.isActive - Filter by active status
   * @returns {Promise} API response with users list
   */
  async getAllUsers(params = {}) {
    const response = await api.get("/users/all", { params });
    return response.data;
  },

  /**
   * Update user role (Admin only)
   * @param {string} userId - User ID
   * @param {Object} roleData - Role update data
   * @param {string} roleData.role - New role
   * @param {string} roleData.reason - Reason for change
   * @returns {Promise} API response
   */
  async updateUserRole(userId, roleData) {
    const response = await api.put(`/users/${userId}/role`, roleData);
    return response.data;
  },

  /**
   * Deactivate user (Admin only)
   * @param {string} userId - User ID
   * @param {Object} deactivateData - Deactivation data
   * @param {string} deactivateData.reason - Reason for deactivation
   * @returns {Promise} API response
   */
  async deactivateUser(userId, deactivateData) {
    const response = await api.patch(
      `/users/${userId}/deactivate`,
      deactivateData
    );
    return response.data;
  },

  /**
   * Get user details (Admin only)
   * @param {string} userId - User ID
   * @returns {Promise} API response with detailed user info
   */
  async getUserDetails(userId) {
    const response = await api.get(`/users/${userId}/details`);
    return response.data;
  },
};

export default userService;
