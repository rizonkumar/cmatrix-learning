# Frontend API Integration Guide - C-Matrix Learning

## Overview

This guide provides comprehensive instructions for integrating the C-Matrix Learning backend API into your React frontend application. It includes complete setup instructions, service implementations, component examples, and error handling patterns.

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in your React project root:

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
REACT_APP_APP_NAME=C-Matrix Learning
REACT_APP_VERSION=1.0.0
```

### 2. Project Structure

```
src/
├── services/
│   ├── api.js              # Base API service
│   ├── authService.js      # Authentication service
│   ├── courseService.js    # Course management
│   ├── enrollmentService.js # Enrollment management
│   ├── todoService.js      # TODO management
│   ├── kanbanService.js    # Kanban board service
│   └── reviewService.js    # Review system
├── stores/
│   ├── authStore.js        # Authentication state
│   ├── courseStore.js      # Course state
│   └── uiStore.js          # UI state
├── components/
│   ├── common/
│   │   ├── LoadingSpinner.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── ProtectedRoute.jsx
│   ├── auth/
│   ├── courses/
│   ├── dashboard/
│   └── ...
├── hooks/
│   ├── useAuth.js
│   ├── useCourses.js
│   └── useLocalStorage.js
└── utils/
    ├── constants.js
    └── helpers.js
```

### 3. Dependencies

```bash
npm install zustand react-query react-dnd react-dnd-html5-backend \
            react-router-dom axios react-hook-form yup \
            lucide-react tailwindcss
```

## Base URL Configuration

```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/v1";
```

## 🔐 Authentication Integration

### 1. Auth Store Setup (Zustand/Redux)

```javascript
// stores/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      // Login user
      login: async (email, password) => {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: "include", // Important for cookies
          });

          const data = await response.json();

          if (data.success) {
            set({
              user: data.data.user,
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              isAuthenticated: true,
            });
            return { success: true };
          } else {
            return { success: false, message: data.message };
          }
        } catch (error) {
          return { success: false, message: "Network error" };
        }
      },

      // Register user
      register: async (userData) => {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
            credentials: "include",
          });

          const data = await response.json();

          if (data.success) {
            set({
              user: data.data.user,
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              isAuthenticated: true,
            });
            return { success: true };
          } else {
            return { success: false, message: data.message };
          }
        } catch (error) {
          return { success: false, message: "Network error" };
        }
      },

      // Logout user
      logout: async () => {
        try {
          await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
          });
        } catch (error) {
          console.error("Logout error:", error);
        }

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      // Refresh token
      refreshAccessToken: async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
            method: "POST",
            credentials: "include",
          });

          const data = await response.json();

          if (data.success) {
            set({
              accessToken: data.data.accessToken,
            });
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      // Update user profile
      updateProfile: async (profileData) => {
        const { accessToken } = get();

        try {
          const response = await fetch(`${API_BASE_URL}/users/profile`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(profileData),
            credentials: "include",
          });

          const data = await response.json();

          if (data.success) {
            set({ user: data.data.user });
            return { success: true };
          } else {
            return { success: false, message: data.message };
          }
        } catch (error) {
          return { success: false, message: "Network error" };
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
```

### 2. API Service Setup

```javascript
// services/api.js
class ApiService {
  constructor() {
    this.baseURL = "http://localhost:8000/api/v1";
  }

  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Handle API responses
  async handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
      // Handle token refresh on 401
      if (response.status === 401) {
        // Try to refresh token
        const refreshResponse = await fetch(
          `${this.baseURL}/auth/refresh-token`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          localStorage.setItem("accessToken", refreshData.data.accessToken);
          // Retry original request
          return this.request(response.url, {
            ...response.options,
            headers: {
              ...response.options.headers,
              Authorization: `Bearer ${refreshData.data.accessToken}`,
            },
          });
        }
      }

      throw new Error(data.message || "API request failed");
    }

    return data;
  }

  // Generic request method
  async request(url, options = {}) {
    const response = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      credentials: "include",
    });

    return this.handleResponse(response);
  }

  // GET request
  async get(url, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return this.request(fullUrl);
  }

  // POST request
  async post(url, data = {}) {
    return this.request(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(url, data = {}) {
    return this.request(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(url, data = {}) {
    return this.request(url, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(url) {
    return this.request(url, {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();
```

## 📚 Course Management Integration

### 1. Course Service

```javascript
// services/courseService.js
import { apiService } from "./api.js";

class CourseService {
  // Get all courses with filters
  async getAllCourses(filters = {}) {
    return apiService.get("/courses", filters);
  }

  // Get course by ID
  async getCourseById(courseId) {
    return apiService.get(`/courses/${courseId}`);
  }

  // Search courses
  async searchCourses(query, filters = {}) {
    return apiService.get("/courses/search", { q: query, ...filters });
  }

  // Get courses by category
  async getCoursesByCategory(category, filters = {}) {
    return apiService.get(`/courses/category/${category}`, filters);
  }

  // Get featured courses
  async getFeaturedCourses(limit = 6) {
    return apiService.get("/courses/featured", { limit });
  }

  // Get course categories
  async getCategories() {
    return apiService.get("/courses/categories");
  }

  // Admin: Create course
  async createCourse(courseData) {
    return apiService.post("/admin/courses", courseData);
  }

  // Admin: Update course
  async updateCourse(courseId, courseData) {
    return apiService.put(`/admin/courses/${courseId}`, courseData);
  }

  // Admin: Delete course
  async deleteCourse(courseId) {
    return apiService.delete(`/admin/courses/${courseId}`);
  }

  // Admin: Publish/unpublish course
  async toggleCoursePublish(courseId, isPublished) {
    return apiService.patch(`/admin/courses/${courseId}/publish`, {
      isPublished,
    });
  }

  // Admin: Bulk update courses
  async bulkUpdateCourses(courseIds, updates) {
    return apiService.patch("/admin/courses/bulk-update", {
      courseIds,
      updates,
    });
  }

  // Admin: Get course statistics
  async getCourseStats() {
    return apiService.get("/admin/stats/courses");
  }

  // Admin: Get teachers
  async getTeachers() {
    return apiService.get("/admin/teachers");
  }
}

export const courseService = new CourseService();
```

### 2. Course Component Example

```javascript
// components/CourseCard.jsx
import React, { useState } from "react";
import { courseService } from "../services/courseService.js";
import { useAuthStore } from "../stores/authStore.js";

const CourseCard = ({ course }) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      // Redirect to login
      return;
    }

    setIsEnrolling(true);
    try {
      await enrollmentService.enrollInCourse(course._id);
      // Refresh course data or show success message
      alert("Successfully enrolled!");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsEnrolling(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">
          ☆
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">
          ☆
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={course.thumbnailUrl}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{course.description}</p>

        <div className="flex items-center mb-2">
          <div className="flex items-center mr-4">
            {renderStars(course.rating)}
            <span className="ml-1 text-sm text-gray-600">
              ({course.reviewCount})
            </span>
          </div>
          <span className="text-sm text-gray-500">{course.category}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">₹{course.price}</span>

          {course.isEnrolled ? (
            <div className="text-green-600 font-medium">
              Enrolled ({course.enrollmentProgress}%)
            </div>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={isEnrolling}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isEnrolling ? "Enrolling..." : "Enroll Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
```

## 📝 Enrollment Management Integration

### 1. Enrollment Service

```javascript
// services/enrollmentService.js
import { apiService } from "./api.js";

class EnrollmentService {
  // Enroll in course
  async enrollInCourse(courseId) {
    return apiService.post(`/enrollments/courses/${courseId}/enroll`);
  }

  // Unenroll from course
  async unenrollFromCourse(courseId) {
    return apiService.delete(`/enrollments/courses/${courseId}/unenroll`);
  }

  // Update lesson progress
  async updateLessonProgress(courseId, lessonId, completed = true) {
    return apiService.patch(
      `/enrollments/courses/${courseId}/lessons/${lessonId}/progress`,
      { completed }
    );
  }

  // Get user's enrollments
  async getMyEnrollments(filters = {}) {
    return apiService.get("/enrollments/my-enrollments", filters);
  }

  // Get enrollment details
  async getEnrollmentDetails(enrollmentId) {
    return apiService.get(`/enrollments/${enrollmentId}`);
  }

  // Check enrollment status
  async checkEnrollmentStatus(courseId) {
    return apiService.get(`/enrollments/courses/${courseId}/status`);
  }

  // Get course progress
  async getCourseProgress(courseId) {
    return apiService.get(`/enrollments/courses/${courseId}/progress`);
  }

  // Get course enrollments (admin/teacher)
  async getCourseEnrollments(courseId, filters = {}) {
    return apiService.get(
      `/enrollments/courses/${courseId}/enrollments`,
      filters
    );
  }
}

export const enrollmentService = new EnrollmentService();
```

### 2. Course Player Component

```javascript
// components/CoursePlayer.jsx
import React, { useState, useEffect } from "react";
import { enrollmentService } from "../services/enrollmentService.js";

const CoursePlayer = ({ course, enrollment }) => {
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(
    enrollment?.completedLessons || []
  );

  const handleLessonComplete = async (lessonId) => {
    try {
      await enrollmentService.updateLessonProgress(course._id, lessonId, true);
      setCompletedLessons((prev) => [...prev, lessonId]);
    } catch (error) {
      alert("Failed to update progress: " + error.message);
    }
  };

  const isLessonCompleted = (lessonId) => {
    return completedLessons.includes(lessonId);
  };

  const currentLessonData =
    course.modules[currentModule]?.lessons[currentLesson];

  return (
    <div className="flex h-screen">
      {/* Sidebar with modules and lessons */}
      <div className="w-80 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="font-bold text-lg mb-4">{course.title}</h2>

        {course.modules.map((module, moduleIndex) => (
          <div key={moduleIndex} className="mb-4">
            <h3
              className="font-medium cursor-pointer hover:text-blue-600"
              onClick={() => setCurrentModule(moduleIndex)}
            >
              {module.title}
            </h3>

            {module.lessons.map((lesson, lessonIndex) => (
              <div
                key={lessonIndex}
                className={`ml-4 p-2 cursor-pointer rounded ${
                  isLessonCompleted(lesson._id)
                    ? "bg-green-100 text-green-800"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => {
                  setCurrentModule(moduleIndex);
                  setCurrentLesson(lessonIndex);
                }}
              >
                {isLessonCompleted(lesson._id) && (
                  <span className="mr-2">✓</span>
                )}
                {lesson.title}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Main content area */}
      <div className="flex-1 p-6">
        {currentLessonData ? (
          <div>
            <h1 className="text-2xl font-bold mb-4">
              {currentLessonData.title}
            </h1>

            {currentLessonData.contentType === "video" && (
              <div className="mb-4">
                <video
                  controls
                  className="w-full max-w-4xl"
                  onEnded={() => handleLessonComplete(currentLessonData._id)}
                >
                  <source src={currentLessonData.content} type="video/mp4" />
                </video>
              </div>
            )}

            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                disabled={currentLesson === 0}
                className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>

              {!isLessonCompleted(currentLessonData._id) && (
                <button
                  onClick={() => handleLessonComplete(currentLessonData._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Mark as Complete
                </button>
              )}

              <button
                onClick={() =>
                  setCurrentLesson(
                    Math.min(
                      course.modules[currentModule].lessons.length - 1,
                      currentLesson + 1
                    )
                  )
                }
                disabled={
                  currentLesson ===
                  course.modules[currentModule].lessons.length - 1
                }
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Select a lesson to start learning
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePlayer;
```

## ✅ TODO Management Integration

### 1. TODO Service

```javascript
// services/todoService.js
import { apiService } from "./api.js";

class TodoService {
  // Create todo
  async createTodo(todoData) {
    return apiService.post("/todos", todoData);
  }

  // Get user's todos
  async getMyTodos(filters = {}) {
    return apiService.get("/todos", filters);
  }

  // Update todo
  async updateTodo(todoId, todoData) {
    return apiService.put(`/todos/${todoId}`, todoData);
  }

  // Delete todo
  async deleteTodo(todoId) {
    return apiService.delete(`/todos/${todoId}`);
  }

  // Toggle completion status
  async toggleTodoStatus(todoId) {
    return apiService.patch(`/todos/${todoId}/toggle`);
  }

  // Bulk update todos
  async bulkUpdateTodos(todoIds, updates) {
    return apiService.patch("/todos/bulk/update", { todoIds, updates });
  }

  // Bulk delete todos
  async bulkDeleteTodos(todoIds) {
    return apiService.delete("/todos/bulk/delete", { todoIds });
  }

  // Get todo statistics
  async getTodoStats() {
    return apiService.get("/todos/stats");
  }

  // Get upcoming todos
  async getUpcomingTodos(limit = 5) {
    return apiService.get("/todos/upcoming", { limit });
  }
}

export const todoService = new TodoService();
```

### 2. TODO Component Example

```javascript
// components/TodoList.jsx
import React, { useState, useEffect } from "react";
import { todoService } from "../services/todoService.js";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTodos();
  }, [filter]);

  const loadTodos = async () => {
    setLoading(true);
    try {
      const filters =
        filter === "all" ? {} : { isCompleted: filter === "completed" };
      const response = await todoService.getMyTodos(filters);
      setTodos(response.data.todos);
    } catch (error) {
      alert("Failed to load todos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      await todoService.createTodo({
        taskDescription: newTodo,
        priority: "medium",
      });
      setNewTodo("");
      loadTodos();
    } catch (error) {
      alert("Failed to add todo: " + error.message);
    }
  };

  const handleToggleTodo = async (todoId) => {
    try {
      await todoService.toggleTodoStatus(todoId);
      loadTodos();
    } catch (error) {
      alert("Failed to update todo: " + error.message);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;

    try {
      await todoService.deleteTodo(todoId);
      loadTodos();
    } catch (error) {
      alert("Failed to delete todo: " + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Todos</h1>

      {/* Add Todo Form */}
      <form onSubmit={handleAddTodo} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </form>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        {["all", "pending", "completed"].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-2 rounded ${
              filter === filterType
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Todo List */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className={`flex items-center gap-3 p-4 border rounded-lg ${
                todo.isCompleted ? "bg-green-50 border-green-200" : "bg-white"
              }`}
            >
              <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => handleToggleTodo(todo._id)}
                className="w-5 h-5"
              />

              <span
                className={`flex-1 ${
                  todo.isCompleted ? "line-through text-gray-500" : ""
                }`}
              >
                {todo.taskDescription}
              </span>

              <span
                className={`px-2 py-1 text-xs rounded ${
                  todo.priority === "high"
                    ? "bg-red-100 text-red-800"
                    : todo.priority === "urgent"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {todo.priority}
              </span>

              <button
                onClick={() => handleDeleteTodo(todo._id)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}

          {todos.length === 0 && (
            <div className="text-center py-8 text-gray-500">No todos found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoList;
```

## 📋 Kanban Board Integration

### 1. Kanban Service

```javascript
// services/kanbanService.js
import { apiService } from "./api.js";

class KanbanService {
  // Board operations
  async createBoard(boardData) {
    return apiService.post("/kanban/boards", boardData);
  }

  async getMyBoards() {
    return apiService.get("/kanban/boards");
  }

  async getBoardById(boardId) {
    return apiService.get(`/kanban/boards/${boardId}`);
  }

  async updateBoard(boardId, boardData) {
    return apiService.put(`/kanban/boards/${boardId}`, boardData);
  }

  async deleteBoard(boardId) {
    return apiService.delete(`/kanban/boards/${boardId}`);
  }

  // Column operations
  async createColumn(boardId, columnData) {
    return apiService.post(`/kanban/boards/${boardId}/columns`, columnData);
  }

  async updateColumn(columnId, columnData) {
    return apiService.put(`/kanban/columns/${columnId}`, columnData);
  }

  async deleteColumn(columnId) {
    return apiService.delete(`/kanban/columns/${columnId}`);
  }

  async reorderColumns(boardId, columnOrder) {
    return apiService.patch(`/kanban/boards/${boardId}/columns/reorder`, {
      columnOrder,
    });
  }

  // Card operations
  async createCard(columnId, cardData) {
    return apiService.post(`/kanban/columns/${columnId}/cards`, cardData);
  }

  async updateCard(cardId, cardData) {
    return apiService.put(`/kanban/cards/${cardId}`, cardData);
  }

  async deleteCard(cardId) {
    return apiService.delete(`/kanban/cards/${cardId}`);
  }

  async moveCard(cardId, newColumnId, newOrder) {
    return apiService.patch(`/kanban/cards/${cardId}/move`, {
      newColumnId,
      newOrder,
    });
  }

  async reorderCards(columnId, cardOrder) {
    return apiService.patch(`/kanban/columns/${columnId}/cards/reorder`, {
      cardOrder,
    });
  }

  // Statistics
  async getBoardStats(boardId) {
    return apiService.get(`/kanban/boards/${boardId}/stats`);
  }
}

export const kanbanService = new KanbanService();
```

### 2. Kanban Board Component

```javascript
// components/KanbanBoard.jsx
import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { kanbanService } from "../services/kanbanService.js";
import KanbanColumn from "./KanbanColumn.jsx";
import KanbanCard from "./KanbanCard.jsx";

const KanbanBoard = ({ boardId }) => {
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  const loadBoard = async () => {
    try {
      const response = await kanbanService.getBoardById(boardId);
      setBoard(response.data.board);
      setColumns(response.data.columns);
    } catch (error) {
      alert("Failed to load board: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveCard = async (cardId, newColumnId, newOrder) => {
    try {
      await kanbanService.moveCard(cardId, newColumnId, newOrder);
      loadBoard(); // Refresh board data
    } catch (error) {
      alert("Failed to move card: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{board?.title}</h1>
        <p className="text-gray-600">{board?.description}</p>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column._id}
            column={column}
            onMoveCard={handleMoveCard}
            onRefresh={loadBoard}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
```

## ⭐ Review System Integration

### 1. Review Service

```javascript
// services/reviewService.js
import { apiService } from "./api.js";

class ReviewService {
  // Create review
  async createReview(courseId, reviewData) {
    return apiService.post(`/reviews/courses/${courseId}/reviews`, reviewData);
  }

  // Get course reviews
  async getCourseReviews(courseId, filters = {}) {
    return apiService.get(`/reviews/courses/${courseId}/reviews`, filters);
  }

  // Get review statistics
  async getReviewStats(courseId) {
    return apiService.get(`/reviews/courses/${courseId}/stats`);
  }

  // Update review
  async updateReview(reviewId, reviewData) {
    return apiService.put(`/reviews/${reviewId}`, reviewData);
  }

  // Delete review
  async deleteReview(reviewId) {
    return apiService.delete(`/reviews/${reviewId}`);
  }

  // Mark review helpful
  async markReviewHelpful(reviewId) {
    return apiService.post(`/reviews/${reviewId}/helpful`);
  }

  // Report review
  async reportReview(reviewId, reason) {
    return apiService.post(`/reviews/${reviewId}/report`, { reason });
  }

  // Get user's reviews
  async getMyReviews(filters = {}) {
    return apiService.get("/reviews/my-reviews", filters);
  }

  // Admin functions
  async getAllReviews(filters = {}) {
    return apiService.get("/reviews/admin/all", filters);
  }

  async approveReview(reviewId) {
    return apiService.patch(`/reviews/admin/${reviewId}/approve`);
  }

  async rejectReview(reviewId) {
    return apiService.patch(`/reviews/admin/${reviewId}/reject`);
  }
}

export const reviewService = new ReviewService();
```

### 2. Review Component

```javascript
// components/CourseReviews.jsx
import React, { useState, useEffect } from "react";
import { reviewService } from "../services/reviewService.js";
import { useAuthStore } from "../stores/authStore.js";

const CourseReviews = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [courseId]);

  const loadReviews = async () => {
    try {
      const response = await reviewService.getCourseReviews(courseId);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await reviewService.getReviewStats(courseId);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await reviewService.createReview(courseId, newReview);
      setNewReview({ rating: 5, title: "", comment: "" });
      setShowReviewForm(false);
      loadReviews();
      loadStats();
    } catch (error) {
      alert("Failed to submit review: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        className={`text-2xl ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        } ${interactive ? "hover:text-yellow-400 cursor-pointer" : ""}`}
        onClick={interactive ? () => onChange(i + 1) : undefined}
        disabled={!interactive}
      >
        ★
      </button>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Review Statistics */}
      {stats && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl font-bold text-yellow-400">
              {stats.averageRating.toFixed(1)}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {renderStars(Math.round(stats.averageRating))}
              </div>
              <div className="text-gray-600">
                Based on {stats.totalReviews} reviews
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm w-8">{star}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${
                        stats.totalReviews > 0
                          ? (stats.ratingDistribution[star] /
                              stats.totalReviews) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm w-8">
                  {stats.ratingDistribution[star]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write Review Button */}
      {isAuthenticated && (
        <div className="mb-6">
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Write a Review
          </button>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && isAuthenticated && (
        <form
          onSubmit={handleSubmitReview}
          className="bg-white p-6 rounded-lg shadow-md mb-6"
        >
          <h3 className="text-lg font-bold mb-4">Write Your Review</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-1">
              {renderStars(newReview.rating, true, (rating) =>
                setNewReview({ ...newReview, rating })
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) =>
                setNewReview({ ...newReview, title: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Review title..."
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Comment</label>
            <textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Share your experience..."
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={review.student.avatar}
                  alt={review.student.fullName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-medium">{review.student.fullName}</h4>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-500 ml-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h5 className="font-medium mb-2">{review.title}</h5>
            <p className="text-gray-700 mb-4">{review.comment}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <button className="hover:text-blue-600">
                👍 Helpful ({review.helpfulCount})
              </button>
              <button className="hover:text-red-600">🚨 Report</button>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No reviews yet. Be the first to review this course!
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseReviews;
```

## 🔧 Error Handling & Loading States

### 1. Global Error Handler

```javascript
// utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return data.message || "Bad request";
      case 401:
        // Handle unauthorized - redirect to login
        window.location.href = "/login";
        return "Please login to continue";
      case 403:
        return data.message || "Access denied";
      case 404:
        return data.message || "Resource not found";
      case 409:
        return data.message || "Conflict with existing data";
      case 500:
        return "Server error. Please try again later";
      default:
        return data.message || "An error occurred";
    }
  } else if (error.request) {
    // Network error
    return "Network error. Please check your connection";
  } else {
    // Other error
    return error.message || "An unexpected error occurred";
  }
};
```

### 2. Loading Spinner Component

```javascript
// components/LoadingSpinner.jsx
import React from "react";

const LoadingSpinner = ({ size = "medium", message = "Loading..." }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        className={`animate-spin rounded-full border-2 border-blue-600 border-t-transparent ${sizeClasses[size]}`}
      />
      {message && <p className="mt-2 text-gray-600">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
```

## 🚀 Getting Started with Frontend Integration

1. **Install Dependencies:**

   ```bash
   npm install zustand react-dnd react-dnd-html5-backend
   ```

2. **Setup API Base URL:**

   ```javascript
   // Create .env file
   REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
   ```

3. **Initialize Auth Store:**

   ```javascript
   // In your main App.jsx
   import useAuthStore from "./stores/authStore.js";

   function App() {
     const initializeAuth = useAuthStore((state) => state.initialize);

     useEffect(() => {
       initializeAuth();
     }, []);

     // ... rest of your app
   }
   ```

4. **Use API Services:**

   ```javascript
   // In your components
   import { courseService } from "./services/courseService.js";
   import { enrollmentService } from "./services/enrollmentService.js";

   const MyComponent = () => {
     const [courses, setCourses] = useState([]);
     const [loading, setLoading] = useState(false);

     useEffect(() => {
       loadCourses();
     }, []);

     const loadCourses = async () => {
       setLoading(true);
       try {
         const response = await courseService.getAllCourses();
         setCourses(response.data.courses);
       } catch (error) {
         alert(handleApiError(error));
       } finally {
         setLoading(false);
       }
     };

     // ... component JSX
   };
   ```

## 📁 File Upload Integration

### File Upload Service
```javascript
// services/uploadService.js
import { apiService } from "./api.js";

class UploadService {
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);
    return apiService.request("/users/avatar", {
      method: "POST",
      body: formData,
    });
  }

  async uploadThumbnail(file) {
    const formData = new FormData();
    formData.append("thumbnail", file);
    return apiService.request("/courses/thumbnail", {
      method: "POST",
      body: formData,
    });
  }

  validateFile(file, type) {
    const maxSizes = {
      avatar: 5 * 1024 * 1024,
      thumbnail: 10 * 1024 * 1024,
      courseContent: 500 * 1024 * 1024,
    };

    if (file.size > maxSizes[type]) {
      return `File exceeds ${maxSizes[type] / (1024 * 1024)}MB limit`;
    }
    return null;
  }
}

export const uploadService = new UploadService();
```

## 🧪 Testing Examples

### API Testing
```javascript
// Mock fetch globally
global.fetch = jest.fn();

test("should handle authentication", async () => {
  localStorage.setItem("accessToken", "test-token");
  fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  });

  await apiService.get("/protected");

  expect(fetch).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: "Bearer test-token",
      }),
    })
  );
});
```

## 🎯 Advanced Patterns

### Custom Hooks
```javascript
// hooks/useCourses.js
import { useState, useEffect, useCallback } from "react";
import { courseService } from "../services/courseService.js";

export const useCourses = (filters = {}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await courseService.getAllCourses(filters);
      setCourses(response.data.courses);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return { courses, loading, error, refetch: loadCourses };
};
```

This comprehensive frontend integration guide provides everything needed to build a full-featured e-learning platform with course browsing, enrollment, progress tracking, productivity tools, and review systems.
