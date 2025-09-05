import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Circle,
  Plus,
  Search,
  Calendar,
  Flag,
  Trash2,
  Edit3,
  Clock,
  Sparkles,
  TrendingUp,
  Target,
} from "lucide-react";
import TodoModal from "../components/TodoModal";
import Input from "../components/common/Input";
import { todoService } from "../services/todoService";
import { toast } from "react-hot-toast";

// Add CSS animations
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await todoService.getTodos();
      setTodos(response.data.todos || []);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      toast.error("Failed to load todos");
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (newTodo) => {
    setTodos((prev) => [...prev, newTodo]);
  };

  const handleEditTodo = (todoId) => {
    const todoToEdit = todos.find((todo) => todo._id === todoId);
    if (todoToEdit) {
      setEditingTodo(todoToEdit);
      setShowModal(true);
    }
  };

  const handleUpdateTodo = async (updatedTodo) => {
    try {
      const response = await todoService.updateTodo(updatedTodo._id, {
        taskDescription: updatedTodo.taskDescription,
        priority: updatedTodo.priority,
        dueDate: updatedTodo.dueDate,
        isCompleted: updatedTodo.isCompleted,
      });

      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === updatedTodo._id ? response.data.todo : todo
        )
      );
      setEditingTodo(null);
      toast.success("Task updated successfully!");
    } catch (error) {
      console.error("Failed to update todo:", error);
      toast.error("Failed to update task");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTodo(null);
  };

  const handleToggleTodo = async (todoId) => {
    try {
      const response = await todoService.toggleTodo(todoId);
      setTodos((prev) =>
        prev.map((todo) => (todo._id === todoId ? response.data.todo : todo))
      );
      toast.success(
        response.data.todo.isCompleted
          ? "Task completed! 🎉"
          : "Task marked as pending"
      );
    } catch (error) {
      console.error("Failed to toggle todo:", error);
      toast.error("Failed to update task status");
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await todoService.deleteTodo(todoId);
      setTodos((prev) => prev.filter((todo) => todo._id !== todoId));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Failed to delete todo:", error);
      toast.error("Failed to delete task");
    }
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && todo.isCompleted) ||
      (filter === "pending" && !todo.isCompleted);

    const matchesSearch = todo.taskDescription
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const completedCount = todos.filter((todo) => todo.isCompleted).length;
  const pendingCount = todos.filter((todo) => !todo.isCompleted).length;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 dark:text-red-200 bg-red-100 dark:bg-red-900/40";
      case "medium":
        return "text-yellow-600 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-900/40";
      case "low":
        return "text-green-600 dark:text-green-200 bg-green-100 dark:bg-green-900/40";
      default:
        return "text-gray-600 dark:text-gray-200 bg-gray-100 dark:bg-gray-700";
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-animated rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-xl relative overflow-hidden hover-lift">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                  <Target className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold">
                    Study Tasks
                  </h1>
                  <p className="text-blue-100 text-base lg:text-lg">
                    Organize your learning goals and track your progress! 🎯
                  </p>
                </div>
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-300" />
                    <span className="text-xs text-blue-200">Completed</span>
                  </div>
                  <div className="text-xl lg:text-2xl font-bold">
                    {completedCount}
                  </div>
                  <div className="text-xs text-blue-200">tasks done</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Circle className="w-4 h-4 text-orange-300" />
                    <span className="text-xs text-blue-200">Pending</span>
                  </div>
                  <div className="text-xl lg:text-2xl font-bold">
                    {pendingCount}
                  </div>
                  <div className="text-xs text-blue-200">to complete</div>
                </div>
                <div className="hidden lg:block bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-300" />
                    <span className="text-xs text-blue-200">Progress</span>
                  </div>
                  <div className="text-xl lg:text-2xl font-bold">
                    {todos.length > 0
                      ? Math.round((completedCount / todos.length) * 100)
                      : 0}
                    %
                  </div>
                  <div className="text-xs text-blue-200">completion rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Button Section */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Task
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 p-4 sm:p-6 hover-lift">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-base border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {[
              {
                key: "all",
                label: "All Tasks",
                count: todos.length,
                color: "blue",
              },
              {
                key: "pending",
                label: "Pending",
                count: pendingCount,
                color: "orange",
              },
              {
                key: "completed",
                label: "Completed",
                count: completedCount,
                color: "green",
              },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setFilter(option.key)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm font-medium transition-all duration-200 hover-lift focus-ring-enhanced ${
                  filter === option.key
                    ? `bg-${option.color}-500 text-white shadow-lg transform scale-105`
                    : `bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md`
                }`}
              >
                <span>{option.label}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    filter === option.key
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {option.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo, index) => (
            <div
              key={todo._id}
              className={`group rounded-xl shadow-sm border p-4 sm:p-6 transition-all duration-300 hover-lift ${
                todo.isCompleted
                  ? "opacity-75 bg-green-50/50 dark:bg-green-900/30 border-gray-200 dark:border-gray-600 gradient-border dark:gradient-border-dark"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 gradient-border dark:gradient-border-dark"
              }`}
              style={{
                animationName: "fadeInUp",
                animationDuration: "0.6s",
                animationDelay: `${index * 100}ms`,
                animationTimingFunction: "ease-out",
                animationFillMode: "forwards",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleTodo(todo._id)}
                    className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      todo.isCompleted
                        ? "bg-green-500 border-green-500 text-white shadow-lg"
                        : "border-gray-300 dark:border-gray-500 hover:border-blue-500 hover:shadow-md group-hover:scale-110"
                    }`}
                  >
                    {todo.isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 dark:text-gray-300" />
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3
                        className={`text-lg font-semibold transition-all duration-200 ${
                          todo.isCompleted
                            ? "text-gray-500 dark:text-gray-300 line-through"
                            : "text-gray-900 dark:text-gray-50 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        }`}
                      >
                        {todo.taskDescription}
                      </h3>

                      {/* Action Menu */}
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleEditTodo(todo._id)}
                          className="p-2 text-gray-400 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-300 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50"
                          title="Edit task"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo._id)}
                          className="p-2 text-gray-400 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-300 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Task Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      {todo.dueDate && (
                        <div
                          className={`flex items-center space-x-1 ${
                            new Date(todo.dueDate) < new Date() &&
                            !todo.isCompleted
                              ? "text-red-600 dark:text-red-200"
                              : "text-gray-500 dark:text-gray-200"
                          }`}
                        >
                          <Calendar className="w-4 h-4" />
                          <span>
                            Due: {new Date(todo.dueDate).toLocaleDateString()}
                            {new Date(todo.dueDate) < new Date() &&
                              !todo.isCompleted && (
                                <span className="ml-1 text-red-500 dark:text-red-200">
                                  • Overdue
                                </span>
                              )}
                          </span>
                        </div>
                      )}

                      {todo.priority && (
                        <span
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            todo.priority
                          )}`}
                        >
                          <Flag className="w-3 h-3" />
                          <span className="capitalize">{todo.priority}</span>
                        </span>
                      )}

                      {!todo.isCompleted && todo.dueDate && (
                        <div className="flex items-center space-x-1 text-orange-600 dark:text-orange-200">
                          <Clock className="w-4 h-4" />
                          <span>
                            {Math.ceil(
                              (new Date(todo.dueDate) - new Date()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            days left
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar for Pending Tasks */}
              {!todo.isCompleted && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-200">
                      Progress
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-200">
                      {Math.floor(Math.random() * 100)}% complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Target className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="absolute -top-2 -right-16">
                <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {searchTerm ? "No tasks found" : "Ready to conquer your goals?"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search terms or check your filters"
                : "Transform your study habits with organized task management. Start building your success story today!"}
            </p>

            {!searchTerm && (
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Use the "Add New Task" button above to get started!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Todo Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={handleCloseModal}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <TodoModal
              isOpen={showModal}
              onClose={handleCloseModal}
              onAddTodo={handleAddTodo}
              onUpdateTodo={handleUpdateTodo}
              editingTodo={editingTodo}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoPage;
