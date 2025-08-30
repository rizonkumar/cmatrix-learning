import api from "./api";

/**
 * Review Service
 * Handles all review and rating-related API calls
 */

export const reviewService = {
  /**
   * Create a review for a course
   * @param {string} courseId - Course ID
   * @param {Object} reviewData - Review data
   * @param {number} reviewData.rating - Rating (1-5)
   * @param {string} reviewData.title - Review title
   * @param {string} reviewData.comment - Review comment
   * @returns {Promise} API response with created review
   */
  async createReview(courseId, reviewData) {
    const response = await api.post(
      `/reviews/courses/${courseId}/reviews`,
      reviewData
    );
    return response.data;
  },

  /**
   * Get course reviews
   * @param {string} courseId - Course ID
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.sortBy - Sort by (newest, oldest, highest, lowest, helpful)
   * @returns {Promise} API response with reviews
   */
  async getCourseReviews(courseId, params = {}) {
    const response = await api.get(`/reviews/courses/${courseId}/reviews`, {
      params,
    });
    return response.data;
  },

  /**
   * Get course review statistics
   * @param {string} courseId - Course ID
   * @returns {Promise} API response with review stats
   */
  async getReviewStats(courseId) {
    const response = await api.get(`/reviews/courses/${courseId}/stats`);
    return response.data;
  },

  /**
   * Update a review
   * @param {string} reviewId - Review ID
   * @param {Object} reviewData - Updated review data
   * @returns {Promise} API response with updated review
   */
  async updateReview(reviewId, reviewData) {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  /**
   * Delete a review
   * @param {string} reviewId - Review ID
   * @returns {Promise} API response
   */
  async deleteReview(reviewId) {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  /**
   * Mark review as helpful
   * @param {string} reviewId - Review ID
   * @returns {Promise} API response
   */
  async markReviewHelpful(reviewId) {
    const response = await api.post(`/reviews/${reviewId}/helpful`);
    return response.data;
  },

  /**
   * Report a review
   * @param {string} reviewId - Review ID
   * @param {Object} reportData - Report data
   * @param {string} reportData.reason - Reason for reporting
   * @returns {Promise} API response
   */
  async reportReview(reviewId, reportData) {
    const response = await api.post(`/reviews/${reviewId}/report`, reportData);
    return response.data;
  },

  /**
   * Get user's reviews
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} API response with user's reviews
   */
  async getMyReviews(params = {}) {
    const response = await api.get("/reviews/my-reviews", { params });
    return response.data;
  },

  // Admin functions

  /**
   * Get all reviews (Admin only)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {boolean} params.isApproved - Filter by approval status
   * @returns {Promise} API response with all reviews
   */
  async getAllReviews(params = {}) {
    const response = await api.get("/reviews/admin/all", { params });
    return response.data;
  },

  /**
   * Approve review (Admin only)
   * @param {string} reviewId - Review ID
   * @returns {Promise} API response
   */
  async approveReview(reviewId) {
    const response = await api.patch(`/reviews/admin/${reviewId}/approve`);
    return response.data;
  },

  /**
   * Reject review (Admin only)
   * @param {string} reviewId - Review ID
   * @returns {Promise} API response
   */
  async rejectReview(reviewId) {
    const response = await api.patch(`/reviews/admin/${reviewId}/reject`);
    return response.data;
  },
};

export default reviewService;
