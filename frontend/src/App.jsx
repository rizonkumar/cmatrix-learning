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

// Error Handling
import ErrorBoundary from "./components/ErrorBoundary";

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
import MyReviewsPage from "./pages/MyReviewsPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import AdminDashboard from "./pages/AdminDashboard";
import StudentTrackingPage from "./pages/StudentTrackingPage";
import ReviewManagementPage from "./pages/ReviewManagementPage";
import SyllabusManagement from "./pages/SyllabusManagement";
import NotFoundPage from "./pages/NotFoundPage";
import ErrorPage from "./pages/ErrorPage";
import ProfilePage from "./pages/ProfilePage";
import CourseManagementPage from "./pages/CourseManagementPage";
import AnalyticsDashboardPage from "./pages/AnalyticsDashboardPage";
import PaymentManagementPage from "./pages/PaymentManagementPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";

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
    <ErrorBoundary>
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

            <Route
              path="/courses/:courseId"
              element={
                <MainLayout>
                  <CourseDetailPage />
                </MainLayout>
              }
            />

            {/* Legal Pages */}
            <Route
              path="/terms-of-service"
              element={
                <MainLayout>
                  <TermsOfServicePage />
                </MainLayout>
              }
            />

            <Route
              path="/privacy-policy"
              element={
                <MainLayout>
                  <PrivacyPolicyPage />
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
                    <MyCoursesPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-reviews"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <MyReviewsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/todo"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <TodoPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/kanban"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <KanbanPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/streak"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <StreakPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProfilePage />
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
              path="/admin/students"
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <StudentTrackingPage />
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
              path="/admin/reviews"
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <ReviewManagementPage />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/courses"
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <CourseManagementPage />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/analytics"
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <AnalyticsDashboardPage />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/finance"
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <PaymentManagementPage />
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />

            {/* Error Route */}
            <Route
              path="/error"
              element={
                <MainLayout>
                  <ErrorPage />
                </MainLayout>
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
    </ErrorBoundary>
  );
}

export default App;
