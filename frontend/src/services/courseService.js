import api from "./api";

/**
 * Course Service
 * Handles all course-related API calls
 */

export const courseService = {
  /**
   * Get all courses with optional filters
   * @param {Object} params - Query parameters
   * @param {string} params.category - Course category filter
   * @param {string} params.level - Course level filter
   * @param {string} params.search - Search term
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} API response with courses list
   */
  async getCourses(params = {}) {
    const response = await api.get("/courses", { params });
    return response.data;
  },

  /**
   * Get course by ID
   * @param {string} courseId - Course ID
   * @returns {Promise} API response with course details
   */
  async getCourseById(courseId) {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },

  /**
   * Get course by ID (detailed view)
   * @param {string} courseId - Course ID
   * @returns {Promise} API response with detailed course data
   */
  async getCourseDetail(courseId) {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },

  /**
   * Enroll in a course
   * @param {string} courseId - Course ID
   * @returns {Promise} API response with enrollment confirmation
   */
  async enrollInCourse(courseId) {
    const response = await api.post(`/enrollments/courses/${courseId}/enroll`);
    return response.data;
  },

  /**
   * Get user's enrolled courses
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} API response with enrolled courses
   */
  async getEnrolledCourses(params = {}) {
    const response = await api.get("/enrollments/my-enrollments", { params });
    return response.data;
  },

  /**
   * Get user's course progress
   * @param {string} courseId - Course ID
   * @returns {Promise} API response with course progress
   */
  async getCourseProgress(courseId) {
    const response = await api.get(`/enrollments/courses/${courseId}/progress`);
    return response.data;
  },

  /**
   * Update lesson progress
   * @param {string} courseId - Course ID
   * @param {string} lessonId - Lesson ID
   * @param {Object} progressData - Progress data
   * @param {boolean} progressData.completed - Whether lesson is completed
   * @returns {Promise} API response
   */
  async updateLessonProgress(courseId, lessonId, progressData) {
    const response = await api.patch(
      `/enrollments/courses/${courseId}/lessons/${lessonId}/progress`,
      progressData
    );
    return response.data;
  },

  /**
   * Get course categories
   * @returns {Promise} API response with categories list
   */
  async getCategories() {
    const response = await api.get("/courses/categories");
    return response.data;
  },

  /**
   * Get course levels
   * @returns {Promise} API response with levels list
   */
  async getLevels() {
    const response = await api.get("/courses/levels");
    return response.data;
  },

  /**
   * Get course reviews
   * @param {string} courseId - Course ID
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
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
  async getCourseReviewStats(courseId) {
    const response = await api.get(`/reviews/courses/${courseId}/stats`);
    return response.data;
  },

  /**
   * Search courses
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise} API response with search results
   */
  async searchCourses(query, filters = {}) {
    const response = await api.get("/courses/search", {
      params: { q: query, ...filters },
    });
    return response.data;
  },
};

export default courseService;
