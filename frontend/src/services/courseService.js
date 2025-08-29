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
   * Get course modules
   * @param {string} courseId - Course ID
   * @returns {Promise} API response with course modules
   */
  async getCourseModules(courseId) {
    const response = await api.get(`/courses/${courseId}/modules`);
    return response.data;
  },

  /**
   * Get course lessons
   * @param {string} courseId - Course ID
   * @param {string} moduleId - Module ID
   * @returns {Promise} API response with module lessons
   */
  async getCourseLessons(courseId, moduleId) {
    const response = await api.get(
      `/courses/${courseId}/modules/${moduleId}/lessons`
    );
    return response.data;
  },

  /**
   * Get lesson content
   * @param {string} courseId - Course ID
   * @param {string} moduleId - Module ID
   * @param {string} lessonId - Lesson ID
   * @returns {Promise} API response with lesson content
   */
  async getLessonContent(courseId, moduleId, lessonId) {
    const response = await api.get(
      `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`
    );
    return response.data;
  },

  /**
   * Enroll in a course
   * @param {string} courseId - Course ID
   * @returns {Promise} API response with enrollment confirmation
   */
  async enrollInCourse(courseId) {
    const response = await api.post(`/courses/${courseId}/enroll`);
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
    const response = await api.get("/user/courses", { params });
    return response.data;
  },

  /**
   * Get user's course progress
   * @param {string} courseId - Course ID
   * @returns {Promise} API response with course progress
   */
  async getCourseProgress(courseId) {
    const response = await api.get(`/user/courses/${courseId}/progress`);
    return response.data;
  },

  /**
   * Update lesson progress
   * @param {string} courseId - Course ID
   * @param {string} moduleId - Module ID
   * @param {string} lessonId - Lesson ID
   * @param {Object} progressData - Progress data
   * @param {boolean} progressData.completed - Whether lesson is completed
   * @param {number} progressData.progress - Progress percentage
   * @param {number} progressData.timeSpent - Time spent in seconds
   * @returns {Promise} API response
   */
  async updateLessonProgress(courseId, moduleId, lessonId, progressData) {
    const response = await api.put(
      `/user/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/progress`,
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
   * Rate a course
   * @param {string} courseId - Course ID
   * @param {Object} ratingData - Rating data
   * @param {number} ratingData.rating - Rating value (1-5)
   * @param {string} ratingData.review - Review text (optional)
   * @returns {Promise} API response
   */
  async rateCourse(courseId, ratingData) {
    const response = await api.post(`/courses/${courseId}/rating`, ratingData);
    return response.data;
  },

  /**
   * Get course ratings and reviews
   * @param {string} courseId - Course ID
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} API response with ratings
   */
  async getCourseRatings(courseId, params = {}) {
    const response = await api.get(`/courses/${courseId}/ratings`, { params });
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
