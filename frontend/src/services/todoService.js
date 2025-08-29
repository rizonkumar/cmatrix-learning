import api from "./api";

/**
 * TODO Service
 * Handles all TODO/task-related API calls
 */

export const todoService = {
  /**
   * Get all user's TODO items
   * @param {Object} params - Query parameters
   * @param {boolean} params.completed - Filter by completion status
   * @param {string} params.priority - Filter by priority
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} API response with TODO items
   */
  async getTodos(params = {}) {
    const response = await api.get("/todos", { params });
    return response.data;
  },

  /**
   * Create new TODO item
   * @param {Object} todoData - TODO item data
   * @param {string} todoData.taskDescription - Task description
   * @param {boolean} todoData.isCompleted - Completion status (optional)
   * @param {string} todoData.priority - Priority level (optional)
   * @param {Date} todoData.dueDate - Due date (optional)
   * @param {string} todoData.category - Category (optional)
   * @returns {Promise} API response with created TODO item
   */
  async createTodo(todoData) {
    const response = await api.post("/todos", todoData);
    return response.data;
  },

  /**
   * Get TODO item by ID
   * @param {string} todoId - TODO item ID
   * @returns {Promise} API response with TODO item
   */
  async getTodoById(todoId) {
    const response = await api.get(`/todos/${todoId}`);
    return response.data;
  },

  /**
   * Update TODO item
   * @param {string} todoId - TODO item ID
   * @param {Object} updateData - Updated TODO data
   * @returns {Promise} API response with updated TODO item
   */
  async updateTodo(todoId, updateData) {
    const response = await api.put(`/todos/${todoId}`, updateData);
    return response.data;
  },

  /**
   * Delete TODO item
   * @param {string} todoId - TODO item ID
   * @returns {Promise} API response
   */
  async deleteTodo(todoId) {
    const response = await api.delete(`/todos/${todoId}`);
    return response.data;
  },

  /**
   * Toggle TODO completion status
   * @param {string} todoId - TODO item ID
   * @returns {Promise} API response with updated TODO item
   */
  async toggleTodo(todoId) {
    const response = await api.patch(`/todos/${todoId}/toggle`);
    return response.data;
  },

  /**
   * Bulk update TODO items
   * @param {Object} bulkData - Bulk update data
   * @param {Array} bulkData.todoIds - Array of TODO IDs
   * @param {Object} bulkData.updates - Updates to apply
   * @returns {Promise} API response with updated items
   */
  async bulkUpdateTodos(bulkData) {
    const response = await api.patch("/todos/bulk", bulkData);
    return response.data;
  },

  /**
   * Bulk delete TODO items
   * @param {Array} todoIds - Array of TODO IDs to delete
   * @returns {Promise} API response
   */
  async bulkDeleteTodos(todoIds) {
    const response = await api.delete("/todos/bulk", {
      data: { todoIds },
    });
    return response.data;
  },

  /**
   * Get TODO statistics
   * @returns {Promise} API response with TODO statistics
   */
  async getTodoStats() {
    const response = await api.get("/todos/stats");
    return response.data;
  },

  /**
   * Get TODO items by category
   * @param {string} category - Category name
   * @returns {Promise} API response with TODO items
   */
  async getTodosByCategory(category) {
    const response = await api.get(`/todos/category/${category}`);
    return response.data;
  },

  /**
   * Get overdue TODO items
   * @returns {Promise} API response with overdue TODO items
   */
  async getOverdueTodos() {
    const response = await api.get("/todos/overdue");
    return response.data;
  },

  /**
   * Get today's TODO items
   * @returns {Promise} API response with today's TODO items
   */
  async getTodayTodos() {
    const response = await api.get("/todos/today");
    return response.data;
  },

  /**
   * Get upcoming TODO items
   * @param {Object} params - Query parameters
   * @param {number} params.days - Number of days ahead
   * @returns {Promise} API response with upcoming TODO items
   */
  async getUpcomingTodos(params = { days: 7 }) {
    const response = await api.get("/todos/upcoming", { params });
    return response.data;
  },

  /**
   * Search TODO items
   * @param {string} query - Search query
   * @returns {Promise} API response with search results
   */
  async searchTodos(query) {
    const response = await api.get("/todos/search", {
      params: { q: query },
    });
    return response.data;
  },
};

export default todoService;
