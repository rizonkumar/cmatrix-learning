import React, { useState } from "react";
import { Plus, Calendar, Flag } from "lucide-react";
import Modal from "./common/Modal";
import Button from "./common/Button";
import { toast } from "react-hot-toast";

const TodoModal = ({ isOpen, onClose, onAddTodo }) => {
  const [formData, setFormData] = useState({
    taskDescription: "",
    priority: "medium",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);

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
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      const newTodo = {
        id: Date.now(),
        taskDescription: formData.taskDescription.trim(),
        isCompleted: false,
        priority: formData.priority,
        dueDate: formData.dueDate || null,
        createdAt: new Date().toISOString(),
      };

      onAddTodo(newTodo);

      toast.success("Task added successfully!");

      // Reset form and close modal
      setFormData({
        taskDescription: "",
        priority: "medium",
        dueDate: "",
      });
      onClose();
    } catch (error) {
      toast.error("Failed to add task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = [
    {
      value: "low",
      label: "Low",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      value: "medium",
      label: "Medium",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      value: "high",
      label: "High",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      value: "urgent",
      label: "Urgent",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Task" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Task Description
          </label>
          <textarea
            name="taskDescription"
            value={formData.taskDescription}
            onChange={handleInputChange}
            placeholder="What needs to be done?"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
            required
          />
        </div>

        {/* Priority Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Priority Level
          </label>
          <div className="grid grid-cols-2 gap-3">
            {priorityOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                  formData.priority === option.value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
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
                <Flag className={`w-4 h-4 mr-2 ${option.color}`} />
                <span
                  className={`text-sm font-medium ${
                    formData.priority === option.value
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Due Date (Optional)
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !formData.taskDescription.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding...
              </div>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TodoModal;
