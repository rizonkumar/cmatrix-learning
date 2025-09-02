import api from "./api";

/**
 * Enrollment Service
 * Handles all enrollment and progress-related API calls
 */

export const enrollmentService = {
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
   * Unenroll from a course
   * @param {string} courseId - Course ID
   * @returns {Promise} API response
   */
  async unenrollFromCourse(courseId) {
    const response = await api.delete(
      `/enrollments/courses/${courseId}/unenroll`
    );
    return response.data;
  },

  /**
   * Get user's enrolled courses
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} API response with enrolled courses
   */
  async getMyEnrollments(params = {}) {
    const response = await api.get("/enrollments/my-enrollments", { params });
    return response.data.data;
  },

  /**
   * Get enrollment details
   * @param {string} enrollmentId - Enrollment ID
   * @returns {Promise} API response with enrollment details
   */
  async getEnrollmentDetails(enrollmentId) {
    const response = await api.get(`/enrollments/${enrollmentId}`);
    return response.data;
  },

  /**
   * Check enrollment status for a course
   * @param {string} courseId - Course ID
   * @returns {Promise} API response with enrollment status
   */
  async checkEnrollmentStatus(courseId) {
    const response = await api.get(`/enrollments/courses/${courseId}/status`);
    return response.data;
  },

  /**
   * Get course progress
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
   * Get course enrollments (Teacher/Admin only)
   * @param {string} courseId - Course ID
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} API response with course enrollments
   */
  async getCourseEnrollments(courseId, params = {}) {
    const response = await api.get(
      `/enrollments/courses/${courseId}/enrollments`,
      { params }
    );
    return response.data;
  },
};

export default enrollmentService;
