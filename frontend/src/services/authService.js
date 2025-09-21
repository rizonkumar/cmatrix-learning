import api from "./api";

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

export const authService = {
  /**
   * Login user with email and password
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise} API response with user data and token
   */
  async login(credentials) {
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      console.error("AuthService.login error:", error);
      throw error;
    }
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User full name
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @returns {Promise} API response with user data and token
   */
  async register(userData) {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  /**
   * Get current user profile
   * @returns {Promise} API response with user data
   */
  async getProfile() {
    const response = await api.get("/users/profile");
    return response.data;
  },

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise} API response with updated user data
   */
  async updateProfile(userData) {
    const response = await api.put("/users/profile", userData);
    return response.data;
  },

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise} API response
   */
  async changePassword(passwordData) {
    const response = await api.put("/auth/change-password", passwordData);
    return response.data;
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise} API response
   */
  async requestPasswordReset(email) {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  /**
   * Reset password with token
   * @param {Object} resetData - Password reset data
   * @param {string} resetData.token - Reset token
   * @param {string} resetData.newPassword - New password
   * @returns {Promise} API response
   */
  async resetPassword(resetData) {
    const response = await api.post("/auth/reset-password", resetData);
    return response.data;
  },

  /**
   * Refresh authentication token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} API response with new tokens
   */
  async refreshToken(refreshToken) {
    const response = await api.post("/auth/refresh-token", { refreshToken });
    return response.data;
  },

  /**
   * Logout user (invalidate token on server)
   * @returns {Promise} API response
   */
  async logout() {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  /**
   * Verify email with token
   * @param {string} token - Email verification token
   * @returns {Promise} API response
   */
  async verifyEmail(token) {
    const response = await api.post("/auth/verify-email", { token });
    return response.data;
  },

  /**
   * Resend email verification
   * @returns {Promise} API response
   */
  async resendVerificationEmail() {
    const response = await api.post("/auth/resend-verification");
    return response.data;
  },
};

export default authService;
