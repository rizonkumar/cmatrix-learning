import api from "./api";

/**
 * Kanban Service
 * Handles all Kanban board-related API calls
 */

export const kanbanService = {
  /**
   * Get all user's Kanban boards
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} API response with boards list
   */
  async getBoards(params = {}) {
    const response = await api.get("/kanban/boards", { params });
    return response.data;
  },

  /**
   * Create new Kanban board
   * @param {Object} boardData - Board data
   * @param {string} boardData.boardName - Board name
   * @param {string} boardData.description - Board description (optional)
   * @returns {Promise} API response with created board
   */
  async createBoard(boardData) {
    const response = await api.post("/kanban/boards", boardData);
    return response.data;
  },

  /**
   * Get board by ID with columns and cards
   * @param {string} boardId - Board ID
   * @returns {Promise} API response with board details
   */
  async getBoardById(boardId) {
    const response = await api.get(`/kanban/boards/${boardId}`);
    return response.data;
  },

  /**
   * Update board
   * @param {string} boardId - Board ID
   * @param {Object} updateData - Updated board data
   * @returns {Promise} API response with updated board
   */
  async updateBoard(boardId, updateData) {
    const response = await api.put(`/kanban/boards/${boardId}`, updateData);
    return response.data;
  },

  /**
   * Delete board
   * @param {string} boardId - Board ID
   * @returns {Promise} API response
   */
  async deleteBoard(boardId) {
    const response = await api.delete(`/kanban/boards/${boardId}`);
    return response.data;
  },

  // Column operations

  /**
   * Create new column in board
   * @param {string} boardId - Board ID
   * @param {Object} columnData - Column data
   * @param {string} columnData.title - Column title
   * @param {string} columnData.color - Column color (optional)
   * @param {number} columnData.order - Column order
   * @returns {Promise} API response with created column
   */
  async createColumn(boardId, columnData) {
    const response = await api.post(
      `/kanban/boards/${boardId}/columns`,
      columnData
    );
    return response.data;
  },

  /**
   * Update column
   * @param {string} boardId - Board ID
   * @param {string} columnId - Column ID
   * @param {Object} updateData - Updated column data
   * @returns {Promise} API response with updated column
   */
  async updateColumn(boardId, columnId, updateData) {
    const response = await api.put(
      `/kanban/boards/${boardId}/columns/${columnId}`,
      updateData
    );
    return response.data;
  },

  /**
   * Delete column
   * @param {string} boardId - Board ID
   * @param {string} columnId - Column ID
   * @returns {Promise} API response
   */
  async deleteColumn(boardId, columnId) {
    const response = await api.delete(
      `/kanban/boards/${boardId}/columns/${columnId}`
    );
    return response.data;
  },

  /**
   * Reorder columns
   * @param {string} boardId - Board ID
   * @param {Array} columnOrder - Array of column IDs in new order
   * @returns {Promise} API response
   */
  async reorderColumns(boardId, columnOrder) {
    const response = await api.patch(
      `/kanban/boards/${boardId}/columns/reorder`,
      {
        columnOrder,
      }
    );
    return response.data;
  },

  // Card operations

  /**
   * Create new card in column
   * @param {string} boardId - Board ID
   * @param {string} columnId - Column ID
   * @param {Object} cardData - Card data
   * @param {string} cardData.title - Card title
   * @param {string} cardData.description - Card description (optional)
   * @param {string} cardData.priority - Priority level (optional)
   * @param {Array} cardData.labels - Card labels (optional)
   * @param {Date} cardData.dueDate - Due date (optional)
   * @param {number} cardData.order - Card order in column
   * @returns {Promise} API response with created card
   */
  async createCard(boardId, columnId, cardData) {
    const response = await api.post(
      `/kanban/boards/${boardId}/columns/${columnId}/cards`,
      cardData
    );
    return response.data;
  },

  /**
   * Update card
   * @param {string} boardId - Board ID
   * @param {string} columnId - Column ID
   * @param {string} cardId - Card ID
   * @param {Object} updateData - Updated card data
   * @returns {Promise} API response with updated card
   */
  async updateCard(boardId, columnId, cardId, updateData) {
    const response = await api.put(
      `/kanban/boards/${boardId}/columns/${columnId}/cards/${cardId}`,
      updateData
    );
    return response.data;
  },

  /**
   * Delete card
   * @param {string} boardId - Board ID
   * @param {string} columnId - Column ID
   * @param {string} cardId - Card ID
   * @returns {Promise} API response
   */
  async deleteCard(boardId, columnId, cardId) {
    const response = await api.delete(
      `/kanban/boards/${boardId}/columns/${columnId}/cards/${cardId}`
    );
    return response.data;
  },

  /**
   * Move card between columns
   * @param {string} boardId - Board ID
   * @param {string} cardId - Card ID
   * @param {Object} moveData - Move data
   * @param {string} moveData.fromColumnId - Source column ID
   * @param {string} moveData.toColumnId - Target column ID
   * @param {number} moveData.newOrder - New position in target column
   * @returns {Promise} API response
   */
  async moveCard(boardId, cardId, moveData) {
    const response = await api.patch(
      `/kanban/boards/${boardId}/cards/${cardId}/move`,
      moveData
    );
    return response.data;
  },

  /**
   * Reorder cards within column
   * @param {string} boardId - Board ID
   * @param {string} columnId - Column ID
   * @param {Array} cardOrder - Array of card IDs in new order
   * @returns {Promise} API response
   */
  async reorderCards(boardId, columnId, cardOrder) {
    const response = await api.patch(
      `/kanban/boards/${boardId}/columns/${columnId}/cards/reorder`,
      {
        cardOrder,
      }
    );
    return response.data;
  },

  // Additional features

  /**
   * Duplicate board
   * @param {string} boardId - Board ID
   * @param {string} newBoardName - New board name
   * @returns {Promise} API response with duplicated board
   */
  async duplicateBoard(boardId, newBoardName) {
    const response = await api.post(`/kanban/boards/${boardId}/duplicate`, {
      boardName: newBoardName,
    });
    return response.data;
  },

  /**
   * Export board data
   * @param {string} boardId - Board ID
   * @param {string} format - Export format (json, csv, pdf)
   * @returns {Promise} API response with export data
   */
  async exportBoard(boardId, format = "json") {
    const response = await api.get(`/kanban/boards/${boardId}/export`, {
      params: { format },
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Get board activity/audit log
   * @param {string} boardId - Board ID
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} API response with activity log
   */
  async getBoardActivity(boardId, params = {}) {
    const response = await api.get(`/kanban/boards/${boardId}/activity`, {
      params,
    });
    return response.data;
  },
};

export default kanbanService;
