import React, { useState, useEffect } from "react";
import {
  Plus,
  Calendar,
  Flag,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { todoService } from "../services/todoService";

const TodoModal = ({ isOpen, onClose, onAddTodo }) => {
  const [formData, setFormData] = useState({
    taskDescription: "",
    priority: "medium",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        taskDescription: "",
        priority: "medium",
        dueDate: "",
      });
      setLoading(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.taskDescription.trim()) {
      toast.error("Task description is required");
      return;
    }

    setLoading(true);

    try {
      const todoData = {
        taskDescription: formData.taskDescription.trim(),
        priority: formData.priority,
        ...(formData.dueDate && {
          dueDate: new Date(formData.dueDate).toISOString(),
        }),
      };

      const response = await todoService.createTodo(todoData);

      // Call the parent callback with the API response
      if (onAddTodo) {
        onAddTodo(response.data);
      }

      toast.success("Task added successfully!");

      // Reset form and close modal
      setFormData({
        taskDescription: "",
        priority: "medium",
        dueDate: "",
      });
      onClose();
    } catch (error) {
      // Error is already handled by the API interceptor
      console.error("Failed to create todo:", error);
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = [
    {
      value: "low",
      label: "Low Priority",
      description: "Can be done later",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      icon: Clock,
    },
    {
      value: "medium",
      label: "Medium Priority",
      description: "Should be done soon",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      icon: AlertCircle,
    },
    {
      value: "high",
      label: "High Priority",
      description: "Important task",
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      icon: Flag,
    },
    {
      value: "urgent",
      label: "Urgent",
      description: "Needs immediate attention",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      icon: Sparkles,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Custom Header */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 p-4 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full -translate-y-12 translate-x-12"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        <div className="relative flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Create New Task</h2>
            <p className="text-blue-100 text-sm">
              Add a new study task to your list
            </p>
          </div>
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 space-y-4 max-h-96 overflow-y-auto"
      >
        {/* Task Description */}
        <div className="space-y-2">
          <label className="block text-base font-semibold text-gray-900 dark:text-white">
            Task Description
          </label>
          <div className="relative">
            <textarea
              name="taskDescription"
              value={formData.taskDescription}
              onChange={handleInputChange}
              placeholder="What study task do you need to complete?"
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-sm"
              rows={3}
              required
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {formData.taskDescription.length}/200
            </div>
          </div>
        </div>

        {/* Priority Selection */}
        <div className="space-y-3">
          <label className="block text-base font-semibold text-gray-900 dark:text-white">
            Priority Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {priorityOptions.map((option) => {
              const Icon = option.icon;
              return (
                <label
                  key={option.value}
                  className={`group relative p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                    formData.priority === option.value
                      ? `${option.borderColor} ${option.bgColor} shadow-lg transform scale-105`
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={option.value}
                    checked={formData.priority === option.value}
                    onChange={handleInputChange}
                    className="sr-only"
                  />

                  <div className="flex items-start space-x-2">
                    <div
                      className={`p-1.5 rounded-md transition-colors ${
                        formData.priority === option.value
                          ? "bg-white/80"
                          : "bg-gray-100 dark:bg-gray-600 group-hover:bg-gray-200 dark:group-hover:bg-gray-500"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${option.color}`} />
                    </div>

                    <div className="flex-1">
                      <div
                        className={`font-medium text-sm ${
                          formData.priority === option.value
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {option.label}
                      </div>
                      <div
                        className={`text-xs mt-0.5 ${
                          formData.priority === option.value
                            ? "text-gray-600 dark:text-gray-300"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {option.description}
                      </div>
                    </div>

                    {formData.priority === option.value && (
                      <div className="flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <label className="block text-base font-semibold text-gray-900 dark:text-white">
            Due Date{" "}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              (Optional)
            </span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
            />
            {formData.dueDate && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400">
                {Math.ceil(
                  (new Date(formData.dueDate) - new Date()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.taskDescription.trim()}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-2.5 rounded-lg font-medium shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="text-sm">Creating...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                <span className="text-sm">Create Task</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoModal;
