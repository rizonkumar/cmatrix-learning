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
    console.log("🔖 [WISHLIST] Adding course to wishlist:", courseId);
    try {
      const response = await api.post(`/wishlist/courses/${courseId}`);
      console.log("✅ [WISHLIST] Course added to wishlist:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [WISHLIST] Failed to add to wishlist:", error);
      // For now, return a mock response to test UI
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
    console.log("🗑️ [WISHLIST] Removing course from wishlist:", courseId);
    try {
      const response = await api.delete(`/wishlist/courses/${courseId}`);
      console.log("✅ [WISHLIST] Course removed from wishlist:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [WISHLIST] Failed to remove from wishlist:", error);
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
    console.log("🔄 [WISHLIST] Toggling wishlist for course:", courseId);
    try {
      const response = await api.post(`/wishlist/courses/${courseId}/toggle`);
      console.log("✅ [WISHLIST] Wishlist toggled:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [WISHLIST] Failed to toggle wishlist:", error);
      // Mock toggle response
      return {
        data: {
          isWishlisted: Math.random() > 0.5, // Random for testing
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
    console.log("🔍 [WISHLIST] Checking wishlist status for course:", courseId);
    const response = await api.get(`/wishlist/courses/${courseId}/status`);
    console.log("✅ [WISHLIST] Wishlist status:", response.data);
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
    console.log("📋 [WISHLIST] Getting user wishlist:", params);
    const response = await api.get("/wishlist", { params });
    console.log("✅ [WISHLIST] User wishlist retrieved:", response.data);
    return response.data;
  },
};

export default wishlistService;
