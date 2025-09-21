import api from "./api";

/**
 * Wishlist Service
 * Handles all wishlist-related API calls
 */

export const wishlistService = {
  /**
   * Add course to wishlist
   * @param {string} courseId - Course ID
   * @returns {Promise} API response
   */
  async addToWishlist(courseId) {
    try {
      const response = await api.post(`/wishlist/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("[WISHLIST] Failed to add to wishlist:", error);
      // TODO:For now, return a mock response to test UI
      return {
        data: {
          isWishlisted: true,
          message: "Course added to wishlist successfully",
        },
      };
    }
  },

  /**
   * Remove course from wishlist
   * @param {string} courseId - Course ID
   * @returns {Promise} API response
   */
  async removeFromWishlist(courseId) {
    try {
      const response = await api.delete(`/wishlist/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("[WISHLIST] Failed to remove from wishlist:", error);
      return {
        data: {
          isWishlisted: false,
          message: "Course removed from wishlist successfully",
        },
      };
    }
  },

  /**
   * Toggle wishlist status (add/remove)
   * @param {string} courseId - Course ID
   * @returns {Promise} API response
   */
  async toggleWishlist(courseId) {
    try {
      const response = await api.post(`/wishlist/courses/${courseId}/toggle`);
      return response.data;
    } catch (error) {
      console.error("[WISHLIST] Failed to toggle wishlist:", error);
      // TODO: Mock toggle response
      return {
        data: {
          isWishlisted: Math.random() > 0.5,
          message: "Wishlist toggled successfully",
        },
      };
    }
  },

  /**
   * Check wishlist status for a course
   * @param {string} courseId - Course ID
   * @returns {Promise} API response
   */
  async checkWishlistStatus(courseId) {
    const response = await api.get(`/wishlist/courses/${courseId}/status`);
    return response.data;
  },

  /**
   * Get user's wishlist
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} API response
   */
  async getUserWishlist(params = {}) {
    const response = await api.get("/wishlist", { params });
    return response.data;
  },
};

export default wishlistService;
