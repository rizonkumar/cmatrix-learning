import api from "./api.js";

class AdminService {
  // Search students by username, email, or full name
  async searchStudents(searchTerm, page = 1, limit = 20) {
    return api.get("/admin/students/search", {
      params: { search: searchTerm, page, limit },
    });
  }

  // Get all students with progress overview
  async getAllStudentsProgress(page = 1, limit = 20) {
    return api.get("/admin/students/progress", {
      params: { page, limit },
    });
  }

  // Get detailed student progress
  async getStudentProgressDetails(studentId) {
    return api.get(`/admin/students/${studentId}/progress`);
  }

  // Get student's kanban boards
  async getStudentKanbanBoards(studentId) {
    return api.get(`/admin/students/${studentId}/kanban`);
  }

  // Get student analytics for admin dashboard
  async getStudentAnalytics() {
    return api.get("/admin/analytics/students");
  }

  // Get recent activities for admin dashboard
  async getRecentActivities(limit = 10) {
    return api.get("/admin/activities/recent", {
      params: { limit },
    });
  }

  // Get comprehensive analytics data
  async getAnalytics(params = {}) {
    return api.get("/admin/analytics", { params });
  }

  // Course Management Methods (existing functionality)
  async getAllCourses(filters = {}) {
    return api.get("/admin/courses", { params: filters });
  }

  async createCourse(courseData) {
    return api.post("/admin/courses", courseData);
  }

  async updateCourse(courseId, courseData) {
    return api.put(`/admin/courses/${courseId}`, courseData);
  }

  async deleteCourse(courseId) {
    return api.delete(`/admin/courses/${courseId}`);
  }

  async toggleCoursePublish(courseId, isPublished) {
    return api.patch(`/admin/courses/${courseId}/publish`, { isPublished });
  }

  async getCourseStats() {
    return api.get("/admin/stats/courses");
  }

  async getTeachers() {
    return api.get("/admin/teachers");
  }

  async bulkUpdateCourses(courseIds, updates) {
    return api.patch("/admin/courses/bulk-update", { courseIds, updates });
  }

  // System Settings Methods
  async getSystemSettings() {
    return api.get("/admin/settings");
  }

  async updateSystemSettings(settings) {
    return api.put("/admin/settings", { settings });
  }

  async testEmailSettings(emailSettings) {
    return api.post("/admin/settings/test-email", { emailSettings });
  }

  // Syllabus Management Methods
  async getAllSyllabi(params = {}) {
    return api.get("/admin/syllabi", { params });
  }

  async getSyllabusById(syllabusId) {
    return api.get(`/admin/syllabi/${syllabusId}`);
  }

  async createSyllabus(syllabusData) {
    return api.post("/admin/syllabi", syllabusData);
  }

  async updateSyllabus(syllabusId, syllabusData) {
    return api.put(`/admin/syllabi/${syllabusId}`, syllabusData);
  }

  async deleteSyllabus(syllabusId) {
    return api.delete(`/admin/syllabi/${syllabusId}`);
  }

  async toggleSyllabusActive(syllabusId) {
    return api.patch(`/admin/syllabi/${syllabusId}/toggle-active`);
  }

  async getSyllabiByClassLevel(classLevel) {
    return api.get(`/admin/syllabi/class/${classLevel}`);
  }

  async getActiveSyllabus(classLevel) {
    return api.get(`/admin/syllabi/class/${classLevel}/active`);
  }

  async bulkUpdateSyllabi(syllabusIds, updates) {
    return api.patch("/admin/syllabi/bulk-update", { syllabusIds, updates });
  }
}

export const adminService = new AdminService();
export default adminService;
