import { kanbanService } from "../services/kanban.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class KanbanController {
  // Board operations
  createBoard = asyncHandler(async (req, res) => {
    const ownerId = req.user._id;
    const boardData = req.body;

    const result = await kanbanService.createBoard(ownerId, boardData);

    res
      .status(201)
      .json(
        new ApiResponse(201, { board: result }, "Board created successfully")
      );
  });

  getMyBoards = asyncHandler(async (req, res) => {
    const ownerId = req.user._id;

    const boards = await kanbanService.getUserBoards(ownerId);

    res
      .status(200)
      .json(new ApiResponse(200, { boards }, "Boards retrieved successfully"));
  });

  getBoardById = asyncHandler(async (req, res) => {
    const { boardId } = req.params;
    const ownerId = req.user._id;

    const result = await kanbanService.getBoardById(boardId, ownerId);

    res
      .status(200)
      .json(
        new ApiResponse(200, result, "Board details retrieved successfully")
      );
  });

  updateBoard = asyncHandler(async (req, res) => {
    const { boardId } = req.params;
    const ownerId = req.user._id;
    const updateData = req.body;

    const board = await kanbanService.updateBoard(boardId, ownerId, updateData);

    res
      .status(200)
      .json(new ApiResponse(200, { board }, "Board updated successfully"));
  });

  deleteBoard = asyncHandler(async (req, res) => {
    const { boardId } = req.params;
    const ownerId = req.user._id;

    await kanbanService.deleteBoard(boardId, ownerId);

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Board deleted successfully"));
  });

  // Column operations
  createColumn = asyncHandler(async (req, res) => {
    const { boardId } = req.params;
    const ownerId = req.user._id;
    const columnData = req.body;

    const column = await kanbanService.createColumn(
      boardId,
      ownerId,
      columnData
    );

    res
      .status(201)
      .json(new ApiResponse(201, { column }, "Column created successfully"));
  });

  updateColumn = asyncHandler(async (req, res) => {
    const { columnId } = req.params;
    const ownerId = req.user._id;
    const updateData = req.body;

    const column = await kanbanService.updateColumn(
      columnId,
      ownerId,
      updateData
    );

    res
      .status(200)
      .json(new ApiResponse(200, { column }, "Column updated successfully"));
  });

  deleteColumn = asyncHandler(async (req, res) => {
    const { columnId } = req.params;
    const ownerId = req.user._id;

    await kanbanService.deleteColumn(columnId, ownerId);

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Column deleted successfully"));
  });

  reorderColumns = asyncHandler(async (req, res) => {
    const { boardId } = req.params;
    const ownerId = req.user._id;
    const { columnOrder } = req.body;

    const result = await kanbanService.reorderColumns(
      boardId,
      ownerId,
      columnOrder
    );

    res
      .status(200)
      .json(new ApiResponse(200, result, "Columns reordered successfully"));
  });

  // Card operations
  createCard = asyncHandler(async (req, res) => {
    const { columnId } = req.params;
    const ownerId = req.user._id;
    const cardData = req.body;

    const card = await kanbanService.createCard(columnId, ownerId, cardData);

    res
      .status(201)
      .json(new ApiResponse(201, { card }, "Card created successfully"));
  });

  updateCard = asyncHandler(async (req, res) => {
    const { cardId } = req.params;
    const ownerId = req.user._id;
    const updateData = req.body;

    const card = await kanbanService.updateCard(cardId, ownerId, updateData);

    res
      .status(200)
      .json(new ApiResponse(200, { card }, "Card updated successfully"));
  });

  deleteCard = asyncHandler(async (req, res) => {
    const { cardId } = req.params;
    const ownerId = req.user._id;

    await kanbanService.deleteCard(cardId, ownerId);

    res.status(200).json(new ApiResponse(200, {}, "Card deleted successfully"));
  });

  moveCard = asyncHandler(async (req, res) => {
    const { cardId } = req.params;
    const ownerId = req.user._id;
    const { newColumnId, newOrder } = req.body;

    const card = await kanbanService.moveCard(
      cardId,
      ownerId,
      newColumnId,
      newOrder
    );

    res
      .status(200)
      .json(new ApiResponse(200, { card }, "Card moved successfully"));
  });

  reorderCards = asyncHandler(async (req, res) => {
    const { columnId } = req.params;
    const ownerId = req.user._id;
    const { cardOrder } = req.body;

    const result = await kanbanService.reorderCards(
      columnId,
      ownerId,
      cardOrder
    );

    res
      .status(200)
      .json(new ApiResponse(200, result, "Cards reordered successfully"));
  });

  // Statistics
  getBoardStats = asyncHandler(async (req, res) => {
    const { boardId } = req.params;
    const ownerId = req.user._id;

    const stats = await kanbanService.getBoardStats(boardId, ownerId);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { stats },
          "Board statistics retrieved successfully"
        )
      );
  });
}

export const kanbanController = new KanbanController();
