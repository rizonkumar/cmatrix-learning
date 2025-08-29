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
    <header className="relative sticky top-0 z-50">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50"></div>
      <div className="absolute inset-0 bg-linear-to-r from-blue-50/20 via-transparent to-indigo-50/20 dark:from-blue-900/10 dark:via-transparent dark:to-indigo-900/10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="relative">
              <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
              <div className="absolute inset-0 bg-blue-400/20 dark:bg-blue-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-linear-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-600 dark:group-hover:from-blue-400 dark:group-hover:to-indigo-400 transition-all duration-300">
                C-Matrix Learning
              </span>
              <div className="h-0.5 w-0 bg-linear-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-500"></div>
            </div>
          </Link>

          {/* Desktop Navigation - Only show for unauthenticated users */}
          {!isAuthenticated && (
            <nav className="hidden lg:flex items-center space-x-2">
              <Link
                to="/"
                className="group flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-all duration-300 rounded-xl hover:bg-blue-50/80 dark:hover:bg-blue-900/20 hover:shadow-sm relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Home className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-200" />
                <span className="relative z-10 font-medium">Home</span>
              </Link>

              {/* Program Dropdown */}
              <div className="relative group">
                <button
                  onClick={() =>
                    setIsProgramDropdownOpen(!isProgramDropdownOpen)
                  }
                  className="group flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-all duration-300 rounded-xl hover:bg-indigo-50/80 dark:hover:bg-indigo-900/20 hover:shadow-sm"
                >
                  <GraduationCap className="w-4 h-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-200" />
                  <span className="font-medium">Program</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-all duration-300 ${
                      isProgramDropdownOpen ? "rotate-180 text-indigo-600" : "group-hover:text-indigo-500"
                    }`}
                  />
                </button>

                {isProgramDropdownOpen && (
                  <div className="absolute top-full left-0 mt-3 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 py-3 z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="absolute -top-1 left-6 w-3 h-3 bg-white dark:bg-gray-800 border-l border-t border-gray-200/50 dark:border-gray-700/50 rotate-45"></div>
                    {programClasses.map((programClass, index) => (
                      <Link
                        key={programClass.name}
                        to={programClass.path}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 dark:text-gray-300 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 group"
                        onClick={() => setIsProgramDropdownOpen(false)}
                      >
                        <div className="w-2 h-2 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        <span className="group-hover:translate-x-1 transition-transform duration-200">{programClass.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Target Exam Dropdown */}
              <div className="relative group">
                <button
                  onClick={() =>
                    setIsTargetExamDropdownOpen(!isTargetExamDropdownOpen)
                  }
                  className="group flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 transition-all duration-300 rounded-xl hover:bg-emerald-50/80 dark:hover:bg-emerald-900/20 hover:shadow-sm"
                >
                  <Target className="w-4 h-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-200" />
                  <span className="font-medium">Target Exam</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-all duration-300 ${
                      isTargetExamDropdownOpen ? "rotate-180 text-emerald-600" : "group-hover:text-emerald-500"
                    }`}
                  />
                </button>

                {isTargetExamDropdownOpen && (
                  <div className="absolute top-full left-0 mt-3 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 py-3 z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="absolute -top-1 left-6 w-3 h-3 bg-white dark:bg-gray-800 border-l border-t border-gray-200/50 dark:border-gray-700/50 rotate-45"></div>
                    {targetExams.map((exam, index) => (
                      <Link
                        key={exam.name}
                        to={exam.path}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 dark:text-gray-300 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 group"
                        onClick={() => setIsTargetExamDropdownOpen(false)}
                      >
                        <div className="w-2 h-2 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        <span className="group-hover:translate-x-1 transition-transform duration-200">{exam.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/courses"
                className="group flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-all duration-300 rounded-xl hover:bg-purple-50/80 dark:hover:bg-purple-900/20 hover:shadow-sm relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-purple-500/0 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Book className="w-4 h-4 relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-200" />
                <span className="relative z-10 font-medium">All Courses</span>
              </Link>

              {/* Dashboard Items - Only show if authenticated */}
              {isAuthenticated && (
                <div className="hidden xl:flex items-center space-x-2 ml-6 pl-6 border-l border-gray-200/50 dark:border-gray-700/50">
                  {dashboardItems.map((item, index) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="group flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-all duration-300 rounded-lg hover:bg-blue-50/80 dark:hover:bg-blue-900/20 hover:shadow-sm"
                    >
                      <item.icon className="w-4 h-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-200" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <ThemeToggle />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative p-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-105 group"
            >
              <div className="absolute inset-0 bg-blue-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 relative z-10 transition-transform duration-300 rotate-90 group-hover:rotate-180" />
              ) : (
                <Menu className="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:scale-110" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300 group">
                  <div className="relative">
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                    {user?.name || "User"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 transition-all duration-300 hover:scale-105 group"
                >
                  <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-medium">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-4 py-2.5 rounded-xl border-gray-200 hover:border-blue-300 hover:bg-blue-50/80 dark:border-gray-700 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-105 font-medium"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="primary"
                    size="sm"
                    className="px-4 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 font-medium"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Enhanced with modern design */}
      {isMobileMenuOpen && (
        <div className="lg:hidden relative overflow-hidden">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg"></div>
          <div className="absolute inset-0 bg-linear-to-b from-blue-50/30 via-transparent to-indigo-50/30 dark:from-blue-900/10 dark:via-transparent dark:to-indigo-900/10"></div>

          <div className="relative px-6 py-8 space-y-6 animate-in slide-in-from-top-4 duration-300">
            {!isAuthenticated && (
              <>
                {/* Main Navigation */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleNavigation("/")}
                    className="group flex items-center space-x-4 w-full text-left p-4 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-all duration-300 rounded-2xl hover:bg-blue-50/80 dark:hover:bg-blue-900/20 hover:shadow-lg"
                  >
                    <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors duration-300">
                      <Home className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <div>
                      <span className="font-semibold block">Home</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Welcome page</span>
                    </div>
                  </button>

                  <Link
                    to="/courses"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center space-x-4 p-4 text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-all duration-300 rounded-2xl hover:bg-purple-50/80 dark:hover:bg-purple-900/20 hover:shadow-lg"
                  >
                    <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40 transition-colors duration-300">
                      <Book className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-200" />
                    </div>
                    <div>
                      <span className="font-semibold block">All Courses</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Browse our catalog</span>
                    </div>
                  </Link>
                </div>

                {/* Program Section */}
                <div className="relative">
                  <div className="flex items-center space-x-3 px-4 py-3 mb-3">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                      <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="font-bold text-lg text-gray-900 dark:text-white">
                      Academic Programs
                    </span>
                  </div>
                  <div className="space-y-2 ml-8">
                    {programClasses.map((programClass, index) => (
                      <Link
                        key={programClass.name}
                        to={programClass.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group flex items-center space-x-3 p-3 text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-all duration-300 rounded-xl hover:bg-indigo-50/80 dark:hover:bg-indigo-900/20 hover:translate-x-2"
                      >
                        <div className="w-2 h-2 bg-indigo-500 rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-200"></div>
                        <span className="font-medium">{programClass.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Target Exam Section */}
                <div className="relative">
                  <div className="flex items-center space-x-3 px-4 py-3 mb-3">
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                      <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="font-bold text-lg text-gray-900 dark:text-white">
                      Competitive Exams
                    </span>
                  </div>
                  <div className="space-y-2 ml-8">
                    {targetExams.map((exam, index) => (
                      <Link
                        key={exam.name}
                        to={exam.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group flex items-center space-x-3 p-3 text-sm text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-all duration-300 rounded-xl hover:bg-emerald-50/80 dark:hover:bg-emerald-900/20 hover:translate-x-2"
                      >
                        <div className="w-2 h-2 bg-emerald-500 rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-200"></div>
                        <span className="font-medium">{exam.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Dashboard Items - Only show if authenticated */}
                {isAuthenticated && (
                  <div className="relative">
                    <div className="flex items-center space-x-3 px-4 py-3 mb-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-bold text-lg text-gray-900 dark:text-white">
                        Dashboard
                      </span>
                    </div>
                    <div className="space-y-2 ml-8">
                      {dashboardItems.map((item, index) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="group flex items-center space-x-3 p-3 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-300 rounded-xl hover:bg-blue-50/80 dark:hover:bg-blue-900/20 hover:translate-x-2"
                        >
                          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/40 transition-colors duration-300">
                            <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auth Buttons - Mobile */}
                <div className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50 md:hidden">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 px-4 py-3 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
                        <div className="relative">
                          <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                        </div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {user?.name || "User"}
                        </span>
                      </div>
                      <Button
                        onClick={handleLogout}
                        className="w-full py-4 rounded-2xl bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex items-center justify-center space-x-2 font-semibold shadow-lg hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          variant="outline"
                          className="w-full py-4 rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/80 dark:border-gray-700 dark:hover:bg-blue-900/20 font-semibold transition-all duration-300 hover:scale-105"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button className="w-full py-4 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
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
