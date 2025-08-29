import { todoService } from "../services/todo.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class TodoController {
  // Create a new todo
  createTodo = asyncHandler(async (req, res) => {
    const ownerId = req.user._id;
    const todoData = req.body;

    const todo = await todoService.createTodo(ownerId, todoData);

    res
      .status(201)
      .json(new ApiResponse(201, { todo }, "Todo created successfully"));
  });

  // Get user's todos with filters
  getMyTodos = asyncHandler(async (req, res) => {
    const ownerId = req.user._id;
    const { isCompleted, priority, search, dueDateStart, dueDateEnd } =
      req.query;

    const filters = {
      isCompleted:
        isCompleted === "true"
          ? true
          : isCompleted === "false"
          ? false
          : undefined,
      priority,
      search,
      dueDateStart,
      dueDateEnd,
    };

    const todos = await todoService.getUserTodos(ownerId, filters);

    res
      .status(200)
      .json(new ApiResponse(200, { todos }, "Todos retrieved successfully"));
  });

  // Get specific todo
  getTodoById = asyncHandler(async (req, res) => {
    const { todoId } = req.params;
    const ownerId = req.user._id;

    const todo = await todoService.getTodoById(todoId, ownerId);

    res
      .status(200)
      .json(new ApiResponse(200, { todo }, "Todo retrieved successfully"));
  });

  // Update todo
  updateTodo = asyncHandler(async (req, res) => {
    const { todoId } = req.params;
    const ownerId = req.user._id;
    const updateData = req.body;

    const todo = await todoService.updateTodo(todoId, ownerId, updateData);

    res
      .status(200)
      .json(new ApiResponse(200, { todo }, "Todo updated successfully"));
  });

  // Delete todo
  deleteTodo = asyncHandler(async (req, res) => {
    const { todoId } = req.params;
    const ownerId = req.user._id;

    await todoService.deleteTodo(todoId, ownerId);

    res.status(200).json(new ApiResponse(200, {}, "Todo deleted successfully"));
  });

  // Toggle todo completion status
  toggleTodoStatus = asyncHandler(async (req, res) => {
    const { todoId } = req.params;
    const ownerId = req.user._id;

    const todo = await todoService.toggleTodoStatus(todoId, ownerId);

    res
      .status(200)
      .json(new ApiResponse(200, { todo }, "Todo status updated successfully"));
  });

  // Bulk update todos
  bulkUpdateTodos = asyncHandler(async (req, res) => {
    const ownerId = req.user._id;
    const { todoIds, updates } = req.body;

    if (!Array.isArray(todoIds) || todoIds.length === 0) {
      throw new ApiError(400, "todoIds must be a non-empty array");
    }

    const result = await todoService.bulkUpdateTodos(ownerId, todoIds, updates);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
        },
        "Bulk update completed successfully"
      )
    );
  });

  // Bulk delete todos
  bulkDeleteTodos = asyncHandler(async (req, res) => {
    const ownerId = req.user._id;
    const { todoIds } = req.body;

    if (!Array.isArray(todoIds) || todoIds.length === 0) {
      throw new ApiError(400, "todoIds must be a non-empty array");
    }

    const result = await todoService.bulkDeleteTodos(ownerId, todoIds);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          deletedCount: result.deletedCount,
        },
        "Bulk delete completed successfully"
      )
    );
  });

  // Get todo statistics
  getTodoStats = asyncHandler(async (req, res) => {
    const ownerId = req.user._id;

    const stats = await todoService.getTodoStats(ownerId);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { stats },
          "Todo statistics retrieved successfully"
        )
      );
  });

  // Get upcoming todos
  getUpcomingTodos = asyncHandler(async (req, res) => {
    const ownerId = req.user._id;
    const { limit = 5 } = req.query;

    const todos = await todoService.getUpcomingTodos(ownerId, parseInt(limit));

    res
      .status(200)
      .json(
        new ApiResponse(200, { todos }, "Upcoming todos retrieved successfully")
      );
  });
}

export const todoController = new TodoController();
