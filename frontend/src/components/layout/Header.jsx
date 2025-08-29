import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  GraduationCap,
  Target,
  Home,
  Book,
  Flame,
  CheckSquare,
  KanbanSquare,
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import ThemeToggle from "../ThemeToggle";
import Button from "../common/Button";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  // State for dropdowns and mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProgramDropdownOpen, setIsProgramDropdownOpen] = useState(false);
  const [isTargetExamDropdownOpen, setIsTargetExamDropdownOpen] =
    useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsProgramDropdownOpen(false);
    setIsTargetExamDropdownOpen(false);
  };

  const programClasses = [
    { name: "Class 8th", path: "/courses?class=8" },
    { name: "Class 9th", path: "/courses?class=9" },
    { name: "Class 10th", path: "/courses?class=10" },
    { name: "Class 11th", path: "/courses?class=11" },
    { name: "Class 12th", path: "/courses?class=12" },
  ];

  const targetExams = [
    { name: "JEE Main & Advanced", path: "/courses?exam=jee" },
    { name: "NEET", path: "/courses?exam=neet" },
  ];

  const dashboardItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "My Courses", icon: Book, path: "/my-courses" },
    { name: "Learning Streak", icon: Flame, path: "/streak" },
    { name: "TODO List", icon: CheckSquare, path: "/todo" },
    { name: "Kanban Boards", icon: KanbanSquare, path: "/kanban" },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              C-Matrix Learning
            </span>
          </Link>

          {/* Desktop Navigation - Only show for unauthenticated users */}
          {!isAuthenticated && (
            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                to="/"
                className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>

              {/* Program Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsProgramDropdownOpen(!isProgramDropdownOpen)
                  }
                  className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Program</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isProgramDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProgramDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {programClasses.map((programClass) => (
                      <Link
                        key={programClass.name}
                        to={programClass.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        onClick={() => setIsProgramDropdownOpen(false)}
                      >
                        {programClass.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Target Exam Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsTargetExamDropdownOpen(!isTargetExamDropdownOpen)
                  }
                  className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Target className="w-4 h-4" />
                  <span>Target Exam</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isTargetExamDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isTargetExamDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {targetExams.map((exam) => (
                      <Link
                        key={exam.name}
                        to={exam.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        onClick={() => setIsTargetExamDropdownOpen(false)}
                      >
                        {exam.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/courses"
                className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Book className="w-4 h-4" />
                <span>All Courses</span>
              </Link>

              {/* Dashboard Items - Only show if authenticated */}
              {isAuthenticated && (
                <div className="hidden xl:flex items-center space-x-1 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                  {dashboardItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user?.name || "User"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Only show navigation for unauthenticated users */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="px-4 py-6 space-y-4">
            {!isAuthenticated && (
              <>
                {/* Main Navigation */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleNavigation("/")}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Home className="w-5 h-5" />
                    <span>Home</span>
                  </button>

                  <Link
                    to="/courses"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Book className="w-5 h-5" />
                    <span>All Courses</span>
                  </Link>
                </div>

                {/* Program Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center space-x-2 px-3 mb-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Program
                    </span>
                  </div>
                  <div className="space-y-1 ml-4">
                    {programClasses.map((programClass) => (
                      <Link
                        key={programClass.name}
                        to={programClass.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                      >
                        {programClass.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Target Exam Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center space-x-2 px-3 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Target Exam
                    </span>
                  </div>
                  <div className="space-y-1 ml-4">
                    {targetExams.map((exam) => (
                      <Link
                        key={exam.name}
                        to={exam.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                      >
                        {exam.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Dashboard Items - Only show if authenticated */}
                {isAuthenticated && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="px-3 mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        Dashboard
                      </span>
                    </div>
                    <div className="space-y-1 ml-4">
                      {dashboardItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auth Buttons - Mobile */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 md:hidden">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 px-3">
                        <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {user?.name || "User"}
                        </span>
                      </div>
                      <Button
                        onClick={handleLogout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
