import { Todo } from "../models/todo.model.js";
import { ApiError } from "../utils/ApiError.js";

class TodoService {
  async createTodo(ownerId, todoData) {
    const todo = await Todo.create({
      ...todoData,
      owner: ownerId,
    });

    return await Todo.findById(todo._id);
  }

  async getUserTodos(ownerId, filters = {}) {
    const query = { owner: ownerId };

    // Apply filters
    if (filters.isCompleted !== undefined) {
      query.isCompleted = filters.isCompleted;
    }

    if (filters.priority) {
      query.priority = filters.priority;
    }

    if (filters.search) {
      query.taskDescription = { $regex: filters.search, $options: "i" };
    }

    // Date range filters
    if (filters.dueDateStart || filters.dueDateEnd) {
      query.dueDate = {};
      if (filters.dueDateStart) {
        query.dueDate.$gte = new Date(filters.dueDateStart);
      }
      if (filters.dueDateEnd) {
        query.dueDate.$lte = new Date(filters.dueDateEnd);
      }
    }

    const todos = await Todo.find(query).sort({ createdAt: -1 });

    return todos;
  }

  async getTodoById(todoId, ownerId) {
    const todo = await Todo.findOne({ _id: todoId, owner: ownerId });

    if (!todo) {
      throw new ApiError(404, "Todo not found");
    }

    return todo;
  }

  async updateTodo(todoId, ownerId, updateData) {
    const todo = await Todo.findOneAndUpdate(
      { _id: todoId, owner: ownerId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!todo) {
      throw new ApiError(404, "Todo not found");
    }

    return todo;
  }

  async deleteTodo(todoId, ownerId) {
    const todo = await Todo.findOneAndDelete({ _id: todoId, owner: ownerId });

    if (!todo) {
      throw new ApiError(404, "Todo not found");
    }

    return todo;
  }

  async toggleTodoStatus(todoId, ownerId) {
    const todo = await Todo.findOne({ _id: todoId, owner: ownerId });

    if (!todo) {
      throw new ApiError(404, "Todo not found");
    }

    todo.isCompleted = !todo.isCompleted;
    if (todo.isCompleted) {
      todo.completedAt = new Date();
    } else {
      todo.completedAt = null;
    }

    await todo.save();
    return todo;
  }

  async bulkUpdateTodos(ownerId, todoIds, updates) {
    const result = await Todo.updateMany(
      { _id: { $in: todoIds }, owner: ownerId },
      updates,
      { runValidators: true }
    );

    return result;
  }

  async bulkDeleteTodos(ownerId, todoIds) {
    const result = await Todo.deleteMany({
      _id: { $in: todoIds },
      owner: ownerId,
    });

    return result;
  }

  async getTodoStats(ownerId) {
    const stats = await Todo.aggregate([
      { $match: { owner: ownerId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: ["$isCompleted", 1, 0] },
          },
          pending: {
            $sum: { $cond: ["$isCompleted", 0, 1] },
          },
          highPriority: {
            $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] },
          },
          urgent: {
            $sum: { $cond: [{ $eq: ["$priority", "urgent"] }, 1, 0] },
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$dueDate", null] },
                    { $lt: ["$dueDate", new Date()] },
                    { $eq: ["$isCompleted", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    return (
      stats[0] || {
        total: 0,
        completed: 0,
        pending: 0,
        highPriority: 0,
        urgent: 0,
        overdue: 0,
      }
    );
  }

  async getUpcomingTodos(ownerId, limit = 5) {
    const todos = await Todo.find({
      owner: ownerId,
      isCompleted: false,
      dueDate: { $ne: null, $gte: new Date() },
    })
      .sort({ dueDate: 1 })
      .limit(limit);

    return todos;
  }

  async markOverdueTodos() {
    const result = await Todo.updateMany(
      {
        dueDate: { $lt: new Date() },
        isCompleted: false,
      },
      { isOverdue: true }
    );

    return result;
  }
}

export const todoService = new TodoService();
