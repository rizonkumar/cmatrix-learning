import { KanbanBoard } from "../models/kanbanBoard.model.js";
import { KanbanColumn } from "../models/kanbanColumn.model.js";
import { KanbanCard } from "../models/kanbanCard.model.js";
import { ApiError } from "../utils/ApiError.js";

class KanbanService {
  // Board operations
  async createBoard(ownerId, boardData) {
    const board = await KanbanBoard.create({
      ...boardData,
      owner: ownerId,
    });

    // Create default columns for new board
    const defaultColumns = [
      { title: "To Do", boardId: board._id, order: 0 },
      { title: "In Progress", boardId: board._id, order: 1 },
      { title: "Done", boardId: board._id, order: 2 },
    ];

    await KanbanColumn.insertMany(defaultColumns);

    return await KanbanBoard.findById(board._id).populate(
      "owner",
      "username fullName"
    );
  }

  async getUserBoards(ownerId) {
    const boards = await KanbanBoard.find({ owner: ownerId })
      .populate("owner", "username fullName")
      .sort({ createdAt: -1 });

    return boards;
  }

  async getBoardById(boardId, ownerId) {
    const board = await KanbanBoard.findOne({
      _id: boardId,
      owner: ownerId,
    }).populate("owner", "username fullName");

    if (!board) {
      throw new ApiError(404, "Board not found");
    }

    // Get columns and cards for this board
    const columns = await KanbanColumn.find({ boardId })
      .populate({
        path: "cards",
        populate: {
          path: "assignedTo",
          select: "username fullName avatar",
        },
      })
      .sort({ order: 1 });

    return { board, columns };
  }

  async updateBoard(boardId, ownerId, updateData) {
    const board = await KanbanBoard.findOneAndUpdate(
      { _id: boardId, owner: ownerId },
      updateData,
      { new: true, runValidators: true }
    ).populate("owner", "username fullName");

    if (!board) {
      throw new ApiError(404, "Board not found");
    }

    return board;
  }

  async deleteBoard(boardId, ownerId) {
    const board = await KanbanBoard.findOneAndDelete({
      _id: boardId,
      owner: ownerId,
    });

    if (!board) {
      throw new ApiError(404, "Board not found");
    }

    // Delete all columns and cards associated with this board
    await KanbanColumn.deleteMany({ boardId });
    await KanbanCard.deleteMany({ boardId });

    return board;
  }

  // Column operations
  async createColumn(boardId, ownerId, columnData) {
    // Verify board ownership
    const board = await KanbanBoard.findOne({ _id: boardId, owner: ownerId });
    if (!board) {
      throw new ApiError(404, "Board not found");
    }

    // Get the highest order for this board
    const lastColumn = await KanbanColumn.findOne({ boardId }).sort({
      order: -1,
    });

    const order = lastColumn ? lastColumn.order + 1 : 0;

    const column = await KanbanColumn.create({
      ...columnData,
      boardId,
      order,
    });

    return await KanbanColumn.findById(column._id);
  }

  async updateColumn(columnId, ownerId, updateData) {
    // Find column and verify board ownership
    const column = await KanbanColumn.findById(columnId);
    if (!column) {
      throw new ApiError(404, "Column not found");
    }

    const board = await KanbanBoard.findOne({
      _id: column.boardId,
      owner: ownerId,
    });
    if (!board) {
      throw new ApiError(403, "Unauthorized to modify this column");
    }

    const updatedColumn = await KanbanColumn.findByIdAndUpdate(
      columnId,
      updateData,
      { new: true, runValidators: true }
    );

    return updatedColumn;
  }

  async deleteColumn(columnId, ownerId) {
    // Find column and verify board ownership
    const column = await KanbanColumn.findById(columnId);
    if (!column) {
      throw new ApiError(404, "Column not found");
    }

    const board = await KanbanBoard.findOne({
      _id: column.boardId,
      owner: ownerId,
    });
    if (!board) {
      throw new ApiError(403, "Unauthorized to delete this column");
    }

    // Move cards to the next column or delete them
    const nextColumn = await KanbanColumn.findOne({
      boardId: column.boardId,
      order: { $gt: column.order },
    }).sort({ order: 1 });

    if (nextColumn) {
      await KanbanCard.updateMany({ columnId }, { columnId: nextColumn._id });
    } else {
      await KanbanCard.deleteMany({ columnId });
    }

    await KanbanColumn.findByIdAndDelete(columnId);

    return column;
  }

  async reorderColumns(boardId, ownerId, columnOrder) {
    // Verify board ownership
    const board = await KanbanBoard.findOne({ _id: boardId, owner: ownerId });
    if (!board) {
      throw new ApiError(403, "Unauthorized to modify this board");
    }

    // Update column orders
    const updatePromises = columnOrder.map((columnId, index) =>
      KanbanColumn.findByIdAndUpdate(columnId, { order: index })
    );

    await Promise.all(updatePromises);
    return { message: "Columns reordered successfully" };
  }

  // Card operations
  async createCard(columnId, ownerId, cardData) {
    // Find column and verify board ownership
    const column = await KanbanColumn.findById(columnId);
    if (!column) {
      throw new ApiError(404, "Column not found");
    }

    const board = await KanbanBoard.findOne({
      _id: column.boardId,
      owner: ownerId,
    });
    if (!board) {
      throw new ApiError(403, "Unauthorized to create card in this board");
    }

    // Get the highest order for this column
    const lastCard = await KanbanCard.findOne({ columnId }).sort({ order: -1 });

    const order = lastCard ? lastCard.order + 1 : 0;

    const card = await KanbanCard.create({
      ...cardData,
      columnId,
      boardId: column.boardId,
      order,
    });

    // Add card to column's cards array
    await KanbanColumn.findByIdAndUpdate(columnId, {
      $push: { cards: card._id },
    });

    return await KanbanCard.findById(card._id).populate(
      "assignedTo",
      "username fullName avatar"
    );
  }

  async updateCard(cardId, ownerId, updateData) {
    // Find card and verify board ownership
    const card = await KanbanCard.findById(cardId);
    if (!card) {
      throw new ApiError(404, "Card not found");
    }

    const board = await KanbanBoard.findOne({
      _id: card.boardId,
      owner: ownerId,
    });
    if (!board) {
      throw new ApiError(403, "Unauthorized to modify this card");
    }

    const updatedCard = await KanbanCard.findByIdAndUpdate(cardId, updateData, {
      new: true,
      runValidators: true,
    }).populate("assignedTo", "username fullName avatar");

    return updatedCard;
  }

  async deleteCard(cardId, ownerId) {
    // Find card and verify board ownership
    const card = await KanbanCard.findById(cardId);
    if (!card) {
      throw new ApiError(404, "Card not found");
    }

    const board = await KanbanBoard.findOne({
      _id: card.boardId,
      owner: ownerId,
    });
    if (!board) {
      throw new ApiError(403, "Unauthorized to delete this card");
    }

    // Remove card from column's cards array
    await KanbanColumn.findByIdAndUpdate(card.columnId, {
      $pull: { cards: cardId },
    });

    await KanbanCard.findByIdAndDelete(cardId);

    return card;
  }

  async moveCard(cardId, ownerId, newColumnId, newOrder) {
    // Find card and verify board ownership
    const card = await KanbanCard.findById(cardId);
    if (!card) {
      throw new ApiError(404, "Card not found");
    }

    const board = await KanbanBoard.findOne({
      _id: card.boardId,
      owner: ownerId,
    });
    if (!board) {
      throw new ApiError(403, "Unauthorized to move this card");
    }

    // Verify new column belongs to the same board
    const newColumn = await KanbanColumn.findById(newColumnId);
    if (
      !newColumn ||
      newColumn.boardId.toString() !== card.boardId.toString()
    ) {
      throw new ApiError(400, "Invalid column");
    }

    // Update card position
    card.columnId = newColumnId;
    card.order = newOrder || 0;
    await card.save();

    // Update column references
    await KanbanColumn.findByIdAndUpdate(card.columnId, {
      $pull: { cards: cardId },
    });

    await KanbanColumn.findByIdAndUpdate(newColumnId, {
      $push: { cards: cardId },
    });

    return card;
  }

  async reorderCards(columnId, ownerId, cardOrder) {
    // Find column and verify board ownership
    const column = await KanbanColumn.findById(columnId);
    if (!column) {
      throw new ApiError(404, "Column not found");
    }

    const board = await KanbanBoard.findOne({
      _id: column.boardId,
      owner: ownerId,
    });
    if (!board) {
      throw new ApiError(403, "Unauthorized to modify this board");
    }

    // Update card orders
    const updatePromises = cardOrder.map((cardId, index) =>
      KanbanCard.findByIdAndUpdate(cardId, { order: index })
    );

    await Promise.all(updatePromises);
    return { message: "Cards reordered successfully" };
  }

  async getBoardStats(boardId, ownerId) {
    // Verify board ownership
    const board = await KanbanBoard.findOne({ _id: boardId, owner: ownerId });
    if (!board) {
      throw new ApiError(403, "Unauthorized to access this board");
    }

    const stats = await KanbanColumn.aggregate([
      { $match: { boardId: board._id } },
      {
        $lookup: {
          from: "kanbancards",
          localField: "_id",
          foreignField: "columnId",
          as: "cards",
        },
      },
      {
        $group: {
          _id: null,
          totalColumns: { $sum: 1 },
          totalCards: { $sum: { $size: "$cards" } },
          columns: {
            $push: {
              title: "$title",
              cardCount: { $size: "$cards" },
              cards: "$cards",
            },
          },
        },
      },
    ]);

    return (
      stats[0] || {
        totalColumns: 0,
        totalCards: 0,
        columns: [],
      }
    );
  }
}

export const kanbanService = new KanbanService();
