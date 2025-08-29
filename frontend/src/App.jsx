import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import StudentDashboard from "./pages/StudentDashboard";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TodoPage from "./pages/TodoPage";
import KanbanPage from "./pages/KanbanPage";
import StreakPage from "./pages/StreakPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import AdminDashboard from "./pages/AdminDashboard";
import SyllabusManagement from "./pages/SyllabusManagement";
import NotFoundPage from "./pages/NotFoundPage";

// Stores
import useAuthStore from "./store/authStore";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Admin Protected Route Component
const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          />

          <Route
            path="/courses"
            element={
              <MainLayout>
                <CoursesPage />
              </MainLayout>
            }
          />

          {/* Authentication Pages */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StudentDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-courses"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="text-center py-16">
                    <h1 className="text-2xl font-bold mb-4">My Courses</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      Course management coming soon...
                    </p>
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/todo"
            element={
              <ProtectedRoute>
                <TodoPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kanban"
            element={
              <ProtectedRoute>
                <KanbanPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/streak"
            element={
              <ProtectedRoute>
                <StreakPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-courses"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MyCoursesPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="text-center py-16">
                    <h1 className="text-2xl font-bold mb-4">Profile</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      Profile management coming soon...
                    </p>
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/syllabus"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <SyllabusManagement />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/courses"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold mb-4">
                        Course Management
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400">
                        Course management interface coming soon...
                      </p>
                    </div>
                  </div>
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold mb-4">
                        Analytics Dashboard
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400">
                        Analytics dashboard coming soon...
                      </p>
                    </div>
                  </div>
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold mb-4">
                        System Settings
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400">
                        System settings interface coming soon...
                      </p>
                    </div>
                  </div>
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <MainLayout>
                <NotFoundPage />
              </MainLayout>
            }
          />
        </Routes>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
